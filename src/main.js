import * as THREE from 'three';
import { createScene, createCamera, createRenderer } from './scene.js';
import { loadMap } from './maps/index.js';
import { setupControls } from './game/controls.js';
import { createPhysicsState, setupJump, applyGravity, updateLandingDip, updateWeaponBob } from './game/physics.js';
import { checkWallCollision } from './game/collision.js';
import { setupShooting } from './game/shooting.js';
import { createHealthState, applyDamage, resetHealth } from './game/health.js';
import { createAmmoState, canFire, fire, setupReloadKey } from './game/ammo.js';
import { updateEffects } from './game/effects.js';
import { updateHealthHUD, updateAmmoHUD, updateRoundHUD } from './ui/hud.js';
import { createRecoilState, triggerRecoil, updateRecoil } from './game/recoil.js';
import { showEndScreen } from './ui/endscreen.js';
import { createMovementState, setupSlide, setupSprint, updateMovement, updateSlideCameraOffset, removeSlideCameraOffset } from './game/movement.js';
import { createRoundState, recordPlayerWin, recordEnemyWin, resetRounds } from './ui/rounds.js';
import { sendPosition, sendHit, sendReady, sendShoot } from './network/network.js';
import { setupGameNetworking } from './network/gamenetwork.js';
import { createCountdownState, startCountdown, updateCountdown } from './game/roundcountdown.js';
import { createMatchFlow } from './game/matchflow.js';
import { loadWeaponModel } from './game/weaponmodel.js';
import { loadCharacterModel } from './game/charactermodel.js';
import { createOpponentController } from './game/opponentcontroller.js';

import './style.css'

// Setup de base
const scene = createScene();
const weaponScene = new THREE.Scene();
const weaponLight = new THREE.DirectionalLight(0xffffff, 1);
weaponLight.position.set(5, 5, 5);
weaponScene.add(weaponLight);
weaponScene.add(new THREE.AmbientLight(0xffffff, 0.5));

const camera = createCamera();
const renderer = createRenderer();
document.body.appendChild(renderer.domElement);
weaponScene.add(camera);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Map
const { floor, wallBoxes, spawns } = loadMap(scene, 'arena1');

// Arme premiere personne
const WEAPON_BASE_Y = -0.4;
const weaponWrapper = new THREE.Group();
weaponWrapper.position.set(0.3, WEAPON_BASE_Y, -0.7);
camera.add(weaponWrapper);

const muzzlePoint = new THREE.Object3D();
muzzlePoint.position.set(0, 0, -1);
weaponWrapper.add(muzzlePoint);

const WEAPON_SCALE_FACTOR = 0.7 / 3.10;

loadWeaponModel(camera, '/models/AssaultRifle_1.glb', (weaponModel) => {
  weaponModel.rotation.y = Math.PI / 2;

  const box = new THREE.Box3().setFromObject(weaponModel);
  const center = box.getCenter(new THREE.Vector3());
  weaponModel.position.sub(center);

  weaponWrapper.add(weaponModel);
  weaponWrapper.scale.set(WEAPON_SCALE_FACTOR, WEAPON_SCALE_FACTOR, WEAPON_SCALE_FACTOR);
});

// Etats de jeu
const ammoState = createAmmoState();
setupReloadKey(ammoState);
const recoilState = createRecoilState(weaponWrapper.position, weaponWrapper.rotation);

const playerHealth = createHealthState(100);
const opponentHealth = createHealthState(100);
updateHealthHUD(playerHealth);
updateAmmoHUD(ammoState);

// Adversaire
const opponentMesh = new THREE.Group();
opponentMesh.visible = false;
scene.add(opponentMesh);

const opponentController = createOpponentController(opponentMesh);

loadCharacterModel('/models/opponent.glb', (model, mixer, actions) => {
  model.traverse((child) => {
    if (child.isMesh) {
      child.frustumCulled = false;
      child.material.side = THREE.DoubleSide;
    }
  });

  model.rotation.y = Math.PI;
  model.position.y = -0.7;
  model.scale.set(0.45, 0.45, 0.45);

  opponentMesh.add(model);
  opponentController.setModel(mixer, actions);
});

const roundState = createRoundState();
updateRoundHUD(roundState);
const countdownState = createCountdownState();
const countdownDisplay = document.getElementById('countdown-display');
const connectionBanner = document.getElementById('connection-banner');
const ROUND_COUNTDOWN_DURATION = 3;

const movementState = createMovementState();
const physicsState = createPhysicsState();
const DAMAGE_PER_HIT = 25;
const PLAYER_MOVE_THRESHOLD = 0.01;
const MOVE_GRACE_PERIOD = 0.25;

// Etat mutable partage entre spawn, room, round et adversaire
let roundActive = false;
let mySpawnIndex = 0;
let opponentTargetRotationY = 0;
const opponentTargetPosition = new THREE.Vector3();

// Logique de manche
const { startRoundCountdown, resetMatch, onPlayerWinsRound, onEnemyWinsRound } = createMatchFlow({
  camera, spawns, opponentMesh,
  playerHealth, opponentHealth, ammoState,
  roundState, countdownState, countdownDisplay,
  ROUND_COUNTDOWN_DURATION,
  updateHealthHUD, updateAmmoHUD, updateRoundHUD,
  recordPlayerWin, recordEnemyWin, resetRounds,
  startCountdown, showEndScreen, sendReady, resetHealth,
  setRoundActive: (value) => { roundActive = value; },
  getMySpawnIndex: () => mySpawnIndex,
});

// Reseau
setupGameNetworking({
  playerHealth, opponentMesh, opponentTargetPosition,
  setOpponentTargetRotationY: (value) => { opponentTargetRotationY = value; },
  setMySpawnIndex: (value) => { mySpawnIndex = value; },
  connectionBanner, applyDamage, updateHealthHUD,
  onEnemyWinsRound, startRoundCountdown, showEndScreen, resetMatch,
  onOpponentShootAnimation: (isMoving) => opponentController.onShoot(isMoving),
  onOpponentPositionUpdate: (moveData) => opponentController.onPositionUpdate(moveData),
});

// Tir
setupShooting(camera, scene, muzzlePoint, [opponentMesh, floor], {
  canFire: () => roundActive && !countdownState.active && canFire(ammoState),
  onFire: () => {
    fire(ammoState);
    triggerRecoil(recoilState);
    const isMoving = (performance.now() / 1000 - lastPlayerMoveTime) < MOVE_GRACE_PERIOD;
    sendShoot(isMoving);
  },
  onHit: (hit) => {
    if (opponentController.isDescendant(hit.object)) {
      sendHit(DAMAGE_PER_HIT);
      applyDamage(opponentHealth, DAMAGE_PER_HIT, () => {
        opponentMesh.visible = false;
        onPlayerWinsRound();
      });
    }
  },
});

// Controles
const { controls, move } = setupControls(camera, renderer);
setupSlide(movementState, move, controls, camera);
setupSprint(movementState);
setupJump(physicsState, () => {
  movementState.sliding = false;
  movementState.slideSpeed = 0;
});

// Boucle principale
let lastPositionSent = 0;
const POSITION_SEND_INTERVAL = 0.1;
const OPPONENT_LERP_SPEED = 10;
const clock = new THREE.Clock();
let lastPlayerMoveTime = 0;
const previousSentPosition = new THREE.Vector3();
let sentPositionInitialized = false;

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (roundActive && !countdownState.active) {
    removeSlideCameraOffset(camera, movementState);

    const oldX = camera.position.x;
    const oldZ = camera.position.z;

    updateMovement(camera, controls, move, movementState, delta);
    updateEffects(scene, delta);
    updateAmmoHUD(ammoState);
    updateRecoil(weaponWrapper, camera, recoilState, delta);

    if (checkWallCollision(camera.position.x, oldZ, wallBoxes)) camera.position.x = oldX;
    if (checkWallCollision(camera.position.x, camera.position.z, wallBoxes)) camera.position.z = oldZ;

    applyGravity(camera, physicsState, delta);
    const networkY = camera.position.y;
    updateLandingDip(camera, physicsState, delta);
    updateWeaponBob(weaponWrapper, WEAPON_BASE_Y, physicsState);
    updateSlideCameraOffset(camera, movementState, delta);

    lastPositionSent += delta;
    if (lastPositionSent >= POSITION_SEND_INTERVAL) {
      sendPosition(camera.position.x, networkY, camera.position.z, camera.rotation.y, movementState.sliding);
      lastPositionSent = 0;
    }

    if (sentPositionInitialized) {
      const dist = Math.hypot(camera.position.x - previousSentPosition.x, camera.position.z - previousSentPosition.z);
      if (dist > PLAYER_MOVE_THRESHOLD) {
        lastPlayerMoveTime = performance.now() / 1000;
      }
    }
    previousSentPosition.set(camera.position.x, camera.position.y, camera.position.z);
    sentPositionInitialized = true;
  }

  updateCountdown(countdownState, delta);
  if (countdownState.active) {
    countdownDisplay.textContent = Math.ceil(countdownState.timeLeft);
  }

  opponentController.update(delta);

  opponentMesh.position.lerp(opponentTargetPosition, Math.min(1, OPPONENT_LERP_SPEED * delta));
  opponentMesh.rotation.y += (opponentTargetRotationY - opponentMesh.rotation.y) * Math.min(1, OPPONENT_LERP_SPEED * delta);

  renderer.autoClear = true;
  renderer.render(scene, camera);
  renderer.autoClear = false;
  renderer.clearDepth();
  renderer.render(weaponScene, camera);
  renderer.autoClear = true;
}
animate();
import * as THREE from 'three';
import { createScene, createCamera, createRenderer } from './scene.js';
import { loadMap } from './maps/index.js';
import { setupControls } from './game/controls.js';
import { createPhysicsState, setupJump, applyGravity, updateLandingDip } from './game/physics.js';
import { checkWallCollision } from './game/collision.js';
import { setupShooting } from './game/shooting.js';
import { createHealthState, applyDamage, resetHealth } from './game/health.js';
import { createWeapon } from './game/weapon.js';
import { createAmmoState, canFire, fire, setupReloadKey } from './game/ammo.js';
import { updateEffects } from './game/effects.js';
import { updateHealthHUD, updateAmmoHUD, updateRoundHUD } from './ui/hud.js';
import { createRecoilState, triggerRecoil, updateRecoil } from './game/recoil.js';
import { showEndScreen } from './ui/endscreen.js';
import { createMovementState, setupSlide, setupSprint, updateMovement, updateSlideCameraOffset, removeSlideCameraOffset } from './game/movement.js';
import { createRoundState, recordPlayerWin, recordEnemyWin, resetRounds } from './ui/rounds.js';
import { sendPosition, sendHit, sendReady } from './network/network.js';
import { setupGameNetworking } from './network/gamenetwork.js';
import { createCountdownState, startCountdown, updateCountdown } from './game/roundcountdown.js';
import { createMatchFlow } from './game/matchflow.js';

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

// Etats de jeu
const { weaponGroup, barrel } = createWeapon(camera);
const ammoState = createAmmoState();
setupReloadKey(ammoState);
const recoilState = createRecoilState(weaponGroup.position, weaponGroup.rotation);

const { floor, wallMeshes, wallBoxes, spawns } = loadMap(scene, 'arena1');
const playerHealth = createHealthState(100);
const opponentHealth = createHealthState(100);
updateHealthHUD(playerHealth);
updateAmmoHUD(ammoState);

const opponentMesh = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 1.8, 0.5),
  new THREE.MeshStandardMaterial({ color: 0x0000ff })
);
opponentMesh.visible = false;
scene.add(opponentMesh);

const roundState = createRoundState();
updateRoundHUD(roundState);
const countdownState = createCountdownState();
const countdownDisplay = document.getElementById('countdown-display');
const connectionBanner = document.getElementById('connection-banner');
const ROUND_COUNTDOWN_DURATION = 3;

const movementState = createMovementState();
const physicsState = createPhysicsState();
const DAMAGE_PER_HIT = 25;

// Etat mutable partage entre spawn, room, round et adversaire
let roundActive = false;
let mySpawnIndex = 0;
let opponentTargetRotationY = 0;
const opponentTargetPosition = new THREE.Vector3();

// Logique de manche
const { startRoundCountdown, resetRound, resetMatch, onPlayerWinsRound, onEnemyWinsRound } = createMatchFlow({
  camera, spawns, opponentMesh,
  playerHealth, opponentHealth, ammoState,
  roundState, countdownState, countdownDisplay,
  ROUND_COUNTDOWN_DURATION,
  updateHealthHUD, updateAmmoHUD, updateRoundHUD,
  recordPlayerWin, recordEnemyWin, resetRounds,
  startCountdown, showEndScreen, sendReady,
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
});

// Tir
setupShooting(camera, scene, barrel, [opponentMesh, floor, ...wallMeshes], {
  canFire: () => roundActive && !countdownState.active && canFire(ammoState),
  onFire: () => {
    fire(ammoState);
    triggerRecoil(recoilState);
  },
  onHit: (hit) => {
    if (hit.object === opponentMesh) {
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
    updateRecoil(weaponGroup, camera, recoilState, delta);

    if (checkWallCollision(camera.position.x, oldZ, wallBoxes)) camera.position.x = oldX;
    if (checkWallCollision(camera.position.x, camera.position.z, wallBoxes)) camera.position.z = oldZ;

    applyGravity(camera, physicsState, delta);
    updateLandingDip(camera, physicsState, delta);
    updateSlideCameraOffset(camera, movementState, delta);

    lastPositionSent += delta;
    if (lastPositionSent >= POSITION_SEND_INTERVAL) {
      sendPosition(camera.position, camera.rotation.y);
      lastPositionSent = 0;
    }
  }

  updateCountdown(countdownState, delta);
  if (countdownState.active) {
    countdownDisplay.textContent = Math.ceil(countdownState.timeLeft);
  }

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
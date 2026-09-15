import * as THREE from 'three';
import { playAnimation } from './charactermodel.js';

const MOVEMENT_THRESHOLD = 0.01;
const MOVE_GRACE_PERIOD = 0.25;
const SHOOT_ANIMATION_DURATION = 0.5;

export function createOpponentController(opponentMesh) {
  const state = {
    mixer: null,
    actions: null,
    currentAction: { current: null },
    lastMoveTime: 0,
    previousReceivedPosition: new THREE.Vector3(),
    receivedPositionInitialized: false,
    sliding: false,
    shootLockUntil: 0,
  };

  function setModel(mixer, actions) {
    state.mixer = mixer;
    state.actions = actions;
    playAnimation(actions, 'Idle', state.currentAction);
  }

  function onPositionUpdate(moveData) {
    const newPos = new THREE.Vector3(moveData.x, moveData.y, moveData.z);
    if (state.receivedPositionInitialized) {
      const dist = newPos.distanceTo(state.previousReceivedPosition);
      if (dist > MOVEMENT_THRESHOLD) {
        state.lastMoveTime = performance.now() / 1000;
      }
    }
    state.previousReceivedPosition.copy(newPos);
    state.receivedPositionInitialized = true;
    state.sliding = !!moveData.isSliding;
  }

  function onShoot(isMoving) {
    if (!state.actions) return;
    playAnimation(state.actions, isMoving ? 'Run_Shoot' : 'Gun_Shoot', state.currentAction);
    state.shootLockUntil = performance.now() / 1000 + SHOOT_ANIMATION_DURATION;
  }

  function update(delta) {
    if (!state.mixer || !state.actions) return;
    const now = performance.now() / 1000;

    if (now >= state.shootLockUntil) {
      if (state.sliding) {
        playAnimation(state.actions, 'Roll', state.currentAction);
      } else {
        const isMoving = (now - state.lastMoveTime) < MOVE_GRACE_PERIOD;
        playAnimation(state.actions, isMoving ? 'Run' : 'Idle', state.currentAction);
      }
    }

    state.mixer.update(delta);
  }

  function isDescendant(object) {
    let current = object;
    while (current) {
      if (current === opponentMesh) return true;
      current = current.parent;
    }
    return false;
  }

  return { setModel, onPositionUpdate, onShoot, update, isDescendant };
}
import * as THREE from 'three';

const RECOIL_KICK_BACK = 0.08;
const RECOIL_KICK_ROTATION = 0.05;
const RECOIL_RECOVERY_SPEED = 8;
const VERTICAL_RECOIL_KICK = 0.015;
const CAMERA_SHAKE_AMOUNT = 0.015;

export function createRecoilState(weaponRestPosition, weaponRestRotation) {
  return {
    weaponRestPosition: weaponRestPosition.clone(),
    weaponRestRotation: weaponRestRotation.clone(),
    currentKick: 0,
    lastShakeX: 0,
    lastShakeY: 0,
    lastVerticalKick: 0,
  };
}

export function triggerRecoil(state) {
  state.currentKick = 1;
}

export function updateRecoil(weaponGroup, camera, state, delta) {
  state.currentKick = Math.max(0, state.currentKick - RECOIL_RECOVERY_SPEED * delta);

  weaponGroup.position.z = state.weaponRestPosition.z + RECOIL_KICK_BACK * state.currentKick;
  weaponGroup.rotation.x = state.weaponRestRotation.x - RECOIL_KICK_ROTATION * state.currentKick;

  // Retire l'ancien recul vertical avant d'appliquer le nouveau
  camera.rotation.x -= state.lastVerticalKick;
  state.lastVerticalKick = VERTICAL_RECOIL_KICK * state.currentKick;
  camera.rotation.x += state.lastVerticalKick;

  // Shake horizontal existant (inchange)
  camera.rotation.x -= state.lastShakeX;
  camera.rotation.y -= state.lastShakeY;

  const shake = CAMERA_SHAKE_AMOUNT * state.currentKick;
  state.lastShakeX = shake * (Math.random() - 0.5);
  state.lastShakeY = shake * (Math.random() - 0.5);

  camera.rotation.x += state.lastShakeX;
  camera.rotation.y += state.lastShakeY;
}
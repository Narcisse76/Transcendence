import * as THREE from 'three';

const PLAYER_RADIUS = 0.3;

export function checkWallCollision(x, z, wallBoxes) {
  const playerBox = new THREE.Box3(
    new THREE.Vector3(x - PLAYER_RADIUS, 0, z - PLAYER_RADIUS),
    new THREE.Vector3(x + PLAYER_RADIUS, 3, z + PLAYER_RADIUS)
  );

  for (const box of wallBoxes) {
    if (playerBox.intersectsBox(box)) {
      return true;
    }
  }
  return false;
}
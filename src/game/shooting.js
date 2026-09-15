import * as THREE from 'three';
import { createTracer, createHitMarker } from './effects.js';

const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);
const MAX_RANGE = 100;

export function setupShooting(camera, scene, weaponBarrel, targets, { canFire, onFire, onHit }) {
  document.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    if (canFire && !canFire()) return;

    if (onFire) onFire();

    raycaster.setFromCamera(center, camera);
    const intersects = raycaster.intersectObjects(targets);

    const start = weaponBarrel.getWorldPosition(new THREE.Vector3()); // depuis le canon, pas la camera
    let end;

    if (intersects.length > 0) {
      end = intersects[0].point;
      createHitMarker(scene, end);
      if (onHit) onHit(intersects[0]);
    } else {
      const direction = camera.getWorldDirection(new THREE.Vector3());
      end = start.clone().addScaledVector(direction, MAX_RANGE);
    }

    createTracer(scene, start, end);
  });
}
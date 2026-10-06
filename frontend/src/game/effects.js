import * as THREE from 'three';

const activeTracers = [];
const activeHitMarkers = [];

const TRACER_DURATION = 0.15;
const HITMARKER_DURATION = 1.5;

export function createTracer(scene, start, end) {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 1 });
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  activeTracers.push({ line, material, elapsed: 0 });
}

export function createHitMarker(scene, position) {
  const geometry = new THREE.SphereGeometry(0.05, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
  const marker = new THREE.Mesh(geometry, material);
  marker.position.copy(position);
  scene.add(marker);

  activeHitMarkers.push({ marker, material, elapsed: 0 });
}

export function updateEffects(scene, delta) {
  for (let i = activeTracers.length - 1; i >= 0; i--) {
    const t = activeTracers[i];
    t.elapsed += delta;
    t.material.opacity = 1 - t.elapsed / TRACER_DURATION;

    if (t.elapsed >= TRACER_DURATION) {
      scene.remove(t.line);
      t.line.geometry.dispose();
      t.material.dispose();
      activeTracers.splice(i, 1);
    }
  }

  for (let i = activeHitMarkers.length - 1; i >= 0; i--) {
    const h = activeHitMarkers[i];
    h.elapsed += delta;
    h.material.opacity = 1 - h.elapsed / HITMARKER_DURATION;

    if (h.elapsed >= HITMARKER_DURATION) {
      scene.remove(h.marker);
      h.marker.geometry.dispose();
      h.material.dispose();
      activeHitMarkers.splice(i, 1);
    }
  }
}
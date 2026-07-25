import * as THREE from 'three';

export function createWeapon(camera) {
  const weaponGroup = new THREE.Group();

  const bodyGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.6);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  weaponGroup.add(body);

  const barrelGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.3);
  const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const barrel = new THREE.Mesh(barrelGeometry, barrelMaterial);
  barrel.position.z = -0.45;
  weaponGroup.add(barrel);

  weaponGroup.position.set(0.3, -0.3, -0.7);
  camera.add(weaponGroup);

  return { weaponGroup, barrel };
}
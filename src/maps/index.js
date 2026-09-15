import * as THREE from 'three';
import { arena1 } from './arena1.js';

const maps = { arena1 };

export function loadMap(scene, mapName) {
  const mapData = maps[mapName];


  const floorGeometry = new THREE.PlaneGeometry(mapData.floorSize, mapData.floorSize);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);


  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaa4444 });
  const wallBoxes = [];

  for (const wallDef of mapData.walls) {
    const geometry = new THREE.BoxGeometry(...wallDef.size);
    const mesh = new THREE.Mesh(geometry, wallMaterial);
    mesh.position.set(...wallDef.position);
    scene.add(mesh);
    wallBoxes.push(new THREE.Box3().setFromObject(mesh));
  }

  return { floor, wallBoxes, spawns: mapData.spawns };
}
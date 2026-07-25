export const arena1 = {
  floorSize: 50,
  walls: [
    { position: [-10, 0.5, 0], size: [1, 3, 20] },
    { position: [10, 0.5, 0], size: [1, 3, 20] },
  ],
  spawns: [
    { x: -7, y: 1, z: 8, rotationY: -Math.PI / 4 },
    { x: 7, y: 1, z: -8, rotationY: Math.PI - Math.PI / 4 },
  ],
};
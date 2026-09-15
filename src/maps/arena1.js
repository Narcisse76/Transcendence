export const arena1 = {
  floorSize: 20,
  walls: [
    { position: [-9.5, 1.5, 0], size: [1, 3, 20] },
    { position: [9.5, 1.5, 0], size: [1, 3, 20] },
    { position: [0, 1.5, -9.5], size: [20, 3, 1] },
    { position: [0, 1.5, 9.5], size: [20, 3, 1] },

    // Murs interieurs / couverture
    { position: [-3, 1, -2], size: [1, 2, 4] },
    { position: [3, 1, 2], size: [1, 2, 4] },
    { position: [0, 1, -5], size: [4, 2, 1] },
    { position: [0, 1, 5], size: [4, 2, 1] },
  ],
  spawns: [
    { x: -7, y: 1, z: 7, rotationY: -Math.PI / 4 },
    { x: 7, y: 1, z: -7, rotationY: Math.PI - Math.PI / 4 },
  ],
};
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function loadWeaponModel(camera, path, onLoaded) {
  loader.load(
    path,
    (gltf) => {
      const weaponModel = gltf.scene;
      camera.add(weaponModel);

      if (onLoaded) onLoaded(weaponModel);
    },
    undefined,
    (error) => {
      console.error('Erreur de chargement du modele:', error);
    }
  );
}
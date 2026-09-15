import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function loadCharacterModel(path, onLoaded) {
  loader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      const mixer = new THREE.AnimationMixer(model);

      const actions = {};
      gltf.animations.forEach((clip) => {
        actions[clip.name] = mixer.clipAction(clip);
      });

      if (onLoaded) onLoaded(model, mixer, actions);
    },
    undefined,
    (error) => {
      console.error('Erreur de chargement du personnage:', error);
    }
  );
}

const FADE_DURATION = 0.2;

export function playAnimation(actions, name, currentActionRef) {
  const nextAction = actions[name];
  if (!nextAction || currentActionRef.current === nextAction) return;

  if (currentActionRef.current) {
    currentActionRef.current.fadeOut(FADE_DURATION);
  }

  nextAction.reset().fadeIn(FADE_DURATION).play();
  currentActionRef.current = nextAction;
}
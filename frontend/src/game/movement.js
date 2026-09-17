import * as THREE from 'three';

const WALK_SPEED = 5;
const SPRINT_SPEED = 9;
const SLIDE_INITIAL_SPEED = 16;
const SLIDE_FRICTION = 10;
const SLIDE_CAMERA_DIP = 0.4;
const SLIDE_CAMERA_DIP_SPEED = 10;
const SLIDE_COOLDOWN = 1;
const SLIDE_ACCELERATION = 30;

export function createMovementState() {
  return {
    sliding: false,
    slideSpeed: 0,
    slideDirection: new THREE.Vector3(),
    sprinting: false,
    cameraDip: 0,
    lastSlideTime: -Infinity,
    slideAccelerating: false,
  };
}

export function setupSprint(state) {
  document.addEventListener('keydown', (event) => {
    if (event.code === 'ShiftLeft') {
      state.sprinting = true;
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.code === 'ShiftLeft') {
      state.sprinting = false;
    }
  });
}

export function setupSlide(state, move, controls, camera) {
  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;

    const anyMovementKey = move.forward || move.backward || move.left || move.right;
    const now = performance.now() / 1000;
    const cooldownElapsed = now - state.lastSlideTime >= SLIDE_COOLDOWN;

    if (event.code === 'KeyC' && anyMovementKey && !state.sliding && cooldownElapsed) {
      const forward = controls.getDirection(new THREE.Vector3()).clone();
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(forward, camera.up).normalize();

      const direction = new THREE.Vector3();
      if (move.forward) direction.add(forward);
      if (move.backward) direction.sub(forward);
      if (move.right) direction.add(right);
      if (move.left) direction.sub(right);

      if (direction.lengthSq() < 0.0001) return;

      direction.normalize();

      state.sliding = true;
      state.slideSpeed = state.sprinting ? SPRINT_SPEED : WALK_SPEED;
      state.slideDirection = direction;
      state.lastSlideTime = now;
      state.slideAccelerating = true;
    }
  });
}

export function updateMovement(camera, controls, move, state, delta) {
  if (state.sliding) {
    if (state.slideAccelerating) {
      state.slideSpeed = Math.min(SLIDE_INITIAL_SPEED, state.slideSpeed + SLIDE_ACCELERATION * delta);
      if (state.slideSpeed >= SLIDE_INITIAL_SPEED) {
        state.slideAccelerating = false;
      }
    } else {
      state.slideSpeed -= SLIDE_FRICTION * delta;
    }

    const distance = state.slideSpeed * delta;
    camera.position.addScaledVector(state.slideDirection, distance);

    if (state.slideSpeed <= WALK_SPEED) {
      state.sliding = false;
      state.slideSpeed = 0;
    }
  } else {
    const currentSpeed = state.sprinting ? SPRINT_SPEED : WALK_SPEED;
    const distance = currentSpeed * delta;
    if (move.forward) controls.moveForward(distance);
    if (move.backward) controls.moveForward(-distance);
    if (move.right) controls.moveRight(distance);
    if (move.left) controls.moveRight(-distance);
  }
}

export function removeSlideCameraOffset(camera, state) {
  camera.position.y += state.cameraDip;
}

export function updateSlideCameraOffset(camera, state, delta) {
  const target = state.sliding ? SLIDE_CAMERA_DIP : 0;
  state.cameraDip += (target - state.cameraDip) * Math.min(1, SLIDE_CAMERA_DIP_SPEED * delta);
  camera.position.y -= state.cameraDip;
}
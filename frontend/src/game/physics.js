const GRAVITY = -20;
const JUMP_STRENGTH = 8;
const FLOOR_Y = 0.7;

const LANDING_DIP_AMOUNT = 0.3;
const LANDING_RECOVERY_SPEED = 6;
const LANDING_TRIGGER_THRESHOLD = 0.5;

const LAND_BOB_AMOUNT = 0.08;

export function createPhysicsState() {
  return {
    velocityY: 0,
    canJump: false,
    landingDip: 0,
  };
}

export function setupJump(state, onJump) {
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && state.canJump) {
      state.velocityY = JUMP_STRENGTH;
      state.canJump = false;
      if (onJump) onJump();
    }
  });
}

export function applyGravity(camera, state, delta) {
  state.velocityY += GRAVITY * delta;
  camera.position.y += state.velocityY * delta;

  if (camera.position.y <= FLOOR_Y) {
    const fallSpeed = state.velocityY;
    camera.position.y = FLOOR_Y;

    if (fallSpeed < -LANDING_TRIGGER_THRESHOLD) {
      const intensity = Math.min(1, Math.abs(fallSpeed) / 10);
      state.landingDip = Math.max(state.landingDip, intensity);
    }

    state.velocityY = 0;
    state.canJump = true;
  }
}

export function updateLandingDip(camera, state, delta) {
  state.landingDip = Math.max(0, state.landingDip - LANDING_RECOVERY_SPEED * delta);
  camera.position.y -= LANDING_DIP_AMOUNT * state.landingDip;
}

export function updateWeaponBob(weaponWrapper, baseY, state) {
  weaponWrapper.position.y = baseY - LAND_BOB_AMOUNT * state.landingDip;
}
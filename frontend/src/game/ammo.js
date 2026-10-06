const MAGAZINE_SIZE = 12;
const RELOAD_TIME = 1.5;
const FIRE_RATE = 0.15;

export function createAmmoState() {
  return {
    current: MAGAZINE_SIZE,
    max: MAGAZINE_SIZE,
    reloading: false,
    reloadStartTime: 0,
    reloadDuration: RELOAD_TIME,
    lastShotTime: -Infinity,
  };
}

export function canFire(state) {
  const now = performance.now() / 1000;
  if (state.reloading) return false;
  if (state.current <= 0) return false;
  if (now - state.lastShotTime < FIRE_RATE) return false;
  return true;
}

export function fire(state) {
  state.current -= 1;
  state.lastShotTime = performance.now() / 1000;
}

export function reload(state, onComplete) {
  if (state.reloading || state.current === state.max) return;
  state.reloading = true;
  state.reloadStartTime = performance.now() / 1000;

  setTimeout(() => {
    state.current = state.max;
    state.reloading = false;
    if (onComplete) onComplete();
  }, RELOAD_TIME * 1000);
}

export function getReloadTimeRemaining(state) {
  if (!state.reloading) return 0;
  const elapsed = performance.now() / 1000 - state.reloadStartTime;
  return Math.max(0, state.reloadDuration - elapsed);
}

export function setupReloadKey(state, onReloadStart) {
  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyR') {
      reload(state);
      if (onReloadStart) onReloadStart();
    }
  });
}
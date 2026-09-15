export function createCountdownState() {
  return { active: false, timeLeft: 0 };
}

export function startCountdown(state, duration, onComplete) {
  state.active = true;
  state.timeLeft = duration;
  state.onComplete = onComplete;
}

export function updateCountdown(state, delta) {
  if (!state.active) return;

  state.timeLeft -= delta;
  if (state.timeLeft <= 0) {
    state.active = false;
    if (state.onComplete) state.onComplete();
  }
}
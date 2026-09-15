const MAX_HEALTH = 100;

export function createHealthState(maxHealth = MAX_HEALTH) {
  return {
    current: maxHealth,
    max: maxHealth,
    isDead: false,
  };
}

export function applyDamage(healthState, amount, onDeath) {
  if (healthState.isDead) return;

  healthState.current -= amount;

  if (healthState.current <= 0) {
    healthState.current = 0;
    healthState.isDead = true;
    if (onDeath) onDeath();
  }
}

export function resetHealth(healthState) {
  healthState.current = healthState.max;
  healthState.isDead = false;
}
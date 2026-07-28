import { getReloadTimeRemaining } from '../game/ammo.js';

const healthBarFill = document.getElementById('health-bar-fill');
const healthText = document.getElementById('health-text');
const ammoCounter = document.getElementById('ammo-counter');
const roundScore = document.getElementById('round-score');

export function updateRoundHUD(roundState) {
  roundScore.textContent = `${roundState.playerScore} - ${roundState.enemyScore}`;
}

export function updateHealthHUD(healthState) {
  const ratio = healthState.current / healthState.max;
  healthBarFill.style.width = `${ratio * 100}%`;
  healthText.textContent = `${healthState.current} / ${healthState.max}`;

  if (ratio > 0.5) {
    healthBarFill.style.backgroundColor = '#4caf50';
  } else if (ratio > 0.25) {
    healthBarFill.style.backgroundColor = '#ff9800';
  } else {
    healthBarFill.style.backgroundColor = '#f44336';
  }
}

export function updateAmmoHUD(ammoState) {
  if (ammoState.reloading) {
    const remaining = getReloadTimeRemaining(ammoState);
    ammoCounter.textContent = `Rechargement... ${remaining.toFixed(1)}s`;
  } else {
    ammoCounter.textContent = `${ammoState.current} / ${ammoState.max}`;
  }
}
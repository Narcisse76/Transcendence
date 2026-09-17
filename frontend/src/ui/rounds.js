const ROUNDS_TO_WIN = 3;

export function createRoundState() {
  return {
    playerScore: 0,
    enemyScore: 0,
  };
}

export function recordPlayerWin(state) {
  state.playerScore += 1;
  return state.playerScore >= ROUNDS_TO_WIN;
}

export function recordEnemyWin(state) {
  state.enemyScore += 1;
  return state.enemyScore >= ROUNDS_TO_WIN;
}

export function resetRounds(state) {
  state.playerScore = 0;
  state.enemyScore = 0;
}
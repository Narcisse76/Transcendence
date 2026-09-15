export function createMatchFlow(deps) {
  const {
    camera, spawns, opponentMesh,
    playerHealth, opponentHealth, ammoState,
    roundState, countdownState, countdownDisplay,
    ROUND_COUNTDOWN_DURATION,
    updateHealthHUD, updateAmmoHUD, updateRoundHUD,
    recordPlayerWin, recordEnemyWin, resetRounds,
    startCountdown, showEndScreen, sendReady, resetHealth,
    setRoundActive, getMySpawnIndex,
  } = deps;

  function positionAtSpawn() {
    const spawn = spawns[getMySpawnIndex()];
    camera.position.set(spawn.x, spawn.y, spawn.z);
    camera.rotation.set(0, spawn.rotationY, 0, 'YXZ');
  }

  function startRoundCountdown() {
    positionAtSpawn();
    opponentMesh.visible = true;
    countdownDisplay.classList.remove('hidden');
    startCountdown(countdownState, ROUND_COUNTDOWN_DURATION, () => {
      countdownDisplay.classList.add('hidden');
      setRoundActive(true);
    });
  }

  function resetRound() {
    resetHealth(playerHealth);
    resetHealth(opponentHealth);

    ammoState.current = ammoState.max;
    ammoState.reloading = false;

    updateHealthHUD(playerHealth);
    updateAmmoHUD(ammoState);

    sendReady();
  }

  function resetMatch() {
    resetRounds(roundState);
    updateRoundHUD(roundState);
    resetRound();
  }

  function onPlayerWinsRound() {
    setRoundActive(false);
    const matchWon = recordPlayerWin(roundState);
    updateRoundHUD(roundState);

    if (matchWon) {
      showEndScreen('Victoire finale !', resetMatch);
    } else {
      showEndScreen(`Manche gagnee ! (${roundState.playerScore} - ${roundState.enemyScore})`, resetRound);
    }
  }

  function onEnemyWinsRound() {
    setRoundActive(false);
    const matchLost = recordEnemyWin(roundState);
    updateRoundHUD(roundState);

    if (matchLost) {
      showEndScreen('Defaite finale !', resetMatch);
    } else {
      showEndScreen(`Manche perdue... (${roundState.playerScore} - ${roundState.enemyScore})`, resetRound);
    }
  }

  return { startRoundCountdown, resetRound, resetMatch, onPlayerWinsRound, onEnemyWinsRound };
}
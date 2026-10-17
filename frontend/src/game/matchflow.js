const OPPONENT_EYE_Y = 0.7;

export function createMatchFlow(deps) {
  const {
    camera, spawns, opponentMesh,
    opponentTargetPosition, setOpponentTargetRotationY,
    playerHealth, opponentHealth, ammoState,
    roundState, countdownState, countdownDisplay,
    ROUND_COUNTDOWN_DURATION,
    updateHealthHUD, updateAmmoHUD, updateRoundHUD,
    recordPlayerWin, recordEnemyWin, resetRounds,
    startCountdown, showEndScreen, sendReady, resetHealth,
    setRoundActive, getMySpawnIndex, goToMenu,
  } = deps;

  function positionAtSpawn() {
    const mySpawnIndex = getMySpawnIndex();
    const spawn = spawns[mySpawnIndex];
    camera.position.set(spawn.x, spawn.y, spawn.z);
    camera.rotation.set(0, spawn.rotationY, 0, 'YXZ');

    const opponentSpawn = spawns[1 - mySpawnIndex];
    opponentTargetPosition.set(opponentSpawn.x, OPPONENT_EYE_Y, opponentSpawn.z);
    opponentMesh.position.copy(opponentTargetPosition);
    setOpponentTargetRotationY(opponentSpawn.rotationY);
    opponentMesh.rotation.y = opponentSpawn.rotationY;
  }

  function startRoundCountdown() {
    resetHealth(playerHealth);
    resetHealth(opponentHealth);
    ammoState.current = ammoState.max;
    ammoState.reloading = false;
    updateHealthHUD(playerHealth);
    updateAmmoHUD(ammoState);

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
      showEndScreen('Victoire !', goToMenu, 'Retour au menu');
    } else {
      showEndScreen(`Manche gagnee ! (${roundState.playerScore} - ${roundState.enemyScore})`, resetRound);
    }
  }

  function onEnemyWinsRound() {
    setRoundActive(false);
    const matchLost = recordEnemyWin(roundState);
    updateRoundHUD(roundState);

    if (matchLost) {
      showEndScreen('Defaite !', goToMenu, 'Retour au menu');
    } else {
      showEndScreen(`Manche perdue... (${roundState.playerScore} - ${roundState.enemyScore})`, resetRound);
    }
  }

  return { startRoundCountdown, resetRound, resetMatch, onPlayerWinsRound, onEnemyWinsRound };
}
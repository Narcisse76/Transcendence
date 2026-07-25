import { connectToServer } from './network.js';

export function setupGameNetworking(deps) {
  const {
    playerHealth, opponentMesh,
    opponentTargetPosition, setOpponentTargetRotationY,
    setMySpawnIndex,
    connectionBanner, applyDamage, updateHealthHUD,
    onEnemyWinsRound, startRoundCountdown, showEndScreen, resetMatch,
  } = deps;

  return connectToServer({
    onRoundStart: () => {
      startRoundCountdown();
    },
    onMatchStart: (matchData) => {
      setMySpawnIndex(matchData.spawnIndex);
      opponentMesh.visible = true;
      startRoundCountdown();
    },
    onMatchResumed: (matchData) => {
      setMySpawnIndex(matchData.spawnIndex);
      opponentMesh.visible = true;
    },
    onOpponentMove: (moveData) => {
      opponentTargetPosition.set(moveData.x, moveData.y, moveData.z);
      setOpponentTargetRotationY(moveData.rotationY);
    },
    onOpponentShoot: (shootData) => {
      console.log('Adversaire tire:', shootData);
    },
    onOpponentHit: (hitData) => {
      applyDamage(playerHealth, hitData.damage, () => {
        onEnemyWinsRound();
      });
      updateHealthHUD(playerHealth);
    },
    onOpponentDisconnected: () => {
      connectionBanner.textContent = 'Adversaire deconnecte, en attente de reconnexion...';
      connectionBanner.classList.remove('hidden');
    },
    onOpponentReconnected: () => {
      connectionBanner.classList.add('hidden');
    },
    onMatchAbandoned: () => {
      connectionBanner.classList.add('hidden');
      showEndScreen('Adversaire non revenu - Partie terminee', resetMatch);
    },
  });
}
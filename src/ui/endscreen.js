const endScreen = document.getElementById('end-screen');
const endMessage = document.getElementById('end-message');
let restartButton = document.getElementById('restart-button');

export function showEndScreen(message, onRestart) {
  endMessage.textContent = message;
  endScreen.classList.remove('hidden');

  const newButton = restartButton.cloneNode(true);
  restartButton.replaceWith(newButton);
  restartButton = newButton;

  restartButton.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    onRestart();
  });
}
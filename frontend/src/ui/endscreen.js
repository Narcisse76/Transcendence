const endScreen = document.getElementById('end-screen');
const endMessage = document.getElementById('end-message');
let restartButton = document.getElementById('restart-button');

export function showEndScreen(message, onRestart, buttonLabel = 'Rejouer') {
  endMessage.textContent = message;
  endScreen.classList.remove('hidden');

  const newButton = restartButton.cloneNode(true);
  newButton.textContent = buttonLabel;
  restartButton.replaceWith(newButton);
  restartButton = newButton;

  restartButton.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    onRestart();
  });
}
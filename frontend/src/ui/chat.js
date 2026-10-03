const chatContainer = document.getElementById('chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');

const MAX_MESSAGES = 30;
const MESSAGE_FADE_DELAY = 8000;

export function setupChat({ onSend, onOpen }) {
  let open = false;

  function openChat() {
    open = true;
    chatContainer.classList.add('open');
    chatInput.focus();
    if (onOpen) onOpen();
  }

  function closeChat() {
    open = false;
    chatInput.value = '';
    chatInput.blur();
    chatContainer.classList.remove('open');
  }

  document.addEventListener('keydown', (event) => {
    if (!open && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
      event.preventDefault();
      openChat();
    }
  });

  chatInput.addEventListener('keydown', (event) => {
    event.stopPropagation();
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      const text = chatInput.value.trim();
      if (text) onSend(text);
      closeChat();
    } else if (event.code === 'Escape') {
      closeChat();
    }
  });
  chatInput.addEventListener('keyup', (event) => event.stopPropagation());
  chatInput.addEventListener('blur', () => {
    if (open) closeChat();
  });

  function appendLine(className, author, text) {
    const line = document.createElement('div');
    line.className = `chat-line ${className}`;

    if (author) {
      const authorSpan = document.createElement('span');
      authorSpan.className = 'chat-author';
      authorSpan.textContent = `${author} : `;
      line.appendChild(authorSpan);
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    line.appendChild(textSpan);

    chatMessages.appendChild(line);
    while (chatMessages.children.length > MAX_MESSAGES) {
      chatMessages.firstChild.remove();
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => line.classList.add('faded'), MESSAGE_FADE_DELAY);
  }

  return {
    addMessage: (author, text, isMine) => appendLine(isMine ? 'mine' : 'theirs', author, text),
    addSystemMessage: (text) => appendLine('system', null, text),
    isOpen: () => open,
  };
}

const BANNED_WORDS = ['connard', 'encule', 'salope', 'fdp', 'ntm'];

function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export async function moderateMessage(text, context) {
  const normalized = normalize(text);

  for (const word of BANNED_WORDS) {
    if (new RegExp(`\\b${word}\\b`).test(normalized)) {
      return { allowed: false, reason: 'Langage inapproprie' };
    }
  }

  return { allowed: true };
}
export async function sendAccountDeletedEmail(email) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    throw new Error('Configuration Resend manquante');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    signal: AbortSignal.timeout(5000),
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Transcendence <${process.env.RESEND_FROM}>`,
      to: [email],
      subject: 'Suppression de votre compte Transcendence',
      text: 'Votre compte Transcendence a bien été supprimé.',
    }),
  });

  if (!response.ok) {
    throw new Error('Envoi du mail refusé par Resend');
  }
}

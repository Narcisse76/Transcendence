import { useState } from 'react';
import Accordion from './components/Accordion';
import Button from './components/Button';
import { translations } from './translations';
import type { User } from './App';

type HomeScreenProps = {
  user: User;
  setUser: (newUser: User | null) => void;
  setSelectedScreen: (newScreen: string) => void;
};

export default function HomeScreen({ user, setUser, setSelectedScreen }: HomeScreenProps) {
  const languageText = translations[user.language];
  const [errorMessage, setErrorMessage] = useState('');

  async function logout() {
    try {
      const response = await fetch('/api/account/logout', { method: 'POST' });
      if (!response.ok) {
        setErrorMessage('Déconnexion refusée');
        return;
      }
      setUser(null);
      setSelectedScreen('home');
    } catch {
      setErrorMessage('Serveur inaccessible');
    }
  }

  return (
    <main lang={user.language} className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-9 text-center text-2xl font-bold text-yellow-400">TRANSCENDENCE</h1>

        <p>{user.pseudo}</p>
        <Accordion title={languageText.rulesTitle} paragraphs={languageText.rulesParagraphs} />
        <div className="mt-6 flex flex-col gap-3">

          <Button text={languageText.playButton} onClick={() => { window.location.href = '/game/'; }} />

          <Button text={languageText.commandsTitle} onClick={() => setSelectedScreen('commands')} />
          <Button text="Mon profil" onClick={() => setSelectedScreen('profile')} />
          <Button text="Déconnexion" onClick={logout} />
        </div>
        <p>{errorMessage}</p>

        <footer className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
          <a href="/privacy.html" className="underline hover:text-white">
            Privacy Policy
          </a>
          <a href="/rgpd.html" className="underline hover:text-white">
            RGPD
          </a>
          <a href="/terms.html" className="underline hover:text-white">
            Terms of Service
          </a>
        </footer>
      </div>
    </main>
  );
}
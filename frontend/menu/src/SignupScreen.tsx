import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { User } from './App';
import Button from './components/Button';
import LanguageSelector from './components/LanguageSelector';
import { translations } from './translations';
import type { Language } from './translations';

type SignupScreenProps = {
  selectedLanguage: Language;
  setSelectedLanguage: (newLanguage: Language) => void;
  setUser: (newUser: User | null) => void;
  setSelectedScreen: (newScreen: string) => void;
};

export default function SignupScreen({ setUser, setSelectedScreen, selectedLanguage, setSelectedLanguage }: SignupScreenProps) {
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const languageText = translations[selectedLanguage];

  function changeLanguage(newLanguage: Language) {
    setSelectedLanguage(newLanguage);
    setErrorMessage('');
  }

  async function signup(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    if (!pseudo.trim()) {
      setErrorMessage(languageText.emptyNickname);
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMessage(languageText.passwordMismatch);
      return;
    }
    try {
      const response = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pseudo, password, language: selectedLanguage }),
      });
      if (!response.ok) {
        setErrorMessage(languageText.signupFailed);
        return;
      }
      setUser(await response.json());
      setSelectedScreen('home');
    } catch {
      setErrorMessage(languageText.serverUnavailable);
    }
  }

  return (
    <main lang={selectedLanguage} className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl text-yellow-400">{languageText.signupTitle}</h1>
        <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={changeLanguage} />
        <form onSubmit={signup} className="flex flex-col gap-4">
          <label>{languageText.emailLabel}
            <input className="w-full rounded border bg-neutral-900 p-3" type="email" required
              value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          <label>{languageText.nicknameLabel}
            <input className="w-full rounded border bg-neutral-900 p-3" required maxLength={24}
              value={pseudo} onChange={event => setPseudo(event.target.value)} />
          </label>
          <label>{languageText.signupPasswordLabel}
            <input className="w-full rounded border bg-neutral-900 p-3" type="password" required minLength={5} maxLength={128}
              value={password} onChange={event => setPassword(event.target.value)} />
          </label>
          <label>{languageText.passwordConfirmationLabel}
            <input className="w-full rounded border bg-neutral-900 p-3" type="password" required
              value={passwordConfirmation} onChange={event => setPasswordConfirmation(event.target.value)} />
          </label>
          <p>{errorMessage}</p>
          <button className="rounded bg-yellow-400 p-3 text-black" type="submit">{languageText.signupButton}</button>
        </form>
        <div className="mt-4">
          <Button text={languageText.backToLogin} onClick={() => setSelectedScreen('home')} />
        </div>
      </div>
    </main>
  );
}

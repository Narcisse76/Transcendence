import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { User } from './App';
import Button from './components/Button';

type LoginScreenProps = {
  setUser: (newUser: User | null) => void;
  setSelectedScreen: (newScreen: string) => void;
};

export default function LoginScreen({ setUser, setSelectedScreen }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function login(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    try {
      const response = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        setErrorMessage('Connexion refusée');
        return;
      }
      const connectedUser: User = await response.json();
      setUser(connectedUser);
      setSelectedScreen('home');
    } catch {
      setErrorMessage('Serveur inaccessible');
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl text-yellow-400">Connexion</h1>
        <form onSubmit={login} className="flex flex-col gap-4">
          <label>Email
            <input className="w-full rounded border bg-neutral-900 p-3" type="email" required
              value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          <label>Mot de passe
            <input className="w-full rounded border bg-neutral-900 p-3" type="password" required maxLength={128}
              value={password} onChange={event => setPassword(event.target.value)} />
          </label>
          <p>{errorMessage}</p>
          <button className="rounded bg-yellow-400 p-3 text-black" type="submit">Se connecter</button>
        </form>
        <div className="mt-4">
          <Button text="Créer un compte" onClick={() => setSelectedScreen('signup')} />
        </div>
      </div>
    </main>
  );
}

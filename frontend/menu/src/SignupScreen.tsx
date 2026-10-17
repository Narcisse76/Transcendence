import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { User } from './App';
import Button from './components/Button';

type SignupScreenProps = {
  setUser: (newUser: User | null) => void;
  setSelectedScreen: (newScreen: string) => void;
};

export default function SignupScreen({ setUser, setSelectedScreen }: SignupScreenProps) {
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function signup(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    if (!pseudo.trim()) {
      setErrorMessage('Le pseudo ne peut pas être vide ou contenir uniquement des espaces.');
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMessage('Les mots de passe sont différents');
      return;
    }
    try {
      const response = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pseudo, password }),
      });
      if (!response.ok) {
        setErrorMessage('Inscription refusée : vérifie les champs ou utilise un autre email.');
        return;
      }
      setUser(await response.json());
      setSelectedScreen('home');
    } catch {
      setErrorMessage('Serveur inaccessible');
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl text-yellow-400">Créer un compte</h1>
        <form onSubmit={signup} className="flex flex-col gap-4">
          <label>Email
            <input className="w-full rounded border bg-neutral-900 p-3" type="email" required
              value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          <label>Pseudo
            <input className="w-full rounded border bg-neutral-900 p-3" required maxLength={24}
              value={pseudo} onChange={event => setPseudo(event.target.value)} />
          </label>
          <label>Mot de passe (5 caractères minimum)
            <input className="w-full rounded border bg-neutral-900 p-3" type="password" required minLength={5} maxLength={128}
              value={password} onChange={event => setPassword(event.target.value)} />
          </label>
          <label>Confirmer le mot de passe
            <input className="w-full rounded border bg-neutral-900 p-3" type="password" required
              value={passwordConfirmation} onChange={event => setPasswordConfirmation(event.target.value)} />
          </label>
          <p>{errorMessage}</p>
          <button className="rounded bg-yellow-400 p-3 text-black" type="submit">Créer mon compte</button>
        </form>
        <div className="mt-4">
          <Button text="Retour à la connexion" onClick={() => setSelectedScreen('home')} />
        </div>
      </div>
    </main>
  );
}

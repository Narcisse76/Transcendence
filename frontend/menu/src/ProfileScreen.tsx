import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { User } from './App';
import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';
import AvatarOption from './components/AvatarOption';
import Button from './components/Button';
import { translations } from './translations';
import type { Language } from './translations';

type ProfileScreenProps = {
  user: User;
  setUser: (newUser: User | null) => void;
  setSelectedScreen: (newScreen: string) => void;
};

export default function ProfileScreen({ user, setUser, setSelectedScreen }: ProfileScreenProps) {
  const [pseudo, setPseudo] = useState(user.pseudo);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [selectedLanguage, setSelectedLanguage] = useState(user.language);
  const [errorMessage, setErrorMessage] = useState('');
  const languageText = translations[selectedLanguage];
  const avatarsTableau = [
    { id: 'human', label: languageText.avatarHuman },
    { id: 'robot', label: languageText.avatarRobot },
    { id: 'cat', label: languageText.avatarCat },
    { id: 'alien', label: languageText.avatarAlien },
  ];

  function changeLanguage(newLanguage: Language) {
    setSelectedLanguage(newLanguage);
    setErrorMessage('');
  }

  async function saveProfile(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    if (!pseudo.trim() || pseudo.length > 24) {
      setErrorMessage(languageText.invalidNickname);
      return;
    }
    try {
      const response = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo, avatar: selectedAvatar, language: selectedLanguage }),
      });
      if (!response.ok) {
        setErrorMessage(languageText.saveFailed);
        return;
      }
      setUser(await response.json());
      setSelectedScreen('home');
    } catch {
      setErrorMessage(languageText.serverUnavailable);
    }
  }

  async function deleteAccount() {
    if (!window.confirm(languageText.deleteAccountConfirmation)) {
      return;
    }

    setErrorMessage('');
    try {
      const response = await fetch('/api/account/me', {
        method: 'DELETE',
      });
      if (!response.ok) {
        setErrorMessage(languageText.deleteFailed);
        return;
      }
      setUser(null);
      setSelectedScreen('home');
    } catch {
      setErrorMessage(languageText.serverUnavailable);
    }
  }

  return (
    <main lang={selectedLanguage} className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl text-yellow-400">{languageText.profileButton}</h1>
        <form onSubmit={saveProfile}>
          <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={changeLanguage} />
          <TextInput id="pseudo" label={languageText.pseudoLabel} placeholder={languageText.pseudoPlaceholder}
            value={pseudo} setPseudo={setPseudo} />
          <fieldset className="mt-6">
            <legend>{languageText.avatarLabel}</legend>
            <div className="flex gap-2">
              {avatarsTableau.map(avatar => (
                <AvatarOption key={avatar.id} avatarId={avatar.id} avatarLabel={avatar.label}
                  selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar} />
              ))}
            </div>
          </fieldset>
          <p>{errorMessage}</p>
          <button className="mt-6 w-full rounded bg-yellow-400 p-3 text-black" type="submit">{languageText.saveButton}</button>
        </form>
        <div className="mt-4">
          <Button text={languageText.backToMenu} onClick={() => setSelectedScreen('home')} />
        </div>
        <button className="mt-4 w-full rounded border border-red-400 p-3 text-red-400"
          type="button" onClick={deleteAccount}>
          {languageText.deleteAccountButton}
        </button>
      </div>
    </main>
  );
}

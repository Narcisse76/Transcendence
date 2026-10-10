import TextInput from './components/TextInput';
import LanguageSelector from './components/LanguageSelector';
import AvatarOption from './components/AvatarOption';
import Accordion from './components/Accordion';
import Button from './components/Button';
import { translations } from './translations';
import type { Language } from './translations';

type HomeScreenProps = {
  pseudo: string;
  setPseudo: (value: string) => void;
  selectedLanguage: Language;
  setSelectedLanguage: (newLanguage: Language) => void;
  selectedAvatar: string;
  setSelectedAvatar: (newAvatar: string) => void;
  setSelectedScreen: (newScreen: string) => void;
};

export default function HomeScreen({
  pseudo,
  setPseudo,
  selectedLanguage,
  setSelectedLanguage,
  selectedAvatar,
  setSelectedAvatar,
  setSelectedScreen,
}: HomeScreenProps) {
  // On choisit les textes qui correspondent à la langue actuelle.
  const languageText = translations[selectedLanguage];
  const avatarsTableau = [
    { id: 'human', label: languageText.avatarHuman },
    { id: 'robot', label: languageText.avatarRobot },
    { id: 'cat', label: languageText.avatarCat },
    { id: 'alien', label: languageText.avatarAlien },
  ];

  return (
    <main lang={selectedLanguage} className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">
      <div className="w-full max-w-sm">
        <h1 className="mb-9 text-center text-2xl font-bold text-yellow-400">
          TRANSCENDENCE
        </h1>
        <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
        <TextInput
          id="pseudo"
          label={languageText.pseudoLabel}
          placeholder={languageText.pseudoPlaceholder}
          value={pseudo}
          setPseudo={setPseudo}
        />
        <fieldset className="mt-6">
          <legend className="mb-3">{languageText.avatarLabel}</legend>
          <div className="flex flex-wrap justify-between gap-2">
            {avatarsTableau.map((avatar) => (
              <AvatarOption
                key={avatar.id}
                avatarId={avatar.id}
                avatarLabel={avatar.label}
                selectedAvatar={selectedAvatar}
                setSelectedAvatar={setSelectedAvatar}
              />
            ))}
          </div>
        </fieldset>
        <Accordion
          title={languageText.rulesTitle}
          paragraphs={languageText.rulesParagraphs}
        />
        <div className="mt-6 flex flex-col gap-3">
          <Button
            text={languageText.playButton}
            onClick={() => {
              // Le lancement du jeu sera branché ici plus tard.
            }}
          />
          <Button
            text={languageText.commandsTitle}
            onClick={() => setSelectedScreen('commands')}
          />
        </div>
      </div>
    </main>
  );
}

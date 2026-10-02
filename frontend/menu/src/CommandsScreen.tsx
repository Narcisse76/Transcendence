import Button from './components/Button';
import CommandRow from './components/CommandRow';
import { translations } from './translations';
import type { Language } from './translations';

type CommandsScreenProps = {
  selectedLanguage: Language;
  setSelectedScreen: (newScreen: string) => void;
};

export default function CommandsScreen({ selectedLanguage, setSelectedScreen }: CommandsScreenProps) {
  const languageText = translations[selectedLanguage];
  const commandsTableau = languageText.commands;

  return (
    <main lang={selectedLanguage} className="flex min-h-dvh items-center justify-center bg-black p-6 font-[Arial] text-white">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold text-yellow-400">
          {languageText.commandsTitle}
        </h1>
        <p className="mb-6 mt-3 text-center">QWERTY</p>
        <ul className="flex flex-col gap-3">
          {commandsTableau.map((command) => (
            <CommandRow
              key={command.action}
              action={command.action}
              keyLabel={command.keyLabel}
            />
          ))}
        </ul>
        <div className="mt-6">
          <Button
            text={languageText.backToMenu}
            onClick={() => setSelectedScreen('home')}
          />
        </div>
      </div>
    </main>
  );
}

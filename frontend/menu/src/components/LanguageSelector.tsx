import type { Language } from '../translations';
import { translations } from '../translations';

type LanguageSelectorProps = {
  selectedLanguage: Language;
  setSelectedLanguage: (newLanguage: Language) => void;
};

const languagesTableau: Language[] = ['fr', 'en', 'es'];

export default function LanguageSelector({ selectedLanguage, setSelectedLanguage }: LanguageSelectorProps) {
  const languageText = translations[selectedLanguage];

  return (
    <div role="group" aria-label={languageText.languageLabel} className="mb-8 flex justify-center gap-3">
      {languagesTableau.map((languageCode) => {
        let buttonColors = 'border-gray-500 bg-black text-white';

        if (selectedLanguage === languageCode) {
          buttonColors = 'bg-yellow-400 text-black';
        }

        return (
          <button
            key={languageCode}
            type="button"
            onClick={() => setSelectedLanguage(languageCode)}
            aria-pressed={selectedLanguage === languageCode}
            className={`cursor-pointer  rounded px-4 py-3   ${buttonColors}`}
          >
            {languageCode.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

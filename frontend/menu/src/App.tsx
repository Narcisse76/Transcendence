import { useState } from 'react';
import HomeScreen from './HomeScreen';
import CommandsScreen from './CommandsScreen';
import type { Language } from './translations';

export default function App() {
  // App garde le pseudo pour pouvoir le partager avec les futurs écrans.
  const [pseudo, setPseudo] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('fr');
  const [selectedAvatar, setSelectedAvatar] = useState('human');
  const [selectedScreen, setSelectedScreen] = useState('home');

  // Si on a choisi les commandes, on affiche cet écran à la place de l'accueil.
  if (selectedScreen === 'commands') {
    return (
      <CommandsScreen
        selectedLanguage={selectedLanguage}
        setSelectedScreen={setSelectedScreen}
      />
    );
  }

  return (
    <HomeScreen
      pseudo={pseudo}
      setPseudo={setPseudo}
      selectedLanguage={selectedLanguage}
      setSelectedLanguage={setSelectedLanguage}
      selectedAvatar={selectedAvatar}
      setSelectedAvatar={setSelectedAvatar}
      setSelectedScreen={setSelectedScreen}
    />
  );
}

import { useEffect, useState } from 'react';
import HomeScreen from './HomeScreen';
import CommandsScreen from './CommandsScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import ProfileScreen from './ProfileScreen';
import type { Language } from './translations';
import { translations } from './translations';

export type User = {
  id: string;
  pseudo: string;
  avatar: string;
  language: Language;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScreen, setSelectedScreen] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('fr');

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/account/me');
        if (response.ok) {
          const connectedUser: User = await response.json();
          setUser(connectedUser);
        }
      } finally {
        setLoading(false);
      }
    }
    loadUser().catch(() => {});
  }, []);

  if (loading) return <p lang={selectedLanguage}>{translations[selectedLanguage].loading}</p>;
  if (!user && selectedScreen === 'signup') {
    return <SignupScreen setUser={setUser} setSelectedScreen={setSelectedScreen}
      selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />;
  }
  if (!user) {
    return <LoginScreen setUser={setUser} setSelectedScreen={setSelectedScreen}
      selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />;
  }
  if (selectedScreen === 'profile') {
    return <ProfileScreen user={user} setUser={setUser} setSelectedScreen={setSelectedScreen} />;
  }
  if (selectedScreen === 'commands') {
    return <CommandsScreen selectedLanguage={user.language} setSelectedScreen={setSelectedScreen} />;
  }
  return <HomeScreen user={user} setUser={setUser} setSelectedScreen={setSelectedScreen} />;
}

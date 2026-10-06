// createRoot permet à React de gérer l'affichage dans un élément HTML.
import { createRoot } from 'react-dom/client';
// App est notre composant principal : il contient le reste de l'interface.
import App from './App';
// Ce fichier importe Tailwind pour appliquer les styles de nos composants.
import './index.css';

// On récupère le <div id="root"></div> présent dans index.html.
// Ici, "root" est la variable qui contient cet élément HTML.
const root = document.getElementById('root');

// Si l'élément n'existe pas, on arrête le démarrage avec un message d'erreur.
// Cette vérification indique aussi à TypeScript que root existe après le if.
if (!root) {
  throw new Error('Élément #root introuvable.');
}

// createRoot(root) prépare React à afficher notre interface dans ce div.
// .render(<App />) demande à React d'y afficher le composant App.
// <App /> est du JSX : une syntaxe qui ressemble au HTML et utilise ici
// notre composant. L'extension .tsx permet d'écrire du JSX avec TypeScript.
createRoot(root).render(<App />);

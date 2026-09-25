# Guide de Développement - Waypoint Pilot

## 🚀 Démarrage rapide

### Installation

```bash
# Cloner le repository
git clone https://github.com/uinfo1-informatique/Waypoint-pilot.git
cd Waypoint-pilot

# Installer les dépendances
npm ci

# Lancer le serveur de développement
npm run dev
```

L'application s'ouvre sur `http://localhost:5173`

### Commandes courantes

```bash
# Développement
npm run dev          # Serveur avec hot reload

# Tests
npm test             # Mode watch
npm run test:ci      # Mode CI (rapports verbeux)
npm run test:coverage # Avec couverture de code

# Qualité du code
npm run lint         # ESLint
npm run lint -- --fix # Auto-fix les problèmes

# Build
npm run build        # Build production
npm run preview      # Prévisualiser la build

# Déploiement
git push origin main # Déclenche la CI/CD (GitHub Actions)
```

---

## 🏗️ Architecture

### Flux principal

```
npm run dev
  ↓
index.html (charges les fonts)
  ↓
src/main.jsx (initialisation React)
  ↓
src/App.jsx (gestion auth + routage)
  ├→ user === null    → Login (pages/Login.jsx)
  │  ├→ Modal (ForgotPassword.jsx)
  │  └→ onLogin() → App set user
  └→ user !== null    → Dashboard (pages/Dashboard.jsx)
     └→ onLogout() → App set user = null
```

### Authentification (actuelle)

**Type** : Mock en mémoire (pas d'API réelle)

```jsx
// App.jsx
const [user, setUser] = useState(null)  // null = déconnecté

// Login.jsx - Crédentials acceptés
// Simulation 400ms
setTimeout(() => {
  setUser({ email })  // Connexion réussie
}, 400)
```

**À la fermeture du navigateur** : Tous les données sont perdues (normal pour un mock)

### Sauvegarder la session

Pour persister l'authentification, utilisez `localStorage` ou une vraie API :

```jsx
// Sauvegarde en localStorage
useEffect(() => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.removeItem('user')
  }
}, [user])

// Restaure au chargement
useEffect(() => {
  const saved = localStorage.getItem('user')
  if (saved) {
    setUser(JSON.parse(saved))
  }
}, [])
```

---

## 📝 Ajouter un nouveau composant

### Template de composant

```jsx
import { useState, useCallback } from 'react'
import './MyPage.css'

/**
 * Brève description du composant
 * 
 * Détails supplémentaires :
 * - Responsabilité 1
 * - Responsabilité 2
 * 
 * @component
 * @param {Object} props
 * @param {string} props.title - Titre
 * @param {Function} props.onAction - Callback
 * @returns {JSX.Element}
 */
export default function MyPage({ title, onAction }) {
  // État
  const [isLoading, setIsLoading] = useState(false)

  // Handlers memoïsés
  const handleClick = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onAction()
    }, 400)
  }, [onAction])

  return (
    <div className="my-page">
      <h1>{title}</h1>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Chargement...' : 'Cliquez'}
      </button>
    </div>
  )
}
```

### Template de CSS (BEM)

```css
/* Bloc */
.my-page {
  padding: 2rem;
}

/* Éléments */
.my-page h1 {
  font-size: 1.5rem;
  margin: 0;
}

.my-page__button {
  background: var(--accent);
  color: white;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* État */
.my-page__button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 720px) {
  .my-page {
    padding: 1rem;
  }
}
```

### Template de test

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyPage from '../MyPage'

describe('MyPage', () => {
  it('affiche le titre', () => {
    render(<MyPage title="Test" onAction={vi.fn()} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('appelle onAction au clic', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<MyPage title="Test" onAction={onAction} />)

    const button = screen.getByRole('button')
    await user.click(button)

    await waitFor(() => expect(onAction).toHaveBeenCalled())
  })
})
```

---

## ✅ Standards de qualité

### Code style

**ESLint** — Configuration en `.eslintrc.cjs`

```bash
npm run lint        # Vérifier
npm run lint -- --fix  # Corriger auto
```

**Points clés** :
- Pas de `var` — Utilisez `const` ou `let`
- Pas de dépendances oubliées en `useEffect`
- Pas de `console.log()` en production

### Tests

**Couverture minimale** : 80%

```bash
npm run test:coverage
```

**Types de tests** :
- Unitaires (composant isolé)
- Intégration (composant + enfants)
- E2E (workflow complet)

**Bonnes pratiques** :
- Testez le comportement, pas l'implémentation
- Utilisez des queryables accessibles (`getByRole`, `getByLabelText`)
- Simulez les interactions utilisateur (`userEvent`, pas `fireEvent`)

### Accessibilité (A11y)

**Checklist** :
- ✅ Labels correctement associés aux inputs
- ✅ Messages d'erreur avec `role="alert"`
- ✅ Boutons et modals avec descriptions ARIA
- ✅ Styles focus visibles (`:focus-visible`)
- ✅ Pas de texte sans structure HTML

### Performance

**Optimisations** :
- Memoïsez les callbacks avec `useCallback`
- Splittez les gros composants
- Lazyloadez si besoin (futures images)
- Profilez avec DevTools React

---

## 🔧 Commandes importantes

### Débogage

```bash
# Ajouter console.log() dans le code
console.log('Debug:', myVar)

# DevTools React (Chrome ↓)
# https://chrome.google.com/webstore/detail/react-developer-tools

# DevTools Vite
# http://localhost:5173/__vite_ping  (confirme que Vite est actif)
```

### Git workflow

```bash
# Créer une branche
git checkout -b feature/ma-fonctionnalite

# Committer
git add .
git commit -m "feat: Ajouter modal mot de passe oublié"

# Pousser
git push origin feature/ma-fonctionnalite

# PR sur GitHub
# La CI/CD s'exécute automatiquement
```

### Dépendances

```bash
# Installer une dépendance
npm install nom-package

# Vérifier les vulnérabilités
npm audit

# Mettre à jour
npm update
```

---

## 🐛 Dépannage courant

### Problème : "npm: not found"

**Cause** : Node.js/npm pas dans le PATH

**Solution** :
1. Installer Node.js depuis [nodejs.org](https://nodejs.org)
2. Redémarrer le terminal
3. Vérifier : `node --version` et `npm --version`

### Problème : Port 5173 déjà utilisé

**Cause** : Un autre processus utilise le port

**Solution** :
```bash
# Forcer un autre port
npm run dev -- --port 3000
```

### Problème : Cache git problématique

**Cause** : Git l'a choisi en copie

**Solution** :
```bash
git clean -fd
npm ci
npm run dev
```

### Problème : Tests échouent localement

**Cause** : Node version différente

**Solution** :
```bash
# Vérifier la version
node --version

# Utiliser Node 18 ou 20
# Installer nvm : https://github.com/nvm-sh/nvm
nvm use 20
npm ci
npm test -- --run
```

---

## 📚 Ressources documentaires

**Dans ce repo** :
- [`CLAUDE.md`](CLAUDE.md) — Vue d'ensemble et standards
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — Architecture détaillée
- [`CI-CD.md`](CI-CD.md) — Pipeline CI/CD et tests
- [`README.md`](README.md) — ReadMe général

**Externes** :
- [React Docs](https://react.dev) — Documentation officielle React
- [Vite Docs](https://vitejs.dev) — Documentation Vite
- [Vitest Docs](https://vitest.dev) — Testing framework
- [Testing Library](https://testing-library.com) — Best practices testing
- [MDN Web Docs](https://developer.mozilla.org) — Référence CSS/JS

---

## 🎯 Checklist avant de committer

- [ ] `npm run lint -- --fix` (pas d'erreurs)
- [ ] `npm test -- --run` (tous les tests passent)
- [ ] `npm run build` (build réussit)
- [ ] Pas de `console.log()` ou code debug
- [ ] Code commenté en français
- [ ] Message de commit clair (convention Commitizen)
- [ ] Branche à jour avec `main` (`git pull origin main`)

---

## 🚀 Déploiement

### Automatique (CI/CD)

À chaque `git push` sur `main` :
1. GitHub Actions clone le repo
2. Installe dépendances
3. Lint + Tests + Build
4. Reporte les résultats

**Aucun déploiement automatique** — Étape manuel requise.

### Manual deployment (futur)

Options populaires:
- **Vercel** : Lien GitHub, déploie auto
- **Netlify** : Similaire à Vercel
- **Azure Static Web Apps** : Pour les équipes Microsoft

---

## 📞 Support

**Questions** ?
1. Vérifiez la documentation (`ARCHITECTURE.md`, `CI-CD.md`)
2. Consultez les issues GitHub
3. Créez une issue ou une discussion

---

**Bienvenue dans Waypoint Pilot!** 🎉

Bonne chance avec le développement!

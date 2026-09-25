# Documentation Technique - Waypoint Pilot

## 📋 Table des matières

1. [Architecture](#architecture)
2. [Structure des fichiers](#structure-des-fichiers)
3. [Conventions de code](#conventions-de-code)
4. [Composants](#composants)
5. [État et gestion des données](#état-et-gestion-des-données)
6. [Styles et tokens](#styles-et-tokens)
7. [Tests](#tests)
8. [Références](#références)

---

## Architecture

### Vue d'ensemble

Waypoint Pilot est une application React avec Vite qui démontre :
- ✅ Authentification mock en mémoire
- ✅ Réinitialisation de mot de passe (modal)
- ✅ Dashboard de bienvenue
- ✅ Tests unitaires complèts
- ✅ Qualité du code (ESLint, coverage 80%+)
- ✅ CI/CD automatisée (GitHub Actions)

### Flux d'authentification

```
App (gère state user)
├── !user → Login
│   ├── Formulaire de connexion
│   ├── Modal "Mot de passe oublié"
│   └── onLogin(email) → setUser({ email })
└── user → Dashboard
    ├── Affiche email
    └── onLogout() → setUser(null)
```

### Routage

**Pas de React Router** — Utilise un simple état booléen :
- `user === null` → Page Login
- `user !== null` → Page Dashboard

---

## Structure des fichiers

```
src/
├── App.jsx                      # Composant racine, gestion auth
├── main.jsx                     # Point d'entrée, initialisation React
├── pages/
│   ├── Login.jsx                # Page de connexion + modal
│   ├── Login.css                # Styles login (BEM)
│   ├── ForgotPassword.jsx       # Modal réinitialisation mot de passe
│   ├── Dashboard.jsx            # Page après connexion
│   ├── Dashboard.css            # Styles dashboard (BEM)
│   └── __tests__/
│       ├── Login.test.jsx       # Tests Login (9 tests)
│       └── ForgotPassword.test.jsx  # Tests ForgotPassword (16 tests)
└── styles/
    └── tokens.css               # Variables CSS globales
```

---

## Conventions de code

### React

#### Composants fonctionnels avec hooks

```jsx
/**
 * Brève description du composant
 * @component
 * @param {Object} props - Props du composant
 * @param {string} props.email - Email utilisateur
 * @returns {JSX.Element}
 */
function MyComponent({ email }) {
  const [state, setState] = useState(null)
  
  const handleClick = useCallback(() => {
    // ...
  }, [])
  
  return <div>{email}</div>
}
```

#### Nommage des fonctions

- **Handlers** : `handle*` (ex: `handleSubmit`, `handleOpenModal`)
- **Getters** : `get*` (ex: `getUserFirstName`)
- **Callbacks** : `*Callback` ou `on*` pour les props (ex: `onLogin`, `onClose`)

#### Optimisation des performances

- Utilisez **`useCallback`** pour les fonctions passées en props
- Memoïsez les variables complexes avec **`useMemo`** si nécessaire
- Divisez les gros composants en petits sous-composants

### CSS

#### Méthodologie BEM

```css
/* Bloc */
.login { }

/* Élément */
.login__form { }
.login__subtitle { }

/* Modificateur */
.login__form--error { }
.login__button--disabled { }
```

**Pas de** :
- Classes imbriquées arbitraires
- Styles inline
- IDs pour le styling

#### Variables CSS

```css
/* Bonne pratique */
color: var(--text-muted);
background: var(--accent);

/* Mauvaise pratique */
color: #5b5f57;
background: #3f6d53;
```

### Commentaires

#### JSDoc pour les composants et fonctions

```jsx
/**
 * Valide et envoie le formulaire
 * Simule un appel API avec délai
 * 
 * @param {Event} event - Événement du formulaire
 * @throws {Error} Si email invalide
 */
const handleSubmit = useCallback((event) => {
  // ...
}, [])
```

#### Commentaires de section

```jsx
// État du formulaire de connexion
const [email, setEmail] = useState('')

// Modal "Mot de passe oublié"
const [showForgotModal, setShowForgotModal] = useState(false)
```

---

## Composants

### App

> **Fichier** : `src/App.jsx`

**Responsabilités** :
- Gère l'état d'authentification
- Contrôle le routage entre Login et Dashboard
- Passe les callbacks aux pages

**Props** : Aucune

**État** :
- `user` : null (pas connecté) ou `{ email: string }` (connecté)

**Optimisation** :
- Les callbacks `handleLogin` et `handleLogout` sont memoïsés avec `useCallback`

---

### Login

> **Fichier** : `src/pages/Login.jsx`

**Responsabilités** :
- Affiche le formulaire de connexion
- Gère la modal "Mot de passe oublié"
- Valide email et mot de passe

**Props** :
- `onLogin(email)` — Callback appelée après connexion réussie

**État** :
- `email`, `password` — Champs du formulaire login
- `error` — Message d'erreur de validation
- `isSubmitting` — Flag de soumission en cours
- `showForgotModal` — Visibilité du modal
- `forgotEmail` — Email du formulaire mot de passe oublié

**Optimisation** :
- `handleSubmit` et modal handlers memoïsés
- Inputs désactivés pendant soumission

---

### ForgotPassword

> **Fichier** : `src/pages/ForgotPassword.jsx`

**Responsabilités** :
- Affiche le modal de réinitialisation
- Valide l'email
- Affiche message de succès
- Auto-fermeture après 2 secondes

**Props** :
- `show` — Visibilité du modal
- `email` — Valeur email (état parent)
- `setEmail` — Setter email
- `onSubmit(email)` — Callback après soumission
- `onClose()` — Callback pour fermer

**État** :
- `isSubmitting` — Soumission en cours
- `isSuccess` — Message de succès affiché
- `error` — Erreur de validation

**Effets** :
- Réinitialise l'état à la fermeture
- Auto-fermeture 2 secondes après succès
- Gère la touche Escape

**Optimisation** :
- Handlers memoïsés
- Only renders if `show === true`

---

### Dashboard

> **Fichier** : `src/pages/Dashboard.jsx`

**Responsabilités** :
- Affiche bienvenue utilisateur
- Affiche statistiques et projets récents
- Bouton de déconnexion

**Props** :
- `user` — `{ email: string }`
- `onLogout()` — Callback déconnexion

**Composants enfants** :
- `StatCard` — Affiche une statistique
- `ProjectItem` — Affiche un projet

**Optimisation** :
- Données (stats, projects) stockées en constantes globales
- Extraction en sous-composants pour clarté

---

## État et gestion des données

### Principes

1. **État local** — Chaque composant gère son propre état (forms, visibilité modal, loading)
2. **État lift** — L'authentification est au niveau de `App`
3. **Pas de store global** — Trop simple pour Redux/Context
4. **Pas d'API réelle** — Les appels sont simulés avec `setTimeout`

### Flow d'état Login

```
Login (parent)
├── state: email, password, error, isSubmitting
├── state: showForgotModal, forgotEmail
└── handlers: handleSubmit, handleOpenForgotModal, handleCloseForgotModal
    └── ForgotPassword (enfant)
        ├── props: show, email, setEmail, onSubmit, onClose
        ├── state: isSubmitting, isSuccess, error
        └── effects: Escape key, auto-close timer
```

### Exemple : Validations

```jsx
// Login.jsx - Email et mot de passe requis
if (!email || !password) {
  setError('Renseignez votre email et votre mot de passe.')
  return
}

// ForgotPassword.jsx - Email requis
if (!email) {
  setError('Veuillez entrer votre adresse email.')
  return
}
```

---

## Styles et tokens

### Tokens CSS

```css
/* Couleurs */
--ink: #14171f           /* Noir principal */
--paper: #f2f3ef         /* Gris clair (bg) */
--paper-raised: #ffffff  /* Blanc (panels) */
--accent: #3f6d53        /* Vert (actions) */
--error: #a5352a         /* Rouge (erreurs) */
--border: #d7d9d3        /* Bordures */
--text-muted: #5b5f57    /* Texte secondaire */

/* Typographie */
--font-display: 'Fraunces', serif        /* Titres */
--font-ui: 'Inter', -apple-system, ...   /* Texte */
```

### Fichiers CSS

| Fichier | Responsabilité |
|---------|-----------------|
| `src/styles/tokens.css` | Variables CSS globales, reset |
| `src/pages/Login.css` | Styles Login + ForgotPassword modal |
| `src/pages/Dashboard.css` | Styles Dashboard |

### Mobile-first responsive

```css
/* Par défaut : layout desktop */
.login {
  grid-template-columns: 1fr 1.1fr;
}

/* Mobile : breakpoint 720px */
@media (max-width: 720px) {
  .login {
    grid-template-columns: 1fr;
  }
}
```

---

## Tests

### Stack

- **Runner** : Vitest
- **Library** : React Testing Library
- **User events** : @testing-library/user-event
- **Mocking** : vi.fn()

### Stratégie de test

#### 1. Tests unitaires des composants

```jsx
it('affiche une erreur si les champs sont vides', async () => {
  const user = userEvent.setup()
  render(<Login onLogin={vi.fn()} />)
  
  await user.click(screen.getByRole('button', { name: /se connecter/i }))
  
  expect(screen.getByRole('alert')).toHaveTextContent(/renseignez/i)
})
```

#### 2. Tests de boutons et interactions

```jsx
it('bouton "Se connecter" est présent et fonctionnel', async () => {
  const user = userEvent.setup()
  const onLogin = vi.fn()
  render(<Login onLogin={onLogin} />)
  
  const button = screen.getByRole('button', { name: /se connecter/i })
  expect(button).toBeInTheDocument()
  expect(button).not.toBeDisabled()
  
  // Simuler l'action
  await user.click(button)
  
  // Vérifier le résultat
  await waitFor(() => expect(onLogin).toHaveBeenCalled())
})
```

#### 3. Tests d'accessibilité

```jsx
// Tous les formulaires ont role="alert" pour les erreurs
// Labels associés aux inputs via htmlFor
// Boutons avec aria-label
// Dialogs avec role="dialog" et aria-label
```

### Coverage

**Cible** : 80% sur tous les fichiers (lignes, branches, fonctions)

```bash
npm run test:coverage
```

### Exécution des tests

```bash
# Watch mode (développement)
npm test

# Run once (CI)
npm run test:ci

# Avec couverture
npm run test:coverage
```

---

## Références

### Documentation React

- [React Hooks](https://react.dev/reference/react)
- [useCallback](https://react.dev/reference/react/useCallback)
- [useState](https://react.dev/reference/react/useState)
- [useEffect](https://react.dev/reference/react/useEffect)

### Documentation Vite

- [Vite Documentation](https://vitejs.dev)
- [Vite + React](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

### Testing Library

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [User Event](https://testing-library.com/docs/user-event/intro)
- [Queries](https://testing-library.com/docs/queries/about)

### CSS et Design

- [BEM - Block Element Modifier](https://en.bem.info)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Responsive Web Design](https://web.dev/responsive-web-design-basics/)

### Standards français

- Couleurs Web (WCAG)
- Accessibilité (ARIA)
- Sécurité (OWASP)

---

## Prochaines étapes (TODO)

- [ ] Intégrer une vraie API au place de mocks
- [ ] Ajouter TypeScript
- [ ] Implémenter un state management (Context API ou Redux)
- [ ] Ajouter plus de pages (Profil, Paramètres)
- [ ] Implémenter un système de notifications (Toasts)
- [ ] Ajouter une couche d'authentification réelle (JWT, OAuth)
- [ ] Améliorer le design (dark mode, animations)
- [ ] Déployer en production (Vercel, Netlify)

---

**Dernière mise à jour** : 25 septembre 2026  
**Auteur** : Équipe Waypoint  
**Version** : 0.1.0

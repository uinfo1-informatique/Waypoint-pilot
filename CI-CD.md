# CI/CD - Tests et Non-Régression

Ce document décrit la pipeline CI/CD pour le projet Waypoint Pilot.

## 🔄 Pipeline CI/CD

### Configuration

La pipeline est définie dans `.github/workflows/ci.yml` et s'exécute automatiquement sur :
- Tout `push` sur les branches `main` et `develop`
- Toute `pull_request` vers `main` et `develop`

### Étapes de la pipeline

1. **Checkout du code** — Récupère le dernier commit
2. **Setup Node.js** — Installe la version spécifiée de Node.js (18.x et 20.x testées)
3. **Installer dépendances** — `npm ci` pour une installation reproductible
4. **Lint** — Vérifie la qualité du code avec ESLint (continue-on-error)
5. **Tests unitaires** — Exécute tous les tests avec Vitest en mode non-interactif
6. **Build production** — Compile le projet avec Vite
7. **Coverage** — Génère les rapports de couverture de code

## 🧪 Tests

### Structure des tests

```
src/pages/__tests__/
├── Login.test.jsx          # Tests du composant Login
├── ForgotPassword.test.jsx # Tests du composant ForgotPassword
```

### Types de tests couverts

#### **Tests Login** (9 tests)
- Validation des champs vides
- Authentification valide
- État du modal par défaut
- Ouverture du modal "Mot de passe oublié?"
- **Tests des boutons** :
  - Bouton "Se connecter" présent et fonctionnel
  - État désactivé lors de la soumission
  - Changement du texte du bouton (Connexion…)
- **Tests des champs** :
  - Acceptation des données email et mot de passe
  - Effacement des messages d'erreur

#### **Tests ForgotPassword** (16 tests)
- Rendu conditionnel (modal caché si `show=false`)
- Rendu du modal (si `show=true`)
- Acceptation de l'email
- Validation de l'email vide
- Soumission avec succès (400ms delay simulé)
- Auto-fermeture après 2s
- **Tests des boutons** :
  - Bouton "Fermer" (×) présent et fonctionnel
  - Bouton "Envoyer les instructions" présent et fonctionnel
  - Désactivation lors de la soumission
  - Change le texte (Envoi…)
- **Tests d'interaction** :
  - Fermeture via bouton close
  - Fermeture via touche Escape
  - Fermeture via clic sur le backdrop
- **Tests des champs** :
  - Désactivation de l'email lors de la soumission
  - Effacement des messages d'erreur

### Exécuter les tests localement

```bash
# Mode watch (développement)
npm test

# Mode non-interactif (CI)
npm test -- --run

# Avec couverture de code
npm test -- --run --coverage

# Test spécifique
npm test -- Login.test.jsx
```

## 📊 Couverture de code

### Cibles de couverture

- **Lignes** : 80%
- **Fonctions** : 80%
- **Branches** : 80%
- **Déclarations** : 80%

### Générer un rapport de couverture

```bash
npm test -- --run --coverage
```

Le rapport HTML sera généré dans `coverage/index.html`.

## 🔍 Tous les boutons testés

### Boutons Login

| Bouton | Tests | État |
|--------|-------|------|
| Se connecter | Présence, fonctionnalité, désactivation, texte | ✅ |
| Mot de passe oublié? | Présence, fonctionnalité, ouverture modal | ✅ |

### Boutons ForgotPassword

| Bouton | Tests | État |
|--------|-------|------|
| Fermer (×) | Présence, fonctionnalité, fermeture | ✅ |
| Envoyer les instructions | Présence, fonctionnalité, désactivation, texte | ✅ |

### Interactions

| Action | Tests | État |
|--------|-------|------|
| Escape key | Ferme le modal | ✅ |
| Clic backdrop | Ferme le modal | ✅ |
| Auto-fermeture | 2s après succès | ✅ |

## 🚀 Déploiement

Les tests doivent tous passer avant un merge vers `main`.

### Vérifications avant commit

```bash
npm run lint      # Vérifier la qualité du code
npm test -- --run # Lancer les tests
npm run build     # Vérifier que la build fonctionne
```

## 📝 Notes

- Les tests utilisent **Vitest + React Testing Library**
- Les requêtes utilisateur utilisent **@testing-library/user-event**
- Les délais asynchrones utilisent **waitFor**
- Les mocks sont faits avec **vi.fn()**

## 🐛 Dépannage

### Les tests échouent localement mais passent sur GitHub

Assurez-vous que vous utilisez Node.js 18 ou 20 :
```bash
node --version
npm ci
npm test -- --run
```

### Couverture insuffisante

Ajoutez des tests pour les nouvelles fonctionnalités. Vérifiez le rapport :
```bash
npm test -- --run --coverage
open coverage/index.html  # Mac/Linux
start coverage/index.html # Windows
```

### Lint errors

```bash
npm run lint -- --fix
```

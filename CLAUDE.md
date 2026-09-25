# Waypoint (pilote)

Application de démonstration utilisée pour tester la mise en place de Claude Code
(revue de code automatique, tests, déploiement) avant de généraliser à nos vrais projets.

## Architecture

- Front-end React (Vite), sans backend réel pour l'instant.
- `src/App.jsx` bascule entre `pages/Login.jsx` et `pages/Dashboard.jsx` selon l'état
  d'authentification (mock en mémoire, pas d'appel API réel).
- Styles en CSS simple par page, tokens de design centralisés dans `src/styles/tokens.css`.

## Commandes courantes

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm test` — tests unitaires (Vitest + Testing Library)
- `npm run lint` — lint ESLint

## Standards de code

- Composants fonctionnels avec hooks, pas de classes.
- Un fichier CSS par page/composant, pas de styles inline sauf cas ponctuel.
- Les libellés, messages d'erreur et textes d'interface sont en français.
- Toute nouvelle page ou tout nouveau comportement doit avoir au moins un test associé.

## Contexte pour les revues de code

Ce repo sert de bac à sable pour valider le pipeline Claude Code. N'hésite pas à
proposer des refactors et à signaler les manques (gestion d'erreurs, accessibilité,
tests manquants) lors des revues de pull request.

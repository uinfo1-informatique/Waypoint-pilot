import { useCallback } from 'react'
import './Dashboard.css'

/**
 * Données de statistiques - Bienvenue utilisateur
 * @const {Array<{label: string, value: number}>}
 */
const STATS_DATA = [
  { label: 'Projets actifs', value: 6 },
  { label: 'Tâches en retard', value: 2 },
  { label: 'Livraisons cette semaine', value: 4 },
]

/**
 * Données des projets récents
 * @const {Array<{name: string, status: string, updated: string}>}
 */
const PROJECTS_DATA = [
  { name: 'Migration API paiements', status: 'En cours', updated: 'il y a 2 h' },
  { name: 'Refonte onboarding', status: 'En revue', updated: 'il y a 5 h' },
  { name: 'Audit sécurité Q3', status: 'Planifié', updated: 'hier' },
]

/**
 * Composant StatCard - Affiche une carte de statistique
 * @component
 * @param {Object} props
 * @param {number} props.value - Valeur à afficher
 * @param {string} props.label - Label de la statistique
 * @returns {JSX.Element}
 */
function StatCard({ value, label }) {
  return (
    <div className="dashboard__stat">
      <span className="dashboard__stat-value">{value}</span>
      <span className="dashboard__stat-label">{label}</span>
    </div>
  )
}

/**
 * Composant ProjectItem - Affiche une ligne de projet
 * @component
 * @param {Object} props
 * @param {string} props.name - Nom du projet
 * @param {string} props.status - État du projet
 * @param {string} props.updated - Dernière mise à jour
 * @returns {JSX.Element}
 */
function ProjectItem({ name, status, updated }) {
  return (
    <li>
      <span className="dashboard__project-name">{name}</span>
      <span className="dashboard__project-status">{status}</span>
      <span className="dashboard__project-updated">{updated}</span>
    </li>
  )
}

/**
 * Page de tableau de bord
 * Affiche:
 * - Email et bouton de déconnexion
 * - Message de bienvenue personnalisé
 * - Statistiques clés
 * - Liste des projets récents
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.user - Objet utilisateur (contient email)
 * @param {string} props.user.email - Email de l'utilisateur conecté
 * @param {Function} props.onLogout - Callback pour la déconnexion
 * @returns {JSX.Element}
 */
export default function Dashboard({ user, onLogout }) {
  /**
   * Extrait le nom de l'utilisateur de son email
   * @returns {string} Première partie de l'email avant le @
   */
  const getUserFirstName = useCallback(() => {
    if (!user?.email) return 'Utilisateur'
    // Récupère la partie avant le @ et formate (ex: "ada@waypoint.io" → "Ada")
    const name = user.email.split('@')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  }, [user?.email])

  return (
    <div className="dashboard">
      {/* En-tête avec navigation */}
      <header className="dashboard__nav">
        <span className="dashboard__mark">Waypoint</span>
        <div className="dashboard__account">
          <span>{user.email}</span>
          <button onClick={onLogout}>Se déconnecter</button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="dashboard__main">
        <h1>Bonjour 👋</h1>
        <p className="dashboard__subtitle">Voici où en sont vos projets aujourd'hui.</p>

        {/* Section Statistiques */}
        <section className="dashboard__stats">
          {STATS_DATA.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </section>

        {/* Section Projets récents */}
        <section className="dashboard__projects">
          <h2>Projets récents</h2>
          <ul>
            {PROJECTS_DATA.map((project) => (
              <ProjectItem
                key={project.name}
                name={project.name}
                status={project.status}
                updated={project.updated}
              />
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

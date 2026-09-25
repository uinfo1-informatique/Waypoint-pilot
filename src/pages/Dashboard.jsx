import './Dashboard.css'

const stats = [
  { label: 'Projets actifs', value: 6 },
  { label: 'Tâches en retard', value: 2 },
  { label: 'Livraisons cette semaine', value: 4 },
]

const projects = [
  { name: 'Migration API paiements', status: 'En cours', updated: 'il y a 2 h' },
  { name: 'Refonte onboarding', status: 'En revue', updated: 'il y a 5 h' },
  { name: 'Audit sécurité Q3', status: 'Planifié', updated: 'hier' },
]

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="dashboard">
      <header className="dashboard__nav">
        <span className="dashboard__mark">Waypoint</span>
        <div className="dashboard__account">
          <span>{user.email}</span>
          <button onClick={onLogout}>Se déconnecter</button>
        </div>
      </header>

      <main className="dashboard__main">
        <h1>Bonjour 👋</h1>
        <p className="dashboard__subtitle">Voici où en sont vos projets aujourd'hui.</p>

        <section className="dashboard__stats">
          {stats.map((stat) => (
            <div className="dashboard__stat" key={stat.label}>
              <span className="dashboard__stat-value">{stat.value}</span>
              <span className="dashboard__stat-label">{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="dashboard__projects">
          <h2>Projets récents</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.name}>
                <span className="dashboard__project-name">{project.name}</span>
                <span className="dashboard__project-status">{project.status}</span>
                <span className="dashboard__project-updated">{project.updated}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

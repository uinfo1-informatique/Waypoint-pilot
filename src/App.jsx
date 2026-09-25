import { useState } from 'react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    return <Login onLogin={(email) => setUser({ email })} />
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />
}

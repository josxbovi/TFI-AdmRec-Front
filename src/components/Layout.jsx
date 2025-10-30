import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              <h2>📊 Sistema Gestión Clientes</h2>
            </Link>
          </div>
          
          {isAuthenticated ? (
            <ul className="nav-links">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/clientes">Clientes</Link>
              </li>
              <li>
                <Link to="/contratos">Contratos</Link>
              </li>
              <li>
                <Link to="/facturas">Facturas</Link>
              </li>
              <li>
                <Link to="/reportes">Reportes</Link>
              </li>
              <li className="user-menu">
                <span className="user-info">
                  👤 {user?.nombre || user?.username || 'Usuario'}
                </span>
                <button className="btn-logout" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          ) : (
            <ul className="nav-links">
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/about">Acerca de</Link>
              </li>
              <li>
                <Link to="/login" className="btn-login-link">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </header>
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; 2025 TFI - Administración de Recursos. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default Layout


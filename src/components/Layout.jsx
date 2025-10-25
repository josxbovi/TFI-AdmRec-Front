import { Link } from 'react-router-dom'
import './Layout.css'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <h2>TFI - AdmRec</h2>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/about">Acerca de</Link>
            </li>
          </ul>
        </nav>
      </header>
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; 2025 TFI - AdmRec. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default Layout


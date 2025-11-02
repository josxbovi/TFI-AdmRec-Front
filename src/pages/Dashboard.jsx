import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>¡Bienvenido, {user?.nombre || user?.username || 'Usuario'}!</h1>
        <p>Panel de control - Sistema de Gestión de Clientes</p>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Clientes</h3>
            <p className="stat-number">0</p>
            <small>Gestiona tus clientes</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>Proyectos Activos</h3>
            <p className="stat-number">0</p>
            <small>Proyectos en curso</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Contratos Vigentes</h3>
            <p className="stat-number">0</p>
            <small>Contratos activos</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">🧾</div>
          <div className="stat-content">
            <h3>Facturas Pendientes</h3>
            <p className="stat-number">0</p>
            <small>Por cobrar</small>
          </div>
        </Card>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <Card title="Actividad Reciente">
            <div className="empty-state">
              <p>📊 No hay actividad reciente</p>
              <small>Las acciones del sistema aparecerán aquí</small>
            </div>
          </Card>

          <Card title="Próximos Vencimientos">
            <div className="empty-state">
              <p>📅 No hay vencimientos próximos</p>
              <small>Los contratos próximos a vencer aparecerán aquí</small>
            </div>
          </Card>
        </div>

        <div className="dashboard-sidebar">
          <Card title="Accesos Rápidos">
            <div className="quick-actions">
              <button 
                className="quick-action-btn"
                onClick={() => navigate('/usuarios/nuevo')}
              >
                <span>👤</span>
                Nuevo Usuario
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => navigate('/proyectos/nuevo')}
              >
                <span>📁</span>
                Nuevo Proyecto
              </button>
              <button className="quick-action-btn">
                <span>➕</span>
                Nuevo Cliente
              </button>
              <button className="quick-action-btn">
                <span>📝</span>
                Nueva Factura
              </button>
              <button className="quick-action-btn">
                <span>📄</span>
                Nuevo Contrato
              </button>
              <button className="quick-action-btn">
                <span>📊</span>
                Ver Reportes
              </button>
            </div>
          </Card>

          <Card title="Notificaciones">
            <div className="notifications">
              <div className="empty-state">
                <p>🔔 No hay notificaciones</p>
                <small>Las alertas aparecerán aquí</small>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


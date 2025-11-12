import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import AlertCard from '../components/AlertCard'
import { getAllClientes, getAllProyectos, getAllContratos, getAllFacturas } from '../services/api'
import './Dashboard.css'

const Dashboard = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Estados para los contadores
  const [stats, setStats] = useState({
    totalClientes: 0,
    proyectosActivos: 0,
    contratosVigentes: 0,
    facturasPendientes: 0
  })
  const [loading, setLoading] = useState(true)

  // Cargar estadísticas del dashboard
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Hacer todas las llamadas en paralelo
        const [clientesRes, proyectosRes, contratosRes, facturasRes] = await Promise.all([
          getAllClientes(),
          getAllProyectos(),
          getAllContratos(),
          getAllFacturas()
        ])

        // Parsear clientes
        let clientes = []
        if (Array.isArray(clientesRes)) {
          clientes = clientesRes
        } else if (clientesRes?.records) {
          clientes = clientesRes.records
        } else if (clientesRes?.data?.records) {
          clientes = clientesRes.data.records
        } else if (clientesRes?.data) {
          clientes = clientesRes.data
        }

        // Parsear proyectos
        let proyectos = []
        if (Array.isArray(proyectosRes)) {
          proyectos = proyectosRes
        } else if (proyectosRes?.records) {
          proyectos = proyectosRes.records
        } else if (proyectosRes?.data?.records) {
          proyectos = proyectosRes.data.records
        } else if (proyectosRes?.data) {
          proyectos = proyectosRes.data
        }

        // Parsear contratos
        let contratos = []
        if (Array.isArray(contratosRes)) {
          contratos = contratosRes
        } else if (contratosRes?.records) {
          contratos = contratosRes.records
        } else if (contratosRes?.data?.records) {
          contratos = contratosRes.data.records
        } else if (contratosRes?.data) {
          contratos = contratosRes.data
        }

        // Parsear facturas
        let facturas = []
        if (Array.isArray(facturasRes)) {
          facturas = facturasRes
        } else if (facturasRes?.records) {
          facturas = facturasRes.records
        } else if (facturasRes?.data?.records) {
          facturas = facturasRes.data.records
        } else if (facturasRes?.data) {
          facturas = facturasRes.data
        }

        // Calcular estadísticas
        const totalClientes = clientes.length
        const proyectosActivos = proyectos.filter(p => p.estado?.toLowerCase() === 'activo').length
        const contratosVigentes = contratos.filter(c => c.estado?.toLowerCase() === 'activo').length
        const facturasPendientes = facturas.filter(f => 
          f.estado_pago?.toLowerCase() === 'pendiente' || 
          f.estado_pago?.toLowerCase() === 'vencida'
        ).length

        setStats({
          totalClientes,
          proyectosActivos,
          contratosVigentes,
          facturasPendientes
        })

        console.log('📊 Estadísticas del Dashboard:', {
          totalClientes,
          proyectosActivos,
          contratosVigentes,
          facturasPendientes
        })

      } catch (error) {
        console.error('❌ Error al cargar estadísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>¡Bienvenido, {user?.user_name || user?.nombre || "Usuario"}!</h1>
        <p>Panel de control - Sistema de Gestión de Clientes</p>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Clientes</h3>
            <p className="stat-number">
              {loading ? '...' : stats.totalClientes}
            </p>
            <small>Gestiona tus clientes</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>Proyectos Activos</h3>
            <p className="stat-number">
              {loading ? '...' : stats.proyectosActivos}
            </p>
            <small>Proyectos en curso</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Contratos Vigentes</h3>
            <p className="stat-number">
              {loading ? '...' : stats.contratosVigentes}
            </p>
            <small>Contratos activos</small>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">🧾</div>
          <div className="stat-content">
            <h3>Facturas Pendientes</h3>
            <p className="stat-number">
              {loading ? '...' : stats.facturasPendientes}
            </p>
            <small>Por cobrar</small>
          </div>
        </Card>
      </div>

      <div className="dashboard-content">
        {/* Alertas activas - Sección destacada en la parte superior */}
        <div className="dashboard-alerts-section">
          <AlertCard />
        </div>

        <div className="dashboard-grid">
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
                {/* Solo administradores pueden crear usuarios */}
                {isAdmin() && (
                  <button
                    className="quick-action-btn"
                    onClick={() => navigate("/usuarios/nuevo")}
                  >
                    <span>👤</span>
                    Nuevo Usuario
                  </button>
                )}
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/proyectos/nuevo")}
                >
                  <span>📁</span>
                  Nuevo Proyecto
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/clientes/nuevo")}
                >
                  <span>➕</span>
                  Nuevo Cliente
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/contratos/nuevo")}
                >
                  <span>📋</span>
                  Nuevo Contrato
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/facturas/nuevo")}
                >
                  <span>📝</span>
                  Nueva Factura
                </button>
                {/* Solo administradores pueden ver reportes */}
                {isAdmin() && (
                  <button
                    className="quick-action-btn"
                    onClick={() => navigate("/reportes")}
                  >
                    <span>📊</span>
                    Ver Reportes
                  </button>
                )}
              </div>
            </Card>

            <Card title="Estado del Sistema">
              <div className="system-status">
                <div className="status-item">
                  <span className="status-icon">✅</span>
                  <span className="status-text">Sistema operativo</span>
                </div>
                <div className="status-item">
                  <span className="status-icon">🔒</span>
                  <span className="status-text">Seguridad activa</span>
                </div>
                <div className="status-item">
                  <span className="status-icon">💾</span>
                  <span className="status-text">Respaldo automático</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard


import { useState, useEffect } from 'react'
import { getAllAlertas, deleteAlerta } from '../services/api'
import Card from './Card'
import Button from './Button'
import Loading from './Loading'
import './AlertCard.css'

const AlertCard = () => {
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [resolvingId, setResolvingId] = useState(null)

  // Cargar alertas al montar el componente
  useEffect(() => {
    fetchAlertas()
  }, [])

  const fetchAlertas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getAllAlertas()
      console.log('✅ Alertas recibidas (raw):', response)
      console.log('✅ Tipo de respuesta:', typeof response)
      console.log('✅ Es array?:', Array.isArray(response))
      console.log('✅ Keys de respuesta:', response ? Object.keys(response) : 'null')
      
      // Manejar diferentes formatos de respuesta
      let alertasData = []
      if (Array.isArray(response)) {
        alertasData = response
        console.log('📦 Usando response directo (array)')
      } else if (response && Array.isArray(response.records)) {
        alertasData = response.records
        console.log('📦 Usando response.records')
      } else if (response && Array.isArray(response.data)) {
        alertasData = response.data
        console.log('📦 Usando response.data')
      } else if (response && response.data && Array.isArray(response.data.records)) {
        alertasData = response.data.records
        console.log('📦 Usando response.data.records')
      } else if (response && response.record) {
        // Si viene un solo registro
        alertasData = [response.record]
        console.log('📦 Usando response.record (singular)')
      } else {
        console.warn('⚠️ Formato de respuesta no reconocido:', response)
      }
      
      console.log('📋 Alertas parseadas:', alertasData)
      console.log('📊 Cantidad de alertas:', alertasData.length)
      
      // Ordenar por fecha (más recientes primero)
      alertasData.sort((a, b) => new Date(b.fecha_alerta) - new Date(a.fecha_alerta))
      
      setAlertas(alertasData)
    } catch (err) {
      console.error('❌ Error al cargar alertas:', err)
      setError('No se pudieron cargar las alertas')
    } finally {
      setLoading(false)
    }
  }

  const handleResolver = async (alertaId) => {
    try {
      setResolvingId(alertaId)
      setError(null)
      
      console.log('🔔 Marcando alerta como resuelta. ID:', alertaId)
      console.log('📋 Alertas antes de eliminar:', alertas)
      
      const response = await deleteAlerta(alertaId)
      console.log('✅ Respuesta del backend:', response)
      
      // Actualizar la lista de alertas eliminando la resuelta
      setAlertas(prev => {
        const nuevasAlertas = prev.filter(alerta => alerta.id !== alertaId)
        console.log('📋 Alertas después de eliminar:', nuevasAlertas)
        return nuevasAlertas
      })
      
      console.log('✅ Alerta resuelta exitosamente. ID eliminado:', alertaId)
    } catch (err) {
      console.error('❌ Error al resolver alerta:', err)
      console.error('❌ Detalles del error:', err.message, err.stack)
      setError(`No se pudo resolver la alerta: ${err.message}`)
      
      // Recargar alertas en caso de error
      setTimeout(() => {
        fetchAlertas()
      }, 1500)
    } finally {
      setResolvingId(null)
    }
  }

  // Determinar prioridad y color según tipo de alerta
  const getPrioridad = (tipoAlerta) => {
    const tipo = tipoAlerta?.toLowerCase() || ''
    if (tipo.includes('urgente') || tipo.includes('vencido')) {
      return { clase: 'urgente', emoji: '🚨', label: 'URGENTE' }
    }
    if (tipo.includes('pendiente') || tipo.includes('proximo')) {
      return { clase: 'advertencia', emoji: '⚠️', label: 'ATENCIÓN' }
    }
    return { clase: 'info', emoji: 'ℹ️', label: 'INFO' }
  }

  if (loading) {
    return (
      <Card title="🔔 Alertas Activas">
        <Loading message="Cargando alertas..." />
      </Card>
    )
  }

  return (
    <Card title={`🔔 Alertas Activas (${alertas.length})`}>
      {error && (
        <div className="alert-error-message">
          {error}
        </div>
      )}
      
      {alertas.length === 0 ? (
        <div className="alert-empty-state">
          <p>✅ No hay alertas pendientes</p>
          <span className="alert-empty-subtitle">Todo está en orden</span>
        </div>
      ) : (
        <div className="alert-list">
          {alertas.map((alerta) => {
            const prioridad = getPrioridad(alerta.tipo_alerta)
            
            return (
              <div 
                key={alerta.id} 
                className={`alert-item ${prioridad.clase}`}
              >
                <div className="alert-header">
                  <div className="alert-priority">
                    <span className="priority-emoji">{prioridad.emoji}</span>
                    <span className="priority-label">{prioridad.label}</span>
                  </div>
                  <span className="alert-date">
                    {new Date(alerta.fecha_alerta).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="alert-body">
                  <h4 className="alert-mensaje">{alerta.mensaje}</h4>
                  <p className="alert-descripcion">{alerta.descripcion}</p>
                </div>
                
                <div className="alert-footer">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleResolver(alerta.id)}
                    disabled={resolvingId === alerta.id}
                  >
                    {resolvingId === alerta.id ? 'Resolviendo...' : '✓ Marcar como resuelta'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default AlertCard


import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getContratoById, updateContrato, deleteContrato, createAlerta } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import './ContratoDetalle.css'

const ContratoDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    monto: '',
    estado: ''
  })
  const [clienteInfo, setClienteInfo] = useState(null)
  
  // Estados de UI
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Cargar datos del contrato al montar
  useEffect(() => {
    const fetchContrato = async () => {
      try {
        setLoading(true)
        setError('')
        
        const data = await getContratoById(id)
        console.log('✅ Contrato cargado:', data)
        
        // Formatear fechas para input type="date" (YYYY-MM-DD)
        const fechaInicio = data.fechaInicio ? data.fechaInicio.split('T')[0] : ''
        const fechaFin = data.fechaFin ? data.fechaFin.split('T')[0] : ''
        
        setFormData({
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          monto: data.monto || '',
          estado: data.estado || ''
        })
        
        // Guardar info del cliente si viene en la respuesta
        if (data.cliente) {
          setClienteInfo(data.cliente)
        }
        
      } catch (err) {
        console.error('❌ Error al cargar contrato:', err)
        setError(err.message || 'Error al cargar el contrato')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchContrato()
    }
  }, [id])

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  // Validar formulario
  const validateForm = () => {
    if (!formData.fechaInicio) {
      setError('La fecha de inicio es obligatoria')
      return false
    }
    
    if (!formData.fechaFin) {
      setError('La fecha de fin es obligatoria')
      return false
    }
    
    if (new Date(formData.fechaInicio) > new Date(formData.fechaFin)) {
      setError('La fecha de inicio no puede ser posterior a la fecha de fin')
      return false
    }
    
    if (!formData.monto || formData.monto <= 0) {
      setError('El monto debe ser mayor a 0')
      return false
    }
    
    if (!formData.estado) {
      setError('Debes seleccionar un estado')
      return false
    }
    
    return true
  }

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      // Formatear fechas a ISO
      const formatearFecha = (fecha) => {
        if (!fecha) return null
        if (fecha.includes('T')) return fecha
        return `${fecha}T00:00:00.000Z`
      }

      // IMPORTANTE: No enviamos clienteId porque el backend no permite cambiarlo
      const contratoData = {
        fechaInicio: formatearFecha(formData.fechaInicio),
        fechaFin: formatearFecha(formData.fechaFin),
        monto: Number(formData.monto),
        estado: formData.estado
      }

      console.log('📤 Actualizando contrato:', contratoData)

      await updateContrato(id, contratoData)
      
      // Generar o actualizar alerta si el contrato vence en menos de 30 días
      try {
        // Normalizar fechas: solo usar fecha sin hora para cálculo preciso
        const fechaFin = new Date(formData.fechaFin)
        fechaFin.setHours(0, 0, 0, 0) // Resetear a medianoche local
        
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0) // Resetear a medianoche local
        
        const diferenciaDias = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24))
        
        console.log('📅 Cálculo de vencimiento (actualización):', {
          fechaFin: fechaFin.toLocaleDateString('es-AR'),
          hoy: hoy.toLocaleDateString('es-AR'),
          diferenciaDias
        })

        if (diferenciaDias <= 30 && diferenciaDias > 0) {
          const tipoAlerta = diferenciaDias <= 7 ? 'urgente' : 'proximo_vencimiento'
          const mensajeAlerta = diferenciaDias <= 7 
            ? `⚠️ Contrato de ${clienteInfo?.nombre || 'cliente'} vence en ${diferenciaDias} día${diferenciaDias !== 1 ? 's' : ''} (URGENTE)`
            : `📅 Contrato de ${clienteInfo?.nombre || 'cliente'} vence en ${diferenciaDias} días`

          const alertaData = {
            mensaje: mensajeAlerta,
            tipo_alerta: tipoAlerta,
            fecha_alerta: new Date().toISOString(),
            descripcion: `Contrato #${id} - Cliente: ${clienteInfo?.nombre || 'N/A'} - Vencimiento: ${new Date(fechaFin).toLocaleDateString('es-AR')} - Monto: $${Number(formData.monto).toLocaleString('es-AR')}`,
            clienteId: clienteInfo?.id
          }

          console.log('🔔 Generando alerta automática (actualización):', alertaData)
          await createAlerta(alertaData)
          console.log('✅ Alerta creada/actualizada exitosamente')
        } else if (diferenciaDias <= 0) {
          // El contrato está vencido
          const alertaData = {
            mensaje: `🚨 Contrato de ${clienteInfo?.nombre || 'cliente'} YA ESTÁ VENCIDO`,
            tipo_alerta: 'vencido',
            fecha_alerta: new Date().toISOString(),
            descripcion: `Contrato #${id} - Cliente: ${clienteInfo?.nombre || 'N/A'} - Venció el: ${new Date(fechaFin).toLocaleDateString('es-AR')} - Monto: $${Number(formData.monto).toLocaleString('es-AR')}`,
            clienteId: clienteInfo?.id
          }

          console.log('🔔 Generando alerta de contrato vencido:', alertaData)
          await createAlerta(alertaData)
          console.log('✅ Alerta creada exitosamente')
        }
      } catch (alertaError) {
        console.warn('⚠️ No se pudo crear/actualizar la alerta automática:', alertaError)
        // No bloqueamos el proceso si falla la creación de la alerta
      }
      
      setSuccess(true)
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/contratos')
      }, 2000)
      
    } catch (err) {
      console.error('Error al actualizar contrato:', err)
      setError(err.message || 'Error al actualizar el contrato. Por favor, intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  // Eliminar contrato (baja lógica)
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar este contrato? Esta acción no se puede deshacer.'
    )
    
    if (!confirmDelete) return

    setDeleting(true)
    setError('')

    try {
      await deleteContrato(id)
      
      // Redirigir después de eliminar
      setTimeout(() => {
        navigate('/contratos')
      }, 1000)
      
    } catch (err) {
      console.error('Error al eliminar contrato:', err)
      setError(err.message || 'Error al eliminar el contrato')
    } finally {
      setDeleting(false)
    }
  }

  // Cancelar y volver
  const handleCancel = () => {
    navigate('/contratos')
  }

  if (loading) {
    return (
      <div className="contrato-detalle">
        <Loading message="Cargando contrato..." />
      </div>
    )
  }

  if (error && !formData.monto) {
    return (
      <div className="contrato-detalle">
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    )
  }

  return (
    <div className="contrato-detalle">
      <div className="contrato-detalle-header">
        <h1>Detalle del Contrato</h1>
      </div>

      <div className="contrato-detalle-content">
        <Card>
          {success && (
            <div className="alert alert-success">
              <span>✅</span>
              <p>Contrato actualizado exitosamente. Redirigiendo...</p>
            </div>
          )}

          {error && (
            <ErrorMessage message={error} />
          )}

          {/* Información del cliente (si está disponible) */}
          {clienteInfo && (
            <div className="cliente-info-banner">
              <strong>Cliente:</strong> {clienteInfo.nombre}
              {clienteInfo.cuit && <span> (CUIT: {clienteInfo.cuit})</span>}
              {clienteInfo.email && <span> - {clienteInfo.email}</span>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contrato-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaInicio">
                  Fecha de Inicio <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  disabled={saving || deleting}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaFin">
                  Fecha de Fin <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  disabled={saving || deleting}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="monto">
                Monto <span className="required">*</span>
              </label>
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                disabled={saving || deleting}
                className="form-input"
                placeholder="Ej: 150000.00"
                step="0.01"
                min="0"
              />
              <small className="form-hint">Ingresa el monto en pesos argentinos</small>
            </div>

            <div className="form-group">
              <label htmlFor="estado">
                Estado <span className="required">*</span>
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                disabled={saving || deleting}
                className="form-input"
              >
                <option value="">Seleccione un estado</option>
                <option value="activo">Activo</option>
                <option value="pendiente">Pendiente</option>
                <option value="vencido">Vencido</option>
              </select>
              <small className="form-hint">Pendiente: contrato guardado pero no aceptado aún</small>
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                disabled={saving || deleting}
              >
                {deleting ? 'Eliminando...' : '🗑️ Borrar'}
              </Button>
              
              <div className="right-buttons">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={saving || deleting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving || deleting}
                >
                  {saving ? 'Guardando...' : '💾 Guardar'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default ContratoDetalle


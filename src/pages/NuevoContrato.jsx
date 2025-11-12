import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClienteByCuit, createContrato, createAlerta } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import './NuevoContrato.css'

const NuevoContrato = () => {
  const navigate = useNavigate()
  
  // Estados para búsqueda de cliente
  const [clienteCuit, setClienteCuit] = useState('')
  const [cliente, setCliente] = useState(null)
  const [loadingCliente, setLoadingCliente] = useState(false)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    monto: '',
    estado: ''
  })
  
  // Estados para descuento
  const [montoOriginal, setMontoOriginal] = useState(0)
  const [descuentoAplicado, setDescuentoAplicado] = useState(0)
  const [montoFinal, setMontoFinal] = useState(0)
  
  // Estados de UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Buscar cliente por CUIT
  const handleBuscarCliente = async () => {
    if (!clienteCuit.trim()) {
      setError('Ingresa el CUIT del cliente')
      return
    }

    setLoadingCliente(true)
    setError('')
    setCliente(null)

    try {
      const clienteData = await getClienteByCuit(clienteCuit)
      console.log('✅ Cliente encontrado:', clienteData)
      
      // Verificar que el cliente esté activo
      if (clienteData.estado?.toLowerCase() !== 'activo') {
        setError('⚠️ Este cliente está INACTIVO. No se pueden crear contratos para clientes dados de baja.')
        setCliente(null)
        return
      }
      
      setCliente(clienteData)
    } catch (err) {
      console.error('❌ Error al buscar cliente:', err)
      setError('Cliente no encontrado. Verifica el CUIT.')
    } finally {
      setLoadingCliente(false)
    }
  }

  // Calcular monto con descuento
  const calcularMontoConDescuento = (monto) => {
    if (!cliente || !monto || parseFloat(monto) <= 0) {
      setMontoOriginal(0)
      setDescuentoAplicado(0)
      setMontoFinal(0)
      return
    }

    const montoNum = parseFloat(monto)
    const descuentoPorcentaje = parseFloat(cliente.descuento || 0)
    const descuentoMonto = (montoNum * descuentoPorcentaje) / 100
    const montoConDescuento = montoNum - descuentoMonto

    setMontoOriginal(montoNum)
    setDescuentoAplicado(descuentoMonto)
    setMontoFinal(montoConDescuento)
  }

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Si cambió el monto, recalcular descuento
    if (name === 'monto') {
      calcularMontoConDescuento(value)
    }
    
    if (error) setError('')
  }

  // Validar formulario
  const validateForm = () => {
    if (!cliente) {
      setError('Debes buscar y seleccionar un cliente primero')
      return false
    }

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

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Formatear fechas a ISO
      const formatearFecha = (fecha) => {
        if (!fecha) return null
        if (fecha.includes('T')) return fecha
        return `${fecha}T00:00:00.000Z`
      }

      const contratoData = {
        fechaInicio: formatearFecha(formData.fechaInicio),
        fechaFin: formatearFecha(formData.fechaFin),
        monto: montoFinal > 0 ? montoFinal : Number(formData.monto), // Enviar monto con descuento
        estado: formData.estado,
        clienteId: cliente.id
      }

      console.log('📤 Creando contrato:', contratoData)
      console.log('💰 Descuento aplicado:', {
        montoOriginal,
        descuentoPorcentaje: cliente?.descuento || 0,
        descuentoAplicado,
        montoFinal
      })

      const contratoCreado = await createContrato(contratoData)
      console.log('✅ Contrato creado:', contratoCreado)

      // Generar alerta automática si el contrato vence en menos de 30 días
      try {
        // Normalizar fechas: solo usar fecha sin hora para cálculo preciso
        const fechaFin = new Date(formData.fechaFin)
        fechaFin.setHours(0, 0, 0, 0) // Resetear a medianoche local
        
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0) // Resetear a medianoche local
        
        const diferenciaDias = Math.ceil((fechaFin - hoy) / (1000 * 60 * 60 * 24))
        
        console.log('📅 Cálculo de vencimiento:', {
          fechaFin: fechaFin.toLocaleDateString('es-AR'),
          hoy: hoy.toLocaleDateString('es-AR'),
          diferenciaDias
        })

        if (diferenciaDias <= 30 && diferenciaDias > 0) {
          const tipoAlerta = diferenciaDias <= 7 ? 'urgente' : 'proximo_vencimiento'
          const mensajeAlerta = diferenciaDias <= 7 
            ? `⚠️ Contrato de ${cliente.nombre} vence en ${diferenciaDias} día${diferenciaDias !== 1 ? 's' : ''} (URGENTE)`
            : `📅 Contrato de ${cliente.nombre} vence en ${diferenciaDias} días`

          const alertaData = {
            mensaje: mensajeAlerta,
            tipo_alerta: tipoAlerta,
            fecha_alerta: new Date().toISOString(),
            descripcion: `Contrato #${contratoCreado.id || ''} - Cliente: ${cliente.nombre} (CUIT: ${cliente.cuit}) - Vencimiento: ${new Date(fechaFin).toLocaleDateString('es-AR')}`,
            clienteId: cliente.id
          }

          console.log('🔔 Generando alerta automática:', alertaData)
          await createAlerta(alertaData)
          console.log('✅ Alerta creada exitosamente')
        } else if (diferenciaDias <= 0) {
          // El contrato ya está vencido
          const alertaData = {
            mensaje: `🚨 Contrato de ${cliente.nombre} YA ESTÁ VENCIDO`,
            tipo_alerta: 'vencido',
            fecha_alerta: new Date().toISOString(),
            descripcion: `Contrato #${contratoCreado.id || ''} - Cliente: ${cliente.nombre} (CUIT: ${cliente.cuit}) - Venció el: ${new Date(fechaFin).toLocaleDateString('es-AR')}`,
            clienteId: cliente.id
          }

          console.log('🔔 Generando alerta de contrato vencido:', alertaData)
          await createAlerta(alertaData)
          console.log('✅ Alerta creada exitosamente')
        }
      } catch (alertaError) {
        console.warn('⚠️ No se pudo crear la alerta automática:', alertaError)
        // No bloqueamos el proceso si falla la creación de la alerta
      }

      setSuccess(true)

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/contratos')
      }, 2000)

    } catch (err) {
      console.error('Error al crear contrato:', err)
      setError(err.message || 'Error al crear el contrato. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Cancelar
  const handleCancel = () => {
    navigate('/contratos')
  }

  return (
    <div className="nuevo-contrato">
      <div className="nuevo-contrato-header">
        <h1>Nuevo Contrato</h1>
        <p>Registra un nuevo contrato para un cliente</p>
      </div>

      <div className="nuevo-contrato-content">
        <Card>
          {success && (
            <div className="alert alert-success">
              <span>✅</span>
              <p>Contrato creado exitosamente. Redirigiendo...</p>
            </div>
          )}

          {error && <ErrorMessage message={error} />}

          {/* Paso 1: Buscar Cliente */}
          {!cliente && (
            <div className="buscar-cliente-section">
              <h3>1. Buscar Cliente</h3>
              <p className="section-hint">Primero debes buscar el cliente por CUIT</p>
              
              <div className="buscar-cliente-form">
                <div className="form-group">
                  <label htmlFor="clienteCuit">CUIT del Cliente</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      id="clienteCuit"
                      value={clienteCuit}
                      onChange={(e) => setClienteCuit(e.target.value)}
                      placeholder="Ej: 20-12345678-9"
                      disabled={loadingCliente}
                      className="form-input"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleBuscarCliente()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleBuscarCliente}
                      disabled={loadingCliente}
                    >
                      {loadingCliente ? 'Buscando...' : '🔍 Buscar'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Información del cliente encontrado */}
          {cliente && (
            <div className="cliente-encontrado">
              <h3>Cliente Seleccionado</h3>
              <div className="cliente-info">
                <div className="info-row">
                  <strong>Nombre:</strong> {cliente.nombre}
                </div>
                <div className="info-row">
                  <strong>CUIT:</strong> {cliente.cuit}
                </div>
                <div className="info-row">
                  <strong>Email:</strong> {cliente.email}
                </div>
                {cliente.descuento > 0 && (
                  <div className="info-row descuento-info">
                    🎁 <strong>Descuento del cliente:</strong> {cliente.descuento}%
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setCliente(null)
                  setClienteCuit('')
                }}
              >
                Cambiar Cliente
              </Button>
            </div>
          )}

          {/* Paso 2: Formulario del Contrato */}
          {cliente && (
            <form onSubmit={handleSubmit} className="contrato-form">
              <h3>2. Datos del Contrato</h3>

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
                    disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                  className="form-input"
                >
                  <option value="">Seleccione un estado</option>
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="vencido">Vencido</option>
                </select>
                <small className="form-hint">Pendiente: contrato guardado pero no aceptado aún</small>
              </div>

              {/* Mostrar cálculo de descuento si hay descuento */}
              {cliente.descuento > 0 && montoOriginal > 0 && (
                <div className="descuento-calculo">
                  <h4>💰 Cálculo del Descuento</h4>
                  <div className="calculo-detalle">
                    <div className="calculo-row">
                      <span>Monto original:</span>
                      <span className="monto-original">
                        ${montoOriginal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="calculo-row descuento-row">
                      <span>Descuento ({cliente.descuento}%):</span>
                      <span className="monto-descuento">
                        -${descuentoAplicado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="calculo-separator"></div>
                    <div className="calculo-row total-row">
                      <span><strong>Monto final:</strong></span>
                      <span className="monto-final">
                        <strong>${montoFinal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </span>
                    </div>
                  </div>
                  <p className="descuento-nota">
                    ℹ️ El descuento se aplicará automáticamente al contrato
                  </p>
                </div>
              )}

              <div className="form-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : '💾 Crear Contrato'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

export default NuevoContrato


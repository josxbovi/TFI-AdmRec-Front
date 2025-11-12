import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClienteByCuit, createProyecto } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import './NuevoProyecto.css'

// Módulos disponibles para seleccionar
const MODULOS_DISPONIBLES = [
  { id: 'modulo-notas', nombre: 'Módulo de Notas' },
  { id: 'modulo-asistencias', nombre: 'Módulo de Asistencias' },
  { id: 'modulo-inscripcion', nombre: 'Módulo de Inscripción a Materias' },
  { id: 'modulo-alumnos', nombre: 'Módulo de Gestión de Alumnos' },
  { id: 'modulo-comunicacion', nombre: 'Módulo de Comunicación con Padres' },
  { id: 'modulo-portal', nombre: 'Módulo de Portal del Alumno' },
  { id: 'modulo-biblioteca', nombre: 'Módulo de Biblioteca Virtual' },
  { id: 'modulo-examenes', nombre: 'Módulo de Sistema de Exámenes' },
  { id: 'modulo-tutorias', nombre: 'Módulo de Tutorías Virtuales' },
]

const NuevoProyecto = () => {
  const navigate = useNavigate()
  
  // Estados del formulario
  const [clienteCuit, setClienteCuit] = useState('')
  const [cliente, setCliente] = useState(null)
  const [formData, setFormData] = useState({
    nombre_proyecto: '',
    estado: '',
    fecha_inicio: '',
    fecha_fin: ''
  })
  const [modulosSeleccionados, setModulosSeleccionados] = useState([])
  
  // Estados de UI
  const [loadingCliente, setLoadingCliente] = useState(false)
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
        setError('⚠️ Este cliente está INACTIVO. No se pueden crear proyectos para clientes dados de baja.')
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

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error al editar
    if (error) setError('')
  }

  // Manejar selección de módulos
  const handleModuloChange = (nombreModulo) => {
    setModulosSeleccionados(prev => {
      if (prev.includes(nombreModulo)) {
        return prev.filter(m => m !== nombreModulo)
      } else {
        return [...prev, nombreModulo]
      }
    })
  }

  // Validar formulario
  const validateForm = () => {
    if (!cliente) {
      setError('Primero debes buscar y seleccionar un cliente')
      return false
    }

    if (!formData.nombre_proyecto.trim()) {
      setError('El nombre del proyecto es obligatorio')
      return false
    }

    if (modulosSeleccionados.length === 0) {
      setError('Debes seleccionar al menos un módulo')
      return false
    }

    if (!formData.estado.trim()) {
      setError('El estado es obligatorio')
      return false
    }

    if (!formData.fecha_inicio) {
      setError('La fecha de inicio es obligatoria')
      return false
    }

    if (!formData.fecha_fin) {
      setError('La fecha de fin es obligatoria')
      return false
    }

    // Validar que fecha_fin sea posterior a fecha_inicio
    if (new Date(formData.fecha_fin) <= new Date(formData.fecha_inicio)) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio')
      return false
    }

    return true
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // Convertir los módulos seleccionados a string separado por comas
      const descripcionModulos = modulosSeleccionados.join(',')

      const proyectoData = {
        nombre_proyecto: formData.nombre_proyecto,
        descripcion: descripcionModulos, // Los módulos separados por coma
        estado: formData.estado,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        clienteId: cliente.id.toString(),
      }

      console.log('📤 Enviando proyecto:', proyectoData)

      await createProyecto(proyectoData)
      
      setSuccess(true)
      
      // Mostrar mensaje de éxito y redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
      
    } catch (err) {
      console.error('❌ Error al crear proyecto:', err)
      setError(err.message || 'Error al crear el proyecto. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Manejar cancelación
  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="nuevo-proyecto">
      <div className="nuevo-proyecto-header">
        <h1>Nuevo Proyecto</h1>
        <p>Busca el cliente por CUIT y selecciona los módulos del proyecto</p>
      </div>

      <div className="nuevo-proyecto-content">
        <Card className="form-card">
          {success ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>¡Proyecto creado exitosamente!</h2>
              <p>Redirigiendo al menú principal...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="proyecto-form">
              {error && <ErrorMessage message={error} />}

              {/* Sección: Buscar Cliente */}
              <div className="form-section">
                <h3>1. Buscar Cliente</h3>
                
                <div className="form-group-inline">
                  <div className="form-group flex-grow">
                    <label htmlFor="clienteCuit">
                      CUIT del Cliente <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="clienteCuit"
                      value={clienteCuit}
                      onChange={(e) => setClienteCuit(e.target.value)}
                      placeholder="Ej: 20-12345678-9"
                      disabled={loadingCliente || cliente}
                      className="form-input"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBuscarCliente}
                    disabled={loadingCliente || cliente}
                    className="btn-buscar"
                  >
                    {loadingCliente ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>

                {cliente && (
                  <div className="cliente-info">
                    <div className="info-badge">
                      <strong>Cliente:</strong> {cliente.nombre || 'Sin nombre'}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setCliente(null)
                        setClienteCuit('')
                      }}
                      className="btn-cambiar"
                    >
                      Cambiar Cliente
                    </Button>
                  </div>
                )}
              </div>

              {/* Sección: Datos del Proyecto */}
              {cliente && (
                <>
                  <div className="form-section">
                    <h3>2. Datos del Proyecto</h3>

                    <div className="form-group">
                      <label htmlFor="nombre_proyecto">
                        Nombre del Proyecto <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="nombre_proyecto"
                        name="nombre_proyecto"
                        value={formData.nombre_proyecto}
                        onChange={handleChange}
                        placeholder="Ej: Sistema de Gestión Académica 2025"
                        disabled={loading}
                        className="form-input"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="fecha_inicio">
                          Fecha de Inicio <span className="required">*</span>
                        </label>
                        <input
                          type="date"
                          id="fecha_inicio"
                          name="fecha_inicio"
                          value={formData.fecha_inicio}
                          onChange={handleChange}
                          disabled={loading}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="fecha_fin">
                          Fecha de Fin <span className="required">*</span>
                        </label>
                        <input
                          type="date"
                          id="fecha_fin"
                          name="fecha_fin"
                          value={formData.fecha_fin}
                          onChange={handleChange}
                          disabled={loading}
                          className="form-input"
                        />
                      </div>
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
                        <option value="inactivo">Inactivo</option>
                        <option value="en progreso">En Progreso</option>
                      </select>
                    </div>
                  </div>

                  {/* Sección: Módulos */}
                  <div className="form-section">
                    <h3>3. Módulos del Proyecto <span className="required">*</span></h3>
                    <p className="section-description">
                      Selecciona los módulos que incluirá este proyecto:
                    </p>
                    
                    <div className="modulos-grid">
                      {MODULOS_DISPONIBLES.map(modulo => (
                        <div key={modulo.id} className="modulo-item">
                          <label className="modulo-checkbox">
                            <input
                              type="checkbox"
                              checked={modulosSeleccionados.includes(modulo.nombre)}
                              onChange={() => handleModuloChange(modulo.nombre)}
                              disabled={loading}
                            />
                            <div className="modulo-info">
                              <strong>{modulo.nombre}</strong>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    {modulosSeleccionados.length > 0 && (
                      <div className="modulos-seleccionados">
                        <strong>Módulos seleccionados:</strong>
                        <p>{modulosSeleccionados.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </>
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
                  disabled={loading || !cliente}
                >
                  {loading ? 'Creando...' : 'Crear Proyecto'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

export default NuevoProyecto


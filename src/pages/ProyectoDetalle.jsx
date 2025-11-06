import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProyectoById, updateProyecto, deleteProyecto, getAllFacturas } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { UnifiedTable } from '../components/UnifiedTable'
import './ProyectoDetalle.css'

// Módulos disponibles (los mismos que en NuevoProyecto)
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

// Define columns for the invoices table
const getFacturaColumns = (navigate) => [
  { 
    header: 'Número', 
    accessorKey: 'numero',
    cell: ({ row }) => row.original.numero || 'N/A'
  },
  { 
    header: 'Fecha Emisión', 
    accessorKey: 'fecha_emision',
    cell: ({ row }) => {
      const fecha = row.original.fecha_emision;
      return fecha ? new Date(fecha).toLocaleDateString('es-AR') : 'N/A';
    }
  },
  { 
    header: 'Monto', 
    accessorKey: 'monto',
    cell: ({ row }) => {
      const monto = row.original.monto;
      return monto ? `$${Number(monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : 'N/A';
    }
  },
  { 
    header: 'Estado', 
    accessorKey: 'estado_pago',
    cell: ({ row }) => {
      const estado = row.original.estado_pago || 'desconocido';
      const badgeClass = 
        estado.toLowerCase() === 'pagada' ? 'activo' :
        estado.toLowerCase() === 'pendiente' ? 'en-progreso' :
        estado.toLowerCase() === 'vencida' ? 'inactivo' : '';
      return (
        <span className={`estado-badge ${badgeClass}`}>
          {estado}
        </span>
      );
    }
  },
  { 
    header: 'Cliente', 
    accessorKey: 'cliente',
    cell: ({ row }) => row.original.cliente?.nombre || 'N/A'
  },
  {
    header: 'Acciones',
    accessorKey: 'id',
    cell: ({ row }) => (
      <Button
        variant="primary"
        onClick={() => navigate(`/facturas/${row.original.id}`)}
      >
        Ver Detalle
      </Button>
    )
  }
]

const ProyectoDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre_proyecto: '',
    estado: '',
    fecha_inicio: '',
    fecha_fin: '',
    clienteId: ''
  })
  const [modulosSeleccionados, setModulosSeleccionados] = useState([])
  const [clienteInfo, setClienteInfo] = useState(null)
  const [facturas, setFacturas] = useState([])
  
  // Estados de UI
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Cargar datos del proyecto al montar
  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        setLoading(true)
        setError('')
        
        const data = await getProyectoById(id)
        console.log('✅ Proyecto cargado:', data)
        
        // Parsear módulos desde descripcion (separados por coma)
        const modulosEnDescripcion = data.descripcion ? data.descripcion.split(',').map(m => m.trim()) : []
        setModulosSeleccionados(modulosEnDescripcion)
        
        // Formatear fechas para input type="date" (YYYY-MM-DD)
        const fechaInicio = data.fecha_inicio ? data.fecha_inicio.split('T')[0] : ''
        const fechaFin = data.fecha_fin ? data.fecha_fin.split('T')[0] : ''
        
        setFormData({
          nombre_proyecto: data.nombre_proyecto || '',
          estado: data.estado || '',
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          clienteId: data.clienteId || data.cliente?.id || ''
        })
        
        // Guardar info del cliente si viene en la respuesta
        if (data.cliente) {
          setClienteInfo(data.cliente)
        }
        
        // Cargar facturas del proyecto
        try {
          const todasLasFacturas = await getAllFacturas()
          console.log('✅ Todas las facturas:', todasLasFacturas)
          
          // Extraer array de facturas (manejo diferentes formatos de respuesta)
          let facturasArray = []
          if (Array.isArray(todasLasFacturas)) {
            facturasArray = todasLasFacturas
          } else if (todasLasFacturas && Array.isArray(todasLasFacturas.records)) {
            facturasArray = todasLasFacturas.records
          } else if (todasLasFacturas && Array.isArray(todasLasFacturas.data)) {
            facturasArray = todasLasFacturas.data
          }
          
          // Filtrar facturas del proyecto actual
          const facturasDelProyecto = facturasArray.filter(
            factura => factura.proyectoId === parseInt(id) || factura.proyecto?.id === parseInt(id)
          )
          
          console.log('✅ Facturas del proyecto filtradas:', facturasDelProyecto)
          setFacturas(facturasDelProyecto)
        } catch (facturaError) {
          console.warn('⚠️ No se pudieron cargar las facturas:', facturaError)
          setFacturas([])
        }
        
      } catch (err) {
        console.error('❌ Error al cargar proyecto:', err)
        setError(err.message || 'Error al cargar el proyecto')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProyecto()
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

  // Manejar selección de módulos
  const handleModuloToggle = (moduloNombre) => {
    setModulosSeleccionados(prev => {
      if (prev.includes(moduloNombre)) {
        return prev.filter(m => m !== moduloNombre)
      } else {
        return [...prev, moduloNombre]
      }
    })
  }

  // Validar formulario
  const validateForm = () => {
    if (!formData.nombre_proyecto.trim()) {
      setError('El nombre del proyecto es obligatorio')
      return false
    }
    
    if (!formData.estado) {
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
    
    if (new Date(formData.fecha_inicio) > new Date(formData.fecha_fin)) {
      setError('La fecha de inicio no puede ser posterior a la fecha de fin')
      return false
    }
    
    if (modulosSeleccionados.length === 0) {
      setError('Debes seleccionar al menos un módulo')
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
      // Preparar datos para enviar
      // Formatear fechas a formato ISO con hora
      const formatearFecha = (fecha) => {
        if (!fecha) return null
        // Si ya tiene formato ISO completo, devolverlo tal cual
        if (fecha.includes('T')) return fecha
        // Si es solo YYYY-MM-DD, agregar la hora
        return `${fecha}T00:00:00.000Z`
      }

      // IMPORTANTE: No enviamos clienteId porque el backend no permite cambiarlo
      const proyectoData = {
        nombre_proyecto: formData.nombre_proyecto.trim(),
        descripcion: modulosSeleccionados.join(', '), // Módulos separados por coma
        estado: formData.estado,
        fecha_inicio: formatearFecha(formData.fecha_inicio),
        fecha_fin: formatearFecha(formData.fecha_fin)
      }

      console.log('📤 Enviando datos al backend:', proyectoData)
      console.log('📤 ID del proyecto:', id)

      await updateProyecto(id, proyectoData)
      
      setSuccess(true)
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate(-1) // Volver a la página anterior
      }, 2000)
      
    } catch (err) {
      console.error('Error al actualizar proyecto:', err)
      setError(err.message || 'Error al actualizar el proyecto. Por favor, intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  // Eliminar proyecto (baja lógica)
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.'
    )
    
    if (!confirmDelete) return

    setDeleting(true)
    setError('')

    try {
      await deleteProyecto(id)
      
      // Redirigir después de eliminar
      setTimeout(() => {
        navigate(-1)
      }, 1000)
      
    } catch (err) {
      console.error('Error al eliminar proyecto:', err)
      setError(err.message || 'Error al eliminar el proyecto')
    } finally {
      setDeleting(false)
    }
  }

  // Cancelar y volver
  const handleCancel = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="proyecto-detalle">
        <Loading message="Cargando proyecto..." />
      </div>
    )
  }

  if (error && !formData.nombre_proyecto) {
    return (
      <div className="proyecto-detalle">
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    )
  }

  return (
    <div className="proyecto-detalle">
      <div className="proyecto-detalle-header">
        <h1>Detalle del Proyecto</h1>
      </div>

      <div className="proyecto-detalle-content">
        <Card>
          {success && (
            <div className="alert alert-success">
              <span>✅</span>
              <p>Proyecto actualizado exitosamente. Redirigiendo...</p>
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
            </div>
          )}

          <form onSubmit={handleSubmit} className="proyecto-form">
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
                disabled={saving || deleting}
                className="form-input"
                placeholder="Ingrese el nombre del proyecto"
              />
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
                <option value="inactivo">Inactivo</option>
                <option value="en progreso">En Progreso</option>
              </select>
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
                  disabled={saving || deleting}
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
                  disabled={saving || deleting}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Módulos del Proyecto <span className="required">*</span>
              </label>
              <small className="form-hint">
                Selecciona los módulos que incluirá este proyecto
              </small>
              <div className="modulos-grid">
                {MODULOS_DISPONIBLES.map((modulo) => (
                  <label key={modulo.id} className="modulo-checkbox">
                    <input
                      type="checkbox"
                      checked={modulosSeleccionados.includes(modulo.nombre)}
                      onChange={() => handleModuloToggle(modulo.nombre)}
                      disabled={saving || deleting}
                    />
                    <span>{modulo.nombre}</span>
                  </label>
                ))}
              </div>
              {modulosSeleccionados.length > 0 && (
                <div className="modulos-seleccionados">
                  <strong>Módulos seleccionados:</strong> {modulosSeleccionados.join(', ')}
                </div>
              )}
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

        {/* Facturas del Proyecto */}
        <Card title={`Facturas (${facturas.length})`}>
          {facturas.length > 0 ? (
            <UnifiedTable
              data={facturas}
              columns={getFacturaColumns(navigate)}
              tableTitle=""
            />
          ) : (
            <div className="empty-state">
              <p>📄 Este proyecto no tiene facturas asociadas</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ProyectoDetalle


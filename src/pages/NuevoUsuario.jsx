import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser, getAllRoles } from '../services/api'
import Card from '../components/Card'
import Button from '../components/Button'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import './NuevoUsuario.css'

const NuevoUsuario = () => {
  const navigate = useNavigate()
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    rolId: ''
  })
  
  // Estados para roles
  const [roles, setRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  
  // Estados de UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Cargar roles al montar el componente
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true)
        const response = await getAllRoles()
        
        // Manejar diferentes formatos de respuesta
        let rolesData = []
        if (Array.isArray(response)) {
          rolesData = response
        } else if (response && Array.isArray(response.data)) {
          rolesData = response.data
        } else if (response && Array.isArray(response.roles)) {
          rolesData = response.roles
        }
        
        console.log('✅ Roles cargados:', rolesData)
        setRoles(rolesData)
      } catch (err) {
        console.error('❌ Error al cargar roles:', err)
        setError('No se pudieron cargar los roles. Verifica que el backend esté corriendo.')
      } finally {
        setLoadingRoles(false)
      }
    }

    fetchRoles()
  }, [])

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

  // Validar formulario
  const validateForm = () => {
    if (!formData.user_name.trim()) {
      setError('El nombre de usuario es obligatorio')
      return false
    }
    
    if (formData.user_name.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres')
      return false
    }

    if (!formData.password) {
      setError('La contraseña es obligatoria')
      return false
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }

    if (!formData.rolId) {
      setError('Debes seleccionar un rol')
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
      // Convertir rolId a número
      const userData = {
        ...formData,
        rolId: Number(formData.rolId)
      }

      await createUser(userData)
      
      setSuccess(true)
      
      // Mostrar mensaje de éxito y redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
      
    } catch (err) {
      console.error('Error al crear usuario:', err)
      setError(err.message || 'Error al crear el usuario. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Manejar cancelación
  const handleCancel = () => {
    navigate('/dashboard')
  }

  if (loadingRoles) {
    return (
      <div className="nuevo-usuario">
        <Loading message="Cargando formulario..." />
      </div>
    )
  }

  return (
    <div className="nuevo-usuario">
      <div className="nuevo-usuario-header">
        <h1>Nuevo Usuario</h1>
        <p>Completa el formulario para crear un nuevo usuario en el sistema</p>
      </div>

      <div className="nuevo-usuario-content">
        <Card className="form-card">
          {success ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>¡Usuario creado exitosamente!</h2>
              <p>Redirigiendo al menú principal...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="usuario-form">
              {error && <ErrorMessage message={error} />}

              <div className="form-group">
                <label htmlFor="user_name">
                  Nombre de Usuario <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre de usuario"
                  disabled={loading}
                  className="form-input"
                  autoComplete="username"
                />
                <small className="form-hint">Mínimo 3 caracteres</small>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Contraseña <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingrese la contraseña"
                  disabled={loading}
                  className="form-input"
                  autoComplete="new-password"
                />
                <small className="form-hint">Mínimo 6 caracteres</small>
              </div>

              <div className="form-group">
                <label htmlFor="rolId">
                  Rol <span className="required">*</span>
                </label>
                <select
                  id="rolId"
                  name="rolId"
                  value={formData.rolId}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-select"
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre || rol.name || `Rol ${rol.id}`}
                    </option>
                  ))}
                </select>
                {roles.length === 0 && (
                  <small className="form-hint warning">
                    No hay roles disponibles. Contacta al administrador.
                  </small>
                )}
              </div>

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
                  disabled={loading || roles.length === 0}
                >
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}

export default NuevoUsuario


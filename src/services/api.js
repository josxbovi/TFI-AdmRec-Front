import axios from 'axios'

// Configuración base de Axios
const API_URL = import.meta.env.VITE_API_URL || '/api'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    // Si es un blob (PDF, imagen, etc.), no intentar loggearlo
    if (response.data instanceof Blob) {
      console.log('📡 Respuesta del API (Blob):', response.config.url, `Blob de ${response.data.size} bytes`)
      return response.data
    }
    
    // Para respuestas JSON normales
    console.log('📡 Respuesta del API:', response.config.url, response.data)
    return response.data
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('❌ Error de respuesta:', error.response.status, error.response.data)
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     `Error ${error.response.status}: ${error.response.statusText}`
      throw new Error(message)
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('❌ Error de red - Sin respuesta del servidor')
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000')
    } else {
      // Algo más sucedió al configurar la petición
      console.error('❌ Error:', error.message)
      throw new Error(error.message)
    }
  }
)

// ===== FUNCIONES DE LA API =====

// Ejemplo de función GET
export const fetchExample = async () => {
  try {
    const response = await apiClient.get('/ejemplo')
    return response
  } catch (error) {
    throw error
  }
}

// Ejemplo de función POST
export const createItem = async (data) => {
  try {
    const response = await apiClient.post('/items', data)
    return response
  } catch (error) {
    throw error
  }
}

// Ejemplo de función PUT
export const updateItem = async (id, data) => {
  try {
    const response = await apiClient.put(`/items/${id}`, data)
    return response
  } catch (error) {
    throw error
  }
}

// Ejemplo de función DELETE
export const deleteItem = async (id) => {
  try {
    const response = await apiClient.delete(`/items/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

// ===== USUARIOS =====

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/user/crear', userData)
    return response
  } catch (error) {
    throw error
  }
}

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/user')
    return response
  } catch (error) {
    throw error
  }
}

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/user/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.patch(`/user/${id}`, userData)
    return response
  } catch (error) {
    throw error
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/user/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

// ===== ROLES =====

export const getAllRoles = async () => {
  try {
    console.log('🔍 Solicitando roles desde:', `${API_URL}/rol`)
    const response = await apiClient.get('/rol')
    console.log('✅ Respuesta de roles:', response)
    return response
  } catch (error) {
    console.error('❌ Error al obtener roles:', error)
    throw error
  }
}

export const createRole = async (roleData) => {
  try {
    const response = await apiClient.post('/rol', roleData)
    return response
  } catch (error) {
    throw error
  }
}

export const getRoleById = async (id) => {
  try {
    const response = await apiClient.get(`/rol/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

export const updateRole = async (id, roleData) => {
  try {
    const response = await apiClient.patch(`/rol/${id}`, roleData)
    return response
  } catch (error) {
    throw error
  }
}

export const deleteRole = async (id) => {
  try {
    const response = await apiClient.delete(`/rol/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

// ===== CLIENTES =====

export const getAllClientes = async () => {
  try {
    const response = await apiClient.get('/cliente')
    return response
  } catch (error) {
    throw error
  }
}

export const getClienteById = async (id) => {
  try {
    const response = await apiClient.get(`/cliente/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

 export const getClienteByCuit = async (cuit) => {
  try {
    const response = await apiClient.get(`/cliente/cuit/${cuit}`)
    return response
  } catch (error) {
    throw error
  }
}

export const createCliente = async (clienteData) => {
  try {
    const response = await apiClient.post('/cliente/crear', clienteData)
    return response
  } catch (error) {
    throw error
  }
}

export const updateCliente = async (id, clienteData) => {
  try {
    const response = await apiClient.patch(`/cliente/${id}`, clienteData)
    return response
  } catch (error) {
    throw error
  }
}

export const deleteCliente = async (id) => {
  try {
    const response = await apiClient.delete(`/cliente/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

// ===== PROYECTOS =====

export const getAllProyectos = async () => {
  try {
    const response = await apiClient.get('/proyecto')
    return response
  } catch (error) {
    throw error
  }
}

export const getProyectoById = async (id) => {
  try {
    const response = await apiClient.get(`/proyecto/${id}`)
    console.log('✅ Proyecto obtenido:', response)
    return response
  } catch (error) {
    console.error('❌ Error al obtener proyecto:', error)
    throw error
  }
}

export const createProyecto = async (proyectoData) => {
  try {
    const response = await apiClient.post('/proyecto/crear', proyectoData)
    return response
  } catch (error) {
    throw error
  }
}

export const updateProyecto = async (id, proyectoData) => {
  try {
    console.log('🔄 Actualizando proyecto:', { id, proyectoData })
    const response = await apiClient.patch(`/proyecto/${id}`, proyectoData)
    console.log('✅ Proyecto actualizado:', response)
    return response
  } catch (error) {
    console.error('❌ Error al actualizar proyecto:', error)
    console.error('❌ Datos enviados:', proyectoData)
    console.error('❌ Response del error:', error.response)
    throw error
  }
}

export const deleteProyecto = async (id) => {
  try {
    const response = await apiClient.delete(`/proyecto/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

// ===== ALERTAS =====

export const getAllAlertas = async () => {
  try {
    const response = await apiClient.get('/alerta')
    return response
  } catch (error) {
    throw error
  }
}

export const getAlertaById = async (id) => {
  try {
    const response = await apiClient.get(`/alerta/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

export const createAlerta = async (alertaData) => {
  try {
    const response = await apiClient.post('/alerta/crear', alertaData)
    return response
  } catch (error) {
    throw error
  }
}

export const updateAlerta = async (id, alertaData) => {
  try {
    const response = await apiClient.patch(`/alerta/${id}`, alertaData)
    return response
  } catch (error) {
    throw error
  }
}

export const deleteAlerta = async (id) => {
  try {
    const response = await apiClient.delete(`/alerta/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

// ===== FACTURAS =====

export const getAllFacturas = async () => {
  try {
    const response = await apiClient.get('/factura')
    return response
  } catch (error) {
    throw error
  }
}

export const getFacturaById = async (id) => {
  try {
    const response = await apiClient.get(`/factura/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

export const getFacturaPDF = async (id) => {
  try {
    console.log('📥 Solicitando PDF de factura:', id)
    // Importante: responseType 'blob' para archivos binarios
    const response = await apiClient.get(`/factura/${id}/pdf`, {
      responseType: 'blob'
    })
    console.log('✅ PDF recibido:', response)
    return response
  } catch (error) {
    console.error('❌ Error al obtener PDF:', error)
    throw error
  }
}

export const createFactura = async (facturaData) => {
  try {
    console.log('📄 Creando factura:', facturaData)
    const response = await apiClient.post('/factura/crear', facturaData)
    console.log('✅ Factura creada:', response)
    return response
  } catch (error) {
    console.error('❌ Error al crear factura:', error)
    throw error
  }
}

export const updateFactura = async (id, facturaData) => {
  try {
    console.log('🔄 Actualizando factura:', { id, facturaData })
    const response = await apiClient.patch(`/factura/${id}`, facturaData)
    console.log('✅ Factura actualizada:', response)
    return response
  } catch (error) {
    console.error('❌ Error al actualizar factura:', error)
    throw error
  }
}

export const deleteFactura = async (id) => {
  try {
    console.log('🗑️ Eliminando factura:', id)
    const response = await apiClient.delete(`/factura/${id}`)
    console.log('✅ Factura eliminada')
    return response
  } catch (error) {
    console.error('❌ Error al eliminar factura:', error)
    throw error
  }
}

// ===== CONTRATOS =====

export const getAllContratos = async () => {
  try {
    console.log('🔍 Obteniendo todos los contratos')
    const response = await apiClient.get('/contrato')
    console.log('✅ Contratos obtenidos:', response)
    return response
  } catch (error) {
    console.error('❌ Error al obtener contratos:', error)
    throw error
  }
}

export const getContratoById = async (id) => {
  try {
    console.log('🔍 Obteniendo contrato por ID:', id)
    const response = await apiClient.get(`/contrato/${id}`)
    console.log('✅ Contrato obtenido:', response)
    return response
  } catch (error) {
    console.error('❌ Error al obtener contrato:', error)
    throw error
  }
}

export const createContrato = async (contratoData) => {
  try {
    console.log('📝 Creando contrato:', contratoData)
    const response = await apiClient.post('/contrato/crear', contratoData)
    console.log('✅ Contrato creado:', response)
    return response
  } catch (error) {
    console.error('❌ Error al crear contrato:', error)
    throw error
  }
}

export const updateContrato = async (id, contratoData) => {
  try {
    console.log('🔄 Actualizando contrato:', { id, contratoData })
    const response = await apiClient.patch(`/contrato/${id}`, contratoData)
    console.log('✅ Contrato actualizado:', response)
    return response
  } catch (error) {
    console.error('❌ Error al actualizar contrato:', error)
    console.error('❌ Datos enviados:', contratoData)
    throw error
  }
}

export const deleteContrato = async (id) => {
  try {
    console.log('🗑️ Eliminando contrato:', id)
    const response = await apiClient.delete(`/contrato/${id}`)
    console.log('✅ Contrato eliminado')
    return response
  } catch (error) {
    console.error('❌ Error al eliminar contrato:', error)
    throw error
  }
}

// ===== AUTENTICACIÓN =====

export const login = async (credentials) => {
  try {
    console.log('🔐 Intento de login con:', credentials)
    
    // Mapear 'username' a 'user_name' según el DTO del backend
    const loginData = {
      user_name: credentials.username,
      password: credentials.password
    }
    
    // Hacer la petición al backend
    const response = await apiClient.post('/user/login', loginData)
    
    console.log('✅ Login exitoso:', response)
    
    // Guardar token en localStorage (el backend devuelve 'access_token')
    const token = response.access_token || response.token
    if (token) {
      localStorage.setItem('authToken', token)
    }
    
    // Normalizar la respuesta para que siempre tenga 'token'
    return {
      ...response,
      token: token
    }
  } catch (error) {
    throw error
  }
}

// Obtener perfil del usuario autenticado
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/user/profile')
    console.log('✅ Perfil obtenido:', response)
    return response
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error)
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

export default apiClient


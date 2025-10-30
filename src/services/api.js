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
    // Retornar toda la respuesta para manejar diferentes formatos
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
    const response = await apiClient.get('/rol')
    return response
  } catch (error) {
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

// ===== AUTENTICACIÓN =====

export const login = async (credentials) => {
  try {
    // TODO: Cuando tengas el backend, descomentar esta línea:
    // const response = await apiClient.post('/auth/login', credentials)
    
    // TEMPORAL: Simulación de login para desarrollo (BORRAR cuando conectes el backend)
    console.log('🔐 Intento de login con:', credentials)
    
    // Simulamos una respuesta del backend
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay de red
    
    // Respuesta simulada - ESTO SE REEMPLAZARÁ con la respuesta real del backend
    const response = {
      success: true,
      token: 'token-temporal-de-ejemplo-' + Date.now(),
      user: {
        id: 1,
        username: credentials.username,
        nombre: 'Usuario Demo',
        email: credentials.username + '@ejemplo.com',
        rol: 'administrativo'
      }
    }
    
    // Guardar token
    if (response.token) {
      localStorage.setItem('authToken', response.token)
    }
    
    return response
  } catch (error) {
    throw error
  }
}

export const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

export default apiClient


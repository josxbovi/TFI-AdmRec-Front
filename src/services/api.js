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
    return response.data
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data)
      throw new Error(error.response.data.message || 'Error en la petición')
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de red:', error.request)
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.')
    } else {
      // Algo más sucedió al configurar la petición
      console.error('Error:', error.message)
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


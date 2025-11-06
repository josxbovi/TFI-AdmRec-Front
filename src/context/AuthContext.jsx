import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario almacenado al cargar la app
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('authToken')
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error al parsear usuario:', error)
        // Si hay error, limpiar el storage
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials)
      
      // Guardar usuario y token
      if (response.user) {
        setUser(response.user)
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    apiLogout()
    setUser(null)
    localStorage.removeItem('user')
  }

  // Helper para verificar si el usuario es administrador
  const isAdmin = () => {
    if (!user || !user.rol) return false
    return user.rol.nombre === 'Administrador'
  }

  // Helper para verificar si el usuario tiene un rol específico
  const hasRole = (roleName) => {
    if (!user || !user.rol) return false
    return user.rol.nombre === roleName
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    hasRole,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export default AuthContext


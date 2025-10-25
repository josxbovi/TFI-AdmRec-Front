/**
 * Funciones utilitarias para validación de datos
 */

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar teléfono (formato español)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Validar contraseña (mínimo 8 caracteres, al menos una mayúscula y un número)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

// Validar campo requerido
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

// Validar longitud mínima
export const hasMinLength = (value, minLength) => {
  if (typeof value !== 'string') return false
  return value.length >= minLength
}

// Validar longitud máxima
export const hasMaxLength = (value, maxLength) => {
  if (typeof value !== 'string') return false
  return value.length <= maxLength
}


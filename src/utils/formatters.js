/**
 * Funciones utilitarias para formatear datos
 */

// Formatear fecha
export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Formatear moneda
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return ''
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Capitalizar primera letra
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Truncar texto
export const truncate = (str, maxLength = 50) => {
  if (!str || str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}


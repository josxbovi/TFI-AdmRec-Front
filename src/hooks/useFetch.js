import { useState, useEffect } from 'react'

/**
 * Custom hook para hacer peticiones HTTP
 * @param {Function} fetchFunction - Función que retorna una promesa
 * @param {boolean} immediate - Si debe ejecutarse inmediatamente
 * @returns {Object} - { data, loading, error, refetch }
 */
const useFetch = (fetchFunction, immediate = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const executeFetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFunction()
      setData(result)
      return result
    } catch (err) {
      setError(err.message || 'Ocurrió un error')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      executeFetch()
    }
  }, [])

  const refetch = () => {
    return executeFetch()
  }

  return { data, loading, error, refetch }
}

export default useFetch


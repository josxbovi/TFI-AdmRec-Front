import { useState, useEffect } from 'react'
import { fetchExample } from '../services/api'
import './Home.css'

const Home = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchExample()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <h1>Bienvenido al Frontend TFI - AdmRec</h1>
      
      <div className="card">
        <h2>🚀 Proyecto Configurado</h2>
        <p>Tu proyecto React está listo para desarrollar.</p>
        <p>Este esqueleto incluye:</p>
        <ul className="features-list">
          <li>✅ React 18 con Vite</li>
          <li>✅ React Router para navegación</li>
          <li>✅ Axios para consumir APIs</li>
          <li>✅ Estructura de carpetas organizada</li>
          <li>✅ Servicios para comunicación con backend</li>
        </ul>
      </div>

      <div className="card">
        <h2>🔌 Prueba de Conexión con Backend</h2>
        <button 
          className="button" 
          onClick={handleFetchData}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Probar Conexión API'}
        </button>
        
        {data && (
          <div className="result success">
            <h3>✅ Respuesta del servidor:</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
        
        {error && (
          <div className="result error">
            <h3>❌ Error:</h3>
            <p>{error}</p>
            <small>Asegúrate de que tu backend esté corriendo y la URL esté configurada correctamente.</small>
          </div>
        )}
      </div>

      <div className="card">
        <h2>📚 Próximos Pasos</h2>
        <ol className="steps-list">
          <li>Instala las dependencias: <code>npm install</code></li>
          <li>Inicia el servidor de desarrollo: <code>npm run dev</code></li>
          <li>Configura la URL de tu backend en <code>vite.config.js</code></li>
          <li>Crea tus componentes en <code>src/components/</code></li>
          <li>Agrega tus páginas en <code>src/pages/</code></li>
          <li>Configura tus servicios API en <code>src/services/</code></li>
        </ol>
      </div>
    </div>
  )
}

export default Home


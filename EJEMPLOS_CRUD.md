# 📚 Ejemplos de CRUD

Este documento muestra cómo implementar operaciones CRUD (Create, Read, Update, Delete) en tu aplicación.

## 🎯 Ejemplo Completo: Gestión de Productos

### 1. Configurar el Servicio API

En `src/services/api.js`, agrega las funciones para productos:

```javascript
// ===== PRODUCTOS =====

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await apiClient.get('/productos')
    return response
  } catch (error) {
    throw error
  }
}

// Obtener un producto por ID
export const getProductoById = async (id) => {
  try {
    const response = await apiClient.get(`/productos/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

// Crear un nuevo producto
export const createProducto = async (producto) => {
  try {
    const response = await apiClient.post('/productos', producto)
    return response
  } catch (error) {
    throw error
  }
}

// Actualizar un producto
export const updateProducto = async (id, producto) => {
  try {
    const response = await apiClient.put(`/productos/${id}`, producto)
    return response
  } catch (error) {
    throw error
  }
}

// Eliminar un producto
export const deleteProducto = async (id) => {
  try {
    const response = await apiClient.delete(`/productos/${id}`)
    return response
  } catch (error) {
    throw error
  }
}
```

### 2. Crear la Página de Productos

Crea `src/pages/Productos.jsx`:

```jsx
import { useState, useEffect } from 'react'
import { getProductos, deleteProducto } from '../services/api'
import Button from '../components/Button'
import Card from '../components/Card'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import './Productos.css'

const Productos = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProductos()
      setProductos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return
    }

    try {
      await deleteProducto(id)
      // Actualizar lista después de eliminar
      setProductos(productos.filter(p => p.id !== id))
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  if (loading) return <Loading message="Cargando productos..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchProductos} />

  return (
    <div className="productos-page">
      <div className="page-header">
        <h1>Productos</h1>
        <Button 
          variant="primary" 
          onClick={() => window.location.href = '/productos/nuevo'}
        >
          + Nuevo Producto
        </Button>
      </div>

      <div className="productos-grid">
        {productos.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          productos.map(producto => (
            <Card key={producto.id} title={producto.nombre}>
              <p className="producto-descripcion">{producto.descripcion}</p>
              <p className="producto-precio">
                Precio: ${producto.precio}
              </p>
              <p className="producto-stock">
                Stock: {producto.stock} unidades
              </p>
              <div className="producto-actions">
                <Button 
                  variant="secondary" 
                  onClick={() => window.location.href = `/productos/${producto.id}`}
                >
                  Ver
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => window.location.href = `/productos/editar/${producto.id}`}
                >
                  Editar
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(producto.id)}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default Productos
```

### 3. Crear Estilos de la Página

Crea `src/pages/Productos.css`:

```css
.productos-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.producto-descripcion {
  margin: 0.5rem 0;
  color: rgba(255, 255, 255, 0.7);
}

.producto-precio {
  font-size: 1.2rem;
  font-weight: bold;
  color: #4caf50;
  margin: 0.5rem 0;
}

.producto-stock {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.producto-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.producto-actions button {
  flex: 1;
  font-size: 0.9rem;
  padding: 0.5em 0.8em;
}
```

### 4. Crear Formulario para Crear/Editar

Crea `src/pages/ProductoForm.jsx`:

```jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductoById, createProducto, updateProducto } from '../services/api'
import Button from '../components/Button'
import Card from '../components/Card'
import Loading from '../components/Loading'
import './ProductoForm.css'

const ProductoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEditing) {
      fetchProducto()
    }
  }, [id])

  const fetchProducto = async () => {
    setLoading(true)
    try {
      const producto = await getProductoById(id)
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock
      })
    } catch (err) {
      alert('Error al cargar producto: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0'
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)
    try {
      if (isEditing) {
        await updateProducto(id, formData)
      } else {
        await createProducto(formData)
      }
      navigate('/productos')
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return <Loading message="Cargando producto..." />
  }

  return (
    <div className="producto-form-page">
      <Card title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'error' : ''}
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio">Precio *</label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              step="0.01"
              className={errors.precio ? 'error' : ''}
            />
            {errors.precio && <span className="error-text">{errors.precio}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={errors.stock ? 'error' : ''}
            />
            {errors.stock && <span className="error-text">{errors.stock}</span>}
          </div>

          <div className="form-actions">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate('/productos')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ProductoForm
```

### 5. Estilos del Formulario

Crea `src/pages/ProductoForm.css`:

```css
.producto-form-page {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.87);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #646cff;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #f44336;
}

.error-text {
  display: block;
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}
```

### 6. Agregar Rutas en App.jsx

En `src/App.jsx`, agrega las rutas:

```jsx
import Productos from './pages/Productos'
import ProductoForm from './pages/ProductoForm'

// En Routes:
<Route path="/productos" element={<Productos />} />
<Route path="/productos/nuevo" element={<ProductoForm />} />
<Route path="/productos/editar/:id" element={<ProductoForm />} />
```

### 7. Agregar al Menú

En `src/components/Layout.jsx`:

```jsx
<li>
  <Link to="/productos">Productos</Link>
</li>
```

## 🎨 Variaciones del Hook useFetch

### Con parámetros

```jsx
import useFetch from '../hooks/useFetch'
import { getProductoById } from '../services/api'

const ProductoDetalle = ({ id }) => {
  const { data, loading, error } = useFetch(
    () => getProductoById(id),
    true  // Ejecutar inmediatamente
  )

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />

  return <div>{data?.nombre}</div>
}
```

### Con búsqueda/filtros

```jsx
const ProductosBusqueda = () => {
  const [busqueda, setBusqueda] = useState('')
  const [productos, setProductos] = useState([])

  const handleBuscar = async () => {
    try {
      const data = await getProductos({ busqueda })
      setProductos(data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <input 
        value={busqueda} 
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <button onClick={handleBuscar}>Buscar</button>
      
      {productos.map(p => (
        <div key={p.id}>{p.nombre}</div>
      ))}
    </div>
  )
}
```

## 🔐 Ejemplo con Autenticación

```jsx
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(credentials)
      navigate('/dashboard')
    } catch (err) {
      alert('Error al iniciar sesión: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({
          ...credentials,
          email: e.target.value
        })}
      />
      <input 
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({
          ...credentials,
          password: e.target.value
        })}
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  )
}
```

## 📝 Buenas Prácticas

1. **Siempre maneja errores**: Usa try-catch en todas las llamadas API
2. **Loading states**: Muestra indicadores de carga mientras se procesan peticiones
3. **Validación**: Valida datos tanto en el frontend como en el backend
4. **Confirmaciones**: Pide confirmación antes de eliminar datos
5. **Feedback**: Muestra mensajes de éxito/error al usuario
6. **Limpieza**: Limpia estados cuando un componente se desmonta

## 🚀 Próximos Pasos

- Implementa paginación para listas grandes
- Agrega filtros y ordenamiento
- Implementa búsqueda en tiempo real
- Agrega validación con bibliotecas como Formik o React Hook Form
- Implementa caché de datos con React Query o SWR


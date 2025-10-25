# 🚀 Inicio Rápido

## Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con hot-reload |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint para revisar el código |

## 🔧 Configuración del Backend

### Opción 1: Proxy (Recomendado para desarrollo)

Edita `vite.config.js` y cambia la URL del backend:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080', // ← Cambia esta URL
    changeOrigin: true,
  }
}
```

Luego en tu código, usa rutas relativas:
```javascript
axios.get('/api/usuarios')  // Se redirige a http://localhost:8080/api/usuarios
```

### Opción 2: Variable de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api
```

Ya está configurado en `src/services/api.js` para usar esta variable.

## 📂 Estructura del Proyecto

```
TFI-AdmRec-Front/
├── public/                 # Archivos estáticos
│   └── vite.svg
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Layout.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Loading.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/             # Páginas/Vistas
│   │   ├── Home.jsx
│   │   └── About.jsx
│   ├── services/          # Servicios API
│   │   └── api.js         # ← Configuración de Axios
│   ├── hooks/             # Custom Hooks
│   │   └── useFetch.js
│   ├── context/           # Context API
│   │   └── AuthContext.jsx
│   ├── utils/             # Utilidades
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx            # Componente principal
│   ├── App.css
│   ├── main.jsx           # Punto de entrada
│   └── index.css
├── index.html
├── package.json
├── vite.config.js         # ← Configuración de Vite
└── README.md

```

## 🛠️ Primeros Pasos para Desarrollar

### 1. Crear una nueva página

Crea un archivo en `src/pages/MiPagina.jsx`:

```jsx
const MiPagina = () => {
  return (
    <div>
      <h1>Mi Nueva Página</h1>
      <p>Contenido aquí</p>
    </div>
  )
}

export default MiPagina
```

### 2. Agregar ruta en App.jsx

```jsx
import MiPagina from './pages/MiPagina'

// En el componente Routes:
<Route path="/mi-pagina" element={<MiPagina />} />
```

### 3. Agregar enlace en el menú

En `src/components/Layout.jsx`, agrega el enlace:

```jsx
<li>
  <Link to="/mi-pagina">Mi Página</Link>
</li>
```

## 🌐 Consumir API del Backend

### Ejemplo básico

En `src/services/api.js`, agrega tu función:

```javascript
export const getUsuarios = async () => {
  const response = await apiClient.get('/usuarios')
  return response
}
```

Úsala en tu componente:

```jsx
import { useState, useEffect } from 'react'
import { getUsuarios } from '../services/api'

const MiComponente = () => {
  const [usuarios, setUsuarios] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsuarios()
      setUsuarios(data)
    }
    fetchData()
  }, [])
  
  return (
    <div>
      {usuarios.map(user => (
        <div key={user.id}>{user.nombre}</div>
      ))}
    </div>
  )
}
```

### Usando el hook personalizado

```jsx
import useFetch from '../hooks/useFetch'
import { getUsuarios } from '../services/api'

const MiComponente = () => {
  const { data, loading, error, refetch } = useFetch(getUsuarios)
  
  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>
  
  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>{user.nombre}</div>
      ))}
      <button onClick={refetch}>Recargar</button>
    </div>
  )
}
```

## 🎨 Componentes Disponibles

### Button
```jsx
import Button from '../components/Button'

<Button variant="primary" onClick={handleClick}>
  Click aquí
</Button>
```

Variantes: `primary`, `secondary`, `danger`, `success`

### Card
```jsx
import Card from '../components/Card'

<Card title="Título">
  <p>Contenido de la tarjeta</p>
</Card>
```

### Loading
```jsx
import Loading from '../components/Loading'

<Loading message="Cargando datos..." />
```

### ErrorMessage
```jsx
import ErrorMessage from '../components/ErrorMessage'

<ErrorMessage 
  message="Error al cargar datos" 
  onRetry={handleRetry} 
/>
```

## 📝 Notas Importantes

- **Hot Reload**: Los cambios se reflejan automáticamente sin recargar
- **ESLint**: Configurado para React 18 con JSX Transform
- **Rutas**: Todas las rutas de API deben empezar con `/api`
- **Axios**: Los interceptores ya están configurados para manejo de errores y tokens
- **Auth**: El contexto de autenticación está listo en `src/context/AuthContext.jsx`

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Limpia node_modules y reinstala
rm -rf node_modules
npm install
```

### Error de CORS
Configura el proxy en `vite.config.js` o habilita CORS en tu backend

### Puerto 3000 ocupado
Cambia el puerto en `vite.config.js`:
```javascript
server: {
  port: 3001, // Cambia a otro puerto
}
```

## 🚀 ¡Listo para Empezar!

Tu proyecto está completamente configurado. Ahora puedes:
1. Ejecutar `npm install`
2. Ejecutar `npm run dev`
3. ¡Empezar a desarrollar!


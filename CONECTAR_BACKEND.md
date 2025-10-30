# 🔌 Cómo Conectar el Backend

Este documento explica cómo conectar tu backend al frontend una vez que esté listo.

## 📍 Paso 1: Configurar la URL del Backend

### Opción A: Usando el Proxy de Vite (Recomendado para desarrollo)

Edita el archivo `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // ← Cambia esto por la URL de tu backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### Opción B: Usando Variable de Entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8080/api
```

## 🔐 Paso 2: Actualizar el Servicio de Login

### Ubicación del código temporal
El código de simulación está en: `src/services/api.js` líneas **94-127**

### Lo que debes hacer:

1. **Abre el archivo** `src/services/api.js`

2. **Busca la función** `login` (alrededor de la línea 94)

3. **BORRA** todo el código de simulación (líneas 99-123)

4. **DESCOMENTA** la línea real del backend (línea 97):

```javascript
export const login = async (credentials) => {
  try {
    // Descomenta esta línea:
    const response = await apiClient.post('/auth/login', credentials)
    
    // BORRA TODO ESTO (líneas 99-123):
    // console.log('🔐 Intento de login con:', credentials)
    // await new Promise(resolve => setTimeout(resolve, 1000))
    // const response = { ... }
    
    // Mantén esto:
    if (response.token) {
      localStorage.setItem('authToken', response.token)
    }
    
    return response
  } catch (error) {
    throw error
  }
}
```

### Código final (después de conectar):

```javascript
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials)
    
    if (response.token) {
      localStorage.setItem('authToken', response.token)
    }
    
    return response
  } catch (error) {
    throw error
  }
}
```

## 📋 Paso 3: Formato de Respuesta Esperado del Backend

Tu backend debe devolver una respuesta con este formato:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "jose_admin",
    "nombre": "José Pérez",
    "email": "jose@ejemplo.com",
    "rol": "administrativo"
  }
}
```

### Campos importantes:

- **`token`** (string): JWT o token de autenticación
- **`user`** (object): Datos del usuario
  - `id`: ID único del usuario
  - `username`: Nombre de usuario
  - `nombre`: Nombre completo (se muestra en el menú)
  - `email`: Email del usuario
  - `rol`: Rol del usuario (administrativo, gerente, etc.)

## 🔄 Paso 4: Verificar que Funciona

1. **Inicia tu backend**

2. **Inicia el frontend:**
   ```bash
   npm run dev
   ```

3. **Ve a** `http://localhost:3000/login`

4. **Ingresa credenciales** y verifica:
   - ✅ Se envía la petición al backend
   - ✅ Recibes el token
   - ✅ Te redirige al dashboard
   - ✅ El menú muestra tu nombre de usuario
   - ✅ Puedes navegar entre páginas
   - ✅ Al cerrar sesión vuelves al login

## 🛠️ Endpoints Adicionales que Necesitarás

A medida que avances, agregarás más endpoints en `src/services/api.js`:

### Clientes
```javascript
export const getClientes = async () => {
  return await apiClient.get('/clientes')
}

export const getClienteById = async (id) => {
  return await apiClient.get(`/clientes/${id}`)
}

export const createCliente = async (data) => {
  return await apiClient.post('/clientes', data)
}

export const updateCliente = async (id, data) => {
  return await apiClient.put(`/clientes/${id}`, data)
}

export const deleteCliente = async (id) => {
  return await apiClient.delete(`/clientes/${id}`)
}
```

### Contratos
```javascript
export const getContratos = async () => {
  return await apiClient.get('/contratos')
}

export const createContrato = async (data) => {
  return await apiClient.post('/contratos', data)
}
```

### Facturas
```javascript
export const getFacturas = async () => {
  return await apiClient.get('/facturas')
}

export const emitirFactura = async (data) => {
  return await apiClient.post('/facturas/emitir', data)
}
```

## 🔍 Debug y Troubleshooting

### Ver las peticiones en la consola
Abre las DevTools del navegador → pestaña "Network" → verás todas las peticiones HTTP

### Error CORS
Si recibes error de CORS, tu backend debe configurar:

**En Express (Node.js):**
```javascript
const cors = require('cors')
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```

**En Spring Boot (Java):**
```java
@CrossOrigin(origins = "http://localhost:3000")
```

### El token no se envía
Verifica que el interceptor esté funcionando. Abre la consola y deberías ver el header `Authorization: Bearer <token>` en cada petición.

### Error 401 Unauthorized
- Verifica que el token sea válido
- Verifica que el backend esté validando el token correctamente
- Verifica que no haya expirado el token

## ✅ Checklist de Conexión

- [ ] Backend corriendo
- [ ] URL del backend configurada en `vite.config.js` o `.env`
- [ ] Código de simulación eliminado de `api.js`
- [ ] Endpoint `/auth/login` funcionando
- [ ] Backend devuelve token y datos de usuario
- [ ] CORS configurado en el backend
- [ ] Login funciona correctamente
- [ ] Token se guarda en localStorage
- [ ] Token se envía en peticiones subsiguientes
- [ ] Logout funciona correctamente

## 📞 ¿Problemas?

Si tienes algún problema:
1. Revisa la consola del navegador (F12)
2. Revisa la pestaña Network para ver la respuesta del servidor
3. Verifica que el backend esté corriendo
4. Verifica que la URL sea correcta


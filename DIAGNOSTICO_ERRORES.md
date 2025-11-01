# 🔍 Guía de Diagnóstico de Errores

## Error Actual: "roles.map is not a function"

### ✅ Solución Aplicada

He actualizado el código para manejar diferentes formatos de respuesta del backend y mejorado los logs para diagnosticar problemas.

### 🧪 Pasos para Probar

1. **Abre la consola del navegador** (F12 → Console)

2. **Reinicia el frontend** (si no lo hiciste):
   ```bash
   # Presiona Ctrl+C
   npm run dev
   ```

3. **Navega a "Nuevo Usuario"** en el navegador

4. **Observa los logs en la consola**. Deberías ver:
   ```
   📡 Respuesta del API: /api/rol [datos]
   ✅ Roles cargados: [array de roles]
   ```

---

## 🔍 Diagnóstico Según los Logs

### Caso 1: Ver "📡 Respuesta del API" pero error en "roles.map"

**Problema**: La respuesta del backend tiene un formato diferente al esperado.

**Solución**: El código ahora maneja automáticamente estos formatos:
- `[{id: 1, nombre: "Admin"}, ...]` (array directo)
- `{data: [{id: 1, nombre: "Admin"}, ...]}` (objeto con propiedad data)
- `{roles: [{id: 1, nombre: "Admin"}, ...]}` (objeto con propiedad roles)

Si aún falla, copia el contenido de "📡 Respuesta del API" y compártelo.

### Caso 2: Ver "❌ Error de red - Sin respuesta del servidor"

**Problema**: El backend no está corriendo o no está en el puerto 3000.

**Soluciones**:

1. **Verifica que el backend esté corriendo**:
   ```bash
   # En la carpeta del backend
   npm run start:dev
   ```

2. **Verifica el puerto del backend**. Debería mostrar:
   ```
   Application is running on: http://localhost:3000
   ```

3. **Si el backend usa otro puerto**, actualiza `vite.config.js`:
   ```js
   proxy: {
     '/api': {
       target: 'http://localhost:PUERTO_DEL_BACKEND',
       // ...
     }
   }
   ```

### Caso 3: Ver error de CORS

**Problema**: El backend está bloqueando las peticiones.

**Solución**: Consulta `SOLUCION_CORS.md`

### Caso 4: Error 404 - "Cannot GET /rol"

**Problema**: El endpoint no existe en el backend o la ruta es incorrecta.

**Soluciones**:

1. **Verifica que el endpoint exista** en el backend:
   - Abre Swagger: `http://localhost:3000/api`
   - Busca el endpoint `GET /rol`

2. **Si el endpoint es diferente**, actualiza `src/services/api.js`:
   ```js
   export const getAllRoles = async () => {
     const response = await apiClient.get('/ruta-correcta')
     return response
   }
   ```

### Caso 5: Error 500 - Error del servidor

**Problema**: El backend tiene un error interno.

**Solución**:
1. Revisa los logs del backend en la terminal
2. Verifica que la base de datos esté conectada
3. Verifica que el endpoint de roles esté funcionando correctamente

---

## 🛠️ Comandos Útiles para Diagnóstico

### Ver logs del frontend:
```bash
# La consola del navegador (F12 → Console) mostrará:
📡 Respuesta del API: /api/rol [datos]
✅ Roles cargados: [...]
```

### Probar el backend directamente:

**Opción 1: Desde el navegador**
```
http://localhost:3000/rol
```

**Opción 2: Desde PowerShell**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/rol" -Method GET
```

**Opción 3: Desde CMD**
```cmd
curl http://localhost:3000/rol
```

---

## ✅ Checklist de Verificación

- [ ] Backend corriendo en `http://localhost:3000`
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Swagger accesible en `http://localhost:3000/api`
- [ ] Endpoint `/rol` existe en Swagger
- [ ] No hay errores de CORS en la consola
- [ ] Los logs muestran "📡 Respuesta del API"
- [ ] La consola muestra "✅ Roles cargados"

---

## 🆘 Si nada funciona

1. **Copia los logs de la consola** del navegador (todo lo que veas)
2. **Copia los logs del backend** de la terminal
3. **Prueba el endpoint directamente**:
   - Abre `http://localhost:3000/rol` en el navegador
   - Copia la respuesta que obtienes
4. **Comparte esta información** para ayudarte mejor

---

## 📝 Información Adicional

### Estructura esperada del endpoint `/rol`

El backend debería devolver algo como:

```json
[
  {
    "id": 1,
    "nombre": "Administrador",
    "descripcion": "Acceso total"
  },
  {
    "id": 2,
    "nombre": "Usuario",
    "descripcion": "Acceso limitado"
  }
]
```

O cualquiera de estos formatos también funciona:

```json
{
  "data": [...]
}
```

```json
{
  "roles": [...]
}
```


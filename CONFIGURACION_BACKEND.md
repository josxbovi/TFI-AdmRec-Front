# Configuración del Backend

## Puertos

El proyecto está configurado para usar los siguientes puertos:

- **Frontend (Vite)**: `http://localhost:5173`
- **Backend (NestJS)**: `http://localhost:3000`

### Cambiar el puerto del frontend

Si necesitas cambiar el puerto del frontend, edita el archivo `vite.config.js`:

```js
export default defineConfig({
  server: {
    port: 5173, // Cambia este número al puerto que desees
    // ...
  }
})
```

## Configurar la URL del API

### Opción 1: Usar la configuración por defecto (Recomendado)

El frontend ya está configurado para conectarse al backend en `http://localhost:3000`. No necesitas hacer nada adicional.

### Opción 2: Usar variable de entorno (Opcional)

Si tu backend corre en otro puerto o URL diferente, puedes crear un archivo `.env` en la raíz del proyecto:

```bash
# Crear archivo .env (Windows)
type nul > .env

# Crear archivo .env (Linux/Mac)
touch .env
```

Luego agregar la siguiente configuración:

```env
# URL del backend API (solo si es diferente a localhost:3000)
VITE_API_URL=http://localhost:3000
```

## ⚠️ Importante

- El archivo `.env` no debe subirse a git (ya está en `.gitignore`)
- Si el backend corre en otro puerto o URL, modifica `VITE_API_URL` según corresponda
- Después de crear o modificar el `.env`, debes reiniciar el servidor de desarrollo:

```bash
npm run dev
```

## Proxy configurado

El frontend tiene un proxy configurado en `vite.config.js` que redirige las peticiones de `/api/*` al backend. Esto evita problemas de CORS durante el desarrollo.

### Cómo funciona el proxy:

- Frontend hace petición a: `http://localhost:5173/api/rol`
- Vite proxy redirige a: `http://localhost:3000/rol`
- El navegador piensa que es la misma origin (sin CORS)

## 🚨 Solución de Problemas CORS

Si ves errores de CORS en la consola del navegador, tienes **dos opciones**:

### Opción 1: Usar el Proxy (Ya configurado) ✅

El proyecto ya está configurado para usar el proxy de Vite. Solo necesitas:

1. **Reiniciar el servidor de desarrollo** después de cualquier cambio en `vite.config.js`:
```bash
# Detener el servidor (Ctrl+C)
# Luego iniciarlo nuevamente:
npm run dev
```

2. Asegurarte que el backend esté corriendo en `http://localhost:3000`

### Opción 2: Habilitar CORS en el Backend (Recomendado para producción)

Si prefieres o necesitas habilitar CORS en el backend, edita el archivo `main.ts` de tu backend NestJS:

```typescript
// main.ts del backend
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS - Opción 1: Permitir solo el frontend
  app.enableCors({
    origin: 'http://localhost:5173', // URL del frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // O Habilitar CORS - Opción 2: Permitir todos los orígenes (solo desarrollo)
  // app.enableCors();

  await app.listen(3000);
  console.log('🚀 Backend corriendo en http://localhost:3000');
}
bootstrap();
```

Después de modificar el backend, reinícialo:
```bash
npm run start:dev
```

### Verificar que funciona:

1. Abre el navegador en `http://localhost:5173`
2. Inicia sesión
3. Ve a **"Nuevo Usuario"**
4. La lista de roles debería cargarse sin errores
5. Abre la consola del navegador (F12) y verifica que no haya errores de CORS

## Módulo de Nuevo Usuario

### Página implementada: ✅ `/usuarios/nuevo`

#### Funcionalidad:
- Formulario para crear un nuevo usuario
- Campos:
  - **Usuario** (user_name): Texto, mínimo 3 caracteres
  - **Contraseña** (password): Texto, mínimo 6 caracteres
  - **Rol** (institucionId): Lista desplegable que carga los roles desde el API

#### Endpoints utilizados:
- `POST /user/crear` - Para crear el usuario
- `GET /rol` - Para cargar la lista de roles

#### Acceso:
1. Desde el menú principal: **"Nuevo Usuario"**
2. Desde el Dashboard: Botón de acceso rápido **"👤 Nuevo Usuario"**

#### Validaciones:
- Todos los campos son obligatorios
- Usuario mínimo 3 caracteres
- Contraseña mínimo 6 caracteres
- Debe seleccionar un rol de la lista

#### Flujo:
1. El usuario accede al formulario
2. Se cargan los roles disponibles desde el backend
3. Completa el formulario
4. Al hacer clic en "Crear Usuario", se envía la petición al backend
5. Si es exitoso, muestra mensaje de confirmación y redirige al Dashboard
6. Si hay error, muestra el mensaje de error sin perder los datos del formulario

## Próximos pasos

Para continuar con el desarrollo, puedes implementar:
- Listado de usuarios existentes
- Editar usuarios
- Eliminar usuarios
- Gestión de roles


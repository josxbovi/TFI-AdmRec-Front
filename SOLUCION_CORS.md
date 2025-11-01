# 🚨 Solución Rápida para Errores CORS

## El Problema

Si ves este error en la consola del navegador:

```
Access to XMLHttpRequest at 'http://localhost:3000/rol' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

## ✅ Solución Rápida (Opción 1 - Proxy)

El frontend **ya está configurado** para usar un proxy. Solo necesitas:

### 1. Reiniciar el frontend:

```bash
# En la terminal del frontend, presiona Ctrl+C para detener
# Luego ejecuta:
npm run dev
```

### 2. Verificar que el backend esté corriendo:

```bash
# En la terminal del backend, verifica que esté corriendo en puerto 3000
# Deberías ver algo como: "Application is running on: http://localhost:3000"
```

## ✅ Solución Alternativa (Opción 2 - Habilitar CORS en Backend)

Si la opción 1 no funciona, habilita CORS en el backend:

### Paso 1: Edita el archivo `main.ts` del backend

Busca el archivo `main.ts` en la raíz de tu backend y agrega `app.enableCors()`:

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⬇️ AGREGA ESTA LÍNEA ⬇️
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
```

### Paso 2: Reinicia el backend

```bash
# Detén el backend (Ctrl+C)
# Luego ejecuta:
npm run start:dev
```

## ✅ Solución Avanzada (Para producción)

Si quieres más control sobre CORS, usa esta configuración:

```typescript
// main.ts del backend
app.enableCors({
  origin: 'http://localhost:5173', // Solo permite el frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization',
});
```

## 🧪 Probar que funciona

1. ✅ Backend corriendo en `http://localhost:3000`
2. ✅ Frontend corriendo en `http://localhost:5173`
3. ✅ Abre el navegador en `http://localhost:5173`
4. ✅ Inicia sesión
5. ✅ Ve a **"Nuevo Usuario"**
6. ✅ Abre la consola del navegador (F12 → Console)
7. ✅ NO deberías ver errores de CORS
8. ✅ La lista de roles debería cargarse correctamente

## 📝 Notas

- **Proxy vs CORS**: El proxy es mejor para desarrollo, CORS es necesario para producción
- **Reiniciar servidores**: Cualquier cambio en configuración requiere reiniciar los servidores
- **Puerto 3000 ocupado**: Si el backend no inicia, verifica que el puerto 3000 no esté ocupado por el frontend anterior

## 🆘 Si nada funciona

1. Detén todos los servidores (frontend y backend)
2. Verifica que el backend use el puerto 3000
3. Verifica que el frontend use el puerto 5173
4. Reinicia ambos servidores
5. Limpia la caché del navegador (Ctrl+Shift+Delete)
6. Recarga la página (Ctrl+F5)
7. Consulta `DIAGNOSTICO_ERRORES.md` para más ayuda

## 📚 Guías Disponibles

- `CONFIGURACION_BACKEND.md` - Configuración general del proyecto
- `SOLUCION_CORS.md` - Solución de problemas CORS (este archivo)
- `DIAGNOSTICO_ERRORES.md` - Diagnóstico de errores específicos


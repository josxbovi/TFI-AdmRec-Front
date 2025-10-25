# TFI - AdmRec Frontend

Aplicación frontend desarrollada con React + Vite para el proyecto TFI de Administración de Recursos.

## 🚀 Tecnologías

- **React 18** - Biblioteca para construir interfaces de usuario
- **Vite** - Build tool y dev server ultra rápido
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para consumir APIs
- **ESLint** - Linter para mantener código limpio

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

## 🏃‍♂️ Ejecución

### Modo desarrollo
```bash
npm run dev
```
La aplicación se abrirá en `http://localhost:3000`

### Build para producción
```bash
npm run build
```

### Preview del build
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas/Vistas de la aplicación
├── services/           # Servicios para comunicación con backend
├── hooks/              # Custom hooks
├── utils/              # Funciones utilitarias
├── context/            # Context API para estado global
├── assets/             # Imágenes, íconos, etc.
├── App.jsx             # Componente principal
└── main.jsx            # Punto de entrada

```

## 🔧 Configuración del Backend

El proxy está configurado en `vite.config.js` para redirigir las peticiones `/api` a tu backend.
Por defecto apunta a `http://localhost:8080`. Modifícalo según tu configuración:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // Cambia esta URL
      changeOrigin: true,
    }
  }
}
```

## 🌐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api
```

Accede a ellas en tu código con `import.meta.env.VITE_API_URL`

## 📝 Notas

- Las rutas del backend deben comenzar con `/api` para que el proxy funcione
- El hot-reload está activado por defecto
- ESLint está configurado para React 18+ con JSX Transform


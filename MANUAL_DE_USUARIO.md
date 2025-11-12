# 📘 Manual de Usuario - Sistema de Administración de Recursos

**Versión:** 1.0  
**Fecha:** Noviembre 2025

---

## 📑 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Inicio de Sesión](#inicio-de-sesión)
3. [Roles y Permisos](#roles-y-permisos)
4. [Dashboard Principal](#dashboard-principal)
5. [Gestión de Clientes](#gestión-de-clientes)
6. [Gestión de Proyectos](#gestión-de-proyectos)
7. [Gestión de Contratos](#gestión-de-contratos)
8. [Gestión de Facturas](#gestión-de-facturas)
9. [Gestión de Usuarios](#gestión-de-usuarios-solo-administrador)
10. [Reportes Ejecutivos](#reportes-ejecutivos-solo-administrador)
11. [Sistema de Alertas](#sistema-de-alertas)
12. [Políticas de Descuentos](#políticas-de-descuentos)
13. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🚀 Introducción

Este sistema permite gestionar de manera integral:
- Clientes y sus datos de contacto
- Proyectos asociados a clientes
- Contratos con seguimiento de vencimientos
- Facturación con generación de PDF
- Reportes ejecutivos
- Sistema de alertas automáticas
- Políticas de descuentos personalizadas

---

## 🔐 Inicio de Sesión

### Acceso al Sistema

1. **URL de acceso:** `http://localhost:5173` (o la URL proporcionada por su administrador)
2. **Credenciales:** Solicite sus credenciales al administrador del sistema
3. **Campos requeridos:**
   - Email
   - Contraseña

### Proceso de Login

1. Ingrese su **email** en el campo correspondiente
2. Ingrese su **contraseña**
3. Haga clic en **"Iniciar Sesión"**
4. El sistema validará sus credenciales y lo redirigirá al Dashboard

### ⚠️ Consideraciones

- Las contraseñas son sensibles a mayúsculas y minúsculas
- Después de 3 intentos fallidos, contacte al administrador
- La sesión expira después de cierto tiempo de inactividad
- No comparta sus credenciales con terceros

---

## 👥 Roles y Permisos

El sistema cuenta con **dos roles principales**:

### 🔧 Usuario Estándar

**Puede acceder a:**
- ✅ Dashboard
- ✅ Gestión de Clientes (ver, crear, editar)
- ✅ Gestión de Proyectos (ver, crear, editar, eliminar)
- ✅ Gestión de Contratos (ver, crear)
- ✅ Gestión de Facturas (ver, crear, descargar PDF)
- ✅ Sistema de Alertas (ver, resolver)

**NO puede acceder a:**
- ❌ Creación de nuevos usuarios
- ❌ Reportes Ejecutivos

### 👑 Administrador

**Acceso completo a:**
- ✅ Todas las funcionalidades de Usuario Estándar
- ✅ **Gestión de Usuarios** (crear, asignar roles)
- ✅ **Reportes Ejecutivos** (facturación, clientes, contratos)
- ✅ Configuración del sistema

---

## 📊 Dashboard Principal

### Información Mostrada

El Dashboard es la pantalla principal después del login y muestra:

1. **Resumen de Estadísticas:**
   - Total de clientes registrados
   - Total de proyectos activos
   - Total de contratos
   - Total de facturas

2. **Tarjetas de Acceso Rápido:**
   - 👥 **Clientes:** Acceso directo a la gestión de clientes
   - 📁 **Proyectos:** Acceso a proyectos
   - 📄 **Contratos:** Gestión de contratos
   - 💰 **Facturas:** Gestión de facturación

3. **Sistema de Alertas:**
   - 🔴 **Urgente:** Contratos vencidos o facturas vencidas (< 7 días)
   - 🟡 **Advertencia:** Contratos próximos a vencer o pagos pendientes (7-30 días)
   - 🔵 **Información:** Otras notificaciones

### Navegación

- Use el **menú lateral izquierdo** para navegar entre módulos
- Use las **tarjetas del dashboard** para acceso rápido
- El **botón de cerrar sesión** está en la esquina superior derecha

---

## 👥 Gestión de Clientes

### Ver Lista de Clientes

**Ruta:** `Clientes` → `Ver Lista`

**Información mostrada:**
- Nombre o razón social
- Email
- Teléfono
- CUIT
- Estado (Activo/Inactivo)
- Descuento aplicado (%)
- Acciones (Ver Detalle)

### Crear Nuevo Cliente

**Ruta:** `Clientes` → `Nuevo Cliente`

**Campos requeridos:**
- ✅ **Nombre/Razón Social:** Nombre completo de la empresa o persona
- ✅ **Email:** Correo electrónico de contacto (debe ser válido)
- ✅ **Teléfono:** Número de contacto
- ✅ **CUIT:** CUIT del cliente (formato: XX-XXXXXXXX-X)
- ✅ **Dirección:** Dirección física del cliente

**Campos opcionales:**
- **Estado:** Activo o Inactivo (por defecto: Activo)
- **Descuento (%):** Descuento permanente para este cliente (0-100%)

**Validaciones:**
- El email debe tener formato válido
- El CUIT debe ser único en el sistema
- El descuento debe estar entre 0 y 100
- Todos los campos obligatorios deben estar completos

**Proceso:**
1. Complete todos los campos requeridos
2. Configure el descuento si aplica (ver sección de Descuentos)
3. Seleccione el estado del cliente
4. Haga clic en **"Guardar Cliente"**
5. El sistema confirmará la creación

### Ver Detalle de Cliente

**Ruta:** `Clientes` → `Ver Detalle` (clic en el botón de una fila)

**Información mostrada:**

1. **Datos del Cliente:**
   - Nombre, Email, Teléfono, CUIT, Dirección, Estado, Descuento
   - Botón **"✏️ Editar"** para modificar datos

2. **Proyectos del Cliente:**
   - Lista de todos los proyectos asociados
   - Acceso a cada proyecto mediante "Ver Detalle"

3. **Contratos del Cliente:**
   - Lista de contratos activos y pasados
   - Estado de cada contrato
   - Montos y fechas de vigencia

4. **Facturas del Cliente:**
   - Historial completo de facturación
   - Estado de pago de cada factura
   - Botones para ver detalles y descargar PDFs

5. **Alertas del Cliente:**
   - Alertas específicas relacionadas con este cliente
   - Clasificadas por prioridad (Urgente, Advertencia, Info)
   - Botón para marcar como resuelta

### Editar Cliente

**Desde:** Detalle de Cliente → **"✏️ Editar"**

**Campos editables:**
- Todos los campos del cliente (excepto ID)
- Descuento se puede modificar en cualquier momento

**Proceso:**
1. Haga clic en **"✏️ Editar"**
2. Modifique los campos necesarios
3. Haga clic en **"💾 Guardar Cambios"**
4. O haga clic en **"✖ Cancelar"** para descartar cambios

**⚠️ Importante:**
- Los cambios en el descuento afectarán futuras facturas y contratos
- No afecta contratos o facturas ya creados
- El CUIT debe seguir siendo único

---

## 📁 Gestión de Proyectos

### Ver Lista de Proyectos

**Ruta:** `Proyectos` → `Ver Lista`

**Información mostrada:**
- Nombre del proyecto
- Cliente asociado
- Estado (Activo/Finalizado/Pendiente)
- Fechas de inicio y fin
- Acciones (Ver Detalle)

### Crear Nuevo Proyecto

**Ruta:** `Proyectos` → `Nuevo Proyecto`

**Campos requeridos:**
- ✅ **Nombre del Proyecto:** Nombre descriptivo
- ✅ **Cliente:** Seleccionar de la lista (búsqueda por CUIT o nombre)
- ✅ **Estado:** Activo, Finalizado o Pendiente
- ✅ **Fecha de Inicio:** Fecha de inicio del proyecto
- ✅ **Fecha de Fin:** Fecha estimada de finalización

**Módulos del Proyecto:**
Seleccione los módulos incluidos en el proyecto:
- ☐ Desarrollo Frontend
- ☐ Desarrollo Backend
- ☐ Base de Datos
- ☐ API REST
- ☐ Autenticación
- ☐ Reportes
- ☐ Dashboard

**Proceso:**
1. Complete el nombre del proyecto
2. Busque y seleccione el cliente (por CUIT o nombre)
3. Seleccione el estado
4. Configure las fechas
5. Marque los módulos que apliquen
6. Haga clic en **"Crear Proyecto"**

### Ver Detalle de Proyecto

**Ruta:** `Proyectos` → `Ver Detalle`

**Información mostrada:**
- Todos los datos del proyecto
- Cliente asociado
- Módulos incluidos

**Acciones disponibles:**
- **✏️ Editar:** Modificar cualquier campo del proyecto
- **🗑️ Borrar:** Eliminar el proyecto (soft delete)

### Editar Proyecto

**Desde:** Detalle de Proyecto → **"✏️ Editar"** (aparece automáticamente)

**Campos editables:**
- Todos los campos excepto Cliente y ID
- Módulos se editan mediante checkboxes

**Proceso:**
1. Los campos están en modo edición por defecto
2. Modifique los campos necesarios
3. Marque/desmarque módulos usando los checkboxes
4. Haga clic en **"💾 Guardar"**
5. O haga clic en **"✖ Cancelar"** para descartar

**⚠️ Importante:**
- No se puede cambiar el cliente asignado
- El borrado es lógico (soft delete), no físico
- Los módulos se guardan como texto en el campo `descripcion`

---

## 📄 Gestión de Contratos

### Ver Lista de Contratos

**Ruta:** `Contratos` → `Ver Lista`

**Información mostrada:**
- Número de contrato
- Cliente
- Monto
- Fechas de vigencia (inicio y fin)
- Estado (Activo/Vencido/Pendiente)
- Acciones (Ver Detalle)

**Estados de Contrato:**
- 🟢 **Activo:** Contrato vigente
- 🔴 **Vencido:** Fecha de fin superada
- 🟡 **Pendiente:** Contrato aún no iniciado

### Crear Nuevo Contrato

**Ruta:** `Contratos` → `Nuevo Contrato`

**Campos requeridos:**
- ✅ **Cliente:** Búsqueda por CUIT (formato: XX-XXXXXXXX-X)
- ✅ **Fecha de Inicio:** Fecha de inicio del contrato
- ✅ **Fecha de Fin:** Fecha de finalización del contrato
- ✅ **Monto Original:** Valor del contrato antes de descuentos
- ✅ **Estado:** Activo, Vencido o Pendiente

**Descuento Automático:**
Si el cliente tiene un descuento configurado, el sistema mostrará:
```
💰 Información del Descuento
─────────────────────────────
Monto Original:     $1,000,000.00
Descuento (20%):    -$200,000.00
─────────────────────────────
Monto Final:        $800,000.00
```

**Generación de Alertas Automáticas:**

El sistema genera alertas automáticamente al crear el contrato:

1. **Alerta de Vencimiento Urgente** (< 7 días):
   - 🔴 Prioridad: Urgente
   - Se genera si la fecha de fin es menor a 7 días

2. **Alerta de Próximo Vencimiento** (7-30 días):
   - 🟡 Prioridad: Advertencia
   - Se genera si la fecha de fin está entre 7 y 30 días

3. **Alerta de Contrato Vencido:**
   - 🔴 Prioridad: Urgente
   - Se genera si la fecha de fin ya pasó

**Proceso:**
1. Ingrese el CUIT del cliente y haga clic en **"🔍 Buscar Cliente"**
2. Verifique los datos del cliente
3. Complete las fechas de vigencia
4. Ingrese el monto original
5. Verifique el cálculo del descuento
6. Seleccione el estado
7. Haga clic en **"Crear Contrato"**

**⚠️ Validaciones:**
- La fecha de fin debe ser posterior a la fecha de inicio
- El monto debe ser mayor a 0
- El CUIT debe corresponder a un cliente existente
- El descuento se aplica automáticamente según el cliente

### Ver Detalle de Contrato

**Ruta:** `Contratos` → `Ver Detalle`

**Información mostrada:**
- Número de contrato
- Cliente asociado
- Fechas de vigencia
- Monto original y final
- Descuento aplicado
- Estado actual
- Fecha de creación
- Última actualización

---

## 💰 Gestión de Facturas

### Ver Lista de Facturas

**Ruta:** `Facturas` → `Ver Lista`

**Información mostrada:**
- Número de factura
- Cliente
- Proyecto asociado
- Monto
- Fecha de emisión
- Estado de pago
- Acciones (Ver Detalle, Descargar PDF)

**Estados de Factura:**
- 🟢 **Pagada:** Factura cancelada
- 🟡 **Pendiente:** Pago pendiente
- 🔴 **Vencida:** Pago vencido
- ⚫ **Anulada:** Factura anulada

### Crear Nueva Factura

**Ruta:** `Facturas` → `Nueva Factura`

**Campos requeridos:**
- ✅ **Cliente:** Búsqueda por CUIT (formato: XX-XXXXXXXX-X)
- ✅ **Proyecto:** Seleccionar de los proyectos del cliente
- ✅ **Fecha de Emisión:** Fecha de la factura
- ✅ **Fecha de Vencimiento:** Fecha límite de pago
- ✅ **Monto Original:** Monto antes de descuentos
- ✅ **Estado de Pago:** Pagada, Pendiente, Vencida o Anulada

**Descuento Automático:**
Similar a los contratos, se aplica automáticamente:
```
💰 Información del Descuento
─────────────────────────────
Monto Original:     $500,000.00
Descuento (20%):    -$100,000.00
─────────────────────────────
Monto Final:        $400,000.00
```

**Generación de Alertas Automáticas:**

1. **Estado: Pendiente**
   - 🟡 Alerta de "Pago Pendiente"
   - Prioridad: Advertencia

2. **Estado: Vencida**
   - 🔴 Alerta de "Pago Vencido"
   - Prioridad: Urgente

**Proceso:**
1. Ingrese el CUIT y busque el cliente
2. Seleccione el proyecto asociado (de la lista del cliente)
3. Configure las fechas de emisión y vencimiento
4. Ingrese el monto original
5. Verifique el cálculo del descuento
6. Seleccione el estado de pago
7. Haga clic en **"Crear Factura"**

**⚠️ Validaciones:**
- La fecha de vencimiento debe ser posterior a la fecha de emisión
- El proyecto debe pertenecer al cliente seleccionado
- El monto debe ser mayor a 0
- El número de factura es generado automáticamente por el backend

### Ver Detalle de Factura

**Ruta:** `Facturas` → `Ver Detalle`

**Información mostrada:**
- Número de factura
- Cliente y sus datos
- Proyecto asociado
- Fechas de emisión y vencimiento
- Monto original, descuento y monto final
- Estado de pago
- Fecha de creación
- Botón **"📥 Descargar PDF"**

### Descargar PDF de Factura

**Desde:** Detalle de Factura → **"📥 Descargar PDF"**

**Proceso:**
1. Haga clic en **"📥 Descargar PDF"**
2. El sistema generará el PDF automáticamente
3. El archivo se descargará con el nombre: `factura_{número}.pdf`

**Contenido del PDF:**
- Datos completos de la factura
- Información del cliente
- Detalle de montos y descuentos
- Fecha de emisión y vencimiento
- Estado de pago

**⚠️ Nota:**
- El PDF se genera en el backend
- Requiere conexión al servidor
- El formato es estándar y no personalizable desde el frontend

---

## 👤 Gestión de Usuarios (Solo Administrador)

### ⚠️ Restricción de Acceso

Esta funcionalidad **solo está disponible para usuarios con rol "Administrador"**.

Los usuarios estándar **no verán** la opción "Nuevo Usuario" en el menú.

### Crear Nuevo Usuario

**Ruta:** `Usuarios` → `Nuevo Usuario` (solo visible para Administradores)

**Campos requeridos:**
- ✅ **Nombre:** Nombre completo del usuario
- ✅ **Email:** Correo electrónico (será el nombre de usuario)
- ✅ **Contraseña:** Contraseña segura
- ✅ **Confirmar Contraseña:** Debe coincidir con la contraseña
- ✅ **Rol:** Seleccionar entre los roles disponibles
  - Usuario
  - Administrador

**Validaciones:**
- El email debe ser único en el sistema
- El email debe tener formato válido
- La contraseña debe tener al menos 6 caracteres (según política del backend)
- Las contraseñas deben coincidir
- Se debe seleccionar un rol

**Proceso:**
1. Complete todos los campos
2. Seleccione el rol apropiado
3. Haga clic en **"Crear Usuario"**
4. El usuario recibirá sus credenciales (según política de la empresa)

**⚠️ Consideraciones de Seguridad:**
- Use contraseñas fuertes
- No comparta credenciales de administrador
- Asigne el rol "Administrador" solo a usuarios de confianza
- Los usuarios pueden cambiar su contraseña después del primer login (si está implementado)

---

## 📈 Reportes Ejecutivos (Solo Administrador)

### ⚠️ Restricción de Acceso

Esta sección **solo está disponible para usuarios con rol "Administrador"**.

Los usuarios estándar **no verán** la opción "Reportes" en el menú.

### Acceso a Reportes

**Ruta:** `Reportes` → `Reportes Ejecutivos`

**Reportes Disponibles:**

1. **📊 Reporte de Facturación**
2. **👥 Reporte de Clientes**
3. **📄 Reporte de Contratos**

### Interfaz de Reportes

**Pestañas superiores:**
- Cada reporte tiene su propia pestaña
- Solo se genera el reporte de la pestaña activa
- Se puede exportar cada reporte a PDF de forma independiente

**Filtros de Fecha:**
```
📅 Filtros
─────────────────────
Fecha Inicio: [selector de fecha]
Fecha Fin:    [selector de fecha]
─────────────────────
[🔍 Generar Reporte]
```

### 1. 📊 Reporte de Facturación

**Datos mostrados:**

**Gráfico:**
- Gráfico de barras con facturación por mes
- Eje X: Meses
- Eje Y: Monto total facturado

**Tabla:**
| Mes | Total Facturado | Cantidad |
|-----|----------------|----------|
| Enero 2025 | $1,500,000.00 | 15 |
| Febrero 2025 | $2,300,000.00 | 23 |

**Métricas destacadas:**
- 💰 **Total facturado:** Suma de todas las facturas
- 📊 **Promedio por factura:** Monto promedio
- 📈 **Facturas emitidas:** Cantidad total

**Filtros aplicables:**
- Rango de fechas (fecha de emisión)
- El reporte se actualiza al hacer clic en "Generar Reporte"

### 2. 👥 Reporte de Clientes

**Datos mostrados:**

**Gráfico:**
- Gráfico de pastel con distribución de clientes por estado
- Segmentos: Activos vs Inactivos

**Tabla:**
| Cliente | Email | Estado | Proyectos | Contratos | Facturas |
|---------|-------|--------|-----------|-----------|----------|
| Jose Bovi | bovi@... | Activo | 3 | 2 | 15 |

**Métricas destacadas:**
- 👥 **Total de clientes:** Cantidad total
- 🟢 **Clientes activos:** Clientes con estado "activo"
- 🔴 **Clientes inactivos:** Clientes con estado "inactivo"

**Filtros aplicables:**
- Rango de fechas (fecha de creación del cliente)

### 3. 📄 Reporte de Contratos

**Datos mostrados:**

**Gráfico:**
- Gráfico de barras con contratos por estado
- Segmentos: Activos, Vencidos, Pendientes

**Tabla:**
| Cliente | Fecha Inicio | Fecha Fin | Monto | Estado |
|---------|--------------|-----------|-------|--------|
| Jose Bovi | 01/01/2025 | 31/12/2025 | $800K | Activo |

**Métricas destacadas:**
- 📄 **Total de contratos:** Cantidad total
- 💰 **Valor total:** Suma de todos los contratos
- 🟢 **Contratos activos:** Cantidad de contratos activos

**Filtros aplicables:**
- Rango de fechas (fecha de inicio del contrato)

### Exportar Reportes a PDF

**Proceso:**
1. Genere el reporte con los filtros deseados
2. Revise los datos y gráficos
3. Haga clic en **"📥 Exportar a PDF"** (debajo del reporte)
4. El sistema generará el PDF
5. El archivo se descargará automáticamente

**Nombre del archivo:**
- `reporte_facturacion_YYYYMMDD.pdf`
- `reporte_clientes_YYYYMMDD.pdf`
- `reporte_contratos_YYYYMMDD.pdf`

**Contenido del PDF:**
- Gráfico del reporte
- Tabla con datos
- Métricas destacadas
- Filtros aplicados
- Fecha de generación

**⚠️ Nota:**
- Los PDF se generan en el frontend usando jsPDF y html2canvas
- La calidad depende del tamaño de la pantalla
- Para mejor resultado, use pantalla completa antes de exportar

---

## 🔔 Sistema de Alertas

### ¿Qué son las Alertas?

Las alertas son notificaciones automáticas que el sistema genera para recordarle:
- Contratos próximos a vencer
- Pagos pendientes
- Facturas vencidas
- Contratos ya vencidos

### Dónde Ver las Alertas

**Ubicaciones:**

1. **Dashboard Principal**
   - Sección "🔔 Alertas Activas"
   - Se muestran todas las alertas del sistema
   - Ordenadas por prioridad y fecha

2. **Detalle de Cliente**
   - Sección "🔔 Alertas del Cliente"
   - Se muestran solo las alertas de ese cliente
   - Incluye alertas de contratos y facturas del cliente

### Tipos de Alertas

**Por Prioridad:**

1. **🔴 Urgente**
   - Contratos que vencen en menos de 7 días
   - Contratos ya vencidos
   - Facturas con estado "Vencida"
   - Fondo rojo (#fee2e2)

2. **🟡 Advertencia**
   - Contratos que vencen entre 7 y 30 días
   - Facturas con estado "Pendiente"
   - Fondo amarillo (#fef3c7)

3. **🔵 Información**
   - Otras notificaciones generales
   - Fondo azul (#dbeafe)

### Cuándo se Generan

**Automáticamente al:**

1. **Crear un Contrato:**
   - Si la fecha de fin es < 7 días → Alerta Urgente
   - Si la fecha de fin es entre 7-30 días → Alerta de Advertencia
   - Si la fecha de fin ya pasó → Alerta de Vencido

2. **Crear una Factura:**
   - Si el estado es "Pendiente" → Alerta de Advertencia
   - Si el estado es "Vencida" → Alerta Urgente

### Marcar Alerta como Resuelta

**Proceso:**
1. Localice la alerta en el Dashboard o Detalle de Cliente
2. Lea el mensaje de la alerta
3. Tome la acción correspondiente (renovar contrato, cobrar factura, etc.)
4. Haga clic en **"✓ Marcar como resuelta"**
5. La alerta desaparecerá inmediatamente

**⚠️ Importante:**
- Marcar como resuelta **elimina permanentemente** la alerta
- Solo debe marcar como resuelta si ya tomó acción
- La alerta no volverá a aparecer automáticamente
- Si necesita un recordatorio, no la resuelva todavía

### Estructura de una Alerta

```
┌─────────────────────────────────────────┐
│ 🔴 URGENTE                               │
├─────────────────────────────────────────┤
│ 📅 Contrato de Jose Bovi vence en 5 días│
│                                          │
│ Contrato #3 - Cliente: Jose Bovi        │
│ CUIT: 20-43161983-1                     │
│ Vencimiento: 19/11/2025                 │
│                                          │
│ 📅 Fecha: 07/11/2025                    │
│                                          │
│ [✓ Marcar como resuelta]                │
└─────────────────────────────────────────┘
```

---

## 🎁 Políticas de Descuentos

### ¿Qué es el Descuento de Cliente?

Es un **descuento permanente** que se configura a nivel de cliente y se aplica **automáticamente** en:
- ✅ Todos los contratos creados para ese cliente
- ✅ Todas las facturas creadas para ese cliente

### Configurar Descuento

**Ubicaciones:**

1. **Al Crear un Cliente:**
   - Campo: **"Descuento (%)"**
   - Rango: 0 a 100
   - Por defecto: 0

2. **Al Editar un Cliente:**
   - Detalle de Cliente → **"✏️ Editar"**
   - Modificar el campo **"Descuento (%)"**
   - Guardar cambios

**Validaciones:**
- Solo acepta valores entre 0 y 100
- Puede incluir decimales (ej: 15.5%)
- Si intenta ingresar un valor negativo, se ajusta a 0
- Si intenta ingresar más de 100, se ajusta a 100

### Aplicación Automática

**En Contratos:**
```
Cliente: Jose Bovi
Descuento configurado: 20%

Monto Original:     $1,000,000.00
Descuento (20%):    -$200,000.00
─────────────────────────────────
Monto Final:        $800,000.00  ← Este se guarda en el backend
```

**En Facturas:**
```
Cliente: Jose Bovi
Descuento configurado: 20%

Monto Original:     $500,000.00
Descuento (20%):    -$100,000.00
─────────────────────────────────
Monto Final:        $400,000.00  ← Este se guarda en el backend
```

### ⚠️ Consideraciones Importantes

1. **Aplicación Futura:**
   - El descuento solo afecta contratos y facturas **nuevos**
   - No modifica contratos o facturas ya creados
   - Si cambia el descuento, aplica desde la próxima creación

2. **Transparencia:**
   - El sistema siempre muestra el cálculo completo
   - Se visualiza: monto original, descuento y monto final
   - El backend recibe el monto ya con descuento aplicado

3. **Casos Especiales:**
   - Descuento 0%: No se aplica ningún descuento
   - Descuento 100%: El monto final será $0 (gratis)
   - Descuento debe estar justificado según políticas de la empresa

### Ejemplo Completo

**Escenario:**
1. Cliente "ABC Corp" tiene 15% de descuento
2. Creo un contrato de $2,000,000

**El sistema calcula:**
- Monto Original: $2,000,000.00
- Descuento (15%): -$300,000.00
- Monto Final: $1,700,000.00

**Se envía al backend:** `{ monto: 1700000 }`

**Si luego cambio el descuento a 20%:**
- El contrato de $2M sigue siendo $1.7M (no cambia)
- Nuevos contratos tendrán 20% de descuento

---

## ❓ Preguntas Frecuentes

### Generales

**P: ¿Cómo recupero mi contraseña?**  
R: Contacte al administrador del sistema para que restablezca su contraseña.

**P: ¿Por qué me redirige al login al navegar?**  
R: Su sesión puede haber expirado. Vuelva a iniciar sesión.

**P: ¿Puedo tener múltiples sesiones abiertas?**  
R: Sí, puede tener el sistema abierto en múltiples pestañas o dispositivos.

### Clientes

**P: ¿Puedo eliminar un cliente?**  
R: Actualmente no hay función de eliminación. Puede marcar el cliente como "Inactivo".

**P: ¿El CUIT puede repetirse?**  
R: No, el CUIT debe ser único para cada cliente.

**P: ¿Cómo busco un cliente rápidamente?**  
R: Use el campo de búsqueda por CUIT en los formularios de contratos y facturas.

### Proyectos

**P: ¿Puedo cambiar el cliente de un proyecto?**  
R: No, el cliente no se puede modificar después de crear el proyecto.

**P: ¿Qué significa "soft delete"?**  
R: El proyecto se marca como eliminado pero no se borra físicamente de la base de datos.

**P: ¿Qué son los módulos del proyecto?**  
R: Son componentes o funcionalidades incluidas en el proyecto (Frontend, Backend, etc.).

### Contratos

**P: ¿El sistema calcula automáticamente si un contrato está vencido?**  
R: Sí, el estado se puede actualizar según la fecha actual (según lógica del backend).

**P: ¿Puedo editar un contrato después de crearlo?**  
R: Actualmente no hay función de edición de contratos. Consulte con su administrador.

**P: ¿Las alertas de vencimiento se generan automáticamente?**  
R: Sí, al crear el contrato, el sistema genera alertas según las fechas.

### Facturas

**P: ¿Quién asigna el número de factura?**  
R: El backend asigna automáticamente un número secuencial.

**P: ¿Puedo editar una factura después de crearla?**  
R: Actualmente no hay función de edición. Puede anular la factura y crear una nueva.

**P: ¿El PDF tiene el formato oficial de mi empresa?**  
R: El PDF es un formato estándar. Consulte con su administrador para personalizaciones.

**P: ¿Cómo se calcula el estado "Vencida"?**  
R: Lo asigna el usuario al crear/editar. El sistema genera alerta si es "Vencida".

### Descuentos

**P: ¿El descuento afecta facturas ya emitidas?**  
R: No, solo afecta nuevas facturas y contratos.

**P: ¿Puedo tener descuentos diferentes por producto/servicio?**  
R: No, el descuento es por cliente y se aplica a todo.

**P: ¿Quién autoriza los descuentos?**  
R: Cualquier usuario puede configurarlo, pero debe seguir las políticas internas de la empresa.

### Alertas

**P: ¿Las alertas se envían por email?**  
R: No, solo aparecen en el Dashboard y Detalle de Cliente.

**P: ¿Puedo configurar cuándo se generan alertas?**  
R: No, los umbrales están fijos (7 días y 30 días).

**P: ¿Las alertas se regeneran automáticamente?**  
R: No, si marca como resuelta, desaparece permanentemente.

**P: ¿Todos los usuarios ven las mismas alertas?**  
R: Sí, todas las alertas son visibles para todos los usuarios.

### Reportes (Administrador)

**P: ¿Puedo programar reportes automáticos?**  
R: No, debe generarlos manualmente cuando los necesite.

**P: ¿Los reportes se guardan en el sistema?**  
R: No, debe exportarlos a PDF si desea conservarlos.

**P: ¿Puedo personalizar los gráficos?**  
R: No, los gráficos tienen un formato predefinido.

**P: ¿Los reportes incluyen datos en tiempo real?**  
R: Sí, se generan con los datos actuales de la base de datos.

### Usuarios (Administrador)

**P: ¿Puedo cambiar el rol de un usuario existente?**  
R: Actualmente no hay función de edición de usuarios. Consulte con su administrador de sistema.

**P: ¿Cómo elimino un usuario?**  
R: Actualmente no hay función de eliminación desde el frontend. Consulte con su administrador de sistema.

**P: ¿Los usuarios pueden cambiar su propia contraseña?**  
R: Debe verificar si esta funcionalidad está implementada en "Mi Perfil" o similar.

---

## 🆘 Soporte Técnico

### Problemas Comunes y Soluciones

**Problema: No puedo iniciar sesión**
- ✅ Verifique que el email y contraseña sean correctos
- ✅ Verifique que no haya espacios extras
- ✅ Intente restablecer su contraseña con el administrador

**Problema: No veo la opción "Nuevo Usuario"**
- ✅ Solo los Administradores tienen acceso a esta función
- ✅ Verifique su rol con el administrador

**Problema: No veo la opción "Reportes"**
- ✅ Solo los Administradores tienen acceso a reportes
- ✅ Verifique su rol con el administrador

**Problema: El PDF no se descarga**
- ✅ Verifique que no esté bloqueando descargas en el navegador
- ✅ Verifique que el backend esté funcionando
- ✅ Revise la consola del navegador (F12) para errores

**Problema: No aparecen los clientes**
- ✅ Verifique que haya clientes creados
- ✅ Recargue la página (F5)
- ✅ Verifique la conexión con el backend

**Problema: Las alertas no desaparecen al resolverlas**
- ✅ Recargue la página (F5)
- ✅ Verifique la consola del navegador para errores
- ✅ Verifique la conexión con el backend

### Contacto

Para soporte adicional, contacte a:
- **Administrador del Sistema:** [Insertar contacto]
- **Soporte Técnico:** [Insertar contacto]
- **Email:** [Insertar email]

---

## 📝 Notas Finales

### Buenas Prácticas

1. **Cierre sesión** al terminar de usar el sistema
2. **No comparta** sus credenciales con nadie
3. **Verifique dos veces** antes de crear contratos o facturas
4. **Resuelva alertas** solo cuando haya tomado acción
5. **Configure descuentos** según políticas de la empresa
6. **Revise periódicamente** el Dashboard para ver alertas
7. **Use CUIT correcto** para buscar clientes
8. **Exporte reportes** regularmente para respaldo

### Limitaciones Conocidas

- No se pueden editar contratos después de crearlos
- No se pueden editar facturas después de crearlas
- No hay edición de usuarios desde el frontend
- No hay eliminación de clientes (solo inactivar)
- Los reportes no se guardan automáticamente
- Las alertas no se envían por email
- El número de factura no es editable

### Actualizaciones Futuras Posibles

- Edición de contratos y facturas
- Gestión completa de usuarios
- Notificaciones por email
- Reportes programados
- Personalización de alertas
- Dashboard personalizable
- Exportación a Excel
- Historial de cambios

---

**Fin del Manual de Usuario**

*Versión 1.0 - Noviembre 2025*  
*Este manual está sujeto a cambios según actualizaciones del sistema*



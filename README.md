# TaskFlow - Aplicación de Gestión de Tareas en React

Aplicación web frontend desarrollada en **React 18 + TypeScript + Vite + Tailwind CSS**, replicando con fidelidad las 4 vistas del diseño TaskFlow:

1. **Hoy (Dashboard)**: Progreso circular diario, selector horizontal de calendario semanal, filtros rápidos (Todas, Prioritarias, Trabajo, Personal), lista de tareas que vencen pronto con subtareas y barra de progreso, sección colapsable de tareas completadas y barra de entrada rápida inferior.
2. **Proyectos**: Resumen de espacios activos, tarjetas de colecciones con avatares de equipo y barras de progreso por proyecto, botón para crear proyectos y nube de etiquetas rápidas (`#urgente`, `#reunión`, `#bug`, etc.).
3. **Nueva Tarea**: Formulario completo para registrar tareas con título, descripción, selector de categorías por chips (`Trabajo`, `UX Design`, `Finanzas`, `Personal`), selectores de fecha y hora, selector de nivel de prioridad (`Baja`, `Media`, `Alta`), gestor interactivo de subtareas con checkboxes y eliminación, toggle switch de recordatorios activos y tarjeta de adjuntos.
4. **Rendimiento**: Vista de analítica semanal/mensual/histórica con cuadrícula 2x2 de métricas clave (Completadas, Tasa de Éxito con sparkline, Horas de Enfoque/Pomodoros, Puntualidad), gráfico interactivo de barras de productividad diaria con badge de día pico (Martes), barra segmentada de distribución por categorías, lista de logros desbloqueados y botón de exportación de reporte.

---

## 🚀 Cómo Ejecutar el Proyecto

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

3. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## 🔌 Preparado para Consumir tu Backend

El proyecto está diseñado desde cero con una arquitectura desacoplada para que puedas conectar tu API REST cuando la crees:

- **Cliente HTTP Centralizado**: `src/api/client.ts` con Axios, soporte de interceptores para tokens JWT (`Authorization: Bearer <token>`) y manejo de errores de red.
- **Catálogo de Endpoints**: `src/api/endpoints.ts` con todas las rutas estandarizadas (`/tasks`, `/projects`, `/metrics`, etc.).
- **Capa de Servicios**:
  - `src/services/taskService.ts`
  - `src/services/projectService.ts`
  - `src/services/metricsService.ts`
- **Fallback Automático**: Si el backend aún no está encendido o configuras `VITE_USE_MOCK=true`, la aplicación funciona al 100% con persistencia en `localStorage`, permitiéndote probar la interfaz, crear tareas, marcar subtareas y alternar vistas sin interrupciones.

### Variables de Entorno (`.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK=false
```

Para ver la especificación completa de contratos y payloads JSON, consulta [src/api/README.md](src/api/README.md).

---

## 📁 Estructura del Proyecto

```
ProyectoTareas/
├── .env                  # Variables de entorno locales
├── .env.example          # Plantilla de variables de entorno
├── .gitignore            # Archivos ignorados por Git
├── index.html            # Entry point con fuentes Google (Plus Jakarta Sans)
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración TypeScript para React + JSX
├── vite.config.ts        # Configuración Vite con React y Tailwind CSS
└── src/
    ├── api/
    │   ├── client.ts     # Instancia Axios con interceptores
    │   ├── endpoints.ts  # Rutas de endpoints de la API
    │   └── README.md     # Guía detallada del contrato del backend
    ├── services/         # Llamadas asíncronas para tareas, proyectos y métricas
    ├── types/            # Interfaces TypeScript (Task, Project, Metrics, etc.)
    ├── data/             # Datos iniciales mock exactos a las capturas
    ├── context/          # AppContext para estado global y acciones
    ├── components/
    │   ├── common/       # Header, BottomNav, CircularProgress
    │   └── views/        # TodayView, ProjectsView, NewTaskView, PerformanceView
    ├── App.tsx           # Contenedor principal responsive
    ├── main.tsx          # Render inicial de React
    └── index.css         # Estilos globales y Tailwind CSS
```

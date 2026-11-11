# Guía de Conexión con el Backend (API Contract)

Este frontend está preparado mediante una capa de servicios desacoplada (`src/services/` y `src/api/client.ts`). Cuando desarrolles tu backend (en Node/Express, NestJS, Python FastAPI, Spring Boot, Go, etc.), solo necesitas implementar estos endpoints.

## Configuración de Entorno

En el archivo `.env` del frontend:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_USE_MOCK=false
```
> Si el backend aún no está iniciado o `VITE_USE_MOCK=true`, la aplicación usa automáticamente almacenamiento persistente local (`localStorage`) para que puedas usar todas las pantallas sin que se rompa.

---

## 1. Endpoints de Tareas (`/api/tasks`)

### `GET /api/tasks`
Retorna la lista de todas las tareas.
**Respuesta (200 OK):**
```json
[
  {
    "id": "1",
    "title": "Revisión final de propuesta de diseño",
    "description": "Revisar prototipos de alta fidelidad...",
    "category": "Trabajo",
    "priority": "Alta",
    "dueDate": "Hoy, 24 Oct",
    "dueTime": "11:30 AM",
    "completed": false,
    "completedAt": null,
    "isVideoCall": false,
    "reminderActive": true,
    "reminderText": "15 min antes de la hora fijada",
    "subtasks": [
      { "id": "s1", "title": "Revisar paleta de colores accesibles", "completed": true }
    ],
    "attachments": [
      { "name": "Propuesta_Final_v3.fig", "size": "24.5 MB" }
    ]
  }
]
```

### `POST /api/tasks`
Crea una nueva tarea.
**Body:**
```json
{
  "title": "Nueva reunión",
  "description": "Detalles...",
  "category": "Trabajo",
  "priority": "Alta",
  "dueDate": "Hoy, 24 Oct",
  "dueTime": "03:30 PM",
  "reminderActive": true,
  "subtasks": []
}
```

### `PATCH /api/tasks/:id/toggle`
Alterna el estado completado de una tarea.
**Body:**
```json
{
  "completed": true,
  "completedAt": "09:15 AM"
}
```

### `DELETE /api/tasks/:id`
Elimina una tarea por ID.

---

## 2. Endpoints de Proyectos (`/api/projects`)

### `GET /api/projects`
Retorna las colecciones y espacios de proyectos.
**Respuesta (200 OK):**
```json
[
  {
    "id": "p1",
    "title": "Diseño de Producto",
    "badgeText": "PRIORIDAD ALTA",
    "badgeVariant": "urgent",
    "activeTasksCount": 12,
    "progressPercentage": 75,
    "color": "#6366f1",
    "icon": "palette",
    "members": [
      { "id": "m1", "name": "Ana", "avatar": "url..." }
    ]
  }
]
```

### `POST /api/projects`
Crea un nuevo proyecto o colección.

---

## 3. Endpoints de Métricas (`/api/metrics/weekly`)

### `GET /api/metrics/weekly`
Retorna las estadísticas del dashboard de rendimiento.
**Respuesta:**
```json
{
  "completedCount": 38,
  "completedChange": "+12% vs prev.",
  "successRate": 92,
  "focusHours": 18.5,
  "pomodoros": 37,
  "punctualityRate": 95,
  "punctualityOnTime": 36,
  "dailyProductivity": [
    { "day": "Lun", "count": 5 },
    { "day": "Mar", "count": 8, "isPeak": true }
  ],
  "categoryDistribution": [
    { "name": "Trabajo", "tasksCount": 21, "percentage": 55, "color": "#4f46e5" }
  ]
}
```


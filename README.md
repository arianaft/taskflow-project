# TaskFlow – TravelDream ✈️

Pequeña aplicación web para **planificar viajes** y gestionar una **lista de tareas**, desarrollada con **HTML**, **Tailwind CSS** y **JavaScript vanilla**. Me sirve como proyecto de práctica para buenas prácticas de JS, separación de capas y uso de `localStorage`.


## Funcionalidades

- **Destinos**: tarjetas de París, Bali y Tokio con badges (`.badge`) y botones (`.btn-primary`).
- **Tareas de viaje**:
  - Añadir tareas con validación (no vacías, longitud máxima).
  - Marcar tareas como completadas.
  - Editar el texto de una tarea.
  - Eliminar tareas individuales o todas las completadas.
- **Filtros y ordenación**:
  - Filtro por estado: todas / pendientes / completadas.
  - Búsqueda por texto.
  - Ordenar por: más recientes, más antiguas, alfabético A‑Z.
- **Persistencia**: todas las tareas se guardan en `localStorage`.
- **Modo oscuro**: toggle en el header, persistente entre sesiones.

## Estructura

- `index.html`: estructura principal, secciones de destinos y bloque de tareas (formulario, búsqueda, filtros, lista, contadores).
- `input.css`: configuración de Tailwind + componentes con `@apply` (`.card`, `.badge`, `.btn-primary`).
- `style.css`: CSS generado por Tailwind.
- `tasks.js`: módulo `TaskStore` (estado y persistencia):
  - `loadFromStorage`, `getTasks`, `addTask`, `deleteTask`, `toggleTaskCompleted`,
  - `filterCompletedTasks`, `updateTaskText`, `clearCompleted`.
- `tasks-ui.js`: capa de UI (DOM + eventos) para tareas:
  - render de la lista, mensaje vacío, contador, filtros, ordenación, edición, eliminar completadas.
- `theme.js`: gestión del modo oscuro (aplica clase `dark` y guarda preferencia).

## Uso rápido

1. Abre `index.html` en el navegador.
2. En **“Planifica tu viaje”**:
   - Escribe una tarea (ej: `Reservar hotel en París`) y pulsa **“Añadir”**.
   - Haz clic en el texto para marcarla como completada.
   - Usa el buscador y los selectores de **Estado** y **Ordenar por** para filtrar/ordenar.
   - Usa **“Eliminar completadas”** para limpiar las tareas hechas.

## Arquitectura

- Frontend: HTML, CSS, JS
- Backend: Node.js + Express
- API REST: /api/v1/tasks

## Endpoints

GET /tasks  
POST /tasks  
DELETE /tasks/:id  

## Tecnologías

- Express
- Fetch API
- CORS
- Nodemon
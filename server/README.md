# 🖥️ TaskFlow — Documentación técnica del servidor

Documentación técnica del backend de **TaskFlow**, centrada en su arquitectura, flujo de peticiones, modelo de datos y diseño de la API REST.

---

## Tabla de contenidos

1. [Infraestructura del servidor](#1-infraestructura-del-servidor)
2. [Arquitectura por capas](#2-arquitectura-por-capas)
3. [Middlewares](#3-middlewares)
4. [Modelo de datos](#4-modelo-de-datos)
5. [API REST](#5-api-rest)
6. [Capa de red del frontend](#6-capa-de-red-del-frontend)
7. [Validación y manejo de errores](#7-validación-y-manejo-de-errores)
8. [Persistencia actual](#8-persistencia-actual)
9. [Pruebas y despliegue](#9-pruebas-y-despliegue)

---

## 1. Infraestructura del servidor

### Estructura de carpetas

```
server/
├── .env
├── package.json
└── src/
    ├── index.js
    ├── config/
    │   ├── env.js
    │   └── swagger.js
    ├── controllers/
    │   └── task.controller.js
    ├── routes/
    │   └── task.routes.js
    └── services/
        └── task.service.js
```

### Objetivo de la estructura

El backend se organiza para separar claramente responsabilidades y evitar mezclar en un mismo archivo la definición de rutas, la validación de datos y la lógica de negocio.

- **`src/routes/`** — definición de endpoints HTTP
- **`src/controllers/`** — coordinación entre petición y respuesta
- **`src/services/`** — lógica de negocio pura
- **`src/config/`** — configuración del entorno y herramientas externas

---

## 2. Arquitectura por capas

El backend sigue una arquitectura por capas estricta y unidireccional:

```
Cliente HTTP
    ↓
Routes       → mapea URL + verbo al controlador correcto
    ↓
Controllers  → extrae datos de req, valida, llama al servicio, devuelve res
    ↓
Services     → lógica de negocio pura, sin conocimiento de HTTP
```

### Routes

La capa de rutas define los endpoints y conecta cada uno con su controlador. No implementa ninguna lógica de negocio.

Endpoints disponibles:
- `GET    /api/v1/tasks`
- `POST   /api/v1/tasks`
- `DELETE /api/v1/tasks/:id`
- `PATCH  /api/v1/tasks/:id/toggle`

### Controllers

Los controladores:
- leen `req.params` y `req.body`
- validan los datos de entrada
- llaman a la capa de servicios
- construyen la respuesta HTTP con el código de estado correcto

### Services

La capa de servicios concentra la lógica de negocio pura. No depende de `req` ni de `res`, lo que evita acoplar la lógica funcional a Express y facilita el testeo unitario.

---

## 3. Middlewares

Los middlewares son funciones que se ejecutan durante el ciclo de vida de una petición HTTP, antes de llegar al controlador final.

### `cors()`
Permite que el navegador realice peticiones al backend desde un origen distinto. Fue necesario durante el desarrollo cuando frontend y backend corrían en puertos separados (ej. `localhost:5500` y `localhost:3000`).

### `express.json()`
Parsea el cuerpo de las peticiones en formato JSON y lo expone en `req.body`. Sin este middleware el backend no puede leer los datos enviados en peticiones `POST` o `PATCH`.

### `loggerAcademico` (middleware personalizado)
Registra en consola cada petición con su método HTTP, ruta, código de estado y duración:

```
[GET] /api/v1/tasks - Estado: 200 (3.21ms)
[POST] /api/v1/tasks - Estado: 201 (1.84ms)
[DELETE] /api/v1/tasks/1774523000000 - Estado: 204 (0.97ms)
```

Implementación:
```js
const loggerAcademico = (req, res, next) => {
  const inicio = performance.now();
  res.on('finish', () => {
    const duracion = performance.now() - inicio;
    console.log(`[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion.toFixed(2)}ms)`);
  });
  next();
};
```

### Middleware global de errores
Middleware final de 4 parámetros que captura cualquier error no controlado:
- Si el error es `NOT_FOUND` → responde `404`
- Cualquier otro error → responde `500` con mensaje genérico

```js
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});
```

### Orden de aplicación de middlewares

```
1. cors()
2. express.json()
3. loggerAcademico
4. rutas de la API (/api/v1/tasks)
5. middleware global de errores
```

Este orden garantiza que las peticiones entran correctamente, el cuerpo JSON está disponible al llegar al controlador, cada petición queda registrada y los errores quedan capturados al final del ciclo.

---

## 4. Modelo de datos

La entidad principal del backend es la **tarea**.

### Estructura de una tarea

```json
{
  "id": "1774523125474",
  "text": "Reservar hotel",
  "completed": false
}
```

### Campos del modelo

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador único generado con `Date.now().toString()` |
| `text` | string | Texto descriptivo de la tarea (mínimo 3 caracteres) |
| `completed` | boolean | Estado de completado (`false` por defecto) |

### Decisiones de diseño

- El `id` se genera automáticamente en el servidor usando el timestamp actual, garantizando unicidad sin necesidad de una base de datos.
- `completed` se modela como booleano para simplificar la lógica del toggle.
- El frontend y el backend comparten la misma estructura de tarea, lo que elimina transformaciones innecesarias en ambos lados.

---

## 5. API REST

La API sigue un enfoque REST, utilizando cada verbo HTTP según su finalidad semántica sobre el recurso `tasks`.

### Base URL

- **Local**: `http://localhost:3000/api/v1/tasks`
- **Producción**: `https://taskflow-project-arianafts-projects.vercel.app/api/v1/tasks`

---

### `GET /api/v1/tasks`

Devuelve la lista completa de tareas.

**Respuesta `200 OK`:**
```json
[
  { "id": "1774523000000", "text": "Reservar hotel", "completed": false },
  { "id": "1774523111111", "text": "Comprar maleta", "completed": true }
]
```

Si no hay tareas:
```json
[]
```

---

### `POST /api/v1/tasks`

Crea una nueva tarea.

**Body requerido:**
```json
{ "text": "Reservar hotel" }
```

**Respuesta `201 Created`:**
```json
{ "id": "1774523000000", "text": "Reservar hotel", "completed": false }
```

**Error `400 Bad Request`** si el texto tiene menos de 3 caracteres:
```json
{ "error": "El texto debe tener al menos 3 caracteres" }
```

---

### `DELETE /api/v1/tasks/:id`

Elimina una tarea por su ID.

**Respuesta `204 No Content`** — sin cuerpo de respuesta.

**Error `404 Not Found`** si el ID no existe:
```json
{ "error": "Tarea no encontrada" }
```

---

### `PATCH /api/v1/tasks/:id/toggle`

Alterna el estado `completed` de una tarea.

- Si estaba `false` → pasa a `true`
- Si estaba `true` → pasa a `false`

**Respuesta `200 OK`:**
```json
{ "id": "1774523000000", "text": "Reservar hotel", "completed": true }
```

**Error `404 Not Found`** si el ID no existe:
```json
{ "error": "Tarea no encontrada" }
```

---

### Códigos HTTP utilizados

| Código | Significado | Uso en TaskFlow |
|---|---|---|
| `200` | OK | Lectura o toggle correcto |
| `201` | Created | Tarea creada correctamente |
| `204` | No Content | Tarea eliminada correctamente |
| `400` | Bad Request | Datos inválidos en el body |
| `404` | Not Found | Tarea no encontrada por ID |
| `500` | Internal Server Error | Error inesperado del servidor |

---

## 6. Capa de red del frontend

La comunicación entre frontend y backend se centraliza en:

```
network/client.js
```

### Funciones implementadas

| Función | Método HTTP | Endpoint |
|---|---|---|
| `getTasks()` | GET | `/api/v1/tasks` |
| `createTask(text)` | POST | `/api/v1/tasks` |
| `deleteTask(id)` | DELETE | `/api/v1/tasks/:id` |
| `toggleTask(id)` | PATCH | `/api/v1/tasks/:id/toggle` |

### Detección automática del entorno

```js
const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:3000/api/v1/tasks"
  : "/api/v1/tasks";
```

En local apunta al servidor Express directamente. En producción usa rutas relativas que Vercel redirige al backend.

### Gestión de errores de red

Todas las funciones usan un helper `handleResponse` que:
- lanza un error con mensaje legible si la respuesta no es 2xx
- maneja el caso `204 No Content` (sin cuerpo de respuesta)
- extrae el mensaje de error del JSON del servidor cuando existe

---

## 7. Validación y manejo de errores

### Validaciones en el controlador

Antes de llamar al servicio, el controlador verifica que los datos sean correctos:

```js
if (!text || typeof text !== "string" || text.trim().length < 3) {
  return res.status(400).json({
    error: "El texto debe tener al menos 3 caracteres"
  });
}
```

### Errores en el servicio

Cuando se intenta operar sobre una tarea que no existe, el servicio lanza un error estándar:

```js
throw new Error('NOT_FOUND');
```

El middleware global de errores lo intercepta y responde con `404`.

### Principio de seguridad

El servidor nunca expone detalles técnicos internos al cliente. Los errores inesperados devuelven únicamente:
```json
{ "error": "Error interno del servidor" }
```

---

## 8. Persistencia actual

Actualmente TaskFlow utiliza un **array en memoria** como mecanismo de almacenamiento temporal.

```js
let tasks = []; // en task.service.js
```

### Implicaciones técnicas

- Las tareas existen mientras el proceso del servidor siga activo.
- Al reiniciar el proceso, las tareas se pierden.
- En entornos serverless como Vercel, cada petición puede ejecutarse en una instancia nueva, por lo que los datos no se comparten entre peticiones.
- No existe sincronización entre múltiples instancias del servidor.

### Solución futura

Para persistencia real sería necesario integrar una base de datos externa como **Vercel KV** (Redis), **MongoDB Atlas** o similar, que permita almacenar y recuperar tareas entre peticiones independientemente de qué instancia las procese.

---

## 9. Pruebas y despliegue

### Pruebas con Thunder Client

Se utilizó **Thunder Client** (extensión de VS Code) para verificar el comportamiento de cada endpoint, incluyendo casos de error intencionados.

#### Casos probados

| Caso | Método | Endpoint | Resultado esperado |
|---|---|---|---|
| Listar tareas vacías | GET | `/api/v1/tasks` | `200 []` |
| Crear tarea válida | POST | `/api/v1/tasks` | `201 { tarea }` |
| Crear sin texto | POST | `/api/v1/tasks` body: `{}` | `400 error` |
| Crear texto corto | POST | `/api/v1/tasks` body: `{"text":"ab"}` | `400 error` |
| Toggle tarea | PATCH | `/api/v1/tasks/:id/toggle` | `200 { tarea }` |
| Toggle ID inexistente | PATCH | `/api/v1/tasks/999/toggle` | `404 error` |
| Eliminar tarea | DELETE | `/api/v1/tasks/:id` | `204` |
| Eliminar ID inexistente | DELETE | `/api/v1/tasks/999` | `404 error` |

### Despliegue en Vercel

El proyecto se despliega en Vercel conectando el repositorio de GitHub. El archivo `vercel.json` configura el enrutamiento para que las peticiones a `/api/*` lleguen al servidor Express:

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/index.js" }
  ]
}
```

El archivo `api/index.js` actúa como punto de entrada de Vercel e importa el servidor Express:

```js
const app = require('../server/src/index.js');
module.exports = app;
```

### URLs de producción

| Recurso | URL |
|---|---|
| Frontend | `/index.html` |
| API base | `/api/v1/tasks` |
| Swagger UI | `/api/docs` |

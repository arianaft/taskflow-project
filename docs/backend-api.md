# Herramientas del ecosistema backend

## Axios

Axios es una librería HTTP para JavaScript disponible tanto en el navegador como en Node.js. 
A diferencia de `fetch`, incluye funcionalidades extra sin configuración adicional.

**¿Por qué se usa?**
- Convierte automáticamente las respuestas a JSON sin necesidad de llamar a `.json()`
- Permite interceptores globales para añadir tokens de autenticación en cada petición
- Maneja errores HTTP automáticamente (fetch no lanza error en respuestas 4xx/5xx)
- Compatible con Node.js sin polyfills adicionales

**Ejemplo:**
```js
const { data } = await axios.get('http://localhost:3000/api/v1/tasks');
console.log(data); // array de tareas, ya parseado

await axios.post('http://localhost:3000/api/v1/tasks', { text: 'Reservar hotel' });
```

---

## Postman / Thunder Client

Herramientas gráficas para probar APIs REST sin necesidad de escribir código ni tener 
un frontend. Permiten enviar peticiones HTTP y ver las respuestas de forma visual.

**¿Por qué se usan?**
- Verificar que los endpoints responden correctamente antes de conectar el frontend
- Forzar errores intencionados (400, 404, 500) para comprobar el manejo de excepciones
- Guardar colecciones de peticiones reutilizables y compartibles con el equipo
- Thunder Client funciona directamente dentro de VSCode sin instalar nada externo

**Pruebas realizadas en TaskFlow:**

| Petición | Resultado esperado |
|---|---|
| GET /api/v1/tasks | 200 OK — lista de tareas |
| POST sin body | 400 Bad Request |
| POST con texto corto | 400 Bad Request |
| DELETE con id inexistente | 404 Not Found |
| PATCH toggle con id inexistente | 404 Not Found |
| GET con error simulado | 500 Internal Server Error |

---

## Swagger 

Swagger es un conjunto de herramientas construido sobre la especificación OpenAPI que 
permite documentar APIs REST de forma interactiva. La documentación se genera 
automáticamente a partir de comentarios JSDoc en el código.

**¿Por qué se usa?**
- La documentación siempre está sincronizada con el código real
- Permite probar los endpoints directamente desde el navegador
- Sirve como contrato entre el equipo frontend y backend
- Facilita la incorporación de nuevos desarrolladores al proyecto

**En TaskFlow:**
Disponible en `http://localhost:3000/api/docs` con los 4 endpoints documentados:
- `GET /api/v1/tasks` — obtener todas las tareas
- `POST /api/v1/tasks` — crear una tarea
- `DELETE /api/v1/tasks/:id` — eliminar una tarea
- `PATCH /api/v1/tasks/:id/toggle` — alternar estado completado

---

## Sentry

Sentry es una plataforma de monitorización de errores en tiempo real. Captura 
automáticamente las excepciones que ocurren en producción y las agrupa, prioriza 
y notifica al equipo de desarrollo.

**¿Por qué se usa?**
- Los errores en producción se registran sin que el usuario tenga que reportarlos
- Cada error incluye el stack trace completo, la URL y el historial de acciones del usuario
- Envía alertas por correo o Slack cuando aparece un error nuevo
- Mide tiempos de respuesta y detecta cuellos de botella en la API

**Integración básica en Express:**
```js
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'https://<tu-dsn>@sentry.io/<proyecto>' });

app.use(Sentry.Handlers.requestHandler());
app.use('/api/v1/tasks', taskRoutes);
app.use(Sentry.Handlers.errorHandler());
```
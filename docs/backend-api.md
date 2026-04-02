# 🛠️ Herramientas del backend — ¿Qué son y para qué sirven?

Este documento explica las herramientas más utilizadas en el desarrollo y mantenimiento de APIs backend con Node.js y Express.

---

## Axios

### ¿Qué es?
Axios es una librería JavaScript para realizar peticiones HTTP tanto desde el navegador como desde Node.js. Es una alternativa más completa a la API nativa `fetch`.

### ¿Para qué sirve?
- Hacer peticiones GET, POST, PUT, PATCH, DELETE a una API REST
- Interceptar peticiones y respuestas para añadir cabeceras, tokens o gestionar errores globalmente
- Cancelar peticiones en curso
- Transformar automáticamente la respuesta JSON sin necesidad de llamar `.json()`
- Gestionar timeouts de forma sencilla

### ¿Por qué se usa?
`fetch` es la opción nativa del navegador pero tiene limitaciones: no lanza errores automáticamente en respuestas 4xx/5xx, requiere dos pasos para leer el JSON y no soporta interceptores. Axios resuelve todo esto de forma más elegante y consistente.

### Ejemplo comparativo

Con `fetch`:
```js
const res = await fetch('/api/v1/tasks');
if (!res.ok) throw new Error('Error');
const data = await res.json();
```

Con `axios`:
```js
const { data } = await axios.get('/api/v1/tasks');
// lanza error automáticamente si !res.ok
// .json() no hace falta, ya viene parseado
```

---

## Postman

### ¿Qué es?
Postman es una aplicación de escritorio y web para probar, documentar y compartir APIs REST. Es la herramienta de referencia en la industria para el trabajo con APIs.

### ¿Para qué sirve?
- Enviar peticiones HTTP (GET, POST, PATCH, DELETE) a cualquier endpoint
- Organizar peticiones en colecciones reutilizables
- Definir variables de entorno (ej. URL base, tokens)
- Escribir tests automáticos que verifican el comportamiento de la API
- Generar documentación de la API a partir de las colecciones
- Compartir colecciones con el equipo

### ¿Por qué se usa?
Durante el desarrollo de un backend es imprescindible poder probar los endpoints sin necesidad de tener el frontend terminado. Postman permite hacerlo de forma visual, organizada y documentada. También es fundamental para forzar casos de error (mandar un body inválido, usar un ID inexistente, etc.) que son difíciles de provocar desde la interfaz.

### Alternativas
- **Thunder Client**: extensión de VS Code con funcionalidad similar, más ligera
- **Insomnia**: similar a Postman, enfocado en simplicidad
- **curl**: herramienta de línea de comandos, sin interfaz gráfica

---

## Sentry

### ¿Qué es?
Sentry es una plataforma de monitorización de errores en tiempo real para aplicaciones web y de backend. Captura automáticamente excepciones y errores en producción y los envía a un panel centralizado.

### ¿Para qué sirve?
- Capturar errores no controlados en producción de forma automática
- Ver el stack trace completo, el contexto del error y el usuario afectado
- Recibir alertas por email o Slack cuando ocurre un error nuevo
- Analizar la frecuencia y el impacto de cada error
- Marcar errores como resueltos y hacer seguimiento de regresiones

### ¿Por qué se usa?
En un entorno de producción no podemos estar mirando los logs del servidor constantemente. Sentry actúa como vigilante automático: cuando algo falla, te avisa al instante con toda la información necesaria para reproducir y solucionar el problema. Sin Sentry, muchos errores en producción pasarían desapercibidos hasta que un usuario se queja.

### Ejemplo de integración básica en Express

```js
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'TU_DSN_AQUI' });

// Middleware de Sentry — debe ir antes de las rutas
app.use(Sentry.Handlers.requestHandler());

// ... rutas ...

// Middleware de errores de Sentry — debe ir antes del middleware de errores propio
app.use(Sentry.Handlers.errorHandler());
```

---

## Swagger

### ¿Qué es?
Swagger (actualmente llamado **OpenAPI**) es un estándar para describir, documentar y visualizar APIs REST. En el ecosistema Node.js se usa habitualmente con las librerías `swagger-jsdoc` y `swagger-ui-express`.

### ¿Para qué sirve?
- Generar documentación interactiva de la API automáticamente desde comentarios en el código
- Proporcionar una interfaz web donde cualquier persona puede ver y probar los endpoints
- Definir el contrato de la API (qué parámetros acepta, qué devuelve, qué errores puede lanzar)
- Facilitar la integración entre equipos de frontend y backend

### ¿Por qué se usa?
Sin documentación, el equipo de frontend no sabe cómo llamar a los endpoints: qué campos enviar, qué respuesta esperar o qué errores puede recibir. Swagger genera esa documentación de forma automática a partir del propio código, asegurando que siempre esté actualizada.

### Cómo funciona en este proyecto

Se usa `swagger-jsdoc` para definir los endpoints con comentarios JSDoc encima de cada ruta:

```js
/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Obtener todas las tareas
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
router.get('/', taskController.obtenerTodas);
```

Y `swagger-ui-express` para servir la interfaz visual en `/api/docs`.

### URL de la documentación en este proyecto

```
https://taskflow-project-arianafts-projects.vercel.app/api/docs
```

---

## Resumen comparativo

| Herramienta | Categoría | Cuándo se usa |
|---|---|---|
| **Axios** | Cliente HTTP | En el frontend o backend para hacer peticiones a APIs |
| **Postman** | Testing / Documentación | Durante el desarrollo para probar y documentar endpoints |
| **Sentry** | Monitorización | En producción para detectar y rastrear errores automáticamente |
| **Swagger** | Documentación | Para generar y publicar la documentación interactiva de la API |

const express    = require('express');
const cors       = require('cors');
const taskRoutes = require('./routes/task.routes');
const { PORT }   = require('./config/env');
const swaggerSpec = require('./config/swagger');

const app = express();

// Middlewares 
// cors: permite peticiones desde el frontend
app.use(cors());
// express.json: parsea el body de las peticiones como JSON
app.use(express.json());
// Middleware de auditoría de peticiones
const loggerAcademico = (req, res, next) => {
  const inicio = performance.now();
  res.on('finish', () => {
    const duracion = performance.now() - inicio;
    console.log(`[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion.toFixed(2)}ms)`);
  });
  next();
};

app.use(loggerAcademico);
app.get('/api/docs', (req, res) => {
  const spec = JSON.stringify(swaggerSpec);
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>TaskFlow API Docs</title>
  <meta charset="utf-8"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({ spec: ${spec}, dom_id: '#swagger-ui' })
  </script>
</body>
</html>`);
});

// Rutas 
app.use('/api/v1/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: "API TaskFlow funcionando ✅" });
});

//  Middleware de errores 
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);

  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
});

// Arrancar 
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
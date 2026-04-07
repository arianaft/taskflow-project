const express    = require('express');
const cors       = require('cors');
const taskRoutes = require('./routes/task.routes');
const { PORT }   = require('./config/env');
const swaggerUi   = require('swagger-ui-express');
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
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js'
  ]
}));

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
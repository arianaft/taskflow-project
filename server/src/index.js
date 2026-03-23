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
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

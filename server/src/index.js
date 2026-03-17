const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/task.routes');

// Crear la app de Express
const app = express();

//Importa variable
const { PORT } = require('./config/env');

//Middlewares básicos
app.use(cors());
app.use(express.json());
app.use('/api/v1/tasks', taskRoutes);

//Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: "API TaskFlow funcionando" });
});

//Arranca el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
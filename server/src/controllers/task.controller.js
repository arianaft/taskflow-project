const taskService = require('../services/task.service');

function obtenerTodas(req, res) {
  const tasks = taskService.obtenerTodas();
  res.json(tasks);
}

function crearTarea(req, res) {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim().length < 3) {
    return res.status(400).json({
      error: "El texto debe tener al menos 3 caracteres"
    });
  }

  const nuevaTarea = taskService.crearTarea({ text: text.trim() });
  res.status(201).json(nuevaTarea);
}

function eliminarTarea(req, res, next) {
  try {
    taskService.eliminarTarea(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

function toggleTask(req, res, next) {
  try {
    const task = taskService.toggleTask(req.params.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}
function toggleAll(req, res, next) {
  try {
    const tasks = taskService.toggleAll();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  toggleTask,   
  toggleAll
};

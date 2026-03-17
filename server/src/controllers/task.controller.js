const taskService = require('../services/task.service');

function obtenerTodas(req, res) {
  const tasks = taskService.obtenerTodas();
  res.json(tasks);
}

function crearTarea(req, res) {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({
      error: "El título debe tener al menos 3 caracteres"
    });
  }

  const nuevaTarea = taskService.crearTarea({ title });

  res.status(201).json(nuevaTarea);
}

function eliminarTarea(req, res) {
  const { id } = req.params;

  try {
    taskService.eliminarTarea(id);
    res.status(204).send();
  } catch (error) {
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(500).json({ error: "Error interno" });
  }
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea
};
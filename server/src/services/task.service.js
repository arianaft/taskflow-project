let tasks = [];

function obtenerTodas() {
  return tasks;
}

function crearTarea(data) {
  const nuevaTarea = {
    id: Date.now().toString(),
    text: data.text,
    completed: false,
  };
  tasks.push(nuevaTarea);
  return nuevaTarea;
}

function eliminarTarea(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error("NOT_FOUND");
  tasks.splice(index, 1);
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) throw new Error("NOT_FOUND");
  task.completed = !task.completed;
  return task;
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  toggleTask,   // ← también faltaba aquí
};

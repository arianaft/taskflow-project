let tasks = [];

function obtenerTodas() {
  return tasks;
}

function crearTarea(data) {
  const nuevaTarea = {
    id: Date.now().toString(),
    text: data.text,
    completed: false,
    createdAt: new Date().toISOString(),
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

function toggleAll() {
  const hayPendientes = tasks.some(t => !t.completed);
  tasks = tasks.map(t => ({ ...t, completed: hayPendientes }));
  return tasks;
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  toggleTask, 
  toggleAll  
};

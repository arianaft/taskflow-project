/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} text
 * @property {boolean} completed
 */

/**
 * Módulo de gestión de tareas (estado + persistencia), sin acceso al DOM.
 */
const TaskStore = (() => {
  const STORAGE_KEY_TASKS = "tasks";
  const MAX_TASK_LENGTH = 100;

  /** @type {Task[]} */
  let tasks = [];

  /**
   * Valida el texto de una tarea.
   * @param {string} text
   * @returns {{ isValid: boolean, errorMessage: string | null }}
   */
  function validateTask(text) {
    const rawText = text ?? "";
    const trimmedText = rawText.trim();

    if (!trimmedText) {
      return {
        isValid: false,
        errorMessage: "La tarea no puede estar vacía"
      };
    }

    if (trimmedText.length > MAX_TASK_LENGTH) {
      return {
        isValid: false,
        errorMessage: "La tarea es demasiado larga"
      };
    }

    return {
      isValid: true,
      errorMessage: null
    };
  }

  /**
   * Crea un objeto tarea.
   * @param {string} text
   * @returns {Task}
   */
  function createTask(text) {
    return {
      id: Date.now(),
      text,
      completed: false
    };
  }

  /**
   * Carga tareas desde localStorage y normaliza su estructura.
   * @returns {Task[]}
   */
  function loadFromStorage() {
    try {
      const savedTasksJson = localStorage.getItem(STORAGE_KEY_TASKS);

      if (!savedTasksJson) {
        tasks = [];
        return getTasks();
      }

      const parsed = JSON.parse(savedTasksJson);

      if (!Array.isArray(parsed)) {
        console.error("Formato de tareas en localStorage no válido. Se reinicia el estado.");
        tasks = [];
        saveTasks();
        return getTasks();
      }

      tasks = parsed.map((task) => ({
        id: typeof task.id === "number" ? task.id : Date.now(),
        text: typeof task.text === "string" ? task.text : String(task.text ?? ""),
        completed: Boolean(task.completed)
      }));
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
      tasks = [];
    }

    return getTasks();
  }

  /**
   * Devuelve una copia inmutable de las tareas actuales.
   * @returns {Task[]}
   */
  function getTasks() {
    return tasks.map((task) => ({ ...task }));
  }

  /**
   * Guarda el estado actual de `tasks` en localStorage.
   * @returns {void}
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error al guardar las tareas:", error);
    }
  }

  /**
   * Añade una nueva tarea tras validar el texto.
   * @param {string} text
   * @returns {{ task?: Task, error?: string }}
   */
  function addTask(text) {
    const validation = validateTask(text);
    if (!validation.isValid) {
      return { error: validation.errorMessage || "Tarea no válida" };
    }

    const trimmedText = text.trim();
    const task = createTask(trimmedText);
    tasks.push(task);
    saveTasks();
    return { task };
  }

  /**
   * Elimina una tarea por id.
   * @param {number} id
   * @returns {void}
   */
  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
  }

  /**
   * Alterna el estado de completado de una tarea por id.
   * @param {number} id
   * @returns {void}
   */
  function toggleTaskCompleted(id) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
  }

  /**
   * Devuelve solo las tareas completadas.
   * @param {Task[]} [list]
   * @returns {Task[]}
   */
  function filterCompletedTasks(list) {
    const source = Array.isArray(list) ? list : tasks;
    return source.filter((task) => task.completed === true);
  }

  /**
   * Actualiza el texto de una tarea existente.
   * @param {number} id
   * @param {string} newText
   * @returns {{ task?: Task, error?: string }}
   */
  function updateTaskText(id, newText) {
    const validation = validateTask(newText);
    if (!validation.isValid) {
      return { error: validation.errorMessage || "Tarea no válida" };
    }

    const trimmed = newText.trim();
    let updatedTask;

    tasks = tasks.map((task) => {
      if (task.id !== id) return task;
      updatedTask = { ...task, text: trimmed };
      return updatedTask;
    });

    if (!updatedTask) {
      return { error: "No se encontró la tarea a editar" };
    }

    saveTasks();
    return { task: updatedTask };
  }

  /**
   * Elimina todas las tareas completadas.
   * @returns {void}
   */
  function clearCompleted() {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
  }

  function completeAllTasks() {
  tasks = tasks.map(task => ({
    ...task,
    completed: true
  }));
  saveTasks();
}
  return {
    loadFromStorage,
    getTasks,
    addTask,
    deleteTask,
    toggleTaskCompleted,
    filterCompletedTasks,
    updateTaskText,
    clearCompleted,
    completeAllTasks
  };
})();


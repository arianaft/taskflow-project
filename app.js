/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} text
 * @property {boolean} completed
 */

/** @type {HTMLFormElement | null} */
const form = document.getElementById("taskForm");
/** @type {HTMLInputElement | null} */
const input = document.getElementById("taskInput");
/** @type {HTMLUListElement | null} */
const list = document.getElementById("taskList");
/** @type {HTMLInputElement | null} */
const search = document.getElementById("searchTask");
/** @type {HTMLParagraphElement | null} */
const emptyMessage = document.getElementById("emptyMessage");
/** @type {HTMLParagraphElement | null} */
const completedCountEl = document.getElementById("completedCount");

const STORAGE_KEY_TASKS = "tasks";
const MAX_TASK_LENGTH = 100;

/** @type {Task[]} */
let tasks = [];

/**
 * Valida el texto de una tarea (lógica pura, sin efectos de UI).
 * @param {string} text - Texto a validar.
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
 * Crea un objeto tarea
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
 * Carga las tareas desde localStorage, normaliza su shape y las renderiza.
 * @returns {void}
 */
function loadTasksFromStorage() {
  try {
    const savedTasksJson = localStorage.getItem(STORAGE_KEY_TASKS);

    if (!savedTasksJson) {
      return;
    }

    const parsed = JSON.parse(savedTasksJson);

    if (!Array.isArray(parsed)) {
      console.error("Formato de tareas en localStorage no válido. Se reinicia el estado.");
      tasks = [];
      saveTasks();
      return;
    }

    tasks = parsed.map((task) => ({
      id: typeof task.id === "number" ? task.id : Date.now(),
      text: typeof task.text === "string" ? task.text : String(task.text ?? ""),
      completed: Boolean(task.completed)
    }));

    tasks.forEach((task) => renderTask(task));
  } catch (error) {
    console.error("Error al cargar las tareas:", error);
    tasks = [];
  } finally {
    toggleEmptyMessage();
    updateCompletedCount();
  }
}

// Carga las tareas guardadas al iniciar
window.addEventListener("load", loadTasksFromStorage);

/**
 * Maneja el envío del formulario de nueva tarea.
 * @param {SubmitEvent} event
 * @returns {void}
 */
function handleFormSubmit(event) {
  event.preventDefault();

  if (!input || !list) return;

  const rawText = input.value;
  const validation = validateTask(rawText);

  if (!validation.isValid) {
    alert(validation.errorMessage);
    return;
  }

  const taskText = rawText.trim();
  const task = createTask(taskText);

  tasks.push(task);
  saveTasks();
  renderTask(task);
  toggleEmptyMessage();
  updateCompletedCount();

  input.value = "";
}

// Añadir tarea
if (form) {
  form.addEventListener("submit", handleFormSubmit);
} else {
  console.error('No se encontró el formulario con id "taskForm" en el DOM.');
}

/**
 * Renderiza una tarea en la lista del DOM y registra sus handlers.
 *
 * @param {Task} task - Tarea a renderizar.
 * @returns {void}
 *
 * @sideEffects
 * - Inserta un elemento `<li>` en `list`.
 * - Registra listeners para marcar como completada y para eliminar.
 * - Llama a `deleteTask(task.id)` al eliminar.
 */
function renderTask(task) {
  const li = document.createElement("li");
  li.dataset.text = task.text.toLowerCase();

  const span = document.createElement("span");
  span.textContent = task.text;
  if (task.completed) {
    span.classList.add("completed");
  }
  span.addEventListener("click", () => {
    span.classList.toggle("completed");
    task.completed = !task.completed;
    saveTasks();
    updateCompletedCount();
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-btn");

  deleteButton.addEventListener("click", () => {
    li.remove();
    deleteTask(task.id);
  });

  li.appendChild(span);
  li.appendChild(deleteButton);
  list.appendChild(li);
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
 * Elimina una tarea por id
 * @param {number} id
 * @returns {void}
 */
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  toggleEmptyMessage();
  updateCompletedCount();
}

/**
 * Filtra las tareas según el texto de búsqueda
 * @param {string} searchText
 * @returns {void}
 */
function filterTasks(searchText) {
  const normalizedSearchText = (searchText ?? "").toLowerCase();

  const items = document.querySelectorAll("#taskList li");

  if (!normalizedSearchText) {
    items.forEach((item) => {
      item.style.display = "flex";
    });
    return;
  }

  items.forEach((item) => {
    const itemText = item.dataset.text ?? "";

    item.style.display = itemText.includes(normalizedSearchText)
      ? "flex"
      : "none";
  });
}

/**
 * Devuelve solo las tareas completadas.
 * @param {Task[]} tasksList
 * @returns {Task[]}
 */
function filterCompletedTasks(tasksList) {
  return tasksList.filter((task) => task.completed === true);
}

// Filtro de busqueda
if (search) {
  search.addEventListener("input", () => {
    filterTasks(search.value);
  });
} else {
  console.error('No se encontró el input de búsqueda con id "searchTask" en el DOM.');
}

/**
 * Actualiza el contador visible de tareas completadas.
 * @returns {void}
 */
function updateCompletedCount() {
  if (!completedCountEl) return;
  const completed = filterCompletedTasks(tasks).length;
  completedCountEl.textContent = `${completed} completadas / ${tasks.length} total`;
}

/**
 * Muestra u oculta el mensaje de lista vacía.
 * @returns {void}
 */
function toggleEmptyMessage() {
  if (!emptyMessage) return;

  emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}
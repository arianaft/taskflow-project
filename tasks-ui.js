/**
 * Capa de UI para las tareas: DOM + eventos.
 * Depende de `TaskStore` definido en `tasks.js`.
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
/** @type {HTMLSelectElement | null} */
const statusFilter = document.getElementById("statusFilter");
/** @type {HTMLSelectElement | null} */
const sortOrder = document.getElementById("sortOrder");
/** @type {HTMLButtonElement | null} */
const clearCompletedBtn = document.getElementById("clearCompleted");

/** @type {"all" | "pending" | "completed"} */
let currentStatusFilter = "all";
/** @type {"newest" | "oldest" | "alphabetical"} */
let currentSortOrder = "newest";
/** @type {string} */
let currentSearchText = "";

/**
 * Renderiza una tarea en la lista del DOM y registra sus handlers.
 * @param {Task} task
 * @returns {void}
 */
function renderTask(task) {
  if (!list) return;

  const li = document.createElement("li");
  li.dataset.id = String(task.id);
  li.dataset.text = task.text.toLowerCase();

  const span = document.createElement("span");
  span.textContent = task.text;
  if (task.completed) {
    span.classList.add("completed");
  }

   const editButton = document.createElement("button");
   editButton.textContent = "✏️";
   editButton.type = "button";
   editButton.classList.add("edit-btn");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑";
  deleteButton.type = "button";
  deleteButton.classList.add("delete-btn");

  li.appendChild(span);
  li.appendChild(editButton);
  li.appendChild(deleteButton);
  list.appendChild(li);
}

/**
 * Vuelve a renderizar toda la lista desde el estado del store.
 * @returns {void}
 */
function renderAllTasks() {
  if (!list) return;
  list.innerHTML = "";

  const tasks = TaskStore.getTasks();

  // Filtro por estado
  let visible = tasks;
  if (currentStatusFilter === "completed") {
    visible = TaskStore.filterCompletedTasks(tasks);
  } else if (currentStatusFilter === "pending") {
    visible = tasks.filter((task) => !task.completed);
  }

  // Búsqueda por texto
  const search = currentSearchText.trim().toLowerCase();
  if (search) {
    visible = visible.filter((task) =>
      task.text.toLowerCase().includes(search)
    );
  }

  // Ordenación
  visible = visible.slice().sort((a, b) => {
    if (currentSortOrder === "newest") {
      return b.id - a.id;
    }
    if (currentSortOrder === "oldest") {
      return a.id - b.id;
    }
    // alphabetical
    return a.text.localeCompare(b.text, "es", { sensitivity: "base" });
  });

  visible.forEach((task) => renderTask(task));
}

/**
 * Muestra u oculta el mensaje de lista vacía.
 * @returns {void}
 */
function toggleEmptyMessage() {
  if (!emptyMessage) return;
  const tasks = TaskStore.getTasks();
  emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
}

/**
 * Actualiza el contador visible de tareas completadas.
 * @returns {void}
 */
function updateCompletedCount() {
  if (!completedCountEl) return;
  const tasks = TaskStore.getTasks();
  const completed = TaskStore.filterCompletedTasks(tasks).length;
  completedCountEl.textContent = `${completed} completadas / ${tasks.length} total`;
}

/**
 * Maneja el envío del formulario de nueva tarea.
 * @param {SubmitEvent} event
 * @returns {void}
 */
function handleFormSubmit(event) {
  event.preventDefault();
  if (!input) return;

  const rawText = input.value;
  const { task, error } = TaskStore.addTask(rawText);

  if (error) {
    alert(error);
    return;
  }

  if (task) {
    renderTask(task);
    toggleEmptyMessage();
    updateCompletedCount();
  }

  input.value = "";
}

/**
 * Filtra las tareas en el DOM según el texto de búsqueda.
 * @param {string} searchText
 * @returns {void}
 */
function filterTasks(searchText) {
  currentSearchText = searchText ?? "";
  renderAllTasks();
}

/**
 * Inicializa listeners y render de tareas.
 * @returns {void}
 */
function initTasksUI() {
  // Cargar tareas del store
  TaskStore.loadFromStorage();
  renderAllTasks();
  toggleEmptyMessage();
  updateCompletedCount();

  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  if (search) {
    search.addEventListener("input", () => {
      filterTasks(search.value);
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", () => {
      const value = statusFilter.value;
      if (value === "all" || value === "pending" || value === "completed") {
        currentStatusFilter = value;
        renderAllTasks();
        toggleEmptyMessage();
        updateCompletedCount();
      }
    });
  }

  if (sortOrder) {
    sortOrder.addEventListener("change", () => {
      const value = sortOrder.value;
      if (value === "newest" || value === "oldest" || value === "alphabetical") {
        currentSortOrder = value;
        renderAllTasks();
      }
    });
  }

  if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", () => {
      TaskStore.clearCompleted();
      renderAllTasks();
      toggleEmptyMessage();
      updateCompletedCount();
    });
  }

  if (list) {
    list.addEventListener("click", (event) => {
      const target = /** @type {HTMLElement} */ (event.target);
      const li = target.closest("li");
      if (!li) return;

      const id = Number(li.dataset.id);
      if (!Number.isFinite(id)) return;

      if (target.matches("button.delete-btn")) {
        TaskStore.deleteTask(id);
        li.remove();
        toggleEmptyMessage();
        updateCompletedCount();
        return;
      }

      if (target.matches("button.edit-btn")) {
        const span = li.querySelector("span");
        const currentText = span?.textContent ?? "";
        const newText = window.prompt("Editar tarea", currentText);
        if (newText == null) return;

        const result = TaskStore.updateTaskText(id, newText);
        if (result.error) {
          alert(result.error);
          return;
        }

        renderAllTasks();
        updateCompletedCount();
        toggleEmptyMessage();
        return;
      }

      if (target.matches("span")) {
        target.classList.toggle("completed");
        TaskStore.toggleTaskCompleted(id);
        updateCompletedCount();
      }
    });
  }
}

window.addEventListener("load", initTasksUI);


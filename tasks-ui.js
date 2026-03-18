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

const completeAllBtn = document.getElementById("completeAll");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

/** @type {"all" | "pending" | "completed"} */
let currentStatusFilter = "all";
/** @type {"newest" | "oldest" | "alphabetical"} */
let currentSortOrder = "newest";
/** @type {string} */
let currentSearchText = "";

/**
 * Renderiza una tarea como elemento <li>.
 * El check funciona clicando en la fila (clase toggle-btn).
 * @param {import('./tasks.js').Task} task
 * @returns {HTMLLIElement}
 */
function renderTask(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.15s;
    cursor: pointer;
  `;

  li.innerHTML = `
    <div class="toggle-btn" style="display:flex; align-items:center; gap:10px; flex:1; min-width:0;">
      <!-- Círculo check -->
      <div style="
        width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        ${task.completed
          ? "background: #10b981; border: 2px solid #10b981;"
          : "border: 2px solid #d1d5db; background: transparent;"}
      ">
        ${task.completed
          ? `<svg width="11" height="11" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
             </svg>`
          : ""}
      </div>

      <!-- Texto -->
      <span style="
        font-size: 14px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        ${task.completed
          ? "text-decoration: line-through; color: #9ca3af;"
          : "font-weight: 500; color: #111827;"}
      ">${task.text}</span>
    </div>

    <!-- Acciones -->
    <div class="task-actions" style="display:flex; gap:4px; flex-shrink:0; margin-left:8px;">
      <button class="edit-btn" title="Editar" style="
        padding: 5px; border: none; background: transparent;
        color: #9ca3af; cursor: pointer; border-radius: 6px;
        display: flex; align-items: center; justify-content: center;
        transition: color 0.15s, background 0.15s;
      " onmouseover="this.style.color='#4f46e5';this.style.background='#eef2ff'"
         onmouseout="this.style.color='#9ca3af';this.style.background='transparent'">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z"/>
        </svg>
      </button>
      <button class="delete-btn" title="Eliminar" style="
        padding: 5px; border: none; background: transparent;
        color: #9ca3af; cursor: pointer; border-radius: 6px;
        display: flex; align-items: center; justify-content: center;
        transition: color 0.15s, background 0.15s;
      " onmouseover="this.style.color='#ef4444';this.style.background='#fef2f2'"
         onmouseout="this.style.color='#9ca3af';this.style.background='transparent'">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  `;

  return li;
}

/**
 * Vuelve a renderizar toda la lista desde el estado del store.
 * @returns {void}
 */
function renderAllTasks() {
  if (!list) return;
  list.innerHTML = "";

  const tasks = TaskStore.getTasks();

  let visible = tasks;
  if (currentStatusFilter === "completed") {
    visible = TaskStore.filterCompletedTasks(tasks);
  } else if (currentStatusFilter === "pending") {
    visible = tasks.filter((task) => !task.completed);
  }

  const searchText = currentSearchText.trim().toLowerCase();
  if (searchText) {
    visible = visible.filter((task) =>
      task.text.toLowerCase().includes(searchText)
    );
  }

  visible = visible.slice().sort((a, b) => {
    if (currentSortOrder === "newest") return b.id - a.id;
    if (currentSortOrder === "oldest") return a.id - b.id;
    return a.text.localeCompare(b.text, "es", { sensitivity: "base" });
  });

  visible.forEach((task) => {
    const li = renderTask(task);
    list.appendChild(li);
  });
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

function updateProgressBar() {
  if (!progressBar || !progressText) return;

  const tasks = TaskStore.getTasks();
  const total = tasks.length;
  const completed = TaskStore.filterCompletedTasks(tasks).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressBar.classList.remove("bg-red-500", "bg-yellow-400", "bg-green-500");

  if (percentage < 30) {
    progressBar.style.background = "#ef4444";
  } else if (percentage < 70) {
    progressBar.style.background = "#f59e0b";
  } else {
    progressBar.style.background = "#10b981";
  }

  progressBar.style.width = percentage + "%";
  progressText.textContent = `${completed} de ${total} completadas`;
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
    renderAllTasks();
    toggleEmptyMessage();
    updateCompletedCount();
    updateProgressBar();
  }

  input.value = "";
}

/**
 * Inicializa listeners y render de tareas.
 * @returns {void}
 */
function initTasksUI() {
  TaskStore.loadFromStorage();
  renderAllTasks();
  toggleEmptyMessage();
  updateCompletedCount();
  updateProgressBar();

  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  if (search) {
    search.addEventListener("input", () => {
      currentSearchText = search.value;
      renderAllTasks();
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
      updateProgressBar();
    });
  }

  if (completeAllBtn) {
    completeAllBtn.addEventListener("click", () => {
      TaskStore.completeAllTasks();
      renderAllTasks();
      toggleEmptyMessage();
      updateCompletedCount();
      updateProgressBar();
    });
  }

  if (list) {
    list.addEventListener("click", (event) => {
      const target = /** @type {HTMLElement} */ (event.target);
      const li = target.closest("li");
      if (!li) return;

      const id = Number(li.dataset.id);
      if (!Number.isFinite(id)) return;

      if (target.closest("button.delete-btn")) {
        TaskStore.deleteTask(id);
        li.remove();
        toggleEmptyMessage();
        updateCompletedCount();
        updateProgressBar();
        return;
      }

      if (target.closest("button.edit-btn")) {
        const span = li.querySelector("span");
        const currentText = span?.textContent?.trim() ?? "";
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

      if (target.closest(".toggle-btn")) {
        TaskStore.toggleTaskCompleted(id);
        renderAllTasks();
        updateCompletedCount();
        updateProgressBar();
      }
    });
  }
}

window.addEventListener("load", initTasksUI);

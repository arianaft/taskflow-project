/**
 * Capa de presentación.
 * Gestiona los tres estados de red: carga, éxito y error.
 */

import { getTasks, createTask, deleteTask, toggleTask } from "./network/client.js";

//  ELEMENTOS DOM 
const form           = document.getElementById("taskForm");
const input          = document.getElementById("taskInput");
const list           = document.getElementById("taskList");
const emptyMessage   = document.getElementById("emptyMessage");
const progressBar    = document.getElementById("progressBar");
const progressText   = document.getElementById("progressText");
const searchInput    = document.getElementById("searchTask");
const statusFilter   = document.getElementById("statusFilter");
const sortOrder      = document.getElementById("sortOrder");
const completeAllBtn = document.getElementById("completeAll");
const clearCompBtn   = document.getElementById("clearCompleted");

// ESTADO LOCAL  
let allTasks = [];

//HELPERS DE ESTADO DE RED 

//Muestra un spinner de carga en la lista 
function setLoadingState() {
  if (!list) return;
  list.innerHTML = `
    <li style="padding:32px 16px; text-align:center; color:#9ca3af; font-size:13px;">
      <div class="spinner" style="
        display:inline-block; width:22px; height:22px;
        border:3px solid #e5e7eb; border-top-color:#4f46e5;
        border-radius:50%; animation:spin 0.7s linear infinite;
        margin-bottom:8px;
      "></div>
      <br>Cargando tareas…
    </li>
  `;
  if (emptyMessage) emptyMessage.style.display = "none";
}

//Muestra un error con mensaje descriptivo 
function setErrorState(message) {
  if (!list) return;
  list.innerHTML = `
    <li style="padding:32px 16px; text-align:center;">
      <span style="font-size:28px;">⚠️</span>
      <p style="margin:8px 0 4px; font-size:14px; font-weight:600; color:#dc2626;">
        No se pudo conectar con el servidor
      </p>
      <p style="font-size:12px; color:#9ca3af; margin:0;">${message}</p>
      <button onclick="renderAllTasks()"
        style="margin-top:14px; padding:6px 16px; border-radius:6px; border:1px solid #e5e7eb;
               background:#f9fafb; font-size:12px; cursor:pointer; color:#374151;">
        🔄 Reintentar
      </button>
    </li>
  `;
}

//Renderiza las tareas filtradas/ordenadas en pantalla 
function renderTasks() {
  if (!list) return;

  const query  = (searchInput?.value ?? "").toLowerCase().trim();
  const filter = statusFilter?.value ?? "all";
  const order  = sortOrder?.value ?? "newest";

  let visible = allTasks
    .filter(t => {
      if (filter === "pending")   return !t.completed;
      if (filter === "completed") return  t.completed;
      return true;
    })
    .filter(t => !query || t.text.toLowerCase().includes(query));

  if (order === "oldest")       visible = [...visible].reverse();
  else if (order === "alphabetical") visible = [...visible].sort((a, b) => a.text.localeCompare(b.text));

  list.innerHTML = "";

  if (visible.length === 0) {
    if (emptyMessage) emptyMessage.style.display = "block";
    updateProgress();
    return;
  }

  if (emptyMessage) emptyMessage.style.display = "none";

  visible.forEach(task => {
    const li = buildTaskElement(task);
    list.appendChild(li);
  });

  updateProgress();
}

//Construye el elemento <li> de una tarea 
function buildTaskElement(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.style.cssText = `
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 16px; border-bottom:1px solid #f1f5f9;
    transition:background 0.15s;
  `;

  li.innerHTML = `
    <label style="display:flex; gap:10px; align-items:center; cursor:pointer; flex:1; min-width:0;">
      <input type="checkbox" ${task.completed ? "checked" : ""}
        style="accent-color:#4f46e5; width:16px; height:16px; cursor:pointer; flex-shrink:0;" />
      <span style="
        font-size:13px; color:#111827;
        ${task.completed ? "text-decoration:line-through; color:#9ca3af;" : ""}
        white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      ">${escapeHtml(task.text)}</span>
    </label>
    <button class="delete-btn" title="Eliminar"
      style="flex-shrink:0; background:none; border:none; cursor:pointer;
             color:#d1d5db; font-size:16px; padding:4px 6px; border-radius:6px;
             transition:color 0.15s;"
      onmouseover="this.style.color='#ef4444'"
      onmouseout="this.style.color='#d1d5db'">
      ✕
    </button>
  `;

  return li;
}

//Actualiza la barra de progreso 
function updateProgress() {
  if (!progressBar || !progressText) return;
  const total     = allTasks.length;
  const completed = allTasks.filter(t => t.completed).length;
  const pct       = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.style.width  = `${pct}%`;
  progressText.textContent = total === 0 ? "" : `${completed}/${total}`;
}

//Escapa HTML para evitar XSS 
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

//CARGA PRINCIPAL

//Carga las tareas del servidor y gestiona los tres estados 
async function renderAllTasks() {
  setLoadingState();
  await new Promise(r => setTimeout(r, 1500));
  try {
    allTasks = await getTasks();
    renderTasks();
  } catch (err) {
    setErrorState(err.message);
  }
}

// Exponemos para que el botón "Reintentar" del HTML inline pueda llamarla
window.renderAllTasks = renderAllTasks;

//CREA TAREA 

async function handleFormSubmit(e) {
  e.preventDefault();
  if (!input) return;

  const submitBtn = form?.querySelector("button[type=submit]");
  const originalText = submitBtn?.innerHTML ?? "";

  // Deshabilitar botón mientras se envía
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "⏳";
  }

  try {
    await createTask(input.value);
    input.value = "";
    clearInlineError();
    await renderAllTasks();

  } catch (err) {
    showInlineError(`Error: ${err.message}`);
  }
 finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }
}

//Muestra un mensaje de error debajo del formulario 
function showInlineError(msg) {
  let el = document.getElementById("form-error");
  if (!el) {
    el = document.createElement("p");
    el.id = "form-error";
    el.style.cssText = "margin:4px 16px 0; font-size:12px; color:#dc2626;";
    form?.after(el);
  }
  el.textContent = msg;
}

function clearInlineError() {
  const el = document.getElementById("form-error");
  if (el) el.remove();
}

//DELEGACIÓN DE EVENTOS EN LA LISTA

async function handleListClick(e) {
  const li = e.target.closest("li");
  if (!li) return;

  const id = li.dataset.id;

  // TOGGLE (checkbox)
  if (e.target.type === "checkbox") {
    e.target.disabled = true; 
    try {
      await deleteTask(id);
     
      const task = allTasks.find(t => t.id === id);
      if (task) task.completed = !task.completed;
      renderTasks();
    } catch (err) {
      alert(`No se pudo actualizar la tarea: ${err.message}`);
      e.target.disabled = false;
      renderTasks(); 
    }
    return;
  }

  // DELETE
  if (e.target.classList.contains("delete-btn") || e.target.closest(".delete-btn")) {
    li.style.opacity = "0.4";
    try {
      await removeTask(id);
      allTasks = allTasks.filter(t => t.id !== id);
      renderTasks();
    } catch (err) {
      alert(`No se pudo eliminar la tarea: ${err.message}`);
      li.style.opacity = "1";
    }
  }
}

//COMPLETA TODAS 

async function handleCompleteAll() {
  const pending = allTasks.filter(t => !t.completed);
  if (pending.length === 0) return;

  try {
    await Promise.all(pending.map(t => toggleTask(t.id)));
    await renderAllTasks();
  } catch (err) {
    alert(`Error al completar tareas: ${err.message}`);
  }
}

//LIMPIA COMPLETADAS 

async function handleClearCompleted() {
  const completed = allTasks.filter(t => t.completed);
  if (completed.length === 0) return;

  try {
    await Promise.all(completed.map(t => deleteTask(t.id)));
    allTasks = allTasks.filter(t => !t.completed);
    renderTasks();
  } catch (err) {
    alert(`Error al eliminar tareas: ${err.message}`);
  }
}

//INICIALIZACIÓN 

function init() {
  renderAllTasks();

  form?.addEventListener("submit", handleFormSubmit);
  list?.addEventListener("click", handleListClick);
  searchInput?.addEventListener("input", renderTasks);
  statusFilter?.addEventListener("change", renderTasks);
  sortOrder?.addEventListener("change", renderTasks);
  completeAllBtn?.addEventListener("click", handleCompleteAll);
  clearCompBtn?.addEventListener("click", handleClearCompleted);
}

window.addEventListener("load", init);

// CSS: animación del spinner 
const style = document.createElement("style");
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

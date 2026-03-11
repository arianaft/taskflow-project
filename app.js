const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const search = document.getElementById("searchTask");

let tasks = [];
/**
 * Valida el texto de una tarea
 * @param {string} text
 * @returns {boolean}
 */
function validateTask(text) {
  if (!text || text.trim() === "") {
    alert("La tarea no puede estar vacía");
    return false;
  }

  if (text.length > 100) {
    alert("La tarea es demasiado larga");
    return false;
  }

  return true;
}
/**
 * Crea un objeto tarea
 * @param {string} text
 * @returns {object}
 */
function createTask(text) {
  return {
    id: Date.now(),
    text: text
  };
}

// Carga las tareas guardadas
window.addEventListener("load", () => {
  try {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      tasks.forEach(task => renderTask(task));     
    }
    toggleEmptyMessage();
  } catch (error) {
    console.error("Error al cargar las tareas:", error);
  }
});

// Añadir tarea
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!validateTask(text)) return;
 
  try {
   const task = createTask(text);

    tasks.push(task);
    toggleEmptyMessage();
    saveTasks();
    renderTask(task);

    input.value = "";
  } catch (error) {
    console.error("Error al crear la tarea:", error);
  }
});

/* * Renderiza una tarea en la lista del DOM
* @param {object} task
*/
function renderTask(task) {
  try {
    const li = document.createElement("li");
    li.dataset.text = task.text.toLowerCase();

    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("click", () => {
      try {
        span.classList.toggle("completed");
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
      }
    });

    const btn = document.createElement("button");
    btn.innerHTML = "🗑";
    btn.classList.add("delete-btn");

    btn.addEventListener("click", () => {
      try {
        li.remove();
        deleteTask(task.id);
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    });

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  } catch (error) {
    console.error("Error al renderizar la tarea:", error);
  }
}

// Guarda en localStorage
function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Error al guardar las tareas:", error);
  }
}
/**
 * Elimina una tarea por id
 * @param {number} id
 */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  toggleEmptyMessage();
  saveTasks();
}
/**
 * Filtra las tareas según el texto de búsqueda
 * @param {string} searchText
 */
function filterTasks(searchText) {
  const items = document.querySelectorAll("#taskList li");

  items.forEach(item => {
    if (item.dataset.text.includes(searchText)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
// Filtro de busqueda
search.addEventListener("input", () => {
  const text = search.value.toLowerCase();
  filterTasks(text);
});

//Mostrar u ocultar mensajes
function toggleEmptyMessage() {
  try {
    const msg = document.getElementById("emptyMessage");

    if (tasks.length === 0) {
      msg.style.display = "block";
    } else {
      msg.style.display = "none";
    }
  } catch (error) {
    console.error("Error al actualizar el mensaje vacío:", error);
  }
}
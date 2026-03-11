const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const search = document.getElementById("searchTask");

let tasks = [];

// Carga las tareas guardadas
window.addEventListener("load", () => {
  try {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      tasks.forEach(task => renderTask(task));
    }
  } catch (error) {
    console.error("Error al cargar las tareas:", error);
  }
});

// Añadir tarea
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = input.value.trim();
  if (text === "") return;

  try {
    const task = {
      id: Date.now(),
      text: text,
    };

    tasks.push(task);
    toggleEmptyMessage();
    saveTasks();
    renderTask(task);

    input.value = "";
  } catch (error) {
    console.error("Error al crear la tarea:", error);
  }
});

// Crea elemento en la lista
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
        tasks = tasks.filter(t => t.id !== task.id);
        toggleEmptyMessage();
        saveTasks();
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

// Filtro de busqueda
search.addEventListener("input", function () {
  try {
    const text = search.value.toLowerCase();

    const items = document.querySelectorAll("#taskList li");

    items.forEach(item => {
      if (item.dataset.text.includes(text)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  } catch (error) {
    console.error("Error al filtrar las tareas:", error);
  }
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
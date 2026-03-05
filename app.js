const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const search = document.getElementById("searchTask");

let tasks =[];

// Carga las tareas guardadas
window.addEventListener("load", () => {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    tasks.forEach(task => renderTask(task));
  }
});

// Añadir tarea
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const text = input.value.trim();
  if(text === "") return;


  const task = {
    id: Date.now(),
    text: text
  };

  tasks.push(task);
  toggleEmptyMessage();
  saveTasks();
  renderTask(task);

  input.value = "";
});

// Crea elemento en la lista
function renderTask(task) {

  const li = document.createElement("li");
  li.dataset.text = task.text.toLowerCase();

  const span = document.createElement("span");
  span.textContent = task.text;
  span.addEventListener("click", () => {
  span.classList.toggle("completed");
});

  const btn = document.createElement("button");
  btn.innerHTML = "🗑";
  btn.classList.add("delete-btn");

  btn.addEventListener("click", () => {
    li.remove();
    tasks = tasks.filter(t => t.id !== task.id);
    toggleEmptyMessage();
    saveTasks();
  });

  li.appendChild(span);
  li.appendChild(btn);
  list.appendChild(li);
}

// Guarda en localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Filtro de busqueda
search.addEventListener("input", function() {

  const text = search.value.toLowerCase();

  const items = document.querySelectorAll("#taskList li");

  items.forEach(item => {

    if(item.dataset.text.includes(text)){
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });

});

//Mostrar u ocultar mensajes
function toggleEmptyMessage(){

  const msg = document.getElementById("emptyMessage");

  if(tasks.length === 0){
    msg.style.display = "block";
  } else {
    msg.style.display = "none";
  }

}
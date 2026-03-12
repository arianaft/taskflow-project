# Experimentos con IA en programación

En esta sección se realizaron varios experimentos para comparar la resolución de problemas de programación primero sin utilizar herramientas de inteligencia artificial y posteriormente utilizando IA.

El objetivo fue evaluar:

- el tiempo invertido
- la calidad del código generado
- la comprensión del problema

Los experimentos se dividieron en dos grupos: problemas generales de programación y tareas relacionadas con el proyecto TaskFlow.

---

# 1. Problemas generales de programación

## Experimento 1 – Invertir un texto

### Problema

Crear una función que invierta un texto.

---

### Solución sin IA

```javascript
function reverseString(text) {
  let reversed = "";

  for (let i = text.length - 1; i >= 0; i--) {
    reversed += text[i];
  }

  return reversed;
}
```

Tiempo aproximado: **4 minutos**

---

### Solución con IA

Prompt utilizado:

```
Actúa como un desarrollador senior de JavaScript y genera una función que invierta un string.
```

Código generado por la IA:

```javascript
function reverseString(text) {
  return text.split("").reverse().join("");
}
```

Tiempo aproximado: **1 minuto**

---

### Comparación

La solución con IA es más corta y utiliza métodos modernos de JavaScript. Además, el tiempo de desarrollo fue significativamente menor.

---

## Experimento 2 – Encontrar el número mayor de un array

### Problema

Crear una función que encuentre el número mayor dentro de un array.

---

### Solución sin IA

```javascript
function findMax(numbers) {
  let max = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }

  return max;
}
```

Tiempo aproximado: **5 minutos**

---

### Solución con IA

Prompt utilizado:

```
Genera una función JavaScript que devuelva el número mayor dentro de un array.
```

Código generado por la IA:

```javascript
function findMax(numbers) {
  return Math.max(...numbers);
}
```

Tiempo aproximado: **1 minuto**

---

### Comparación

La solución con IA utiliza el operador spread y la función `Math.max`, lo que hace el código más compacto y fácil de leer.

---

## Experimento 3 – Contar vocales en un texto

### Problema

Crear una función que cuente el número de vocales en un texto.

---

### Solución sin IA

```javascript
function countVowels(text) {
  let count = 0;
  const vowels = "aeiou";

  for (let char of text.toLowerCase()) {
    if (vowels.includes(char)) {
      count++;
    }
  }

  return count;
}
```

Tiempo aproximado: **6 minutos**

---

### Solución con IA

Prompt utilizado:

```
Crea una función JavaScript que cuente cuántas vocales hay en un texto.
```

Código generado por la IA:

```javascript
function countVowels(text) {
  return (text.match(/[aeiou]/gi) || []).length;
}
```

Tiempo aproximado: **1 minuto**

---

### Comparación

La solución generada por la IA utiliza expresiones regulares, lo que permite resolver el problema de forma más compacta.

---

# 2. Tareas relacionadas con el proyecto TaskFlow

## Experimento 4 – Contar tareas completadas

### Problema

Falta de orientación para el usuario al usar la aplicación.

---

### Solución sin IA

```<section class="info-lista">
  <h3>Como funciona tu lista de viaje</h3>

  <ol>
    <li>Escribe una tarea como reservar hotel o hacer check-in online</li>
    <li>Pulsa en añadir para guardarla</li>
    <li>Haz clic en una tarea para marcarla como completada</li>
    <li>Usa el buscador para encontrar tareas</li>
    <li>La lista se guarda en el navegador</li>
  </ol>
</section>
```

Tiempo aproximado: **5 minutos**

---

### Solución con IA

Prompt utilizado:

```
Añadir una pequeña sección “Cómo funciona” o “Pasos” justo antes del formulario de tareas para guiar al usuario.
```

Código generado por la IA:

```<section class="max-w-xl mx-auto mb-8 px-4">
        <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-white text-center">
          ¿Cómo funciona tu lista de viaje?
        </h3>
        <ol class="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">
          <li>Escribe una tarea como “Reservar hotel” o “Hacer check-in online”.</li>
          <li>Pulsa en “Añadir” para guardarla en tu lista.</li>
          <li>Haz clic sobre una tarea para marcarla como completada.</li>
          <li>Usa el buscador para encontrar tareas por texto.</li>
          <li>Tu lista se guarda automáticamente en este navegador.</li>
        </ol>
      </section>
```

Tiempo aproximado: **1 minuto**

---

### Comparación

La solución con IA utiliza permite obtener una version mas optimizada y reutilizable.

---

## Experimento 5 – Refactorizar validación de tareas

### Problema

Se pretende obtener un código  HTML más limpio y mantenible 
---

### Solución sin IA

```
@tailwind base;
@tailwind components;
@tailwind utilities;

```

Tiempo aproximado: **4 minutos**

---

### Solución con IA

Prompt utilizado:

```
Tailwind : Extraer componentes reutilizables con @apply , crea clases como .card, .badge, .btn-primary en el CSS fuente (input.css) usando @layer components.
```

Código sugerido por la IA:

```
@tailwind utilities; @layer components { 
.card { @apply bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:scale-105 transition; } 
.badge { @apply text-xs px-2 py-1 rounded-full; } 
.btn-primary { @apply bg-sky-500 text-white hover:bg-sky-600 transition; } }

```

Tiempo aproximado: **1 minuto**

---

### Comparación

La versión generada con IA fue refactorizazada y mejorarada, creando en el código clases reutilizables (card, badge, btn-primary)

---

## Experimento 6 – Mejorar el filtrado de tareas

### Problema

Poca reutilización además de código difícil de mantener

---

### Solución sin IA

```javascript
// tasks-ui.js

import { getTasks, addTask, toggleTask } from "./tasks.js";

const list = document.querySelector("#taskList");
const input = document.querySelector("#taskInput");
const button = document.querySelector("#addTaskBtn");

// renderizar tareas
e// tasks-ui.js

import { getTasks, addTask, toggleTask } from "./tasks.js";

const list = document.querySelector("#taskList");
const input = document.querySelector("#taskInput");
const button = document.querySelector("#addTaskBtn");

// Ejemplo archivo tasks-ui.js
export function renderTasks() {
  list.innerHTML = "";

  const tasks = getTasks();

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.textContent = task.text;

    if (task.completed) {
      li.classList.add("line-through");
    }

    li.addEventListener("click", () => {
      toggleTask(task.id);
      renderTasks();
    });

    list.appendChild(li);
  });
}
```

Tiempo aproximado: **15 minutos**

---

### Solución con IA

Prompt utilizado:

```
Separar los modulos en tasks.js , tasks-ui.js, theme.js para reusar las tareas 
```

Código sugerido por la IA:

```javascript
function renderAllTasks() {
  if (!list) return;
  list.innerHTML = "";
  const tasks = TaskStore.getTasks();
  tasks.forEach((task) => renderTask(task));
}
```

Tiempo aproximado: **1 minuto**

---

### Comparación

La solución generada con IA reduce código duplicado y mejora la legibilidad .

---

# Conclusión

Los experimentos muestran que el uso de herramientas de inteligencia artificial puede acelerar significativamente el desarrollo de pequeñas funcionalidades.

La IA permite:

- generar soluciones más rápidas
- sugerir mejores prácticas de programación
- permite la automatización de tareas

Sin embargo, sigue siendo necesario revisar el código generado para asegurar que cumple los requisitos del proyecto y es entendible.
# Flujo de trabajo con Cursor

## Introducción

En este documento describo mi primer contacto con Cursor como entorno de desarrollo asistido por inteligencia artificial mientras trabajaba en el proyecto TaskFlow.

Cursor integra herramientas de inteligencia artificial directamente en el editor de código, lo que permite generar funciones, refactorizar código, pedir explicaciones sobre partes del proyecto y realizar cambios en múltiples archivos utilizando lenguaje natural.

El objetivo de este ejercicio fue explorar las principales funcionalidades de Cursor y entender cómo puede mejorar el flujo de trabajo de un desarrollador.

---

# Exploración de la interfaz

Al abrir el proyecto TaskFlow en Cursor se pueden identificar varias partes importantes de la interfaz:

- **Explorador de archivos**: permite navegar por las carpetas y archivos del proyecto.
- **Terminal integrada**: permite ejecutar comandos como Git, npm u otros sin salir del editor.
- **Chat con IA**: un asistente que permite hacer preguntas sobre el código o pedir sugerencias.
- **Editor de código**: área principal donde se escribe y modifica el código.
- **Composer**: herramienta que permite generar cambios que afectan a varios archivos del proyecto.

Estas herramientas permiten trabajar con inteligencia artificial de forma integrada dentro del proceso de desarrollo.

---

# Autocompletado usando comentarios

Una de las funcionalidades más útiles de Cursor es generar código a partir de comentarios.

Ejemplo de comentario escrito en el editor:

```javascript
// función que recibe un array de tareas y devuelve solo las tareas completadas
function getCompletedTasks(tasks) {
  return tasks.filter(task => task.completed);
}

## Uso de Composer

Utilicé Composer para generar cambios en varios archivos del proyecto.

Prompt utilizado:

Añade manejo de errores usando try/catch en las funciones que obtienen o actualizan tareas y actualiza los archivos donde se utilizan.

Resultado:

Cursor analizó el proyecto y propuso añadir bloques try/catch en las funciones que interactúan con las tareas.

También añadió mensajes de error utilizando console.error para facilitar la depuración.

Esto mejoró la robustez del código y ayudó a manejar posibles errores durante la ejecución.

## Atajos de teclado utilizados

Durante el uso de Cursor utilicé varios atajos de teclado que facilitan la interacción con las herramientas de inteligencia artificial y mejoran la productividad durante el desarrollo.

| Atajo de teclado | Función |
|------------------|--------|
| Ctrl + K | Editar o refactorizar código utilizando IA (edición inline) |
| Ctrl + I | Abrir Composer para generar cambios en múltiples archivos |
| Ctrl + P | Buscar archivos rápidamente dentro del proyecto |
| Ctrl + F | Buscar texto dentro del documento|

El uso de estos atajos permite trabajar de forma más rápida y aprovechar mejor las funcionalidades de inteligencia artificial integradas en Cursor.
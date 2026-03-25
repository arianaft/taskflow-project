/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} text
 * @property {boolean} completed
 */

import { getTasks, createTask, deleteTask } from "./network/client.js";

/**
 * Validación del texto de una tarea
 * @param {string} text
 * @returns {{ isValid: boolean, errorMessage: string | null }}
 */
function validateTask(text) {
  const trimmedText = (text ?? "").trim();

  if (!trimmedText) {
    return { isValid: false, errorMessage: "La tarea no puede estar vacía" };
  }

  if (trimmedText.length > 100) {
    return { isValid: false, errorMessage: "La tarea es demasiado larga (máx. 100 caracteres)" };
  }

  return { isValid: true, errorMessage: null };
}

/**
 * Obtiene las tareas desde el backend.
 * @returns {Promise<Task[]>}
 */
export async function fetchTasks() {
  return await getTasks();
}

/**
 * Crea una tarea en el backend.
 * @param {string} text
 * @returns {Promise<{ task?: Task, error?: string }>}
 */
export async function addTask(text) {
  const validation = validateTask(text);

  if (!validation.isValid) {
    return { error: validation.errorMessage };
  }

  const task = await createTask(text.trim());
  return { task };
}

/**
 * Elimina una tarea del backend.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function removeTask(id) {
  await deleteTask(id);
}

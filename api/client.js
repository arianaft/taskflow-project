/**
 * Capa de red del frontend.
 * Todas las peticiones HTTP al servidor Node.js pasan por aquí.
 */

const BASE_URL = "http://localhost:3000/api/v1/tasks";

/**
 * Helper interno: lanza error con mensaje legible si la respuesta no es 2xx.
 * @param {Response} response
 * @returns {Promise<any>}
 */
async function handleResponse(response) {
  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const data = await response.json();
      message = data.error || message;
    } catch {
      // Si el body no es JSON (ej. 204 No Content) 
    }
    throw new Error(message);
  }

  // 204 No Content no tiene body
  if (response.status === 204) return null;

  return response.json();
}

/**
 * Obtiene todas las tareas del servidor.
 * @returns {Promise<Task[]>}
 */
export async function getTasks() {
  const response = await fetch(BASE_URL);
  return handleResponse(response);
}

/**
 * Crea una tarea nueva.
 * @param {string} text
 * @returns {Promise<Task>}
 */
export async function createTask(text) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return handleResponse(response);
}

/**
 * Elimina una tarea por ID.
 * @param {string} id
 * @returns {Promise<null>}
 */
export async function deleteTask(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}

/**
 * Alterna el estado completed de una tarea.
 * @param {string} id
 * @returns {Promise<Task>}
 */
export async function toggleTask(id) {
  const response = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PATCH",
  });
  return handleResponse(response);
}

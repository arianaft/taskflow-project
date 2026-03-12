# Prompt Engineering aplicado al desarrollo

En este documento se recopilan diferentes ejemplos de prompts utilizados para interactuar con herramientas de inteligencia artificial durante el desarrollo del proyecto TaskFlow.

Se experimentó con diferentes técnicas de prompt engineering como:

- definición de roles
- few-shot prompting
- razonamiento paso a paso
- restricciones claras en la respuesta

Estas técnicas ayudan a obtener respuestas más precisas y útiles al trabajar con asistentes de inteligencia artificial.

---

# Prompts utilizados

## Prompt 1 – Definir un rol

Prompt:

Actúa como un desarrollador senior de JavaScript y revisa el siguiente código. Explica posibles mejoras y buenas prácticas que se podrían aplicar.

Por qué funciona:

Definir un rol ayuda a orientar la respuesta del modelo hacia un tipo de conocimiento específico. En este caso, pedir que actúe como un desarrollador senior hace que la respuesta sea más técnica y centrada en buenas prácticas.

---

## Prompt 2 – Refactorización de código

Prompt:

Refactoriza la siguiente función para mejorar la legibilidad del código y utilizar nombres de variables más claros.

Por qué funciona:

Este prompt define claramente la tarea que se espera: mejorar la legibilidad. Las instrucciones específicas ayudan al modelo a centrarse en una mejora concreta del código.

---

## Prompt 3 – Explicación de código

Prompt:

Explica paso a paso qué hace la siguiente función de JavaScript.

Por qué funciona:

Pedir una explicación paso a paso obliga al modelo a estructurar mejor la respuesta y facilita la comprensión del código.

---

## Prompt 4 – Generar documentación

Prompt:

Genera comentarios JSDoc para la siguiente función de JavaScript.

Por qué funciona:

Este prompt es útil para generar documentación automática en el código, lo que mejora la mantenibilidad del proyecto.

---

## Prompt 5 – Few-shot prompting

Prompt:

Convierte estas funciones a un estilo más limpio eliminando variables innnecesarias y mejorando la legibilidad


Ejemplo 1:

function validateTask(text) {
  const taskText = text ?? "";
  const trimmedTaskText = taskText.trim();

  if (!trimmedTaskText) {
    alert("La tarea no puede estar vacía");
    return false;
  }

  if (taskText.length > MAX_TASK_LENGTH) {
    alert("La tarea es demasiado larga");
    return false;
  }

  return true;
}

Ahora aplica el mismo estilo a la siguiente función.

Por qué funciona:

El few-shot prompting proporciona ejemplos que guían al modelo sobre el formato o estilo esperado en la respuesta.

---

## Prompt 6 – Análisis del proyecto

Prompt:

Analiza la estructura de este proyecto y explica qué archivos son responsables de la lógica principal de la aplicación.

Por qué funciona:

Este prompt permite que la IA analice la estructura del proyecto y ayude a entender mejor la organización del código.

---

## Prompt 7 – Mejora de rendimiento

Prompt:

Analiza esta función y sugiere posibles mejoras de rendimiento o simplificación del código.

Por qué funciona:

Este tipo de prompt permite identificar posibles optimizaciones y mejorar la eficiencia del código.

---

## Prompt 8 – Restricciones claras

Prompt:

Genera una función JavaScript que filtre tareas completadas. La respuesta debe tener menos de 10 líneas de código.

Por qué funciona:

Las restricciones ayudan a controlar el formato y tamaño de la respuesta generada por el modelo.

---

## Prompt 9 – Detección de errores

Prompt:

Encuentra posibles errores o casos límite en la siguiente función.

Por qué funciona:

Este tipo de prompt permite utilizar la IA como herramienta de revisión de código para detectar problemas potenciales.

---

## Prompt 10 – Mejora de nombres de variables

Prompt:

Sugiere nombres de variables más descriptivos para el siguiente fragmento de código.

Por qué funciona:

Los nombres de variables claros son importantes para la legibilidad del código, y la IA puede ayudar a proponer alternativas más descriptivas.
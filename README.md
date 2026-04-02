# ✈️ TaskFlow — Gestor de tareas de viaje

TaskFlow es una aplicación web para organizar y gestionar tareas antes de un viaje. Permite crear, completar y eliminar tareas a través de una interfaz visual conectada a una API REST propia.

---

## Descripción general

El proyecto está dividido en dos partes que trabajan juntas:

- **Frontend**: interfaz visual en HTML, CSS y JavaScript puro que consume la API mediante `fetch`.
- **Backend**: servidor Node.js con Express que expone una API REST bajo `/api/v1/tasks`.

Ambas partes se despliegan como una única aplicación en Vercel.

---

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML + CSS + JavaScript | Interfaz de usuario |
| Tailwind CSS | Estilos del frontend |
| Node.js | Entorno de ejecución del servidor |
| Express | Framework del servidor HTTP |
| cors | Gestión de peticiones entre orígenes |
| dotenv | Variables de entorno |
| swagger-jsdoc + swagger-ui-express | Documentación de la API |
| Vercel | Despliegue del frontend y backend |

---

## Estructura del proyecto

```
taskflow-project/
├── api/
│   └── index.js          # Punto de entrada para Vercel (importa el servidor)
├── network/
│   └── client.js         # Capa de red del frontend (fetch a la API)
├── server/
│   └── src/
│       ├── index.js              # Configuración de Express
│       ├── config/
│       │   ├── env.js            # Variables de entorno
│       │   └── swagger.js        # Configuración de Swagger
│       ├── controllers/
│       │   └── task.controller.js
│       ├── routes/
│       │   └── task.routes.js
│       └── services/
│           └── task.service.js
├── docs/
│   └── backend-api.md    # Documentación de herramientas del backend
├── index.html            # Frontend principal
├── tasks-ui.js           # Lógica de presentación del frontend
├── theme.js              # Toggle de modo oscuro
├── vercel.json           # Configuración de rutas en Vercel
└── README.md             # Este archivo
```

---

## Instalación y ejecución local

### Requisitos previos
- Node.js v18 o superior
- npm

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/taskflow-project.git
cd taskflow-project

# 2. Instala las dependencias del servidor
cd server
npm install

# 3. Crea el archivo de entorno
cp .env.example .env
# Edita .env y añade: PORT=3000

# 4. Arranca el servidor en modo desarrollo
npm run dev
```

Accede a la aplicación en: `http://localhost:3000`

---

## Despliegue en Vercel

El proyecto está desplegado en Vercel y accesible en:

- **Frontend**: https://taskflow-project-arianafts-projects.vercel.app/index.html
- **API**: https://taskflow-project-arianafts-projects.vercel.app/api/v1/tasks
- **Documentación Swagger**: https://taskflow-project-arianafts-projects.vercel.app/api/docs

---

## Documentación de la API

La API está documentada con Swagger. Consulta la documentación interactiva en:

```
https://taskflow-project-arianafts-projects.vercel.app/api/docs
```

Para más detalles técnicos del servidor, consulta el [README del servidor](./server/README.md).

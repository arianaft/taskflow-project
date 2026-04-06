const express = require('express');
const router  = express.Router();
const taskController = require('../controllers/task.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "1716000000000"
 *         text:
 *           type: string
 *           example: "Reservar hotel"
 *         completed:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Obtener todas las tareas
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', taskController.obtenerTodas);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Crear una tarea nueva
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 3
 *                 example: "Reservar hotel"
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Texto inválido
 *         content:
 *           application/json:
 *             example: { "error": "El texto debe tener al menos 3 caracteres" }
 */
router.post('/', taskController.crearTarea);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Eliminar una tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1716000000000"
 *     responses:
 *       204:
 *         description: Tarea eliminada correctamente
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             example: { "error": "Tarea no encontrada" }
 */
router.delete('/:id', taskController.eliminarTarea);

/**
 * @swagger
 * /api/v1/tasks/{id}/toggle:
 *   patch:
 *     summary: Alternar estado completed
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1716000000000"
 *     responses:
 *       200:
 *         description: Estado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             example: { "error": "Tarea no encontrada" }
 */

router.patch('/complete-all', taskController.toggleAll);
router.get('/health', (req, res) => res.json({ ok: true }));
router.patch('/:id/toggle', taskController.toggleTask);

module.exports = router;
const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task.controller');

router.get('/', taskController.obtenerTodas);
router.post('/', taskController.crearTarea);
router.delete('/:id', taskController.eliminarTarea);

module.exports = router;
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

// middleware para validar los datos de un nuevo producto antes de crear uno nuevo
const { validarNuevoProducto } = require('../middlewares/validarProducto.middleware');

router.get('/', productosController.obtenerTodos);
// Ruta para crear un nuevo producto, con validación previa del middleware validarNuevoProducto
router.post('/', validarNuevoProducto, productosController.crearProducto);

// NUEVAS RUTAS
router.get('/:id', productosController.obtenerPorId);
router.put('/:id', productosController.actualizarProducto);
router.delete('/:id', productosController.eliminarProducto);

module.exports = router;
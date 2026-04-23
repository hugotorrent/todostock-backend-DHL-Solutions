const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedores.controller');

router.get('/', proveedoresController.obtenerTodos);
router.get('/:id', proveedoresController.obtenerPorId);
router.post('/', proveedoresController.crearProveedor);
router.put('/:id', proveedoresController.actualizarProveedor);
router.delete('/:id', proveedoresController.eliminarProveedor);

module.exports = router;
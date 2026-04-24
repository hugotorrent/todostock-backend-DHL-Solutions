const Proveedor = require('../models/proveedor.model');
const Producto = require('../models/producto.model');

const obtenerTodos = (req, res) => {
    try {
        res.status(200).json(Proveedor.getAll());
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los proveedores.' });
    }
};

const obtenerPorId = (req, res) => {
    const proveedor = Proveedor.getById(req.params.id);
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado.' });
    res.status(200).json(proveedor);
};

const crearProveedor = (req, res) => {
    const resultado = Proveedor.crear(req.body);
    if (!resultado.ok) return res.status(400).json({ errores: resultado.errores });
    res.status(201).json({ mensaje: 'Proveedor creado.', proveedor: resultado.proveedor });
};

const actualizarProveedor = (req, res) => {
    const resultado = Proveedor.actualizar(req.params.id, req.body);
    if (!resultado.ok && resultado.notFound)
        return res.status(404).json({ error: 'Proveedor no encontrado.' });
    res.status(200).json({ mensaje: 'Proveedor actualizado.', proveedor: resultado.proveedor });
};

const eliminarProveedor = (req, res) => {
    const id = req.params.id;

    // Validación de integridad referencial
    const productos = Producto.getAll();
    const tieneProductos = productos.some(p => p.proveedorId === id);
    if (tieneProductos) {
        return res.status(409).json({
            error: 'Operación denegada: el proveedor tiene productos asociados. Se desactivará en su lugar.'
        });
    }

    const resultado = Proveedor.eliminar(id);
    if (!resultado.ok) return res.status(404).json({ error: 'Proveedor no encontrado.' });
    res.status(200).json({ mensaje: `Proveedor ${id} eliminado.` });
};

module.exports = { obtenerTodos, obtenerPorId, crearProveedor, actualizarProveedor, eliminarProveedor };

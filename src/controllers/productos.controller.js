const Producto = require('../models/producto.model');
const Venta = require('../models/venta.model');

const obtenerTodos = (req, res) => {
    try {
        res.status(200).json(Producto.getAll());
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los productos.' });
    }
};

const obtenerPorId = (req, res) => {
    const producto = Producto.getById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.status(200).json(producto);
};

const crearProducto = (req, res) => {
    const resultado = Producto.crear(req.body);
    if (!resultado.ok) return res.status(400).json({ errores: resultado.errores });
    res.status(201).json({ mensaje: 'Producto creado con éxito.', producto: resultado.producto });
};

const actualizarProducto = (req, res) => {
    const resultado = Producto.actualizar(req.params.id, req.body);
    if (!resultado.ok && resultado.notFound)
        return res.status(404).json({ error: 'Producto no encontrado.' });
    res.status(200).json({ mensaje: 'Producto actualizado.', producto: resultado.producto });
};

const eliminarProducto = (req, res) => {
    const id = Number(req.params.id);

    // Validación de integridad referencial
    const ventas = Venta.getAll();
    const estaEnVentas = ventas.some(v => v.items.some(i => i.productoId === id));
    if (estaEnVentas) {
        return res.status(409).json({
            error: 'Operación denegada: el producto forma parte de una o más ventas registradas.'
        });
    }

    const resultado = Producto.eliminar(id);
    if (!resultado.ok) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.status(200).json({ mensaje: `Producto ${id} eliminado correctamente.` });
};

module.exports = { obtenerTodos, obtenerPorId, crearProducto, actualizarProducto, eliminarProducto };

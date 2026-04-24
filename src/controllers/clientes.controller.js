const Cliente = require('../models/cliente.model');
const Venta = require('../models/venta.model');

const obtenerTodos = (req, res) => {
    try {
        res.status(200).json(Cliente.getAll());
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los clientes.' });
    }
};

const obtenerPorId = (req, res) => {
    const cliente = Cliente.getById(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado.' });
    res.status(200).json(cliente);
};

const crearCliente = (req, res) => {
    const resultado = Cliente.crear(req.body);
    if (!resultado.ok) return res.status(400).json({ errores: resultado.errores });
    res.status(201).json({ mensaje: 'Cliente creado.', cliente: resultado.cliente });
};

const actualizarCliente = (req, res) => {
    const resultado = Cliente.actualizar(req.params.id, req.body);
    if (!resultado.ok && resultado.notFound)
        return res.status(404).json({ error: 'Cliente no encontrado.' });
    res.status(200).json({ mensaje: 'Cliente actualizado.', cliente: resultado.cliente });
};

const eliminarCliente = (req, res) => {
    const id = req.params.id;

    // Validación de integridad referencial
    const ventas = Venta.getAll();
    const tieneVentas = ventas.some(v => v.clienteId === id);
    if (tieneVentas) {
        return res.status(409).json({
            error: 'Operación denegada: el cliente tiene ventas registradas. No se puede eliminar.'
        });
    }

    const resultado = Cliente.eliminar(id);
    if (!resultado.ok) return res.status(404).json({ error: 'Cliente no encontrado.' });
    res.status(200).json({ mensaje: `Cliente ${id} eliminado.` });
};

module.exports = { obtenerTodos, obtenerPorId, crearCliente, actualizarCliente, eliminarCliente };

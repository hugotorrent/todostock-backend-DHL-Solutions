const Venta = require('../models/venta.model');
const Producto = require('../models/producto.model');
const Cliente = require('../models/cliente.model');

const obtenerTodas = (req, res) => {
    res.status(200).json(Venta.getAll());
};

const crearVenta = (req, res) => {
    try {
        const { clienteId, items } = req.body;

        // 1. Validar que el cliente exista
        const cliente = Cliente.getById(clienteId);
        if (!cliente) {
            return res.status(404).json({ error: 'El cliente especificado no existe.' });
        }

        // 2. Verificar stock y calcular total
        const productos = Producto.getAll();
        let totalVenta = 0;

        for (const item of items) {
            const productoDb = productos.find(p => p.id === item.productoId);
            if (!productoDb) {
                return res.status(404).json({ error: `El producto con ID ${item.productoId} no existe.` });
            }
            if (productoDb.stock < item.cantidad) {
                return res.status(400).json({
                    error: `Stock insuficiente para "${productoDb.nombre}". Stock actual: ${productoDb.stock}`
                });
            }
            productoDb.stock -= item.cantidad;
            totalVenta += productoDb.precio * item.cantidad;
            item.precioUnitario = productoDb.precio;
        }

        // 3. Persistir el nuevo stock
        Producto.guardarProductos(productos);

        // 4. Crear la venta usando la clase — aquí entra POO
        const resultado = Venta.crear({
            clienteId: cliente.id,
            razonSocial: cliente.razonSocial,
            items,
            total: totalVenta
        });

        if (!resultado.ok) return res.status(400).json({ errores: resultado.errores });
        res.status(201).json({ mensaje: 'Venta registrada con éxito.', venta: resultado.venta });

    } catch (error) {
        res.status(500).json({ error: 'Error interno al procesar la venta.' });
    }
};

module.exports = { obtenerTodas, crearVenta };

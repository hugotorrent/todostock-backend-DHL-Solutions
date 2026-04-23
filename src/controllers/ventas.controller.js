const VentaModel = require('../models/venta.model');
const ProductoModel = require('../models/producto.model');
const ClienteModel = require('../models/cliente.model');

// Obtener las ventas
const obtenerTodas = (req, res) => {
    const ventas = VentaModel.leerVentas();
    res.status(200).json(ventas);
};

// Crear una venta con validación de cliente, stock y cálculo de total
const crearVenta = (req, res) => {
    try {
        const { clienteId, items } = req.body;
        
        // 1. Validar que el cliente exista
        const clientes = ClienteModel.leerClientes();
        const cliente = clientes.find(c => c.id === clienteId);
        if (!cliente) {
            return res.status(404).json({ error: "El cliente especificado no existe." });
        }

        // 2. Leer productos actuales para verificar stock y calcular el total
        const productos = ProductoModel.leerProductos();
        let totalVenta = 0;

        // Recorremos cada item del pedido
        for (let item of items) {
            // Buscamos el producto en nuestra "base de datos" (el array de productos)
            const productoDb = productos.find(p => p.id === item.productoId);
            
            if (!productoDb) {
                return res.status(404).json({ error: `El producto con ID ${item.productoId} no existe.` });
            }

            if (productoDb.stock < item.cantidad) {
                return res.status(400).json({ 
                    error: `Stock insuficiente para ${productoDb.nombre}. Stock actual: ${productoDb.stock}` 
                });
            }

            // Descontamos el stock temporalmente en memoria
            productoDb.stock -= item.cantidad;
            
            // Calculamos el subtotal de este item
            totalVenta += (productoDb.precio * item.cantidad);
            
            // Le agregamos el precio unitario histórico al registro de la venta
            item.precioUnitario = productoDb.precio;
        }

        // 3.GUARDAMOS el nuevo stock en el archivo productos.json
        ProductoModel.guardarProductos(productos);

        // 4. Generamos y guardamos la nueva venta
        const ventas = VentaModel.leerVentas();
        const nuevaVenta = {
            id: `vta-${ventas.length > 0 ? ventas.length + 1 : 1}`,
            fecha: new Date().toISOString(),
            clienteId: cliente.id,
            razonSocial: cliente.razonSocial, // Guardamos el nombre
            items: items,
            total: totalVenta
        };

        ventas.push(nuevaVenta);
        VentaModel.guardarVentas(ventas);

        res.status(201).json({ mensaje: "Venta registrada con éxito", venta: nuevaVenta });

    } catch (error) {
        res.status(500).json({ error: "Error interno al procesar la venta." });
    }
};

module.exports = { obtenerTodas, crearVenta };
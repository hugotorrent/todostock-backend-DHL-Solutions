const ProductoModel = require('../models/producto.model');
const VentaModel = require('../models/venta.model'); // Importamos el modelo de ventas para validar

// Obtener todos los productos (GET)
const obtenerTodos = (req, res) => {
    try {
        const productos = ProductoModel.leerProductos();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al leer los productos" });
    }
};

// Crear un nuevo producto (POST)
const crearProducto = (req, res) => {
    try {
        const productos = ProductoModel.leerProductos();
        const nuevoProducto = req.body;

        // Autogenerar un ID simple
        nuevoProducto.id = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;

        // Guardar en el "array" y luego en el archivo JSON
        productos.push(nuevoProducto);
        ProductoModel.guardarProductos(productos);

        res.status(201).json({ mensaje: "Producto creado con éxito", producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el producto" });
    }
};

// Obtener un solo producto por su ID (GET /api/productos/:id)
const obtenerPorId = (req, res) => {
    const id = parseInt(req.params.id); // Capturamos el ID de la URL
    const productos = ProductoModel.leerProductos();
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(producto);
};

// Actualizar un producto (PUT /api/productos/:id)
const actualizarProducto = (req, res) => {
    const id = parseInt(req.params.id);
    let productos = ProductoModel.leerProductos();
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado para actualizar" });
    }

    // Actualizamos los datos, pero mantenemos el ID original por seguridad
    productos[index] = { ...productos[index], ...req.body, id: id };
    ProductoModel.guardarProductos(productos);

    res.status(200).json({ mensaje: "Producto actualizado", producto: productos[index] });
};

// Eliminar un producto (DELETE /api/productos/:id)
const eliminarProducto = (req, res) => {
    const id = parseInt(req.params.id);

    // VALIDACIÓN DE INTEGRIDAD REFERENCIAL: Antes de eliminar, verificamos si el producto está presente en alguna venta registrada
    const ventas = VentaModel.leerVentas();
    // Buscamos si ALGUNA venta tiene ALGÚN item con este ID de producto específico
    const estaEnVentas = ventas.some(venta => 
        venta.items.some(item => item.productoId === id)
    );

    if (estaEnVentas) {
        // Bloqueamos la eliminación y devolvemos el código 409 (Conflicto)
        return res.status(409).json({ 
            error: "Operación denegada: No se puede eliminar el producto porque ya forma parte de una o más ventas registradas." 
        });
    }
    

    let productos = ProductoModel.leerProductos();
    
    // Filtramos el array dejando todos MENOS el que queremos eliminar
    const productosFiltrados = productos.filter(p => p.id !== id);

    // Si la longitud es la misma, significa que no encontró el ID para borrar
    if (productos.length === productosFiltrados.length) {
        return res.status(404).json({ error: "Producto no encontrado para eliminar" });
    }

    ProductoModel.guardarProductos(productosFiltrados);
    res.status(200).json({ mensaje: `Producto con ID ${id} eliminado correctamente` });
};

module.exports = { obtenerTodos, crearProducto, obtenerPorId, actualizarProducto, eliminarProducto };
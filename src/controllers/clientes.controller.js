const ClienteModel = require('../models/cliente.model');
const VentaModel = require('../models/venta.model'); // Para validar que un cliente no tenga ventas asociadas antes de eliminarlo

const obtenerTodos = (req, res) => {
    try {
        const clientes = ClienteModel.leerClientes();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: "Error al leer los clientes" });
    }
};

const obtenerPorId = (req, res) => {
    const id = req.params.id;
    const clientes = ClienteModel.leerClientes();
    const cliente = clientes.find(c => c.id === id);

    if (!cliente) {
        return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json(cliente);
};

const crearCliente = (req, res) => {
    try {
        const clientes = ClienteModel.leerClientes();
        const nuevoCliente = req.body;

        const nuevoNum = clientes.length > 0 
            ? parseInt(clientes[clientes.length - 1].id.split('-')[1]) + 1 
            : 1;
        nuevoCliente.id = `cli-${nuevoNum.toString().padStart(3, '0')}`;
        
        if (nuevoCliente.activo === undefined) nuevoCliente.activo = true;

        clientes.push(nuevoCliente);
        ClienteModel.guardarClientes(clientes);

        res.status(201).json({ mensaje: "Cliente creado", cliente: nuevoCliente });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el cliente" });
    }
};

const actualizarCliente = (req, res) => {
    const id = req.params.id;
    let clientes = ClienteModel.leerClientes();
    const index = clientes.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Cliente no encontrado" });
    }

    clientes[index] = { ...clientes[index], ...req.body, id: id };
    ClienteModel.guardarClientes(clientes);

    res.status(200).json({ mensaje: "Cliente actualizado", cliente: clientes[index] });
};

const eliminarCliente = (req, res) => {
    const id = req.params.id;

    // --- NUEVA LÓGICA DE VALIDACIÓN ---
    // Leemos las ventas para verificar si el cliente tiene historial activo 
    const ventas = VentaModel.leerVentas();
    const tieneVentas = ventas.some(venta => venta.clienteId === id);

    if (tieneVentas) {
        // Bloqueamos la eliminación si hay dependencia entre módulos 
        return res.status(409).json({ 
            error: "Operación denegada: No se puede eliminar el cliente porque tiene pedidos registrados en el sistema." 
        });
    }

    let clientes = ClienteModel.leerClientes();
    const clientesFiltrados = clientes.filter(c => c.id !== id);

    if (clientes.length === clientesFiltrados.length) {
        return res.status(404).json({ error: "Cliente no encontrado" });
    }

    ClienteModel.guardarClientes(clientesFiltrados);
    res.status(200).json({ mensaje: `Cliente ${id} eliminado correctamente` });
};

module.exports = { obtenerTodos, obtenerPorId, crearCliente, actualizarCliente, eliminarCliente };
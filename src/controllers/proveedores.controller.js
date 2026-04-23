const ProveedorModel = require('../models/proveedor.model');

const obtenerTodos = (req, res) => {
    try {
        const proveedores = ProveedorModel.leerProveedores();
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ error: "Error al leer los proveedores" });
    }
};

const obtenerPorId = (req, res) => {
    const id = req.params.id; //  ID es un texto
    const proveedores = ProveedorModel.leerProveedores();
    const proveedor = proveedores.find(p => p.id === id);

    if (!proveedor) {
        return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.status(200).json(proveedor);
};

const crearProveedor = (req, res) => {
    try {
        const proveedores = ProveedorModel.leerProveedores();
        const nuevoProveedor = req.body;

        // autogenerar un ID como "prov-003"
        const nuevoNum = proveedores.length > 0 
            ? parseInt(proveedores[proveedores.length - 1].id.split('-')[1]) + 1 
            : 1;
        nuevoProveedor.id = `prov-${nuevoNum.toString().padStart(3, '0')}`;
        
        // Por defecto, un proveedor nuevo entra activo
        if (nuevoProveedor.activo === undefined) nuevoProveedor.activo = true;

        proveedores.push(nuevoProveedor);
        ProveedorModel.guardarProveedores(proveedores);

        res.status(201).json({ mensaje: "Proveedor creado", proveedor: nuevoProveedor });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el proveedor" });
    }
};

const actualizarProveedor = (req, res) => {
    const id = req.params.id;
    let proveedores = ProveedorModel.leerProveedores();
    const index = proveedores.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    proveedores[index] = { ...proveedores[index], ...req.body, id: id };
    ProveedorModel.guardarProveedores(proveedores);

    res.status(200).json({ mensaje: "Proveedor actualizado", proveedor: proveedores[index] });
};

const eliminarProveedor = (req, res) => {
    const id = req.params.id;
    let proveedores = ProveedorModel.leerProveedores();
    const proveedoresFiltrados = proveedores.filter(p => p.id !== id);

    if (proveedores.length === proveedoresFiltrados.length) {
        return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    ProveedorModel.guardarProveedores(proveedoresFiltrados);
    res.status(200).json({ mensaje: `Proveedor ${id} eliminado` });
};

module.exports = { obtenerTodos, obtenerPorId, crearProveedor, actualizarProveedor, eliminarProveedor };
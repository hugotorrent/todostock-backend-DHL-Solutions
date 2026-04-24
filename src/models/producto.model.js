const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/productos.json');

class Producto {
    constructor({ nombre, precio, stock, stockMinimo = 0, proveedorId, proveedorNombre }) {
        // ID numérico autoincremental: busca el mayor ID actual y suma 1
        const lista = Producto._leer();
        const maxId = lista.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
        this.id              = maxId + 1;
        this.nombre          = nombre;
        this.precio          = Number(precio);
        this.stock           = Number(stock);
        this.stockMinimo     = Number(stockMinimo);
        this.proveedorId     = proveedorId;
        this.proveedorNombre = proveedorNombre || '';
    }

    // El objeto se valida a sí mismo
    validar() {
        const errores = [];
        if (!this.nombre || this.nombre.trim() === '')
            errores.push('El nombre del producto es obligatorio.');
        if (isNaN(this.precio) || this.precio < 0)
            errores.push('El precio debe ser un número mayor o igual a 0.');
        if (isNaN(this.stock) || this.stock < 0)
            errores.push('El stock debe ser un número mayor o igual a 0.');
        if (!this.proveedorId)
            errores.push('El proveedorId es obligatorio.');
        return errores;
    }


    //  --MÉTODOS ESTÁTICOS — operan sobre la colección completa---

    static _leer() {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }

    static _guardar(productos) {
        fs.writeFileSync(dataPath, JSON.stringify(productos, null, 2));
    }

    // Alias para compatibilidad con app.js
    static leerProductos() { return Producto._leer(); }
    static guardarProductos(lista) { Producto._guardar(lista); }

    static getAll() {
        return Producto._leer();
    }

    static getById(id) {
        return Producto._leer().find(p => p.id === Number(id)) || null;
    }

    static crear(datos) {
        const nuevo = new Producto(datos);
        const errores = nuevo.validar();
        if (errores.length > 0) return { ok: false, errores };

        const productos = Producto._leer();
        productos.push(nuevo);
        Producto._guardar(productos);
        return { ok: true, producto: nuevo };
    }

    static actualizar(id, datos) {
        const productos = Producto._leer();
        const index = productos.findIndex(p => p.id === Number(id));
        if (index === -1) return { ok: false, notFound: true };

        productos[index] = { ...productos[index], ...datos, id: Number(id) };
        Producto._guardar(productos);
        return { ok: true, producto: productos[index] };
    }

    static eliminar(id) {
        const productos = Producto._leer();
        const filtrados = productos.filter(p => p.id !== Number(id));
        if (filtrados.length === productos.length) return { ok: false, notFound: true };
        Producto._guardar(filtrados);
        return { ok: true };
    }
}

module.exports = Producto;
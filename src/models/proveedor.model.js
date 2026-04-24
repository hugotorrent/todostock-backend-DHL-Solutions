const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/proveedores.json');

class Proveedor {
    constructor({ nombre, contacto, telefono, cuit = '' }) {
        // ID autoincremental con formato "prov-001", "prov-002", etc.
        const lista = Proveedor._leer();
        const ultimo = lista[lista.length - 1];
        const numero = ultimo
            ? parseInt(ultimo.id.replace('prov-', '')) + 1
            : 1;
        this.id       = `prov-${String(numero).padStart(3, '0')}`;
        this.nombre   = nombre;
        this.contacto = contacto;
        this.telefono = telefono;
        this.cuit      = cuit;
        this.activo   = true;
    }

    validar() {
        const errores = [];
        if (!this.nombre || this.nombre.trim() === '')
            errores.push('El nombre del proveedor es obligatorio.');
        if (!this.contacto || this.contacto.trim() === '')
            errores.push('El contacto es obligatorio.');
        if (!this.telefono || this.telefono.trim() === '')
            errores.push('El teléfono es obligatorio.');
        return errores;
    }

    static _leer() {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }

    static _guardar(lista) {
        fs.writeFileSync(dataPath, JSON.stringify(lista, null, 2));
    }

    static leerProveedores() { return Proveedor._leer(); }
    static guardarProveedores(lista) { Proveedor._guardar(lista); }

    static getAll() {
        return Proveedor._leer();
    }

    static getById(id) {
        return Proveedor._leer().find(p => p.id === id) || null;
    }

    static crear(datos) {
        const nuevo = new Proveedor(datos);
        const errores = nuevo.validar();
        if (errores.length > 0) return { ok: false, errores };

        const lista = Proveedor._leer();
        lista.push(nuevo);
        Proveedor._guardar(lista);
        return { ok: true, proveedor: nuevo };
    }

    static actualizar(id, datos) {
        const lista = Proveedor._leer();
        const index = lista.findIndex(p => p.id === id);
        if (index === -1) return { ok: false, notFound: true };

        lista[index] = { ...lista[index], ...datos, id };
        Proveedor._guardar(lista);
        return { ok: true, proveedor: lista[index] };
    }

    static desactivar(id) {
        const lista = Proveedor._leer();
        const index = lista.findIndex(p => p.id === id);
        if (index === -1) return { ok: false, notFound: true };

        lista[index].activo = false;
        Proveedor._guardar(lista);
        return { ok: true, proveedor: lista[index] };
    }

    static eliminar(id) {
        const lista = Proveedor._leer();
        const filtrados = lista.filter(p => p.id !== id);
        if (filtrados.length === lista.length) return { ok: false, notFound: true };
        Proveedor._guardar(filtrados);
        return { ok: true };
    }
}

module.exports = Proveedor;
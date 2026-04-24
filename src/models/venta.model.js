const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/ventas.json');

class Venta {
    constructor({ clienteId, razonSocial, items, total }) {
        // ID autoincremental con formato "vta-001", "vta-002", etc.
        const lista = Venta._leer();
        const ultimo = lista[lista.length - 1];
        const numero = ultimo
            ? parseInt(ultimo.id.replace('vta-', '')) + 1
            : 1;
        this.id          = `vta-${String(numero).padStart(3, '0')}`;
        this.fecha       = new Date().toISOString();
        this.clienteId   = clienteId;
        this.razonSocial = razonSocial;
        this.items       = items;
        this.total       = total;
    }

    // El objeto se valida a sí mismo
    validar() {
        const errores = [];
        if (!this.clienteId)
            errores.push('El clienteId es obligatorio.');
        if (!this.items || !Array.isArray(this.items) || this.items.length === 0)
            errores.push('La venta debe contener al menos un item.');
        this.items?.forEach((item, i) => {
            if (!item.productoId)
                errores.push(`Item ${i + 1}: productoId es obligatorio.`);
            if (!item.cantidad || item.cantidad <= 0)
                errores.push(`Item ${i + 1}: la cantidad debe ser mayor a 0.`);
        });
        return errores;
    }

    // ================================================================
    //  MÉTODOS ESTÁTICOS — operan sobre la colección completa
    // ================================================================

    static _leer() {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }

    static _guardar(lista) {
        fs.writeFileSync(dataPath, JSON.stringify(lista, null, 2));
    }

    // Alias para compatibilidad con app.js
    static leerVentas() { return Venta._leer(); }
    static guardarVentas(lista) { Venta._guardar(lista); }

    static getAll() {
        return Venta._leer();
    }

    static getById(id) {
        return Venta._leer().find(v => v.id === id) || null;
    }

    static crear({ clienteId, razonSocial, items, total }) {
        const nueva = new Venta({ clienteId, razonSocial, items, total });
        const errores = nueva.validar();
        if (errores.length > 0) return { ok: false, errores };

        const lista = Venta._leer();
        lista.push(nueva);
        Venta._guardar(lista);
        return { ok: true, venta: nueva };
    }
}

module.exports = Venta;
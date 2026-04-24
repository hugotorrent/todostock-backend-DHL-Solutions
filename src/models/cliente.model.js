const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/clientes.json');

class Cliente {
    constructor({ razonSocial, cuit, modalidad = 'contado' }) {
        // ID autoincremental con formato "cli-001", "cli-002", etc.
        const lista = Cliente._leer();
        const ultimo = lista[lista.length - 1];
        const numero = ultimo
            ? parseInt(ultimo.id.replace('cli-', '')) + 1
            : 1;
        this.id          = `cli-${String(numero).padStart(3, '0')}`;
        this.razonSocial = razonSocial;
        this.cuit        = cuit;
        this.modalidad   = modalidad;
        this.activo      = true;
    }

    validar() {
        const errores = [];
        if (!this.razonSocial || this.razonSocial.trim() === '')
            errores.push('La razón social es obligatoria.');
        if (!this.cuit || this.cuit.trim() === '')
            errores.push('El CUIT es obligatorio.');
        const modalidadesValidas = ['contado', 'cuenta_corriente'];
        if (!modalidadesValidas.includes(this.modalidad))
            errores.push(`La modalidad debe ser: ${modalidadesValidas.join(' o ')}.`);
        return errores;
    }

    static _leer() {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }

    static _guardar(lista) {
        fs.writeFileSync(dataPath, JSON.stringify(lista, null, 2));
    }

    static leerClientes() { return Cliente._leer(); }
    static guardarClientes(lista) { Cliente._guardar(lista); }

    static getAll() {
        return Cliente._leer();
    }

    static getById(id) {
        return Cliente._leer().find(c => c.id === id) || null;
    }

    static crear(datos) {
        const nuevo = new Cliente(datos);
        const errores = nuevo.validar();
        if (errores.length > 0) return { ok: false, errores };

        const lista = Cliente._leer();
        lista.push(nuevo);
        Cliente._guardar(lista);
        return { ok: true, cliente: nuevo };
    }

    static actualizar(id, datos) {
        const lista = Cliente._leer();
        const index = lista.findIndex(c => c.id === id);
        if (index === -1) return { ok: false, notFound: true };

        lista[index] = { ...lista[index], ...datos, id };
        Cliente._guardar(lista);
        return { ok: true, cliente: lista[index] };
    }

    static desactivar(id) {
        const lista = Cliente._leer();
        const index = lista.findIndex(c => c.id === id);
        if (index === -1) return { ok: false, notFound: true };

        lista[index].activo = false;
        Cliente._guardar(lista);
        return { ok: true, cliente: lista[index] };
    }

    static eliminar(id) {
        const lista = Cliente._leer();
        const filtrados = lista.filter(c => c.id !== id);
        if (filtrados.length === lista.length) return { ok: false, notFound: true };
        Cliente._guardar(filtrados);
        return { ok: true };
    }
}

module.exports = Cliente;
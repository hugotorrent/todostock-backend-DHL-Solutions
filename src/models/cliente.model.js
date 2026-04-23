const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/clientes.json');

const leerClientes = () => {
    const contenido = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(contenido);
};

const guardarClientes = (clientes) => {
    fs.writeFileSync(dataPath, JSON.stringify(clientes, null, 2));
};

module.exports = { leerClientes, guardarClientes };
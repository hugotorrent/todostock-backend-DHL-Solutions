const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/proveedores.json');

const leerProveedores = () => {
    const contenido = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(contenido);
};

const guardarProveedores = (proveedores) => {
    fs.writeFileSync(dataPath, JSON.stringify(proveedores, null, 2));
};

module.exports = { leerProveedores, guardarProveedores };
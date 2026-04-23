const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/ventas.json');

const leerVentas = () => {
    const contenido = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(contenido);
};

const guardarVentas = (ventas) => {
    fs.writeFileSync(dataPath, JSON.stringify(ventas, null, 2));
};

module.exports = { leerVentas, guardarVentas };
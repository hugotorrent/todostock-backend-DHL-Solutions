const fs = require('fs');
const path = require('path');

// Ruta absoluta a nuestro archivo JSON
const dataPath = path.join(__dirname, '../data/productos.json');

// Función para leer los productos
const leerProductos = () => {
    const contenido = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(contenido);
};

// Función para guardar los productos
const guardarProductos = (productos) => {
    fs.writeFileSync(dataPath, JSON.stringify(productos, null, 2));
};

module.exports = { leerProductos, guardarProductos };
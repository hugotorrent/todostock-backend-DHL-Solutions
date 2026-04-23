const registrarPeticion = (req, res, next) => {
    const fecha = new Date().toLocaleString('es-AR');
    // Imprime por consola el método (GET, POST), la URL y la hora
    console.log(`[${fecha}] Petición entrante: ${req.method} ${req.url}`);
    
    // next() permite que la petición continúe hacia el siguiente middleware o ruta
    next(); 
};

module.exports = { registrarPeticion };
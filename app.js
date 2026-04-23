const express = require('express');
const app = express();
const port = 3000;

// --- IMPORTACIÓN DE MODELOS (Para las vistas Pug) ---
const ProductoModel = require('./src/models/producto.model');
const ProveedorModel = require('./src/models/proveedor.model');
const ClienteModel = require('./src/models/cliente.model');
const VentaModel = require('./src/models/venta.model');

// --- IMPORTACIÓN DE RUTAS API ---
const productosRoutes = require('./src/routes/productos.routes');
const proveedoresRoutes = require('./src/routes/proveedores.routes');
const clientesRoutes = require('./src/routes/clientes.routes');
const ventasRoutes = require('./src/routes/ventas.routes');

// --- CONFIGURACIÓN DE PUG ---
app.set('view engine', 'pug');
app.set('views', './src/views'); // Directorio de archivos de diseño 

// --- MIDDLEWARES ---
app.use(express.json()); // Para procesar JSON en el body

// Middleware de Logger Personalizado
const { registrarPeticion } = require('./src/middlewares/logger.middleware');
app.use(registrarPeticion); // Registro global de peticiones 

// --- RUTAS DE VISTAS WEB (PUG) ---


app.get('/', (req, res) => {
    res.render('index'); // Menú Principal
});

app.get('/productos', (req, res) => {
    const productos = ProductoModel.leerProductos();
    res.render('productos', { productos });
});

app.get('/proveedores', (req, res) => {
    const proveedores = ProveedorModel.leerProveedores();
    res.render('proveedores', { proveedores });
});

app.get('/clientes', (req, res) => {
    const clientes = ClienteModel.leerClientes();
    res.render('clientes', { clientes });
});

app.get('/ventas', (req, res) => {
    const ventas = VentaModel.leerVentas();
    res.render('ventas', { ventas });
});

// --- RUTAS DE LA API (JSON) ---

app.use('/api/productos', productosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);

// --- ARRANQUE DEL SERVIDOR ---
app.listen(port, () => {
    console.log(`Servidor de TodoStock S.A. corriendo en http://localhost:${port}`);
});
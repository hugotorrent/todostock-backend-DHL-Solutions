# TodoStock S.A. — Sistema de Gestión Mayorista

**DSWB_2#_#################_1C26**  
Tecnicatura Superior en Desarrollo de Software — IFTS N° 29  
Materia: Desarrollo Web Backend | Primera Entrega 2026

---

##  Descripción

API REST para la gestión interna de la **Distribuidora Mayorista TodoStock S.A.** (Caso 3). Permite administrar proveedores, productos, clientes y ventas con validaciones de integridad referencial entre módulos. Los datos se persisten en archivos JSON y las vistas se renderizan con el motor de plantillas Pug.

---

##  Integrantes

| Nombre | Rol |
|--------|-----|
| — NyA 1 — | Tech Lead / Módulo Ventas |
| — NyA 2 — | Módulos Productos y Proveedores |
| — NyA 3 — | Vistas Pug y pruebas ThunderClient |
| —   — | Módulo Clientes y archivos JSON |
| —   — | Documentación y video |

---

##  Tecnologías

- **Node.js** — entorno de ejecución
- **Express.js** — framework web y enrutamiento
- **Pug** — motor de plantillas para las vistas
- **JSON** — persistencia de datos
- **Nodemon** — recarga automática en desarrollo
- **ThunderClient** — pruebas de la API

---

##  Estructura del proyecto

```
todostock-app/
├── app.js                        ← Punto de entrada
├── package.json
└── src/
    ├── models/
    │   ├── producto.model.js
    │   ├── proveedor.model.js
    │   ├── cliente.model.js
    │   └── venta.model.js
    ├── controllers/
    │   ├── producto.controller.js
    │   ├── proveedor.controller.js
    │   ├── cliente.controller.js
    │   └── venta.controller.js
    ├── routes/
    │   ├── productos.routes.js
    │   ├── proveedores.routes.js
    │   ├── clientes.routes.js
    │   └── ventas.routes.js
    ├── middlewares/
    │   └── logger.middleware.js
    ├── views/
    │   ├── index.pug
    │   ├── productos.pug
    │   ├── proveedores.pug
    │   ├── clientes.pug
    │   └── ventas.pug
    └── data/
        ├── productos.json
        ├── proveedores.json
        ├── clientes.json
        └── ventas.json
```

---

##  Instalación y ejecución

**Requisitos previos:** Node.js v18 o superior

```bash
# 1. Clonar el repositorio
git clone https://github.com/— tu usuario —/todostock-app.git
cd todostock-app

# 2. Instalar dependencias (incluye express, pug y nodemon)
npm install

# 3. Iniciar el servidor (modo desarrollo)
npm run dev

# 4. Iniciar el servidor (modo producción)
npm start
```

El servidor queda disponible en: `http://localhost:3000`

---

##  Vistas web (Pug)

| Ruta | Vista |
|------|-------|
| `GET /` | Menú principal |
| `GET /proveedores` | Listado de proveedores |
| `GET /productos` | Listado de productos |
| `GET /clientes` | Listado de clientes |
| `GET /ventas` | Listado de ventas |

---

##  Endpoints de la API

### Proveedores — `/api/proveedores`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/proveedores` | Lista todos los proveedores |
| GET | `/api/proveedores/:id` | Obtiene un proveedor por ID |
| POST | `/api/proveedores` | Crea un nuevo proveedor |
| PUT | `/api/proveedores/:id` | Actualiza un proveedor |
| DELETE | `/api/proveedores/:id` | Desactiva un proveedor |

### Productos — `/api/productos`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Lista productos con datos del proveedor |
| GET | `/api/productos/:id` | Obtiene un producto por ID |
| POST | `/api/productos` | Crea un producto (requiere proveedorId válido) |
| PUT | `/api/productos/:id` | Actualiza datos o reasigna proveedor |
| DELETE | `/api/productos/:id` | Elimina o desactiva el producto |

### Clientes — `/api/clientes`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clientes` | Lista todos los clientes |
| GET | `/api/clientes/:id` | Obtiene un cliente por ID |
| POST | `/api/clientes` | Registra un nuevo cliente |
| PUT | `/api/clientes/:id` | Actualiza datos del cliente |
| DELETE | `/api/clientes/:id` | Desactiva el cliente |

### Ventas — `/api/ventas`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ventas` | Lista ventas con cliente y productos |
| GET | `/api/ventas/:id` | Obtiene una venta por ID |
| POST | `/api/ventas` | Registra una venta (valida stock) |
| PUT | `/api/ventas/:id` | Modifica la venta |
| DELETE | `/api/ventas/:id` | Cancela la venta y repone stock |

---

##  Ejemplos de uso

**Crear un proveedor:**
```json
POST /api/proveedores
{
  "nombre": "LogiSupply S.R.L.",
  "contacto": "Juan Pérez",
  "telefono": "011-4444-5555",
  "ruc": "20123456789"
}
```

**Crear un producto:**
```json
POST /api/productos
{
  "nombre": "Harina 000 x 50kg",
  "precio": 4500,
  "stock": 200,
  "proveedorId": 1
}
```

**Registrar una venta:**
```json
POST /api/ventas
{
  "clienteId": 1,
  "productos": [
    { "productoId": 1, "cantidad": 10 },
    { "productoId": 2, "cantidad": 5 }
  ]
}
```

---

##  Validaciones implementadas

- Campos obligatorios verificados antes de persistir
- `proveedorId` debe existir y estar activo al crear un producto
- `clienteId` debe existir y estar activo al registrar una venta
- Stock verificado antes de confirmar una venta
- No se puede eliminar un proveedor con productos activos (se desactiva)
- No se puede eliminar un cliente con ventas registradas (se desactiva)
- El total de la venta se calcula automáticamente (`precio × cantidad`)
- Al cancelar una venta se repone el stock de los productos

---

##  Middleware

**Logger** — registra cada petición HTTP en consola:
```
[2026-04-22T10:35:12.000Z] POST /api/ventas
[2026-04-22T10:35:20.000Z] GET  /api/productos
```

---

##  Links

-  Carpeta Drive: —  —
-  Video explicativo: —  —

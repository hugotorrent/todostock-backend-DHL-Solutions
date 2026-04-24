# TodoStock S.A. — Sistema de Gestión Mayorista

**DSWB_2#_#################_1C26**  
Tecnicatura Superior en Desarrollo de Software — IFTS N° 29  
Materia: Desarrollo Web Backend | Primera Entrega 2026

---

##  Descripción

API REST para la gestión interna de la **Distribuidora Mayorista TodoStock S.A.** (Caso 3). Permite administrar proveedores, productos, clientes y ventas con validaciones de integridad referencial entre módulos. Los datos se persisten en archivos JSON y las vistas se renderizan con el motor de plantillas Pug.

La arquitectura aplica **Programación Orientada a Objetos (POO)**: cada módulo define una `class` con constructor, método `validar()` propio y métodos estáticos CRUD. Los controladores solo orquestan el flujo HTTP sin contener lógica de negocio.

---

##  Integrantes

| Nombre | Rol |
|--------|-----|
| — Integrante 1 — | Tech Lead / Módulo Ventas |
| — Integrante 2 — | Módulos Productos y Proveedores |
| — Integrante 3 — | Vistas Pug y pruebas ThunderClient |
| — Integrante 4 — | Módulo Clientes y archivos JSON |
| — Integrante 5 — | Documentación y video |

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
g/
├── app.js                        ← Punto de entrada
├── package.json
└── src/
    ├── models/
    │   ├── producto.model.js     ← class Producto (POO)
    │   ├── proveedor.model.js    ← class Proveedor (POO)
    │   ├── cliente.model.js      ← class Cliente (POO)
    │   └── venta.model.js        ← class Venta (POO)
    ├── controllers/
    │   ├── productos.controller.js
    │   ├── proveedores.controller.js
    │   ├── clientes.controller.js
    │   └── ventas.controller.js
    ├── routes/
    │   ├── productos.routes.js
    │   ├── proveedores.routes.js
    │   ├── clientes.routes.js
    │   └── ventas.routes.js
    ├── middlewares/
    │   ├── logger.middleware.js           ← registra método, ruta y timestamp
    │   └── validarProducto.middleware.js  ← valida body antes de crear producto
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
git clone https://github.com/hugotorrent/todostock-backend-DHL-Solutions.git
cd todostock-backend-DHL-Solutions

# 2. Instalar dependencias (incluye express, pug y nodemon)
npm install

# 3. Iniciar el servidor (modo desarrollo)
npm run dev


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
| DELETE | `/api/proveedores/:id` | Elimina un proveedor |

### Productos — `/api/productos`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Lista productos con datos del proveedor |
| GET | `/api/productos/:id` | Obtiene un producto por ID |
| POST | `/api/productos` | Crea un producto (requiere proveedorId válido) |
| PUT | `/api/productos/:id` | Actualiza datos o reasigna proveedor |
| DELETE | `/api/productos/:id` | Elimina el producto si no tiene ventas |

### Clientes — `/api/clientes`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clientes` | Lista todos los clientes |
| GET | `/api/clientes/:id` | Obtiene un cliente por ID |
| POST | `/api/clientes` | Registra un nuevo cliente |
| PUT | `/api/clientes/:id` | Actualiza datos del cliente |
| DELETE | `/api/clientes/:id` | Elimina el cliente si no tiene ventas |

### Ventas — `/api/ventas`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ventas` | Lista todas las ventas |
| POST | `/api/ventas` | Registra una venta (valida cliente y stock) |

---

##  Ejemplos de uso

**Crear un proveedor:**
```json
POST /api/proveedores
{
  "nombre": "AgroInsumos del Norte",
  "contacto": "María Gómez",
  "telefono": "264-555-1234",
  "cuit": "30-99887766-1"
}
```

**Crear un producto:**
```json
POST /api/productos
{
  "nombre": "Lavandina 1L",
  "precio": 850,
  "stock": 100,
  "stockMinimo": 30,
  "proveedorId": "prov-001",
  "proveedorNombre": "Limpio S.A."
}
```

**Registrar una venta:**
```json
POST /api/ventas
{
  "clienteId": "cli-001",
  "items": [
    { "productoId": 1, "cantidad": 3 },
    { "productoId": 2, "cantidad": 5 }
  ]
}
```

**Crear un cliente:**
```json
POST /api/clientes
{
  "razonSocial": "Almacén Don Roberto",
  "cuit": "20-33445566-7",
  "modalidad": "cuenta_corriente"
}
```

---

##  Validaciones implementadas

Las validaciones viven dentro de cada clase modelo (método `validar()`), no en los controladores:

- **Producto:** nombre, precio ≥ 0, stock ≥ 0 y `proveedorId` obligatorios
- **Proveedor:** nombre, contacto y teléfono obligatorios; campo `cuit` opcional
- **Cliente:** razón social y CUIT obligatorios; modalidad debe ser `contado` o `cuenta_corriente`
- **Venta:** `clienteId` obligatorio, al menos un item, cantidad > 0 por item

Validaciones de integridad referencial (en controladores, al cruzar módulos):

- No se puede eliminar un proveedor que tenga productos asociados → error 409
- No se puede eliminar un cliente que tenga ventas registradas → error 409
- No se puede eliminar un producto que figure en ventas → error 409
- Stock verificado antes de confirmar una venta → error 400 si insuficiente
- El total de la venta se calcula automáticamente (`precio × cantidad`)

---

##  Arquitectura POO

Cada módulo implementa una `class` con responsabilidades bien separadas:

```
┌─────────────────────────────────────────────────────────┐
│  class Producto                                         │
│                                                         │
│  constructor()   → define la forma del objeto y el ID  │
│  validar()       → el objeto se valida a sí mismo      │
│                                                         │
│  static getAll()      → lee todos del JSON             │
│  static getById()     → busca por ID                   │
│  static crear()       → new Producto() + validar()     │
│  static actualizar()  → mezcla datos y persiste        │
│  static eliminar()    → filtra y persiste              │
└─────────────────────────────────────────────────────────┘
```

**IDs autoincrementales por módulo:**

| Módulo | Formato | Ejemplo |
|--------|---------|---------|
| Proveedor | `prov-XXX` | `prov-001`, `prov-002` |
| Producto | numérico | `1`, `2`, `3` |
| Cliente | `cli-XXX` | `cli-001`, `cli-002` |
| Venta | `vta-XXX` | `vta-001`, `vta-002` |

**Flujo de un POST:**
```
Request → Controlador → Modelo.crear(datos)
                              ↓
                        new Clase(datos)      ← constructor genera el ID
                              ↓
                        instancia.validar()   ← método de instancia
                              ↓
                        _guardar(lista)       ← persiste en JSON
                              ↓
                        { ok: true, objeto }
                              ↓
         Controlador → res.status(201).json(...)
```

Los controladores **no generan IDs, no arman objetos, no validan campos** — eso es responsabilidad exclusiva de la clase.

---

##  Middleware

**Logger** — registra cada petición HTTP en consola:
```
[24/4/2026, 08:44:15] Petición entrante: GET /
[24/4/2026, 08:44:17] Petición entrante: GET /proveedores
```

**validarProducto** — middleware aplicado en la ruta `POST /api/productos` que verifica el body antes de llegar al controlador.

---

## 🔗 Links

-  Carpeta Drive: —   —
-  Video explicativo: —  —
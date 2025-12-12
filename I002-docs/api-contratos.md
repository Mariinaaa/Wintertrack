# API Contratos
Este documento describe los contratos y endpoints de dos microservicios del proyecto:  
- **CRM Mini** (Node.js + Express)  
- **IoT WinterTrack** (Python + FastAPI)

# 1. CRM Mini

## 1. Descripción general
Microservicio **CRM Mini**, desarrollado en **Node.js + Express**, que gestiona **clientes** y **pedidos**.  
Los datos se almacenan en ficheros JSON y se validan mediante **AJV** con schemas definidos en `/schemas/`.


## 2. Entidades principales
### Cliente
| Campo          | Tipo   | Descripción         |
|----------------|--------|---------------------|
| clienteId      | string | Identificador único |
| nombreCompleto | string | Nombre completo     |
| email          | string | Correo válido       |
| telefono       | string | Teléfono            |
| ubicacionId    | string | ID ubicación        |
| tipoForfait    | string | Tipo de pase        |
| saldoMonedero  | number | Saldo actual        |

### Pedido
| Campo       | Tipo   | Descripción              |
|-------------|--------|--------------------------|
| pedidoId    | string | Identificador del pedido |
| clienteId   | string | Cliente asociado         |
| fechaPedido | string | Fecha ISO                |
| totalMonto  | number | Importe total            |
| estado      | string | Estado actual            |



## 3. JSON Schemas (resumen)
**cliente.schema.json**
  { "clienteId": "string", "nombreCompleto": "string", "email": "email", "ubicacionId": "string" }
**pedido.schema.json**
  { "pedidoId": "string", "clienteId": "string", "fechaPedido": "date-time", "totalMonto": "number", "estado": "string" }

## 4. Endpoints principales
Método	Ruta	Descripción	Parámetros principales
GET	/clientes	Lista de clientes con paginación y búsqueda	q, ubicacionId, page, pageSize
GET	/clientes/:id	Obtiene un cliente por ID	id
GET	/pedidos	Lista pedidos filtrados	clienteId, estado, page, pageSize
GET	/pedidos/:id	Obtiene un pedido por ID	id

Ejemplo respuesta 200 OK:
  { "clienteId": "C001", "nombreCompleto": "Juan Pérez", "email": "juan@example.com" }

## 5. Códigos HTTP
|Código | Significado                        |
|-------|------------------------------------|
|200	  | OK                                 |
|400	  | Parámetros inválidos               |
|404    | No encontrado                      |
|500    | Error interno o validación fallida |

## 6. Validación
Los datos se validan con AJV y ajv-formats (email, date-time).
Si algún objeto no cumple el schema → HTTP 500.


# 2. IoT WinterTrack

## 1. Descripción general
Microservicio que expone **sensores** y **lecturas** de la estación de esquí, con datos JSON y validación mediante **jsonschema**.

## 2. Entidades principales

#### Sensor
| Campo             | Tipo   | Descripción             |
|-------------------|--------|-------------------------|
| id                | string | Identificador único     |
| tipo              | string | Tipo de sensor          |
| ubicacionId       | string | Ubicación del sensor    |
| estadoOperacional | string | Estado actual           |

#### Lectura
| Campo     | Tipo   | Descripción                  |
|-----------|--------|------------------------------|
| id        | string | Identificador único          |
| sensorId  | string | Sensor asociado              |
| valor     | number | Valor de la medición         |
| unidad    | string | Unidad de medida             |
| timestamp | string | Fecha y hora ISO 8601        |

### 3. JSON Schema (resumen)
**lectura.schema.json**
{
  "id": "string",
  "sensorId": "string",
  "valor": "number",
  "unidad": "string",
  "timestamp": "date-time"
}

### 4. Endpoints principales
Método	Ruta	Descripción	Parámetros principales
GET	/sensores	Lista todos los sensores
GET	/lecturas	Lista lecturas filtradas	sensorId, ubicacionId, from, to, limit=100

Ejemplo respuesta GET /lecturas

[
  {
    "id": "LEC-AF-001",
    "sensorId": "REM-TS01",
    "valor": 150,
    "unidad": "personas",
    "timestamp": "2025-10-16T10:00:00Z"
  }
]

### 5. Códigos HTTP
|Código |	Significado                                      |
|-------|--------------------------------------------------|
|200	  | OK                                               |
|400    |	Parámetros inválidos (ej. fecha ISO mal formada) |
|500    |	Datos no cumplen el schema                       |

### 6. Validación
Cada lectura se valida contra lectura.schema.json usando jsonschema.
Si falla la validación → HTTP 500.

# Pruebas con Postman
Colección exportada:
/docs/postman_collection.json
Endpoints probados:
- crm: /clientes, /clientes/:id, /pedidos, /pedidos/:id, /pedidos/:id - error 404
- iot:  /sensores, /lecturas, /lecturas (con filtros), /lecturas (error de fecha)
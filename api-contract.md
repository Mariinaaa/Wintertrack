# API Unificada: Integración de CRM e IoT

Este documento describe los contratos y endpoints del **servicio API Unificada**, que actúa como capa de integración entre los sistemas **CRM** e **IoT** simulados.

---

## 1. Descripción general

La **API Unificada** centraliza el acceso a los datos de clientes, sensores y lecturas, obteniéndolos en tiempo real desde:

- CRM (clientes y pedidos)  
- IoT (sensores y lecturas)  

El servicio unifica la información, valida la respuesta contra un **JSON Schema unificado** y la expone a clientes externos (Postman, web, dashboards, etc.).

**Objetivos principales:**

- Consultar datos en tiempo real desde CRM e IoT.  
- Unificar la información en estructuras de datos consolidadas.  
- Validar las respuestas con JSON Schema unificado.  
- Ofrecer endpoints listos para clientes finales.  

---

## 2. Endpoints principales

### GET /clientes/detalle

- **Descripción:** Devuelve la lista de clientes enriquecidos con sensores asociados y sus lecturas.  
- **Parámetros query:**  
  - `page` (opcional) → número de página  
  - `pageSize` (opcional) → tamaño de página  

---

### GET /resumen

- **Descripción:** Devuelve un resumen por ubicación con la cantidad de sensores, lecturas totales y clientes asociados.  
- **Parámetros query:** Ninguno.  

---

## 3. Códigos HTTP

| Código | Significado                                     |
|--------|-----------------------------------------------|
| 200    | OK                                            |
| 400    | Parámetros inválidos                           |
| 404    | Recurso no encontrado                          |
| 500    | Error interno o validación contra JSON Schema |
| 503    | Servicio CRM o IoT no disponible              |

---

## 4. Validación

- Todas las respuestas se validan con **AJV** y el **JSON Schema unificado** (`/schemas/unified.schemas.json`).  
- Si algún objeto no cumple el schema, se devuelve **HTTP 500** con detalle de errores.

---

## 5. Pruebas con Postman

- **Colección exportada:** `/docs/postman_api_unificada.json`  
- **Endpoints probados:**  
  - `/clientes/detalle`  
  - `/resumen`  

### 5.1 Test automáticos en Postman

Se añadieron **tests en Postman** para validar:

- Test de estado HTTP
        pm.test("Status code is 200", function () {
            pm.response.to.have.status(200);
        });

- Test de estructura (comprobando campos principales)
        pm.test("Response has required fields", function () {
            var jsonData = pm.response.json();
            pm.expect(jsonData.data[0]).to.have.property("clienteId");
            pm.expect(jsonData.data[0]).to.have.property("nombreCompleto");
            pm.expect(jsonData.data[0]).to.have.property("email");
            pm.expect(jsonData.data[0]).to.have.property("sensores");
        });

- Test de que los sensores tienen lecturas
        pm.test("Sensores tienen lecturas", function () {
            var jsonData = pm.response.json();
            jsonData.data.forEach(cliente => {
                cliente.sensores.forEach(sensor => {
                    pm.expect(sensor).to.have.property("lecturas");
                });
            });
        });
Los tests se guardan en la colección Postman y se pueden exportar en /docs/postman_api_unificada.json.

Al ejecutar la colección se valida automáticamente que los endpoints devuelvan:
- Status 200
- Estructura completa según JSON Schema
- Lecturas en cada sensor

## 6. Uso recomendado

Iniciar API Unificada en localhost:4000.
Abrir colección Postman /docs/postman_api_unificada.json.
Ejecutar tests en cada endpoint para verificar respuesta y validación del schema.
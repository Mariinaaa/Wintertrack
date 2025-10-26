# Modelo de Datos Común: WinterTrack

Este documento describe las entidades clave y sus relaciones, estableciendo el estándar de datos que utilizará la API Unificada para integrar la información de los sistemas CRM, ERP y el IoT fragmentado.

## 1. Identificación y Función de entidades

Hemos clasificado las entidades en dos grupos principales para reflejar los sistemas de origen:

### A. Entidades administrativas

Estas entidades gestionan los aspectos comerciales y de servicio al cliente.

* Cliente:
    * **Tipo de Sistema:** CRM.
    * **Función:** Gestiona la información del usuario, el tipo de forfait y el saldo precargado. Es clave para la personalización de la experiencia y la seguridad.
* Pedido:
    * **Tipo de Sistema:** ERP.
    * **Función:** Registra las transacciones financieras y comerciales (compra de forfait, alquiler). Es esencial para el control de inventario y facturación.

### B. Entidades Operacionales (IoT / Mantenimiento)

Estas entidades capturan la información del entorno físico y la infraestructura.

* **Remonte:**
    * **Tipo de Sistema:** Operacional/IoT (Infraestructura).
    * **Función:** Representa la instalación física del remonte. Su propósito es contextualizar las lecturas del sensor y permitir el monitoreo de su estado general.
* **LecturaSensor:**
    * **Tipo de Sistema:** Operacional/IoT (Datos).
    * **Función:** Entidad fundamental para la **monitorización en tiempo real**. Captura el dato crudo (vibración, temperatura, aforo) junto con su marca de tiempo.

---

## 2. Relación entre Entidades

El modelo se basa en referencias de identificadores (`string` de ID) que permiten a la API Unificada consolidar la información.

### Relación 1: Cliente -> Pedido (1:N)

* **Explicación:** Un **Cliente** (`Cliente.clienteId`) puede generar **Múltiples Pedidos** a lo largo del tiempo.
* **Mecanismo:** El campo `Pedido.clienteId` actúa como la clave foránea, referenciando a `Cliente.clienteId`.

### Relación 2: Remonte -> LecturaSensor (1:N)

* **Explicación:** Un **Remonte** (`Remonte.remonteId`) genera **Múltiples LecturasSensor** (datos) en alta frecuencia.
* **Mecanismo:** El campo `LecturaSensor.remonteId` actúa como clave foránea, referenciando a `Remonte.remonteId`.

---

## 3. Decisiones Clave (Justificación de Campos)

### Enfoque de Integración (IoT y Arquitectura)

* **Separación de Infraestructura y Datos:** Se eligió separar la entidad **`Remonte`** (estable) de **`LecturaSensor`** (alto volumen y alta frecuencia). Esto permite que el tráfico de datos crudos no sature la información estática del remonte y facilita el mantenimiento predictivo.
* **Campos de Relación:** Se usan IDs de referencia como `remonteId` y `clienteId` para **facilitar la consulta cruzada** en la API Unificada, que es el objetivo central del proyecto.

### Justificación de Campos Específicos

* **`Cliente.saldoMonedero`:** Incluimos este campo para permitir la integración futura de servicios de **pago rápido** (monedero virtual), fusionando datos de fidelización (CRM) con puntos de venta (ERP).
* **`Pedido.estado` (uso de `enum`):** Se define un conjunto limitado de estados (ej. "Completado", "Pendiente de Pago") para **estandarizar** la comunicación del ciclo de vida de la transacción a través de todos los sistemas.
* **`Remonte.estadoOperacional` (uso de `enum`):** Este campo es **crítico para la integración**. Es el dato que debe ser actualizado en tiempo real (basado en `LecturaSensor` y mantenimientos) y consumido por la aplicación del cliente (CRM/App) para informar sobre cierres o retrasos.
* **`LecturaSensor.fechaHora` (Formato ISO 8601):** El uso del formato `"date-time"` estandarizado es **vital** para asegurar que todas las fuentes de datos (sistemas antiguos, nuevos sensores) utilicen el **mismo huso horario** y formato, previniendo errores de sincronización en el análisis de eventos.
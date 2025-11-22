# Arquitectura Inicial – Proyecto WinterTrack

## Diagrama de Componentes

### Descripción general
La arquitectura está diseñada para ser simple, funcional y escalable. La API unificada actúa como punto central de conexión entre usuarios, CRM e IoT, organizando y combinando los datos para ofrecerlos listos para usar.

### Componentes principales
- **API Unificada**: núcleo del sistema. Recibe peticiones de usuarios (cliente, empleado, gestor) y de la interfaz web. Coordina los servicios y entrega datos consolidados.
- **CRM**: gestiona información administrativa como clientes, pedidos, facturas y pagos.
- **IoT**: proporciona datos operativos desde sensores y máquinas (remontes, lecturas, temperaturas, vibraciones).
- **Base de Datos**: almacena la información combinada para consultas y reportes.
- **Interfaz Web / Postman**: punto de acceso para visualizar la información unificada.

### Flujos de comunicación
- Comunicación vía REST sobre HTTP, con datos en formato JSON.
- La API realiza llamadas como:
  - `GET /clientes`, `GET /pedidos` al CRM
  - `GET /lecturas`, `GET /remontes` al IoT
- Usuarios interactúan con la API mediante la web o Postman.

### Ventajas de esta arquitectura
- **Centralización**: todos los datos pasan por la API, que los combina y entrega.
- **Mantenimiento sencillo**: cambios en CRM o IoT no afectan a clientes ni interfaz.
- **Control y seguridad**: validación, autenticación y autorización centralizadas en la API.

---

## Diagrama de Contenedores

Representa los principales bloques de software del sistema.

### API Unificada
Conecta y coordina los servicios, procesando peticiones de usuarios.

### Servicios conectados
- **CRM**: datos administrativos.
- **IoT**: datos de sensores y remontes.
- **Ticketing**: control de accesos y autenticación.

### Base de Datos
Centraliza la información combinada de todos los servicios.

### Sistemas externos
- **Pasarela de Pagos** (Stripe, PayPal): procesamiento de transacciones.
- **ERP**: gestión de órdenes de mantenimiento generadas por IoT.

### Acceso de usuarios
- **Navegador Web**: para gestores.
- **Aplicación Cliente**: para clientes y empleados.

### Comunicación
- REST sobre HTTP
- Formato JSON

---

## Diagrama Lógico

Representa las relaciones entre entidades del sistema.

### Relaciones entre entidades

- Un cliente puede estar vinculado a múltiples registros en el CRM, lo que permite gestionar varias interacciones, pedidos o facturas por cada cliente (relación 1:N).

- Cada registro en el CRM está gestionado por un único gestor, aunque un mismo gestor puede encargarse de múltiples clientes o cuentas (relación N:1).

- El CRM está directamente conectado con el servicio, permitiendo que la información administrativa fluya hacia los procesos operativos sin intermediarios.

- El servicio se vincula directamente con el sistema IoT, lo que permite asociar datos técnicos y lecturas de sensores con los servicios prestados.

- Cada empleado puede estar asignado a un único remote, que representa un punto de control o dispositivo físico, aunque varios empleados pueden compartir el mismo (relación N:1).

- Un remonte puede estar conectado a varios dispositivos IoT, permitiendo la supervisión y control de múltiples sensores desde un único punto (relación 1:N).

- Cada dispositivo IoT genera una única orden de mantenimiento, lo que asegura trazabilidad directa entre el estado del sensor y la acción correctiva (relación 1:1).

- Finalmente, cada orden de mantenimiento está asignada a un único empleado, cerrando el ciclo operativo con responsabilidad clara sobre la ejecución de la tarea (relación 1:1).


### Propósito del diseño lógico
Visualizar cómo se estructuran y relacionan usuarios, servicios y dispositivos para facilitar la gestión y el análisis de datos.


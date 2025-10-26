# Contexto del proyecto: WinterTrack

WinterTrack es una empresa especializada en la digitalización integral de estaciones de esquí, con un enfoque en la mejora de la experiencia del cliente y la optimización de los recursos operativos mediante sensores IoT.

## 1. Actividad principal

WinterTrack trabaja para estaciones de esquí y centros de deportes de invierno. Sus actividades clave incluyen:

* **Operación y Seguridad:** Mantenimiento y gestión segura de las pistas de esquí y de toda la infraestructura de transporte (telesillas, telecabinas, cintas).
* **Servicios al Cliente:** Venta de forfaits, alquiler de material, escuela de esquí y gestión de servicios de restauración.
* **Gestión de Recursos:** Control de consumos energéticos, optimización de inventarios y uso eficiente del agua para la producción de nieve artificial.

---

## 2. Sistemas de Información existentes

Actualmente, los sistemas de la estación de esquí operan como segmentación de datos, lo que impide una visión entera del negocio:

### A. Sistemas de negocio

* **CRM:**
    * Gestiona la base de datos de clientes, el historial de forfaits y las reservas.
    * **Fallo:** No tiene acceso a datos de uso de remontes o estados de operación en tiempo real.
* **ERP:**
    * Sistema para la gestión financiera, compras, inventario y RR.HH.
    * Fallo: No está conectado a los datos operativos de mantenimiento o a los consumos energéticos de la infraestructura.

### B. Sistemas operacionales y IoT fragmentado

* **Sensores de pistas:** Estaciones meteorológicas y sensores de nieve.
    * Fallo: Solo ofrecen una visualización básica y los datos se exportan manualmente una vez al día.
* **Controladores de Remontes (PLCs):** Gestionan velocidad y estado de los remontes.
    * Fallo: Los registros de fallos solo son accesibles desde la sala de control local.
* **Sistema de Ticketing (Acceso):** Tornos que leen los forfaits.
    * Fallo: La información de paso de cliente (aforo) se procesa al final del día, sin impacto inmediato en la gestión de colas.

---

## 3. Problema de Integración a Resolver

El principal desafío es la falta de una visión unificada y en tiempo real entre los datos operacionales (IoT) y los datos de negocio (CRM/ERP).

### El Problema en acción

Cuando un sensor detecta una alta vibración en un telesilla:

* **No hay comunicación al ERP:** No se genera automáticamente una orden de trabajo de mantenimiento ni se verifica la disponibilidad de repuestos.
* **No hay comunicación al CRM:** No se alerta a los clientes en la aplicación móvil sobre un posible retraso o cierre.
* **No hay cruce de datos:** No se puede usar la información de aforo para determinar el impacto real en los esquiadores y redirigirlos activamente a otras zonas.

### Objetivo del Proyecto de integración

El proyecto busca integrar los datos de los sensores IoT (nieve, temperatura, vibración, aforo) en una Plataforma Central de Datos (API Unificada). Esta plataforma permitirá que todos los sistemas consuman la información en tiempo real para:

* **Mantenimiento Predictivo:** Activar órdenes de trabajo automáticas en el ERP.
* **Mejora del Cliente:** Informar en tiempo real a los esquiadores sobre estados de remontes y aforos.
* **Optimización de Recursos:** Usar datos de nieve y temperatura en tiempo real para optimizar los sistemas de innovación.

# Microservicios del Proyecto – Tema 2: Integración de Aplicaciones

Este documento describe dos microservicios del proyecto: un CRM Mini y un servicio de IoT WinterTrack.  

## 1. Servicio CRM Mini (Node.js + Express)

### Descripción general
Este microservicio simula un sistema CRM.  
Proporciona datos estáticos de clientes y opcionalmente de pedidos, almacenados en ficheros JSON.  

### Requisitos previos
- Node.js v18 o superior  
- npm  
- Visual Studio Code 

### Instalación
cd services/crm

npm install

npm start

### Ejecución
Para iniciar el servicio, ejecuta: npm start

El servidor quedará disponible en http://localhost:3000

## 2. Servicio de IoT – WinterTrack (Python + FastAPI)

### Descripción general
Este microservicio expone datos de sensores y lecturas de la estación de esquí.

### Requisitos previos
Python 3.10 o superior
Entorno virtual recomendado

### Instalación
- Activar entorno virtual: 
    .venv\Scripts\activate.bat

- Instalar dependencias: 
    pip install -r requirements.txt

### Ejecución
Para iniciar el servidor en modo desarrollo:

uvicorn main:app --reload --port 8002

El servicio quedará disponible en http://localhost:8002.

## 3. EJemplos de comprobaciones
crm:
- clientes: http://127.0.0.1:8000/lecturas
    - Para ver los 50 clientes y no solo los 25 primeros: http://localhost:3001/clientes?pageSize=50
    - Para flitar por nombre: http://localhost:3001/clientes?q=nombre_del_cliente_que_queramos_buscar
- pedidos: http://localhost:3001/pedidos
    - Para filtrar por id del cliente al que esta vinculado el pedido: http://localhost:3001/pedidos?clienteId=número_de_id_del_cliente_por_el_que_queramos_filtrar

iot:
- lecturas: http://127.0.0.1:8000/lecturas
- sensores: http://127.0.0.1:8000/sensores


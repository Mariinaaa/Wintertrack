# API Unificada (Tema 3)

Este proyecto integra los microservicios **CRM** e **IoT**, ofreciendo endpoints unificados que combinan información de clientes, pedidos, sensores y lecturas.

## Requisitos previos
Antes de ejecutar esta API unificada, asegúrate de tener corriendo:

1. **CRM**
   - Carpeta: `services/crm`
   - Ejecutar:
     cd services/crm
     npm install
     npm start
   - Por defecto, el CRM corre en: `http://localhost:3001`

2. **IoT**
   - Carpeta: `services/iot`
   - Ejecutar:
     cd services/iot
     pip install -r requirements.txt
     uvicorn main:app --reload

   - Por defecto, IoT corre en: `http://127.0.0.1:8000`

Ambos microservicios deben estar activos antes de levantar la API unificada, ya que ésta depende de sus endpoints.


## Instalación de la API unificada

cd services/api-unificada
npm install

## Ejecutar en desarrollo
npm run dev

## Ejemplos de comprobaciones

Listado completo de clientes enriquecidos:
http://localhost:4000/clientes/detalle

Resumen de ubicaciones con clientes, sensores y total de lecturas:
http://localhost:4000/resumen


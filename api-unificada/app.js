/* 
======================================================================================
Nombre : app.js
Descripcion: Archivo principal de la API. Configura el servidor Express, aplica middleware
             y define las rutas de la API unificada.
Detalle: Configura CORS, JSON parser, define puerto y rutas:
        - GET /clientes/detalle -> getClientesDetalle
        - GET /resumen -> getResumen
---------------------------------------------------------------------------
HISTORICO DE CAMBIOS:

ISSUE         AUTOR              FECHA                   DESCRIPCION
--------      ---------          ---------------         -----------------------------------------------
I001          Marina             22-11-2025              Creación de app.js con configuración básica de Express
======================================================================================
*/

const express = require("express");
const cors = require("cors");

const { 
  getClientesDetalle,
  getResumen
} = require("./controllers/integrationController");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Rutas API Unificada
app.get("/clientes/detalle", getClientesDetalle);
app.get("/resumen", getResumen);

app.listen(PORT, () => {
  console.log(`API Unificada escuchando en http://localhost:${PORT}`);
});

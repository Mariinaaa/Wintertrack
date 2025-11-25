/* 
======================================================================================
Nombre : api.js
Descripcion: Define las rutas de la API y asigna los controladores correspondientes.
Detalle: Rutas disponibles:
        - GET /clientes/detalle -> integrationController.getClientesDetalle
        - GET /resumen -> integrationController.getResumen
---------------------------------------------------------------------------
HISTORICO DE CAMBIOS:

ISSUE         AUTOR              FECHA                   DESCRIPCION
--------      ---------          ---------------         -----------------------------------------------
I001          Marina             22-11-2025              Creación del archivo de rutas
======================================================================================
*/

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/integrationController');

router.get('/clientes/detalle', ctrl.getClientesDetalle);
router.get('/resumen', ctrl.getResumen);

module.exports = router;

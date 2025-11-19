const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/integrationController');

router.get('/clientes/detalle', ctrl.getClientesDetalle);
router.get('/resumen', ctrl.getResumen);

module.exports = router;

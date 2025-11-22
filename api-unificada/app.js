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

const express = require("express");
const fs = require("fs");
const cors = require("cors");

const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configurar AJV
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Cargar schemas
const clienteSchema = JSON.parse(fs.readFileSync("../../schemas/cliente.schema.json"));
const pedidoSchema = JSON.parse(fs.readFileSync("../../schemas/pedido.schema.json"));
const validateCliente = ajv.compile(clienteSchema);
const validatePedido = ajv.compile(pedidoSchema);

// RUTA: GET /clientes
app.get("/clientes", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("./data/clientes.json", "utf-8"));
    const { q, ubicacionId, page = 1, pageSize = 25 } = req.query;

    const pageNum = Number(page);
    const sizeNum = Number(pageSize);

    if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
      return res.status(400).json({ error: "Parámetros de paginación inválidos." });
    }

    let filtered = data;

    if (q) {
      const search = q.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.nombreCompleto.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search)
      );
    }

    if (ubicacionId) {
      filtered = filtered.filter((c) => c.ubicacionId === ubicacionId);
    }

    const start = (pageNum - 1) * sizeNum;
    const paged = filtered.slice(start, start + sizeNum);

    for (const cliente of paged) {
      if (!validateCliente(cliente)) {
        return res.status(500).json({
          error: "Datos no válidos según el schema de cliente.",
          detalles: validateCliente.errors,
        });
      }
    }

    res.json({
      total: filtered.length,
      page: pageNum,
      pageSize: sizeNum,
      data: paged,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar la solicitud de clientes." });
  }
});


// RUTA: GET /clientes/:id
app.get("/clientes/:id", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("./data/clientes.json", "utf-8"));
    const cliente = data.find((c) => c.clienteId === req.params.id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }

    if (!validateCliente(cliente)) {
      return res.status(500).json({ error: "El cliente no cumple con el schema." });
    }

    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al leer los datos del cliente." });
  }
});


// RUTA: GET /pedidos
app.get("/pedidos", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("./data/pedidos.json", "utf-8"));
    const { clienteId, estado, page = 1, pageSize = 25 } = req.query;

    const pageNum = Number(page);
    const sizeNum = Number(pageSize);

    if (isNaN(pageNum) || isNaN(sizeNum) || pageNum < 1 || sizeNum < 1) {
      return res.status(400).json({ error: "Parámetros de paginación inválidos." });
    }

    let filtered = data;

    if (clienteId) {
      filtered = filtered.filter((p) => p.clienteId === clienteId);
    }

    if (estado) {
      filtered = filtered.filter((p) => p.estado === estado);
    }

    const start = (pageNum - 1) * sizeNum;
    const paged = filtered.slice(start, start + sizeNum);

    for (const pedido of paged) {
      if (!validatePedido(pedido)) {
        return res.status(500).json({
          error: "Datos no válidos según el schema de pedido.",
          detalles: validatePedido.errors,
        });
      }
    }

    res.json({
      total: filtered.length,
      page: pageNum,
      pageSize: sizeNum,
      data: paged,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar la solicitud de pedidos." });
  }
});


// RUTA: GET /pedidos/:id
app.get("/pedidos/:id", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("./data/pedidos.json", "utf-8"));
    const pedido = data.find((p) => p.pedidoId === req.params.id);

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado." });
    }

    if (!validatePedido(pedido)) {
      return res.status(500).json({ error: "El pedido no cumple con el schema." });
    }

    res.json(pedido);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al leer los datos del pedido." });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`CRM API corriendo en http://localhost:${port}`);
});

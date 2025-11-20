const { fetchJson } = require("../lib/httpClient");
const { validateCliente } = require("../lib/validator");

const CRM_BASE = "http://localhost:3001";
const IOT_BASE = "http://localhost:8000";

/* --------------------------------------------------
   Construir cliente enriquecido
-----------------------------------------------------*/
function buildClienteEnriquecido(cliente, pedidosCliente, sensoresUbicacion, lecturasPorSensor) {
    return {
        clienteId: cliente.clienteId,
        nombreCompleto: cliente.nombreCompleto,
        email: cliente.email,
        ubicacionId: cliente.ubicacionId,
        sensores: sensoresUbicacion.map(sensor => ({
            sensorId: sensor.id,
            tipo: sensor.tipo,
            estadoOperacional: sensor.estadoOperacional,
            lecturas: lecturasPorSensor
                .filter(l => l.sensorId === sensor.id)
                .map(l => ({
                    id: l.id,
                    valor: l.valor,
                    unidad: l.unidad,
                    timestamp: l.timestamp
                }))
        }))
    };
}

/* ========================================================
   ===============   DETALLE CLIENTES   ====================
   ======================================================== */
async function getClientesDetalle(req, res) {
    // CRM → Clientes
    const clientesResp = await fetchJson(`${CRM_BASE}/clientes?page=1&pageSize=200`);
    if (!clientesResp.ok)
        return res.status(503).json({ error: "CRM no disponible (clientes)", detalles: clientesResp.error });

    // CRM → Pedidos
    const pedidosResp = await fetchJson(`${CRM_BASE}/pedidos?page=1&pageSize=500`);
    if (!pedidosResp.ok)
        return res.status(503).json({ error: "CRM no disponible (pedidos)", detalles: pedidosResp.error });

    // IoT → Sensores
    const sensoresResp = await fetchJson(`${IOT_BASE}/sensores`);
    if (!sensoresResp.ok)
        return res.status(503).json({ error: "IoT no disponible (sensores)", detalles: sensoresResp.error });

    // IoT → Lecturas
    const lecturasResp = await fetchJson(`${IOT_BASE}/lecturas`);
    if (!lecturasResp.ok)
        return res.status(503).json({ error: "IoT no disponible (lecturas)", detalles: lecturasResp.error });

    const clientes = clientesResp.data.data;
    const pedidos = pedidosResp.data.data;
    const sensores = sensoresResp.data;
    const lecturas = lecturasResp.data;

    const resultado = clientes.map(cliente => {
        const pedidosCliente = pedidos.filter(p => p.clienteId === cliente.clienteId);
        const sensoresUbicacion = sensores.filter(s => s.ubicacionId === cliente.ubicacionId);
        const lecturasCliente = lecturas.filter(
            l => sensoresUbicacion.map(s => s.id).includes(l.sensorId)
        );

        return buildClienteEnriquecido(
            cliente,
            pedidosCliente,
            sensoresUbicacion,
            lecturasCliente
        );
    });

    /* ------------------------------------------------------
       Validación AJV del resultado completo
    ---------------------------------------------------------*/
    const errores = resultado
        .map(cliente => validateCliente(cliente))
        .filter(v => !v.valid);

    if (errores.length > 0) {
        console.error("❌ ERROR DE VALIDACIÓN AJV:");
        console.error(errores);

        return res.status(500).json({
            error: "La respuesta no cumple el JSON Schema",
            detalles: errores
        });
    }

    // Respuesta correcta
    res.json({
        total: resultado.length,
        data: resultado
    });
}

/* ========================================================
   ===================== RESUMEN ===========================
   ======================================================== */
async function getResumen(req, res) {
    const clientesResp = await fetchJson(`${CRM_BASE}/clientes?page=1&pageSize=200`);
    if (!clientesResp.ok)
        return res.status(503).json({ error: "CRM no disponible", detalles: clientesResp.error });

    const sensoresResp = await fetchJson(`${IOT_BASE}/sensores`);
    if (!sensoresResp.ok)
        return res.status(503).json({ error: "IoT no disponible (sensores)", detalles: sensoresResp.error });

    const lecturasResp = await fetchJson(`${IOT_BASE}/lecturas`);
    if (!lecturasResp.ok)
        return res.status(503).json({ error: "IoT no disponible (lecturas)", detalles: lecturasResp.error });

    const clientes = clientesResp.data.data;
    const sensores = sensoresResp.data;
    const lecturas = lecturasResp.data;

    const resumen = {};

    for (const sensor of sensores) {
        if (!resumen[sensor.ubicacionId]) {
            resumen[sensor.ubicacionId] = {
                ubicacionId: sensor.ubicacionId,
                clientesAsociados: clientes.filter(
                    c => c.ubicacionId === sensor.ubicacionId
                ).length,
                sensores: [],
                totalLecturas: 0
            };
        }

        const lecturasSensor = lecturas.filter(l => l.sensorId === sensor.id);

        resumen[sensor.ubicacionId].sensores.push({
            sensorId: sensor.id,
            tipo: sensor.tipo,
            estado: sensor.estadoOperacional,
            totalLecturas: lecturasSensor.length
        });

        resumen[sensor.ubicacionId].totalLecturas += lecturasSensor.length;
    }

    res.json(Object.values(resumen));
}

module.exports = {
    getClientesDetalle,
    getResumen
};

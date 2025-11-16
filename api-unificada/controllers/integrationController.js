const axios = require("axios");

const CRM_BASE = "http://localhost:3001";
const IOT_BASE = "http://localhost:8000";

// Construye un cliente con toda la información integrada
function buildClienteEnriquecido(cliente, pedidosCliente, sensoresUbicacion, lecturasPorSensor) {
    return {
        ...cliente,
        pedidos: pedidosCliente,
        sensoresUbicacion,
        lecturasSensores: lecturasPorSensor
    };
}

/* ========================================================
   ===============   DETALLE CLIENTES   ====================
   ======================================================== */
async function getClientesDetalle(req, res) {
    try {
        // CRM → Clientes
        const clientesResp = await axios.get(`${CRM_BASE}/clientes?page=1&pageSize=200`);
        const clientes = clientesResp.data.data;

        // CRM → Pedidos
        const pedidosResp = await axios.get(`${CRM_BASE}/pedidos?page=1&pageSize=500`);
        const pedidos = pedidosResp.data.data;

        // IoT → Sensores
        const sensoresResp = await axios.get(`${IOT_BASE}/sensores`);
        const sensores = sensoresResp.data;

        // IoT → Lecturas
        const lecturasResp = await axios.get(`${IOT_BASE}/lecturas`);
        const lecturas = lecturasResp.data;

        const resultado = clientes.map(cliente => {
            const pedidosCliente = pedidos.filter(p => p.clienteId === cliente.clienteId);

            const sensoresUbicacion = sensores.filter(
                s => s.ubicacionId === cliente.ubicacionId
            );

            const idsSensores = sensoresUbicacion.map(s => s.id);

            const lecturasCliente = lecturas.filter(
                l => idsSensores.includes(l.sensorId)
            );

            return buildClienteEnriquecido(
                cliente,
                pedidosCliente,
                sensoresUbicacion,
                lecturasCliente
            );
        });

        res.json({
            total: resultado.length,
            data: resultado
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Error integrando CRM + IoT",
            detalles: err.message
        });
    }
}

/* ========================================================
   ===================== RESUMEN ===========================
   ======================================================== */
async function getResumen(req, res) {
    try {
        const clientesResp = await axios.get(`${CRM_BASE}/clientes?page=1&pageSize=200`);
        const clientes = clientesResp.data.data;

        const sensoresResp = await axios.get(`${IOT_BASE}/sensores`);
        const sensores = sensoresResp.data;

        const lecturasResp = await axios.get(`${IOT_BASE}/lecturas`);
        const lecturas = lecturasResp.data;

        const resumen = {};

        for (const sensor of sensores) {
            // Siempre creamos entrada por ubicación
            if (!resumen[sensor.ubicacionId]) {
                resumen[sensor.ubicacionId] = {
                    ubicacionId: sensor.ubicacionId,
                    sensores: [],
                    totalLecturas: 0,
                    clientesAsociados: clientes.filter(
                        c => c.ubicacionId === sensor.ubicacionId
                    ).length
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

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Error generando resumen",
            detalles: err.message
        });
    }
}

module.exports = {
    getClientesDetalle,
    getResumen
};

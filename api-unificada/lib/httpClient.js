/* 
======================================================================================
Nombre : httpClient.js
Descripcion: Cliente HTTP basado en Axios con configuración de timeout y headers por defecto.
Detalle: Función principal:
        - fetchJson(url, params): realiza GET y retorna objeto {ok, data/error}
---------------------------------------------------------------------------
HISTORICO DE CAMBIOS:

ISSUE         AUTOR              FECHA                   DESCRIPCION
--------      ---------          ---------------         -----------------------------------------------
I001          Marina             22-11-2025              Creación de fetchJson con manejo de errores
======================================================================================
*/

const axios = require('axios');

const http = axios.create({
  timeout: 6000,
  headers: { 'Content-Type': 'application/json' }
});

async function fetchJson(url, params = {}) {
  try {
    const res = await http.get(url, { params });
    return { ok: true, data: res.data };
  } catch (err) {
    // Normalizar mensaje de error
    const msg = err.response ? `${err.response.status} ${err.response.statusText}` : err.message;
    return { ok: false, error: msg };
  }
}

module.exports = { fetchJson };

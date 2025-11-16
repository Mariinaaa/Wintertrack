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

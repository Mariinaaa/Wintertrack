const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const fs = require("fs");
const path = require("path");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Cargar schema desde /schemas
const schemaPath = path.join(__dirname, "../schemas/unified.schema.json");
const schemaData = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));

const validate = ajv.compile(schemaData);

function validateCliente(cliente) {
    const valid = validate(cliente);
    return { valid, errors: validate.errors || [] };
}

module.exports = { validateCliente };

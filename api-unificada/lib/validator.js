/* 
======================================================================================
Nombre : validator.js
Descripcion: Validador de objetos cliente utilizando AJV y JSON Schema.
Detalle: Función principal:
        - validateCliente(cliente): valida un cliente contra unified.schema.json
---------------------------------------------------------------------------
HISTORICO DE CAMBIOS:

ISSUE         AUTOR              FECHA                   DESCRIPCION
--------      ---------          ---------------         -----------------------------------------------
I001          Marina             22-11-2025              Creación del validador con AJV
======================================================================================
*/

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

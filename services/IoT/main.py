"""
======================================================================================
Nombre: main.py
Descripción: Servicio FastAPI encargado de exponer endpoints REST para obtener
             información de sensores y sus lecturas, aplicando validaciones 
             mediante JSON Schema y filtros opcionales por ubicación y fecha.

Detalle:
    - Funciones incluidas:
        * load_data(filepath)
        * validate_reading(reading_obj)
        * validate_sensor(sensor_obj)
        * get_sensores()
        * get_lecturas(sensorId, ubicacionId, from, to, limit)

---------------------------------------------------------------------------
HISTORICO DE CAMBIOS:
ISSUE     AUTOR    FECHA        DESCRIPCION
--------  -------  -----------  ------------------------------------------------------
I001      Ignacio    13-11-2025   Versión inicial del servicio FastAPI
I002      Ignacio    14-11-2025   Se modifica filtrado de fechas en get_lecturas()
======================================================================================
"""

import json
from fastapi import FastAPI, HTTPException, Query
from jsonschema import validate
from jsonschema.exceptions import ValidationError
from dateutil import parser

app = FastAPI()

# ==============================================================================
# Nombre: load_data(filepath)
# Descripción: Carga un archivo JSON desde disco y devuelve su contenido.
#
# Detalle (parámetros):
#     filepath : str  -> Ruta al archivo JSON a cargar.
#
# HISTORICO DE CAMBIOS:
# ISSUE     AUTOR    FECHA        DESCRIPCION
# I001      Ignacio  13-11-2025   Función creada
# ==============================================================================
def load_data(filepath: str):
    with open(filepath, 'r') as f:
        return json.load(f)


sensores_data = load_data('data/sensores.json')
lecturas_data = load_data('data/lecturas.json')
lectura_schema = load_data('../../schemas/lectura.schema.json')
sensor_schema = load_data('../../schemas/sensor.schema.json')

# ==============================================================================
# Nombre: validate_reading(reading_obj)
# Descripción: Valida una lectura usando el schema lectura_schema. 
#
# Detalle (parámetros):
#     reading_obj : dict  -> Objeto lectura a validar.
#
# HISTORICO DE CAMBIOS:
# ISSUE     AUTOR    FECHA        DESCRIPCION
# I001      Ignacio  13-11-2025   Función creada
# ==============================================================================
def validate_reading(reading_obj):
    try:
        validate(instance=reading_obj, schema=lectura_schema)
    except ValidationError:
        # Lanza una excepción si la validación falla
        raise HTTPException(status_code=500, detail={
                            "error": "Los datos no cumplen el schema definido"})

# ==============================================================================
# Nombre: validate_sensor(sensor_obj)
# Descripción: Valida un sensor usando el schema sensor_schema.
#
# Detalle (parámetros):
#     sensor_obj : dict -> Objeto sensor a validar.
#
# HISTORICO DE CAMBIOS:
# ISSUE     AUTOR    FECHA        DESCRIPCION
# I001      Ignacio  13-11-2025   Función creada
# ==============================================================================
def validate_sensor(sensor_obj):
    try:
        validate(instance=sensor_obj, schema=sensor_schema)
    except ValidationError:
        raise HTTPException(status_code=500, detail={
            "error": "Los datos del sensor no cumplen el schema definido"
        })


# ==============================================================================
# Nombre: get_sensores()
# Descripción: Endpoint GET que devuelve todos los sensores y valida su schema.
#
# Detalle:
#     No recibe parámetros.
#
# HISTORICO DE CAMBIOS:
# ISSUE     AUTOR    FECHA        DESCRIPCION
# I001      Ignacio  13-11-2025   Endpoint creado
# ==============================================================================
@app.get("/sensores")
def get_sensores():
    for sensor in sensores_data:
        validate_sensor(sensor)
    return sensores_data

# ==============================================================================
# Nombre: get_lecturas()
# Descripción: Endpoint GET para consultar lecturas aplicando filtros por:
#              - sensorId
#              - ubicacionId
#              - from/to (ISO 8601)
#              - limit
#
# Detalle (parámetros):
#     sensorId     : str | None
#     ubicacionId  : str | None
#     from         : str | None  -> Alias from_date
#     to           : str | None  -> Alias to_date
#     limit        : int
#
# HISTORICO DE CAMBIOS:
# ISSUE     AUTOR    FECHA        DESCRIPCION
# I001      Ignacio  01-11-2025   Endpoint creado
# I002      Ignacio  14-11-2025   Lógica del filtrado de fechas actualizada
# ==============================================================================
@app.get("/lecturas")
def get_lecturas(
    sensorId: str | None = None,
    ubicacionId: str | None = None,
    from_date: str | None = Query(None, alias="from"),
    to_date: str | None = Query(None, alias="to"),
    limit: int = 100
):
    # Aplicar filtros en orden
    filtered_lecturas = lecturas_data

    if sensorId:
        filtered_lecturas = [
            l for l in filtered_lecturas if l.get('sensorId') == sensorId]

    # Saca solo la información de los sensores en la ubicacion
    if ubicacionId:
        sensores_en_ubicacion = {
            s['id'] for s in sensores_data if s.get('ubicacionId') == ubicacionId}
        filtered_lecturas = [l for l in filtered_lecturas if l.get(
            'sensorId') in sensores_en_ubicacion]

    try:
        from_dt = parser.isoparse(from_date) if from_date else None
        to_dt = parser.isoparse(to_date) if to_date else None

        # Validar que la fecha "from" no sea posterior a la "to" 
        if from_dt and to_dt and from_dt > to_dt:
            raise HTTPException(status_code=400, detail={
                "error": "La fecha 'from' no puede ser posterior a la fecha 'to'"
            })

        # Filtrado de fecha
        if from_dt or to_dt:
            final_filtered = []
            for l in filtered_lecturas:
                timestamp = parser.isoparse(l['timestamp'])                           
                if from_dt and timestamp < from_dt:
                    continue            
                if to_dt and timestamp > to_dt:
                    continue    
                final_filtered.append(l)
            filtered_lecturas = final_filtered
            
    except (ValueError, parser.ParserError):
        raise HTTPException(status_code=400, detail={
                            "error": "El formato de fecha debe ser ISO 8601"})

    result = filtered_lecturas[:limit]

    for lectura in result:
        validate_reading(lectura)

    return result

import json
from fastapi import FastAPI, HTTPException, Query
from jsonschema import validate
from jsonschema.exceptions import ValidationError
from dateutil import parser

app = FastAPI()

# Cargar datos y esquemas al inicio


def load_data(filepath: str):
    with open(filepath, 'r') as f:
        return json.load(f)


sensores_data = load_data('data/sensores.json')
lecturas_data = load_data('data/lecturas.json')
lectura_schema = load_data('../../schemas/lectura.schema.json')

# Función de validación reutilizable


def validate_reading(reading_obj):
    try:
        validate(instance=reading_obj, schema=lectura_schema)
    except ValidationError:
        # Lanza una excepción si la validación falla
        raise HTTPException(status_code=500, detail={
                            "error": "Los datos no cumplen el schema definido"})


@app.get("/sensores")
def get_sensores():
    return sensores_data


@app.get("/lecturas")
def get_lecturas(
    sensorId: str | None = None,
    ubicacionId: str | None = None,
    from_date: str | None = Query(None, alias="from"),
    to_date: str | None = Query(None, alias="to"),
    limit: int = 100
):
    # 1. Aplicar filtros en orden
    filtered_lecturas = lecturas_data

    if sensorId:
        filtered_lecturas = [
            l for l in filtered_lecturas if l.get('sensorId') == sensorId]

    # El filtro por ubicacionId requiere cruzar con la info de sensores
    if ubicacionId:
        sensores_en_ubicacion = {
            s['id'] for s in sensores_data if s.get('ubicacionId') == ubicacionId}
        filtered_lecturas = [l for l in filtered_lecturas if l.get(
            'sensorId') in sensores_en_ubicacion]

    # 2. Manejar y filtrar por fechas
    try:
        if from_date:
            from_dt = parser.isoparse(from_date)
            filtered_lecturas = [
                l for l in filtered_lecturas if parser.isoparse(l['timestamp']) >= from_dt]
        if to_date:
            to_dt = parser.isoparse(to_date)
            filtered_lecturas = [
                l for l in filtered_lecturas if parser.isoparse(l['timestamp']) <= to_dt]
    except (ValueError, parser.ParserError):
        raise HTTPException(status_code=400, detail={
                            "error": "El formato de fecha debe ser ISO 8601"})

    # 3. Aplicar límite
    result = filtered_lecturas[:limit]

    # 4. Validar cada elemento ANTES de devolver la respuesta [cite: 154]
    for lectura in result:
        validate_reading(lectura)

    return result

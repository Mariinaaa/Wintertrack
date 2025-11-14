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
sensor_schema = load_data('../../schemas/sensor.schema.json')

# Función de validación reutilizable


def validate_reading(reading_obj):
    try:
        validate(instance=reading_obj, schema=lectura_schema)
    except ValidationError:
        # Lanza una excepción si la validación falla
        raise HTTPException(status_code=500, detail={
                            "error": "Los datos no cumplen el schema definido"})

def validate_sensor(sensor_obj):
    try:
        validate(instance=sensor_obj, schema=sensor_schema)
    except ValidationError:
        raise HTTPException(status_code=500, detail={
            "error": "Los datos del sensor no cumplen el schema definido"
        })


@app.get("/sensores")
def get_sensores():
    for sensor in sensores_data:
        validate_sensor(sensor)
    return sensores_data


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


    if ubicacionId:
        # Saca solo la información de los sensores en la ubicacion
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


    result = filtered_lecturas[:limit]

    # Validar cada elemento ANTES de devolver la respuesta [cite: 154]
    for lectura in result:
        validate_reading(lectura)

    return result

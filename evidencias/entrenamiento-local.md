# Venue Control · evidencia local

Registro de las comprobaciones ejecutadas en este workspace el 28/10/2026. El backend se inició con Serverless Offline en `http://localhost:3001/dev` porque había otro proceso antiguo escuchando en el puerto 3000. Esta transcripción acredita las respuestas HTTP locales; no sustituye la captura de Thunder Client ni la explicación individual que pide la evaluación.

## Rutas anunciadas por Offline

```text
GET    /dev/zones
GET    /dev/zones/{id}
POST   /dev/zones
PUT    /dev/zones/{id}
PATCH  /dev/zones/{id}
DELETE /dev/zones/{id}
```

## Respuestas observadas

| Petición | Estado | Resultado observado |
|---|---:|---|
| `GET /dev/zones` | 200 | Lista de tres zonas iniciales |
| `GET /dev/zones/ZONE-07` | 200 | Garden Stage, capacidad 2500, estado OPEN |
| `POST /dev/zones` | 201 | Nueva zona River Entrance, capacidad 1200 |
| `PUT /dev/zones/ZONE-07` | 200 | Reemplazo completo; capacidad 2800 |
| `PATCH /dev/zones/ZONE-07` | 200 | Cambio parcial de estado a CLOSED |
| `DELETE /dev/zones/ZONE-18` | 200 | Respuesta `DELETED` |
| `GET /dev/zones/NO-EXISTE` | 404 | Mensaje `Zona no encontrada` |

## Pendiente para la entrega evaluable

- Repetir y capturar las operaciones en Thunder Client desde el equipo del alumno.
- Guardar una captura de Venue Control en el navegador mostrando la lista y una respuesta de acción.
- Conectar AWS Academy, desplegar y registrar el endpoint real, una petición cloud y logs.
- Explicar una petición HTTP de extremo a extremo durante la defensa.

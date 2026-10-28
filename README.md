# 04---SERVERLESS-FRAMEWORK

## Venue Control · entrenamiento evaluable

Aplicación de demostración para consultar y gestionar zonas operativas de un festival. El backend usa TypeScript, Serverless Framework y rutas HTTP; el cliente usa Expo / React Native Web.

## Arquitectura

```text
Navegador / Expo
  → mobile/src/api.ts
  → HTTP local o endpoint API Gateway
  → Serverless Offline / API Gateway
  → handler en backend/src/zones/
  → respuesta JSON
```

El servicio conserva las rutas de Festival Control de los bloques anteriores y añade el contrato `/zones` del entrenamiento.

| Método | Ruta | Uso |
|---|---|---|
| GET | `/zones` | Lista las zonas |
| GET | `/zones/{id}` | Consulta una zona |
| POST | `/zones` | Valida y crea una zona |
| PUT | `/zones/{id}` | Sustituye todos los campos editables |
| PATCH | `/zones/{id}` | Cambia solo el estado |
| DELETE | `/zones/{id}` | Elimina una zona |

Estados aceptados: `OPEN`, `CLOSED`, `MAINTENANCE`. `capacity` debe ser un entero positivo.

## Ejecutar en local

Usa Node.js 22, acorde con el runtime declarado en Serverless y el proyecto Expo.

Terminal 1, desde `backend/`:

```bash
npm ci
npm run typecheck
npm start
```

Serverless Offline debería anunciar la URL local, normalmente `http://localhost:3000/dev`. Si la instalación del Framework o el comando Offline solicita acceso a Serverless, completa `npx serverless login` con la cuenta/licencia indicada por el profesor.

Terminal 2, desde `mobile/`:

```bash
npm ci
npm run typecheck
npm run web
```

La app se sirve normalmente en `http://localhost:8081`. En el navegador, abre Network para comprobar URL, método, payload, estado y respuesta.

## Comprobaciones HTTP con curl

Ejecuta desde Git Bash mientras Serverless Offline esté activo:

```bash
curl -i http://localhost:3000/dev/zones
curl -i http://localhost:3000/dev/zones/ZONE-07
curl -i -X POST http://localhost:3000/dev/zones \
  -H 'Content-Type: application/json' \
  -d '{"name":"River Entrance","capacity":1200,"status":"OPEN"}'
curl -i -X PATCH http://localhost:3000/dev/zones/ZONE-07 \
  -H 'Content-Type: application/json' \
  -d '{"status":"CLOSED"}'
```

Para PUT, envía el objeto completo con `name`, `capacity` y `status`. Para DELETE usa un ID existente, por ejemplo `curl -i -X DELETE http://localhost:3000/dev/zones/ZONE-18`.

## Decisiones y límites conocidos

- El catálogo comienza en memoria con tres zonas. No hay DynamoDB; el contenido puede reiniciarse cuando se reinicia el proceso o la función Lambda.
- La app usa payloads de demostración fijos en los botones CRUD; todavía no incluye formularios de edición.
- PATCH modifica solo `status`; PUT exige todos los campos editables.
- `localhost` funciona para Expo Web en el mismo ordenador. En un móvil físico habría que usar la IP local del ordenador y que ambos estén en la misma red.
- CORS permite el origen web para la práctica. No se ha añadido autenticación.

## Despliegue AWS · pendiente de realizar en el laboratorio

No se incluyen claves AWS. Antes del despliegue, inicia AWS Academy y configura el perfil temporal `academy`, la región permitida y el ARN del rol Lambda facilitado por el profesor. Adapta `backend/serverless.yml` al perfil de la clase y ejecuta `serverless package` antes de `serverless deploy`. Anota aquí la URL real que muestre `serverless info` y cambia `API_URL` en `mobile/src/api.ts` solo después de probar el endpoint con curl.

- Región usada: pendiente.
- Nombre de servicio / código de alumno: pendiente.
- Endpoint API Gateway: pendiente.
- Prueba HTTP cloud: pendiente.
- Invocación y log cloud: pendiente.

No presentes estos puntos como hechos hasta ejecutarlos y guardar evidencias propias. No añadas credenciales, tokens ni archivos `~/.aws/credentials` al repositorio.

## Evidencias para completar personalmente

- Captura de Serverless Offline anunciando las rutas `/zones`.
- Thunder Client: GET, POST, PUT, PATCH y DELETE.
- Salida de al menos tres comandos curl.
- Captura de Venue Control mostrando las zonas y el resultado de una acción.
- Después del despliegue: endpoint real, pruebas HTTP cloud y un log Lambda provocado desde la app.

## Defensa técnica breve

- El parámetro `{id}` de la ruta llega al handler como `event.pathParameters.id`.
- API Gateway coloca el body HTTP en `event.body`; `JSON.parse` lo convierte y la validación comprueba sus campos antes de modificar el catálogo.
- `statusCode` comunica el resultado HTTP: 200 para éxito, 201 al crear, 400 para entrada inválida y 404 cuando no existe la zona.
- PUT reemplaza el recurso usando el objeto completo; PATCH actualiza solo el estado.
- Primero se prueba con curl/Thunder para aislar el contrato HTTP. Después se comprueba la capa cliente móvil y finalmente el endpoint cloud.

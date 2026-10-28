import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isZoneInput, json, readBody, zones } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id' });
  const index = zones.findIndex(zone => zone.id === id);
  if (index < 0) return json(404, { message: 'Zona no encontrada' });
  const input = readBody(event.body);
  if (!isZoneInput(input)) {
    return json(400, { message: 'PUT requiere name, capacity entero positivo y status válido' });
  }
  const zone = { id, ...input };
  zones[index] = zone;
  return json(200, { message: 'REPLACED', zone });
};

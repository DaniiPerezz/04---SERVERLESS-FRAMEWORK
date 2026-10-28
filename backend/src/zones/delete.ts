import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { json, zones } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id' });
  const index = zones.findIndex(zone => zone.id === id);
  if (index < 0) return json(404, { message: 'Zona no encontrada' });
  zones.splice(index, 1);
  return json(200, { message: 'DELETED', id });
};

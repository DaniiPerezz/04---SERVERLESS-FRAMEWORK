import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { json, readBody, zones } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id' });
  const zone = zones.find(item => item.id === id);
  if (!zone) return json(404, { message: 'Zona no encontrada' });
  const body = readBody(event.body);
  if (!body || (body.status !== 'OPEN' && body.status !== 'CLOSED' && body.status !== 'MAINTENANCE')) {
    return json(400, { message: 'PATCH requiere status OPEN, CLOSED o MAINTENANCE' });
  }
  zone.status = body.status;
  return json(200, { message: 'UPDATED', changes: { status: zone.status } });
};

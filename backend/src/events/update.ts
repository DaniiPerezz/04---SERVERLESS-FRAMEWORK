import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catalog, readBody, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id' });
  if (!catalog.some(item => item.id === id)) return json(404, { message: 'Evento no encontrado' });
  const body = readBody(event.body);
  if (!body || (body.status !== 'CONFIRMED' && body.status !== 'CANCELLED')) {
    return json(400, { message: 'status debe ser CONFIRMED o CANCELLED' });
  }
  return json(200, { message: 'UPDATED', changes: { status: body.status } });
};

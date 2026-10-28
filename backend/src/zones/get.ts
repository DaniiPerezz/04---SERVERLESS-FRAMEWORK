import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { json, zones } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  console.log('GET zone:', id);
  if (!id) return json(400, { message: 'Falta id' });
  const zone = zones.find(item => item.id === id);
  return zone ? json(200, zone) : json(404, { message: 'Zona no encontrada' });
};

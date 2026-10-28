import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { catalog, readBody, isEventInput, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id;
  if (!id) return json(400, { message: 'Falta id' });
  if (!catalog.some(item => item.id === id)) return json(404, { message: 'Evento no encontrado' });
  const input = readBody(event.body);
  if (!isEventInput(input)) {
    return json(400, { message: 'PUT requiere artist, space, time HH:mm y status válido' });
  }
  const replaced = { id, ...input };
  return json(200, { message: 'REPLACED', event: replaced });
};

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { readBody, isEventInput, json } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const input = readBody(event.body);
  if (!isEventInput(input)) {
    return json(400, { message: 'JSON con artist, space, time HH:mm y status válido requerido' });
  }
  const created = { id: 'EVT-NEW', ...input };
  console.log('POST evento:', created.id);
  return json(201, created);
};

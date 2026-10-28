import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isZoneInput, json, readBody, zones } from './model.js';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const input = readBody(event.body);
  if (!isZoneInput(input)) {
    return json(400, { message: 'Se requiere name, capacity entero positivo y status válido' });
  }
  const number = Math.max(0, ...zones.map(zone => Number(zone.id.replace('ZONE-', '')))) + 1;
  const zone = { id: `ZONE-${String(number).padStart(2, '0')}`, ...input };
  zones.push(zone);
  console.log('POST zone:', zone.id);
  return json(201, zone);
};

import type { APIGatewayProxyResult } from 'aws-lambda';

export type ZoneStatus = 'OPEN' | 'CLOSED' | 'MAINTENANCE';

export interface VenueZone {
  id: string;
  name: string;
  capacity: number;
  status: ZoneStatus;
}

export type ZoneInput = Omit<VenueZone, 'id'>;

// Catálogo de demostración en memoria: no sobrevive a un reinicio ni sustituye a una base de datos.
export const zones: VenueZone[] = [
  { id: 'ZONE-07', name: 'Garden Stage', capacity: 2500, status: 'OPEN' },
  { id: 'ZONE-12', name: 'North Entrance', capacity: 8000, status: 'OPEN' },
  { id: 'ZONE-18', name: 'Food Court', capacity: 3200, status: 'MAINTENANCE' }
];

export const json = (statusCode: number, value: unknown): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify(value)
});

export function readBody(text: string | null): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(text ?? 'null');
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? value as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

export function isZoneInput(value: Record<string, unknown> | null): value is ZoneInput {
  return value !== null &&
    typeof value.name === 'string' && value.name.trim().length > 0 &&
    typeof value.capacity === 'number' && Number.isInteger(value.capacity) && value.capacity > 0 &&
    (value.status === 'OPEN' || value.status === 'CLOSED' || value.status === 'MAINTENANCE');
}

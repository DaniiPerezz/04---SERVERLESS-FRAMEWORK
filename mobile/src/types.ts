export type ZoneStatus = 'OPEN' | 'CLOSED' | 'MAINTENANCE';

export interface VenueZone {
  id: string;
  name: string;
  capacity: number;
  status: ZoneStatus;
}

export type ZoneInput = Omit<VenueZone, 'id'>;

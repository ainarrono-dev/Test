export interface TransportRequest {
  id: number;
  requesterId: number;
  requesterCompanyName: string;
  resourceType: string;
  startDatetime: string;
  endDatetime: string;
  quantityMax: number;
  quantityCommitted: number;
  status: 'OPEN' | 'PARTIAL' | 'FULL' | 'CLOSED';
  createdAt: string;
  // transport detail (null when masked)
  requiredVehicleCategory: string | null;
  minLoadTons: number | null;
  withDriver: boolean | null;
  visibilityScore: number;
}

export interface RequestCreateRequest {
  startDatetime: string;
  endDatetime: string;
  quantityMax: number;
  requiredVehicleCategory: string;
  minLoadTons: number;
  withDriver: boolean;
}

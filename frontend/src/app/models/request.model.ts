export interface RequestTransportDetail {
  requiredVehicleCategory: string | null;
  minLoadTons: number | null;
  withDriver: boolean;
}

export interface TransportRequest {
  id: number;
  requesterEmail: string;
  requesterCompanyName: string;
  startDatetime: string;
  endDatetime: string;
  quantityMax: number;
  quantityCommitted: number;
  status: 'OPEN' | 'PARTIAL' | 'FULL' | 'CLOSED';
  transportDetail: RequestTransportDetail | null;
  visibilityScore: number;
  createdAt: string;
}

export interface RequestCreateRequest {
  startDatetime: string;
  endDatetime: string;
  quantityMax: number;
  requiredVehicleCategory: string;
  minLoadTons: number;
  withDriver: boolean;
}

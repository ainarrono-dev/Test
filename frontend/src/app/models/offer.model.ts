export interface OfferTransportDetail {
  vehicleCategory: string | null;
  maxLoadTons: number | null;
  volumeM3: number | null;
  lengthM: number | null;
  withDriver: boolean;
}

export interface Offer {
  id: number;
  ownerEmail: string;
  ownerCompanyName: string;
  startDatetime: string;
  endDatetime: string;
  quantityAvailable: number;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  transportDetail: OfferTransportDetail | null;
  visibilityScore: number;
  createdAt: string;
}

export interface OfferCreateRequest {
  startDatetime: string;
  endDatetime: string;
  quantityAvailable: number;
  vehicleCategory: string;
  maxLoadTons: number;
  volumeM3: number;
  lengthM: number;
  withDriver: boolean;
}

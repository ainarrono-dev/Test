export interface Offer {
  id: number;
  ownerId: number;
  ownerCompanyName: string;
  resourceType: string;
  startDatetime: string;
  endDatetime: string;
  quantityAvailable: number;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  createdAt: string;
  // transport detail (null when masked for FREE plan)
  vehicleCategory: string | null;
  maxLoadTons: number | null;
  volumeM3: number | null;
  lengthM: number | null;
  withDriver: boolean | null;
  visibilityScore: number;
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

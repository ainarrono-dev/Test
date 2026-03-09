export interface Commitment {
  id: number;
  requestId: number;
  offerId: number;
  quantity: number;
  status: 'ENGAGED' | 'CANCELLED' | 'COMPLETED';
  cancelReason: string | null;
  createdAt: string;
}

export interface CommitmentCreateRequest {
  requestId: number;
  offerId: number;
  quantity: number;
}

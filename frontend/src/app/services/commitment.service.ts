import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Commitment, CommitmentCreateRequest } from '../models/commitment.model';

@Injectable({ providedIn: 'root' })
export class CommitmentService {
  private url = `${environment.apiUrl}/commitments`;
  constructor(private http: HttpClient) {}

  getCommitments(): Observable<Commitment[]> { return this.http.get<Commitment[]>(this.url); }
  createCommitment(req: CommitmentCreateRequest): Observable<Commitment> { return this.http.post<Commitment>(this.url, req); }
  cancelCommitment(id: number, reason: string): Observable<Commitment> {
    const params = new HttpParams().set('reason', reason);
    return this.http.post<Commitment>(`${this.url}/${id}/cancel`, {}, { params });
  }
  completeCommitment(id: number): Observable<Commitment> { return this.http.post<Commitment>(`${this.url}/${id}/complete`, {}); }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Offer, OfferCreateRequest } from '../models/offer.model';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private url = `${environment.apiUrl}/offers`;
  constructor(private http: HttpClient) {}

  getOffers(): Observable<Offer[]> { return this.http.get<Offer[]>(this.url); }
  getOffer(id: number): Observable<Offer> { return this.http.get<Offer>(`${this.url}/${id}`); }
  createOffer(req: OfferCreateRequest): Observable<Offer> { return this.http.post<Offer>(this.url, req); }
  closeOffer(id: number): Observable<Offer> { return this.http.post<Offer>(`${this.url}/${id}/close`, {}); }
  cancelOffer(id: number): Observable<Offer> { return this.http.post<Offer>(`${this.url}/${id}/cancel`, {}); }
}

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

  /**
   * Crée une offre en multipart/form-data.
   * La partie "data" contient le JSON de l'offre ; la partie "insurance" le fichier.
   */
  createOffer(req: OfferCreateRequest, insuranceFile: File): Observable<Offer> {
    const formData = new FormData();
    // Blob JSON typé pour que Spring puisse le désérialiser avec @RequestPart
    const dataBlob = new Blob([JSON.stringify(req)], { type: 'application/json' });
    formData.append('data', dataBlob);
    formData.append('insurance', insuranceFile, insuranceFile.name);
    return this.http.post<Offer>(this.url, formData);
  }

  /** URL de téléchargement/visualisation du document d'assurance d'une offre. */
  getInsuranceUrl(id: number): string {
    return `${this.url}/${id}/insurance`;
  }

  closeOffer(id: number): Observable<Offer> { return this.http.post<Offer>(`${this.url}/${id}/close`, {}); }
  cancelOffer(id: number): Observable<Offer> { return this.http.post<Offer>(`${this.url}/${id}/cancel`, {}); }
}

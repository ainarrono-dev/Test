import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TransportRequest, RequestCreateRequest } from '../models/request.model';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private url = `${environment.apiUrl}/requests`;
  constructor(private http: HttpClient) {}

  getRequests(): Observable<TransportRequest[]> { return this.http.get<TransportRequest[]>(this.url); }
  getRequest(id: number): Observable<TransportRequest> { return this.http.get<TransportRequest>(`${this.url}/${id}`); }
  createRequest(req: RequestCreateRequest): Observable<TransportRequest> { return this.http.post<TransportRequest>(this.url, req); }
}

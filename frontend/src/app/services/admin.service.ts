import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private url = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> { return this.http.get<User[]>(`${this.url}/users`); }
  validateUser(id: number): Observable<any> { return this.http.post(`${this.url}/users/${id}/validate`, {}); }
  suspendUser(id: number): Observable<any> { return this.http.post(`${this.url}/users/${id}/suspend`, {}); }
  updateReliability(id: number, score: number): Observable<any> { return this.http.post(`${this.url}/users/${id}/reliability`, { score }); }
  getActions(): Observable<any[]> { return this.http.get<any[]>(`${this.url}/actions`); }
}

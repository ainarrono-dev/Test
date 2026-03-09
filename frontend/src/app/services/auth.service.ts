import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthResponse, User } from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'lm_token';
  private readonly USER_KEY = 'lm_user';
  
  currentUser = signal<User | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.currentUser.set(res.user);
      })
    );
  }

  register(email: string, password: string, companyName: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, { email, password, companyName });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  isPlanFree(): boolean {
    return this.currentUser()?.subscriptionPlanName === 'FREE';
  }

  canCreate(): boolean {
    const plan = this.currentUser()?.subscriptionPlanName;
    return plan === 'MEDIUM' || plan === 'EXTRA';
  }

  private loadUser(): User | null {
    const str = localStorage.getItem(this.USER_KEY);
    return str ? JSON.parse(str) : null;
  }
}

import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule],
  template: `
    <mat-toolbar color="primary" *ngIf="auth.isLoggedIn()">
      <span class="logo">🚛 LogiMatch</span>
      <nav class="nav-links">
        <a mat-button routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
        <a mat-button routerLink="/offers" routerLinkActive="active-link">Offres</a>
        <a mat-button routerLink="/requests" routerLinkActive="active-link">Demandes</a>
        <a mat-button routerLink="/commitments" routerLinkActive="active-link">Engagements</a>
        <a mat-button routerLink="/admin" routerLinkActive="active-link" *ngIf="auth.isAdmin()">Admin</a>
      </nav>
      <span class="spacer"></span>
      <span class="user-info">{{ auth.currentUser()?.companyName }}</span>
      <button mat-icon-button (click)="auth.logout()"><mat-icon>logout</mat-icon></button>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .logo { font-weight: bold; font-size: 1.2rem; margin-right: 20px; }
    .nav-links { display: flex; gap: 4px; }
    .spacer { flex: 1; }
    .user-info { margin-right: 8px; font-size: 0.9rem; }
    .active-link { background: rgba(255,255,255,0.15); border-radius: 4px; }
    .container { padding: 24px; max-width: 1400px; margin: 0 auto; }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}
}

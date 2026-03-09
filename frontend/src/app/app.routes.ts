import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'offers', canActivate: [authGuard], loadComponent: () => import('./pages/offers/offers.component').then(m => m.OffersComponent) },
  { path: 'requests', canActivate: [authGuard], loadComponent: () => import('./pages/requests/requests.component').then(m => m.RequestsComponent) },
  { path: 'commitments', canActivate: [authGuard], loadComponent: () => import('./pages/commitments/commitments.component').then(m => m.CommitmentsComponent) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) },
  { path: '**', redirectTo: 'dashboard' }
];

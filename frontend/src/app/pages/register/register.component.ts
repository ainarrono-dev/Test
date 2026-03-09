import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, CommonModule],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>🚛 LogiMatch</mat-card-title>
          <mat-card-subtitle>Créer un compte entreprise</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom de l'entreprise</mat-label>
              <input matInput formControlName="companyName">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input matInput type="password" formControlName="password">
            </mat-form-field>
            <div *ngIf="success" class="success-msg">✅ Compte créé ! En attente de validation par un admin.</div>
            <div *ngIf="error" class="error-msg">{{ error }}</div>
            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="loading || !!success">
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
              <span *ngIf="!loading">S'inscrire</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button routerLink="/login">Déjà un compte ? Se connecter</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
    .auth-card { width: 400px; padding: 16px; }
    .full-width { width: 100%; margin-bottom: 12px; display: block; }
    .error-msg { color: #f44336; margin-bottom: 12px; font-size: 0.9rem; }
    .success-msg { color: #4caf50; margin-bottom: 12px; font-size: 0.9rem; }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    const { companyName, email, password } = this.form.value;
    this.auth.register(email, password, companyName).subscribe({
      next: () => { this.success = 'ok'; this.loading = false; },
      error: (e) => { this.error = e.error?.message || "Erreur lors de l'inscription"; this.loading = false; }
    });
  }
}

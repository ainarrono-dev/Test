import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { OfferService } from '../../services/offer.service';
import { RequestService } from '../../services/request.service';
import { CommitmentService } from '../../services/commitment.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, CommonModule],
  template: `
    <div class="dashboard">
      <div class="upgrade-banner" *ngIf="auth.isPlanFree()">
        ⚠️ Vous êtes en plan <strong>FREE</strong> : détails masqués, aucune création possible.
        <a href="mailto:admin@logimatch.com">Contactez un admin pour upgrader</a>
      </div>

      <h1>Tableau de bord</h1>
      <p class="welcome">Bienvenue, <strong>{{ auth.currentUser()?.companyName }}</strong></p>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon color="primary">local_shipping</mat-icon>
            <div class="stat-number">{{ offerCount }}</div>
            <div class="stat-label">Offres actives</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button color="primary" routerLink="/offers">Voir les offres</a>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon color="accent">search</mat-icon>
            <div class="stat-number">{{ requestCount }}</div>
            <div class="stat-label">Demandes ouvertes</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button color="accent" routerLink="/requests">Voir les demandes</a>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <mat-icon color="warn">handshake</mat-icon>
            <div class="stat-number">{{ commitmentCount }}</div>
            <div class="stat-label">Engagements</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button routerLink="/commitments">Voir les engagements</a>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card profile-card">
          <mat-card-header>
            <mat-card-title>Mon profil</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Email:</strong> {{ auth.currentUser()?.email }}</p>
            <p><strong>Plan:</strong>
              <mat-chip [class]="'plan-' + auth.currentUser()?.subscriptionPlanName?.toLowerCase()">
                {{ auth.currentUser()?.subscriptionPlanName }}
              </mat-chip>
            </p>
            <p><strong>Fiabilité:</strong> {{ auth.currentUser()?.reliabilityScore }}/100</p>
            <p><strong>Statut:</strong>
              <span [class]="auth.currentUser()?.validated ? 'status-ok' : 'status-warn'">
                {{ auth.currentUser()?.validated ? '✅ Validé' : '⏳ En attente de validation' }}
              </span>
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .upgrade-banner { background: #fff3e0; border: 1px solid #ff9800; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px; }
    .upgrade-banner a { color: #e65100; font-weight: bold; }
    h1 { margin-bottom: 4px; }
    .welcome { color: #666; margin-bottom: 24px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    .stat-card { text-align: center; }
    .stat-number { font-size: 2.5rem; font-weight: bold; margin: 8px 0; }
    .stat-label { color: #666; font-size: 0.9rem; }
    mat-icon { font-size: 2rem; height: 2rem; width: 2rem; }
    .profile-card { text-align: left; }
    .profile-card p { margin: 4px 0; }
    .status-ok { color: #4caf50; }
    .status-warn { color: #ff9800; }
    .plan-free { background-color: #e0e0e0; }
    .plan-medium { background-color: #bbdefb; }
    .plan-extra { background-color: #c8e6c9; }
  `]
})
export class DashboardComponent implements OnInit {
  offerCount = 0;
  requestCount = 0;
  commitmentCount = 0;

  constructor(
    public auth: AuthService,
    private offerService: OfferService,
    private requestService: RequestService,
    private commitmentService: CommitmentService
  ) {}

  ngOnInit(): void {
    this.offerService.getOffers().subscribe(offers => this.offerCount = offers.filter(o => o.status === 'ACTIVE').length);
    this.requestService.getRequests().subscribe(reqs => this.requestCount = reqs.filter(r => r.status === 'OPEN' || r.status === 'PARTIAL').length);
    this.commitmentService.getCommitments().subscribe(c => this.commitmentCount = c.length);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OfferService } from '../../services/offer.service';
import { Offer, OfferCreateRequest } from '../../models/offer.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatChipsModule, MatTooltipModule, MatSnackBarModule],
  template: `
    <div>
      <div class="page-header">
        <h1>Offres de transport</h1>
        <button mat-raised-button color="primary" (click)="showForm = !showForm" *ngIf="auth.canCreate() && auth.currentUser()?.validated && !auth.currentUser()?.suspended">
          <mat-icon>add</mat-icon> Nouvelle offre
        </button>
        <div class="upgrade-hint" *ngIf="auth.isPlanFree()">Plan FREE : création désactivée</div>
      </div>

      <mat-card *ngIf="showForm" class="form-card">
        <mat-card-header><mat-card-title>Créer une offre</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="offerForm" (ngSubmit)="createOffer()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Début</mat-label>
                <input matInput type="datetime-local" formControlName="startDatetime">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Fin</mat-label>
                <input matInput type="datetime-local" formControlName="endDatetime">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Quantité disponible</mat-label>
                <input matInput type="number" formControlName="quantityAvailable">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Catégorie véhicule</mat-label>
                <input matInput formControlName="vehicleCategory" placeholder="CAMION, SEMI_REMORQUE...">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Charge max (tonnes)</mat-label>
                <input matInput type="number" step="0.5" formControlName="maxLoadTons">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Volume (m³)</mat-label>
                <input matInput type="number" step="0.1" formControlName="volumeM3">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Longueur (m)</mat-label>
                <input matInput type="number" step="0.1" formControlName="lengthM">
              </mat-form-field>
            </div>
            <mat-checkbox formControlName="withDriver">Avec chauffeur</mat-checkbox>
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="offerForm.invalid || saving">Créer</button>
              <button mat-button type="button" (click)="showForm = false">Annuler</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="blur-banner" *ngIf="auth.isPlanFree()">
        🔒 Les détails sont masqués en plan FREE. Contactez un admin pour upgrader votre plan.
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="offers" class="full-width-table">
            <ng-container matColumnDef="company">
              <th mat-header-cell *matHeaderCellDef>Entreprise</th>
              <td mat-cell *matCellDef="let o">{{ o.ownerCompanyName }}</td>
            </ng-container>
            <ng-container matColumnDef="dates">
              <th mat-header-cell *matHeaderCellDef>Période</th>
              <td mat-cell *matCellDef="let o">{{ o.startDatetime | date:'short' }} → {{ o.endDatetime | date:'short' }}</td>
            </ng-container>
            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Quantité</th>
              <td mat-cell *matCellDef="let o">{{ o.quantityAvailable }}</td>
            </ng-container>
            <ng-container matColumnDef="detail">
              <th mat-header-cell *matHeaderCellDef>Véhicule / Charge</th>
              <td mat-cell *matCellDef="let o" [class.blurred]="auth.isPlanFree()">
                <span *ngIf="!auth.isPlanFree() && o.transportDetail">
                  {{ o.transportDetail?.vehicleCategory }} — {{ o.transportDetail?.maxLoadTons }}t
                </span>
                <span *ngIf="auth.isPlanFree()">████████</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let o">
                <mat-chip [class]="'status-' + o.status.toLowerCase()">{{ o.status }}</mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="score">
              <th mat-header-cell *matHeaderCellDef>Score</th>
              <td mat-cell *matCellDef="let o">{{ o.visibilityScore | number:'1.0-1' }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let o">
                <button mat-icon-button color="warn" (click)="closeOffer(o)" *ngIf="o.status === 'ACTIVE'" matTooltip="Fermer">
                  <mat-icon>lock</mat-icon>
                </button>
                <button mat-icon-button (click)="cancelOffer(o)" *ngIf="o.status === 'ACTIVE'" matTooltip="Annuler">
                  <mat-icon>cancel</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <p *ngIf="offers.length === 0" class="empty-msg">Aucune offre disponible.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    h1 { margin: 0; flex: 1; }
    .upgrade-hint { color: #f44336; font-size: 0.85rem; }
    .form-card { margin-bottom: 20px; }
    .form-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
    .form-row mat-form-field { flex: 1; min-width: 160px; }
    .form-actions { margin-top: 12px; display: flex; gap: 8px; }
    .full-width-table { width: 100%; }
    .blurred { filter: blur(4px); user-select: none; }
    .blur-banner { background: #e3f2fd; border: 1px solid #2196f3; padding: 10px 16px; border-radius: 4px; margin-bottom: 16px; }
    .empty-msg { text-align: center; color: #999; padding: 24px; }
    .status-active { background-color: #c8e6c9; }
    .status-closed { background-color: #e0e0e0; }
    .status-cancelled { background-color: #ffcdd2; }
  `]
})
export class OffersComponent implements OnInit {
  offers: Offer[] = [];
  showForm = false;
  saving = false;
  offerForm: FormGroup;
  displayedColumns = ['company', 'dates', 'quantity', 'detail', 'status', 'score', 'actions'];

  constructor(public auth: AuthService, private offerService: OfferService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.offerForm = this.fb.group({
      startDatetime: ['', Validators.required],
      endDatetime: ['', Validators.required],
      quantityAvailable: [1, [Validators.required, Validators.min(1)]],
      vehicleCategory: ['', Validators.required],
      maxLoadTons: [0, Validators.required],
      volumeM3: [0],
      lengthM: [0],
      withDriver: [false]
    });
  }

  ngOnInit(): void { this.loadOffers(); }

  loadOffers(): void {
    this.offerService.getOffers().subscribe(offers => this.offers = offers);
  }

  createOffer(): void {
    if (this.offerForm.invalid) return;
    this.saving = true;
    const v = this.offerForm.value;
    const req: OfferCreateRequest = {
      startDatetime: v.startDatetime, endDatetime: v.endDatetime,
      quantityAvailable: v.quantityAvailable, vehicleCategory: v.vehicleCategory,
      maxLoadTons: v.maxLoadTons, volumeM3: v.volumeM3,
      lengthM: v.lengthM, withDriver: v.withDriver
    };
    this.offerService.createOffer(req).subscribe({
      next: () => { this.snack.open('Offre créée !', 'OK', { duration: 3000 }); this.showForm = false; this.loadOffers(); this.saving = false; },
      error: (e) => { this.snack.open(e.error?.message || 'Erreur', 'OK', { duration: 4000 }); this.saving = false; }
    });
  }

  closeOffer(offer: Offer): void {
    this.offerService.closeOffer(offer.id).subscribe({ next: () => this.loadOffers(), error: (e) => this.snack.open(e.error?.message || 'Erreur', 'OK', { duration: 3000 }) });
  }

  cancelOffer(offer: Offer): void {
    this.offerService.cancelOffer(offer.id).subscribe({ next: () => this.loadOffers(), error: (e) => this.snack.open(e.error?.message || 'Erreur', 'OK', { duration: 3000 }) });
  }
}

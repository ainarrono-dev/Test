import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { TransportRequest, RequestCreateRequest } from '../../models/request.model';
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
  selector: 'app-requests',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatChipsModule, MatTooltipModule, MatSnackBarModule],
  template: `
    <div>
      <div class="page-header">
        <h1>Demandes de transport</h1>
        <button mat-raised-button color="accent" (click)="showForm = !showForm" *ngIf="auth.canCreate() && auth.currentUser()?.validated && !auth.currentUser()?.suspended">
          <mat-icon>add</mat-icon> Nouvelle demande
        </button>
        <div class="upgrade-hint" *ngIf="auth.isPlanFree()">Plan FREE : création désactivée</div>
      </div>

      <mat-card *ngIf="showForm" class="form-card">
        <mat-card-header><mat-card-title>Créer une demande</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="requestForm" (ngSubmit)="createRequest()">
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
                <mat-label>Quantité max</mat-label>
                <input matInput type="number" formControlName="quantityMax">
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Catégorie véhicule requise</mat-label>
                <input matInput formControlName="requiredVehicleCategory" placeholder="CAMION, SEMI_REMORQUE...">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Charge min (tonnes)</mat-label>
                <input matInput type="number" step="0.5" formControlName="minLoadTons">
              </mat-form-field>
            </div>
            <mat-checkbox formControlName="withDriver">Avec chauffeur</mat-checkbox>
            <div class="form-actions">
              <button mat-raised-button color="accent" type="submit" [disabled]="requestForm.invalid || saving">Créer</button>
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
          <table mat-table [dataSource]="requests" class="full-width-table">
            <ng-container matColumnDef="company">
              <th mat-header-cell *matHeaderCellDef>Entreprise</th>
              <td mat-cell *matCellDef="let r">{{ r.requesterCompanyName }}</td>
            </ng-container>
            <ng-container matColumnDef="dates">
              <th mat-header-cell *matHeaderCellDef>Période</th>
              <td mat-cell *matCellDef="let r">{{ r.startDatetime | date:'short' }} → {{ r.endDatetime | date:'short' }}</td>
            </ng-container>
            <ng-container matColumnDef="quantityMax">
              <th mat-header-cell *matHeaderCellDef>Qté max</th>
              <td mat-cell *matCellDef="let r">{{ r.quantityMax }}</td>
            </ng-container>
            <ng-container matColumnDef="quantityCommitted">
              <th mat-header-cell *matHeaderCellDef>Engagé</th>
              <td mat-cell *matCellDef="let r">{{ r.quantityCommitted }}</td>
            </ng-container>
            <ng-container matColumnDef="detail">
              <th mat-header-cell *matHeaderCellDef>Véhicule / Charge</th>
              <td mat-cell *matCellDef="let r" [class.blurred]="auth.isPlanFree()">
                <span *ngIf="!auth.isPlanFree() && r.transportDetail">
                  {{ r.transportDetail?.requiredVehicleCategory }} — min {{ r.transportDetail?.minLoadTons }}t
                </span>
                <span *ngIf="auth.isPlanFree()">████████</span>
              </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let r">
                <mat-chip [class]="'status-' + r.status.toLowerCase()">{{ r.status }}</mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="score">
              <th mat-header-cell *matHeaderCellDef>Score</th>
              <td mat-cell *matCellDef="let r">{{ r.visibilityScore | number:'1.0-1' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <p *ngIf="requests.length === 0" class="empty-msg">Aucune demande disponible.</p>
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
    .status-open { background-color: #c8e6c9; }
    .status-partial { background-color: #fff9c4; }
    .status-full { background-color: #bbdefb; }
    .status-closed { background-color: #e0e0e0; }
  `]
})
export class RequestsComponent implements OnInit {
  requests: TransportRequest[] = [];
  showForm = false;
  saving = false;
  requestForm: FormGroup;
  displayedColumns = ['company', 'dates', 'quantityMax', 'quantityCommitted', 'detail', 'status', 'score'];

  constructor(public auth: AuthService, private requestService: RequestService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.requestForm = this.fb.group({
      startDatetime: ['', Validators.required],
      endDatetime: ['', Validators.required],
      quantityMax: [1, [Validators.required, Validators.min(1)]],
      requiredVehicleCategory: ['', Validators.required],
      minLoadTons: [0, Validators.required],
      withDriver: [false]
    });
  }

  ngOnInit(): void { this.loadRequests(); }

  loadRequests(): void {
    this.requestService.getRequests().subscribe(reqs => this.requests = reqs.sort((a, b) => b.visibilityScore - a.visibilityScore));
  }

  createRequest(): void {
    if (this.requestForm.invalid) return;
    this.saving = true;
    const v = this.requestForm.value;
    const req: RequestCreateRequest = {
      startDatetime: v.startDatetime, endDatetime: v.endDatetime,
      quantityMax: v.quantityMax, requiredVehicleCategory: v.requiredVehicleCategory,
      minLoadTons: v.minLoadTons, withDriver: v.withDriver
    };
    this.requestService.createRequest(req).subscribe({
      next: () => { this.snack.open('Demande créée !', 'OK', { duration: 3000 }); this.showForm = false; this.loadRequests(); this.saving = false; },
      error: (e) => { this.snack.open(e.error?.message || 'Erreur', 'OK', { duration: 4000 }); this.saving = false; }
    });
  }
}

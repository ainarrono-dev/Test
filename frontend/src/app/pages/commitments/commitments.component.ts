import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommitmentService } from '../../services/commitment.service';
import { Commitment, CommitmentCreateRequest } from '../../models/commitment.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-commitments',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatTooltipModule, MatSnackBarModule],
  template: `
    <div>
      <div class="page-header">
        <h1>Engagements</h1>
        <button mat-raised-button color="primary" (click)="showForm = !showForm" *ngIf="auth.canCreate() && auth.currentUser()?.validated && !auth.currentUser()?.suspended">
          <mat-icon>add</mat-icon> Nouvel engagement
        </button>
      </div>

      <mat-card *ngIf="showForm" class="form-card">
        <mat-card-header><mat-card-title>Créer un engagement</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="commitmentForm" (ngSubmit)="createCommitment()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>ID de la demande</mat-label>
                <input matInput type="number" formControlName="requestId">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>ID de l'offre</mat-label>
                <input matInput type="number" formControlName="offerId">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Quantité</mat-label>
                <input matInput type="number" formControlName="quantity">
              </mat-form-field>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="commitmentForm.invalid || saving">Créer</button>
              <button mat-button type="button" (click)="showForm = false">Annuler</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Cancel form -->
      <mat-card *ngIf="cancellingId" class="form-card">
        <mat-card-header><mat-card-title>Motif d'annulation</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="cancelForm" (ngSubmit)="confirmCancel()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Motif</mat-label>
              <input matInput formControlName="reason">
            </mat-form-field>
            <div class="form-actions">
              <button mat-raised-button color="warn" type="submit" [disabled]="cancelForm.invalid">Confirmer l'annulation</button>
              <button mat-button type="button" (click)="cancellingId = null">Annuler</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="commitments" class="full-width-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let c">{{ c.id }}</td>
            </ng-container>
            <ng-container matColumnDef="requestId">
              <th mat-header-cell *matHeaderCellDef>Demande</th>
              <td mat-cell *matCellDef="let c">#{{ c.requestId }}</td>
            </ng-container>
            <ng-container matColumnDef="offerId">
              <th mat-header-cell *matHeaderCellDef>Offre</th>
              <td mat-cell *matCellDef="let c">#{{ c.offerId }}</td>
            </ng-container>
            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Quantité</th>
              <td mat-cell *matCellDef="let c">{{ c.quantity }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let c">
                <mat-chip [class]="'status-' + c.status.toLowerCase()">{{ c.status }}</mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="cancelReason">
              <th mat-header-cell *matHeaderCellDef>Motif annulation</th>
              <td mat-cell *matCellDef="let c">{{ c.cancelReason || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Créé le</th>
              <td mat-cell *matCellDef="let c">{{ c.createdAt | date:'short' }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let c">
                <ng-container *ngIf="c.status === 'ENGAGED'">
                  <button mat-icon-button color="primary" (click)="completeCommitment(c)" matTooltip="Compléter">
                    <mat-icon>check_circle</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="startCancel(c)" matTooltip="Annuler">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </ng-container>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <p *ngIf="commitments.length === 0" class="empty-msg">Aucun engagement.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    h1 { margin: 0; flex: 1; }
    .form-card { margin-bottom: 20px; }
    .form-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
    .form-row mat-form-field { flex: 1; min-width: 160px; }
    .form-actions { margin-top: 12px; display: flex; gap: 8px; }
    .full-width { width: 100%; }
    .full-width-table { width: 100%; }
    .empty-msg { text-align: center; color: #999; padding: 24px; }
    .status-engaged { background-color: #c8e6c9; }
    .status-cancelled { background-color: #ffcdd2; }
    .status-completed { background-color: #bbdefb; }
  `]
})
export class CommitmentsComponent implements OnInit {
  commitments: Commitment[] = [];
  showForm = false;
  saving = false;
  cancellingId: number | null = null;
  commitmentForm: FormGroup;
  cancelForm: FormGroup;
  displayedColumns = ['id', 'requestId', 'offerId', 'quantity', 'status', 'cancelReason', 'createdAt', 'actions'];

  constructor(public auth: AuthService, private commitmentService: CommitmentService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.commitmentForm = this.fb.group({
      requestId: [null, [Validators.required, Validators.min(1)]],
      offerId: [null, [Validators.required, Validators.min(1)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.cancelForm = this.fb.group({
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void { this.loadCommitments(); }

  loadCommitments(): void {
    this.commitmentService.getCommitments().subscribe(c => this.commitments = c);
  }

  createCommitment(): void {
    if (this.commitmentForm.invalid) return;
    this.saving = true;
    const req: CommitmentCreateRequest = this.commitmentForm.value;
    this.commitmentService.createCommitment(req).subscribe({
      next: () => { this.snack.open('Engagement créé !', 'OK', { duration: 3000 }); this.showForm = false; this.loadCommitments(); this.saving = false; },
      error: (e) => { this.snack.open(e.error?.message || 'Erreur', 'OK', { duration: 4000 }); this.saving = false; }
    });
  }

  startCancel(c: Commitment): void {
    this.cancellingId = c.id;
    this.cancelForm.reset();
  }

  confirmCancel(): void {
    if (!this.cancellingId || this.cancelForm.invalid) return;
    this.commitmentService.cancelCommitment(this.cancellingId, this.cancelForm.value.reason).subscribe({
      next: () => { this.snack.open('Annulé !', 'OK', { duration: 3000 }); this.cancellingId = null; this.loadCommitments(); },
      error: (e) => this.snack.open(e.error?.message || 'Erreur', 'OK', { duration: 3000 })
    });
  }

  completeCommitment(c: Commitment): void {
    this.commitmentService.completeCommitment(c.id).subscribe({
      next: () => { this.snack.open('Complété !', 'OK', { duration: 3000 }); this.loadCommitments(); },
      error: (e) => this.snack.open(e.error?.message || 'Erreur', 'OK', { duration: 3000 })
    });
  }
}

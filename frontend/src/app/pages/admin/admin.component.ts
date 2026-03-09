import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatTabsModule, MatSnackBarModule, MatTooltipModule],
  template: `
    <div>
      <h1>Administration</h1>
      <mat-tab-group>
        <mat-tab label="Utilisateurs">
          <div class="tab-content">
            <mat-card>
              <mat-card-content>
                <table mat-table [dataSource]="users" class="full-width-table">
                  <ng-container matColumnDef="email">
                    <th mat-header-cell *matHeaderCellDef>Email</th>
                    <td mat-cell *matCellDef="let u">{{ u.email }}</td>
                  </ng-container>
                  <ng-container matColumnDef="company">
                    <th mat-header-cell *matHeaderCellDef>Entreprise</th>
                    <td mat-cell *matCellDef="let u">{{ u.companyName }}</td>
                  </ng-container>
                  <ng-container matColumnDef="role">
                    <th mat-header-cell *matHeaderCellDef>Rôle</th>
                    <td mat-cell *matCellDef="let u">
                      <mat-chip [class]="u.role === 'ADMIN' ? 'role-admin' : 'role-company'">{{ u.role }}</mat-chip>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="plan">
                    <th mat-header-cell *matHeaderCellDef>Plan</th>
                    <td mat-cell *matCellDef="let u">{{ u.subscriptionPlanName }}</td>
                  </ng-container>
                  <ng-container matColumnDef="validated">
                    <th mat-header-cell *matHeaderCellDef>Validé</th>
                    <td mat-cell *matCellDef="let u">
                      <span [class]="u.validated ? 'status-ok' : 'status-warn'">
                        {{ u.validated ? '✅' : '⏳' }}
                      </span>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="suspended">
                    <th mat-header-cell *matHeaderCellDef>Suspendu</th>
                    <td mat-cell *matCellDef="let u">
                      <span [class]="u.suspended ? 'status-error' : 'status-ok'">
                        {{ u.suspended ? '🚫' : '✅' }}
                      </span>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="reliability">
                    <th mat-header-cell *matHeaderCellDef>Fiabilité</th>
                    <td mat-cell *matCellDef="let u">
                      <div class="reliability-cell">
                        <span>{{ u.reliabilityScore }}</span>
                        <input type="number" class="reliability-input" [value]="u.reliabilityScore" min="0" max="100"
                          (change)="updateReliability(u, $event)" matTooltip="Modifier le score">
                      </div>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let u">
                      <button mat-icon-button color="primary" (click)="validateUser(u)" *ngIf="!u.validated" matTooltip="Valider">
                        <mat-icon>check_circle</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="suspendUser(u)" *ngIf="!u.suspended" matTooltip="Suspendre">
                        <mat-icon>block</mat-icon>
                      </button>
                    </td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: userColumns;"></tr>
                </table>
                <p *ngIf="users.length === 0" class="empty-msg">Aucun utilisateur.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Journal des actions">
          <div class="tab-content">
            <mat-card>
              <mat-card-content>
                <table mat-table [dataSource]="actions" class="full-width-table">
                  <ng-container matColumnDef="id">
                    <th mat-header-cell *matHeaderCellDef>ID</th>
                    <td mat-cell *matCellDef="let a">{{ a.id }}</td>
                  </ng-container>
                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef>Type</th>
                    <td mat-cell *matCellDef="let a">{{ a.type || a.actionType }}</td>
                  </ng-container>
                  <ng-container matColumnDef="description">
                    <th mat-header-cell *matHeaderCellDef>Description</th>
                    <td mat-cell *matCellDef="let a">{{ a.description || a.details }}</td>
                  </ng-container>
                  <ng-container matColumnDef="createdAt">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let a">{{ a.createdAt | date:'short' }}</td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="actionColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: actionColumns;"></tr>
                </table>
                <p *ngIf="actions.length === 0" class="empty-msg">Aucune action enregistrée.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 20px; }
    .tab-content { padding: 16px 0; }
    .full-width-table { width: 100%; }
    .empty-msg { text-align: center; color: #999; padding: 24px; }
    .status-ok { color: #4caf50; }
    .status-warn { color: #ff9800; }
    .status-error { color: #f44336; }
    .role-admin { background-color: #e3f2fd; }
    .role-company { background-color: #f3e5f5; }
    .reliability-cell { display: flex; align-items: center; gap: 8px; }
    .reliability-input { width: 60px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; }
  `]
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  actions: any[] = [];
  userColumns = ['email', 'company', 'role', 'plan', 'validated', 'suspended', 'reliability', 'actions'];
  actionColumns = ['id', 'type', 'description', 'createdAt'];

  constructor(public auth: AuthService, private adminService: AdminService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadActions();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe(users => this.users = users);
  }

  loadActions(): void {
    this.adminService.getActions().subscribe(actions => this.actions = actions);
  }

  validateUser(user: User): void {
    this.adminService.validateUser(user.id).subscribe({
      next: () => { this.snack.open('Utilisateur validé !', 'OK', { duration: 3000 }); this.loadUsers(); },
      error: (e) => this.snack.open(e.error?.message || 'Erreur', 'OK', { duration: 3000 })
    });
  }

  suspendUser(user: User): void {
    this.adminService.suspendUser(user.id).subscribe({
      next: () => { this.snack.open('Utilisateur suspendu !', 'OK', { duration: 3000 }); this.loadUsers(); },
      error: (e) => this.snack.open(e.error?.message || 'Erreur', 'OK', { duration: 3000 })
    });
  }

  updateReliability(user: User, event: Event): void {
    const score = Number((event.target as HTMLInputElement).value);
    if (score < 0 || score > 100) return;
    this.adminService.updateReliability(user.id, score).subscribe({
      next: () => { this.snack.open('Score mis à jour !', 'OK', { duration: 3000 }); this.loadUsers(); },
      error: (e) => this.snack.open(e.error?.message || 'Erreur', 'OK', { duration: 3000 })
    });
  }
}

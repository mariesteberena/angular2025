import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom border-primary">
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center w-100">
          <div class="d-flex align-items-center">
            <div class="d-flex align-items-center me-3">
            <i class="bi bi-people-fill me-3" style="font-size: 2rem; color: #667eea;"></i>
              <div>
                <h1 class="h5 fw-bold text-dark mb-0">REVIAL</h1>
                <p class="small text-muted mb-0">Registro de Visitantes y Allegados</p>
              </div>
            </div>
          </div>
          
          <nav class="navbar-nav d-none d-md-flex me-auto">
            <a 
              routerLink="/" 
              routerLinkActive="active"
              [routerLinkActiveOptions]="{exact: true}"
              class="nav-link fw-medium"
            >
              Dashboard
            </a>
            <a 
              routerLink="/internas" 
              routerLinkActive="active"
              class="nav-link fw-medium"
            >
              Internas
            </a>
            <a 
              routerLink="/visitantes" 
              routerLinkActive="active"
              class="nav-link fw-medium"
            >
              Visitantes
            </a>
            <a 
              routerLink="/visitas" 
              routerLinkActive="active"
              class="nav-link fw-medium"
            >
              Visitas
            </a>
          </nav>

          <div class="d-flex align-items-center" *ngIf="authService.isAuthenticated()">
            <div class="d-flex align-items-center me-3">
              <div class="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 32px; height: 32px;">
                <span class="text-white fw-medium small">{{ getUserInitials() }}</span>
              </div>
              <span class="text-dark fw-medium">{{ getCurrentUserName() }}</span>
            </div>
            <button 
              (click)="logout()" 
              class="btn btn-danger btn-sm"
            >
              <i class="bi bi-box-arrow-right me-1"></i>Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.name : 'Usuario';
  }

  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (!user) return 'U';
    
    return user.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { InternaService } from '../../services/interna.service';
import { VisitanteService } from '../../services/visitante.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <!-- Hero Section -->
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-dark mb-3">
          Dashboard
        </h1>
        <p class="lead text-muted">
          Estadísticas del Sistema de Gestión Penitenciaria
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4">
        <!-- Total Internas -->
        <div class="col-md-6 col-lg-3">
          <div 
            class="card border-0 shadow-sm h-100 cursor-pointer"
            (click)="navigateToInternas()"
            style="border-left: 4px solid #0d6efd;"
          >
            <div class="card-body p-4">
              <div class="d-flex align-items-center">
                <div class="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <i class="bi bi-person-fill text-primary fs-4"></i>
                </div>
                <div>
                  <h3 class="h6 fw-semibold text-dark mb-1">Total Internas</h3>
                  <p class="h2 fw-bold text-primary mb-0">{{ internaStats.total }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Internas Activas -->
        <div class="col-md-6 col-lg-3">
          <div 
            class="card border-0 shadow-sm h-100 cursor-pointer"
            (click)="navigateToInternas()"
            style="border-left: 4px solid #198754;"
          >
            <div class="card-body p-4">
              <div class="d-flex align-items-center">
                <div class="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                  <i class="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
                <div>
                  <h3 class="h6 fw-semibold text-dark mb-1">Internas Activas</h3>
                  <p class="h2 fw-bold text-success mb-0">{{ internaStats.activas }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Visitantes -->
        <div class="col-md-6 col-lg-3">
          <div 
            class="card border-0 shadow-sm h-100 cursor-pointer"
            (click)="navigateToVisitantes()"
            style="border-left: 4px solid #6f42c1;"
          >
            <div class="card-body p-4">
              <div class="d-flex align-items-center">
                <div class="bg-purple bg-opacity-10 rounded-circle p-3 me-3">
                  <i class="bi bi-people-fill text-purple fs-4"></i>
                </div>
                <div>
                  <h3 class="h6 fw-semibold text-dark mb-1">Total Visitantes</h3>
                  <p class="h2 fw-bold text-purple mb-0">{{ visitanteStats.total }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visitantes Activos -->
        <div class="col-md-6 col-lg-3">
          <div 
            class="card border-0 shadow-sm h-100 cursor-pointer"
            (click)="navigateToVisitantes()"
            style="border-left: 4px solid #fd7e14;"
          >
            <div class="card-body p-4">
              <div class="d-flex align-items-center">
                <div class="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                  <i class="bi bi-clock-fill text-warning fs-4"></i>
                </div>
                <div>
                  <h3 class="h6 fw-semibold text-dark mb-1">Visitantes Activos</h3>
                  <p class="h2 fw-bold text-warning mb-0">{{ visitanteStats.activos }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  internaStats = { total: 0, activas: 0 };
  visitanteStats = { total: 0, activos: 0 };

  constructor(
    private internaService: InternaService,
    private visitanteService: VisitanteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
    
    // Suscribirse a cambios en los datos
    this.internaService.internas$.subscribe(() => {
      this.internaStats = this.internaService.getInternaStats();
    });

    this.visitanteService.visitantes$.subscribe(() => {
      this.visitanteStats = this.visitanteService.getVisitanteStats();
    });
  }

  loadData() {
    this.internaService.getInternas().subscribe();
    this.visitanteService.getVisitantes().subscribe();
  }

  navigateToInternas() {
    this.router.navigate(['/internas']);
  }

  navigateToVisitantes() {
    this.router.navigate(['/visitantes']);
  }
}
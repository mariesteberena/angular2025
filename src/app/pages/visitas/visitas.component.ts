import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visitas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #e8eaf6 100%);">
      <div class="text-center mx-auto px-3" style="max-width: 500px;">
        <!-- Icono de construcción -->
        <div class="mb-4">
          <div class="d-inline-flex align-items-center justify-content-center mx-auto mb-3" style="width: 96px; height: 96px; background-color: #fff3cd; border-radius: 50%;">
            <svg style="width: 48px; height: 48px; color: #856404;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>

        <!-- Título -->
        <h1 class="display-4 fw-bold text-dark mb-3">
          En Construcción
        </h1>

        <!-- Mensaje -->
        <p class="lead text-muted mb-4">
          La sección de visitas está siendo desarrollada. 
          Pronto estará disponible para gestionar las visitas de las internas.
        </p>

        <!-- Barra de progreso -->
        <div class="progress mb-4" style="height: 8px;">
          <div class="progress-bar bg-gradient-primary" role="progressbar" style="width: 60%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
        </div>

        <!-- Información adicional -->
        <div class="card bg-white bg-opacity-75 border-0 shadow-sm">
          <div class="card-body">
            <h3 class="h6 fw-semibold text-dark mb-2">Funcionalidades próximas:</h3>
            <ul class="list-unstyled text-muted small mb-0">
              <li class="mb-1">• Programación de visitas</li>
              <li class="mb-1">• Gestión de horarios</li>
              <li class="mb-1">• Control de acceso</li>
              <li class="mb-1">• Registro de visitantes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VisitasComponent {
  // Componente simplificado - solo muestra la página de construcción
}
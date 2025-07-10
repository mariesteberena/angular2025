import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InternaService } from '../../services/interna.service';
import { VisitanteService } from '../../services/visitante.service';
import { InternaFormComponent } from '../../components/interna-form/interna-form.component';
import { Interna, CreateInternaDto, UpdateInternaDto } from '../../interfaces/interna.interface';

@Component({
  selector: 'app-internas',
  standalone: true,
  imports: [CommonModule, FormsModule, InternaFormComponent],
  template: `
    <div class="container py-4">
      <h1 class="display-6 fw-bold mb-4">Gestión de Internas</h1>
      <button
        (click)="toggleInternaForm()"
        class="btn btn-primary mb-4"
      >
        <i class="bi bi-plus-circle me-2"></i>Nueva Interna
      </button>

      <!-- Toast Notifications -->
      <div *ngIf="showToast" 
           class="position-fixed top-0 end-0 p-3" style="z-index: 1050;">
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header" [class]="toastClass">
            <div class="me-auto">
              <i *ngIf="toastType === 'success'" class="bi bi-check-circle-fill text-success me-2"></i>
              <i *ngIf="toastType === 'error'" class="bi bi-x-circle-fill text-danger me-2"></i>
              <strong class="me-auto" [class]="toastTextClass">{{ toastMessage }}</strong>
            </div>
            <button type="button" class="btn-close" (click)="hideToast()"></button>
          </div>
        </div>
      </div>

      <!-- Modal para el formulario de interna -->
      <div *ngIf="showInternaForm" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ selectedInterna ? 'Editar Interna' : 'Nueva Interna' }}</h5>
              <button type="button" class="btn-close" (click)="onCancelForm()"></button>
            </div>
            <div class="modal-body">
              <app-interna-form
                [interna]="selectedInterna"
                [isSubmitting]="isSubmitting"
                (submitInterna)="onSubmitInterna($event)"
                (cancel)="onCancelForm()"
              ></app-interna-form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para mostrar detalles de interna -->
      <div *ngIf="showInternaDetail" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ selectedInterna?.nombre }} {{ selectedInterna?.apellido }}</h5>
              <button type="button" class="btn-close" (click)="closeInternaDetail()"></button>
            </div>
            <div class="modal-body" *ngIf="selectedInterna">
              <div class="row">
                <!-- Imagen y estado -->
                <div class="col-md-3">
                  <div class="card">
                    <div class="card-body text-center">
                      <div class="mb-3">
                        <img *ngIf="selectedInterna.imagen" [src]="selectedInterna.imagen" [alt]="selectedInterna.nombre" 
                             class="img-fluid rounded" style="max-width: 150px;">
                        <div *ngIf="!selectedInterna.imagen" class="bg-primary text-white rounded d-flex align-items-center justify-content-center mx-auto" 
                             style="width: 150px; height: 150px;">
                          <span class="fw-bold fs-1">{{ selectedInterna.nombre.charAt(0) }}{{ selectedInterna.apellido.charAt(0) }}</span>
                        </div>
                      </div>
                      <div class="d-flex justify-content-center gap-2 mb-2">
                        <span class="badge" [class]="getEstadoClass(selectedInterna.estado)">
                          {{ selectedInterna.estado | titlecase }}
                        </span>
                      </div>
                      <h6 class="text-primary fw-bold">{{ selectedInterna.fcn }}</h6>
                    </div>
                  </div>
                </div>

                <!-- Información detallada -->
                <div class="col-md-9">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="card mb-3">
                        <div class="card-header">
                          <h6 class="mb-0 fw-bold">Información Personal</h6>
                        </div>
                        <div class="card-body">
                          <div class="row mb-2">
                            <div class="col-5 text-muted">DNI:</div>
                            <div class="col-7 fw-medium">{{ selectedInterna.dni }}</div>
                          </div>
                          <div class="row mb-2">
                            <div class="col-5 text-muted">Fecha de Nacimiento:</div>
                            <div class="col-7 fw-medium">{{ selectedInterna.fechaNacimiento | date:'dd/MM/yyyy' }}</div>
                          </div>
                          <div class="row mb-2">
                            <div class="col-5 text-muted">Domicilio:</div>
                            <div class="col-7 fw-medium">{{ selectedInterna.domicilio }}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="card mb-3">
                        <div class="card-header">
                          <h6 class="mb-0 fw-bold">Información Penitenciaria</h6>
                        </div>
                        <div class="card-body">
                          <div class="row mb-2">
                            <div class="col-5 text-muted">Pabellón:</div>
                            <div class="col-7 fw-medium">{{ selectedInterna.pabellon }}</div>
                          </div>
                          <div class="row mb-2">
                            <div class="col-5 text-muted">Celda:</div>
                            <div class="col-7 fw-medium">{{ selectedInterna.celda }}</div>
                          </div>
                          <div class="row mb-2">
                            <div class="col-5 text-muted">Fecha de Ingreso:</div>
                            <div class="col-7 fw-medium">{{ selectedInterna.fechaIngreso | date:'dd/MM/yyyy' }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Visitantes y Familiares -->
                  <div class="row">
                    <div class="col-md-6">
                      <div class="card mb-3">
                        <div class="card-header">
                          <h6 class="mb-0 fw-bold">Visitantes Autorizados</h6>
                        </div>
                        <div class="card-body">
                          <div *ngIf="selectedInterna.visitantes.length > 0; else noVisitantes">
                            <div *ngFor="let visitanteId of selectedInterna.visitantes" class="badge bg-light text-dark me-2 mb-2">
                              ID: {{ visitanteId }}
                            </div>
                          </div>
                          <ng-template #noVisitantes>
                            <p class="text-muted small mb-0">No hay visitantes autorizados</p>
                          </ng-template>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="card mb-3">
                        <div class="card-header">
                          <h6 class="mb-0 fw-bold">Familiares en el Centro</h6>
                        </div>
                        <div class="card-body">
                          <div *ngIf="selectedInterna.familiares.length > 0; else noFamiliares">
                            <div *ngFor="let familiarId of selectedInterna.familiares" class="badge bg-light text-dark me-2 mb-2">
                              ID: {{ familiarId }}
                            </div>
                          </div>
                          <ng-template #noFamiliares>
                            <p class="text-muted small mb-0">No hay familiares en el centro</p>
                          </ng-template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                (click)="onEditInterna(selectedInterna!)"
                class="btn btn-primary"
              >
                <i class="bi bi-pencil me-2"></i>Editar
              </button>
              <button
                (click)="onDeleteInterna(selectedInterna!)"
                class="btn btn-danger"
              >
                <i class="bi bi-trash me-2"></i>Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de internas -->
      <div class="card shadow-sm" style="background: rgba(255, 255, 255, 0.4);border-radius: 15px">
        <div class="card-body p-0" style="background: rgba(255, 255, 255, 0.3); border-radius: 15px">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th class="border-0">Nombre</th>
                  <th class="border-0">Apellido</th>
                  <th class="border-0">FCN</th>
                  <th class="border-0">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let interna of filteredInternas" 
                    (click)="openInternaDetail(interna)"
                    class="cursor-pointer">
                  <td class="fw-medium">{{ interna.nombre }}</td>
                  <td>{{ interna.apellido }}</td>
                  <td class="text-primary fw-bold">{{ interna.fcn }}</td>
                  <td>
                    <span class="badge" [class]="getEstadoClass(interna.estado)">
                      {{ interna.estado | titlecase }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InternasComponent implements OnInit {
  internas: Interna[] = [];
  filteredInternas: Interna[] = [];
  showInternaForm = false;
  showInternaDetail = false;
  selectedInterna: Interna | null = null;
  isSubmitting = false;
  isLoading = false;
  
  // Filters
  searchTerm = '';
  selectedPabellon = '';
  selectedEstado = '';

  // Toast Notifications
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';
  toastClass = '';
  toastTextClass = '';

  constructor(
    private internaService: InternaService,
    private visitanteService: VisitanteService
  ) {}

  ngOnInit() {
    this.loadInternas();
    this.internaService.internas$.subscribe(internas => {
      this.internas = internas;
      this.filterInternas();
    });
  }

  loadInternas() {
    this.isLoading = true;
    this.internaService.getInternas().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading internas:', error);
        this.isLoading = false;
        this.showToastNotification('Error al cargar internas.', 'error');
      }
    });
  }

  toggleInternaForm() {
    this.showInternaForm = !this.showInternaForm;
    if (!this.showInternaForm) {
      this.selectedInterna = null;
    }
  }

  openInternaDetail(interna: Interna) {
    this.selectedInterna = interna;
    this.showInternaDetail = true;
  }

  closeInternaDetail() {
    this.showInternaDetail = false;
    this.selectedInterna = null;
  }

  onSubmitInterna(internaData: CreateInternaDto | UpdateInternaDto) {
    this.isSubmitting = true;
    
    if (this.selectedInterna) {
      // Update existing interna
      this.internaService.updateInterna(this.selectedInterna.id, internaData as UpdateInternaDto).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showInternaForm = false;
          this.selectedInterna = null;
          this.showToastNotification('Interna actualizada exitosamente!', 'success');
          this.loadInternas(); // Reload internas to update the list
        },
        error: (error) => {
          console.error('Error updating interna:', error);
          this.isSubmitting = false;
          this.showToastNotification('Error al actualizar interna.', 'error');
        }
      });
    } else {
      // Create new interna
      this.internaService.createInterna(internaData as CreateInternaDto).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showInternaForm = false;
          this.showToastNotification('Interna creada exitosamente!', 'success');
          this.loadInternas(); // Reload internas to update the list
        },
        error: (error) => {
          console.error('Error creating interna:', error);
          this.isSubmitting = false;
          this.showToastNotification('Error al crear interna.', 'error');
        }
      });
    }
  }

  onCancelForm() {
    this.showInternaForm = false;
    this.selectedInterna = null;
  }

  onEditInterna(interna: Interna) {
    this.selectedInterna = interna;
    this.showInternaForm = true;
    this.closeInternaDetail();
  }

  onViewVisitantes(interna: Interna) {
    // Implementar vista de visitantes de la interna
    alert(`Ver visitantes de ${interna.nombre} ${interna.apellido}`);
  }

  onDeleteInterna(interna: Interna) {
    if (confirm(`¿Está seguro que desea eliminar a ${interna.nombre} ${interna.apellido}?`)) {
      this.internaService.deleteInterna(interna.id).subscribe({
        next: () => {
          this.closeInternaDetail();
          this.showToastNotification('Interna eliminada exitosamente!', 'success');
          this.loadInternas(); // Reload internas to update the list
        },
        error: (error) => {
          console.error('Error deleting interna:', error);
          this.showToastNotification('Error al eliminar interna.', 'error');
        }
      });
    }
  }

  filterInternas() {
    this.filteredInternas = this.internas.filter(interna => {
      const matchesSearch = interna.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        interna.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        interna.fcn.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        interna.dni.includes(this.searchTerm);
      const matchesPabellon = !this.selectedPabellon || interna.pabellon === parseInt(this.selectedPabellon);
      const matchesEstado = !this.selectedEstado || interna.estado === this.selectedEstado;
      return matchesSearch && matchesPabellon && matchesEstado;
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'activa': return 'bg-success text-white';
      case 'trasladada': return 'bg-warning text-dark';
      case 'liberada': return 'bg-primary text-white';
      default: return 'bg-secondary text-white';
    }
  }

  // Toast Notification Methods
  showToastNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    
    // Set CSS classes based on type
    switch (type) {
      case 'success':
        this.toastClass = 'border-green-500';
        this.toastTextClass = 'text-green-600';
        break;
      case 'error':
        this.toastClass = 'border-red-500';
        this.toastTextClass = 'text-red-600';
        break;
      case 'info':
        this.toastClass = 'border-blue-500';
        this.toastTextClass = 'text-blue-600';
        break;
    }
    
    this.showToast = true;
    setTimeout(() => this.hideToast(), 3000); // Hide after 3 seconds
  }

  hideToast() {
    this.showToast = false;
  }
}
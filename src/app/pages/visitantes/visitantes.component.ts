import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitanteService } from '../../services/visitante.service';
import { InternaService } from '../../services/interna.service';
import { Visitante, CreateVisitanteDto } from '../../interfaces/visitante.interface';
import { VisitanteFormComponent } from '../../components/visitante-form/visitante-form.component';

@Component({
  selector: 'app-visitantes',
  standalone: true,
  imports: [CommonModule, FormsModule, VisitanteFormComponent],
  template: `
    <div class="container-fluid py-4">
      <!-- Toast Notifications -->
      @if (showToast) {
        <div class="position-fixed top-0 end-0 p-3" style="z-index: 1050;">
          <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header" [class]="toastClass">
              <div class="me-auto">
                @if (toastType === 'success') {
                  <i class="bi bi-check-circle-fill text-success me-2"></i>
                }
                @if (toastType === 'error') {
                  <i class="bi bi-x-circle-fill text-danger me-2"></i>
                }
                <strong class="me-auto" [class]="toastTextClass">{{ toastMessage }}</strong>
              </div>
              <button type="button" class="btn-close" (click)="hideToast()"></button>
            </div>
          </div>
        </div>
      }

      <div class="d-flex align-items-center justify-content-between mb-4">
        <h1 class="display-5 fw-bold text-dark d-flex align-items-center">          
          Visitantes por Interna
        </h1>
      </div>

      <!-- Filtros -->
      <div class="card shadow-sm mb-4" style="background: rgba(255, 255, 255, 0.3); border-radius: 15px">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <input
                type="text"
                class="form-control"
                placeholder="Buscar por nombre de interna..."
                [(ngModel)]="searchTerm"
                (input)="filterInternas()"
              />
            </div>
            <div class="col-md-4">
              <select
                class="form-select"
                [(ngModel)]="selectedPabellon"
                (change)="filterInternas()"
              >
                <option value="">Todos los pabellones</option>
                <option value="1">Pabellón 1</option>
                <option value="2">Pabellón 2</option>
                <option value="3">Pabellón 3</option>
                <option value="4">Pabellón 4</option>
              </select>
            </div>
            <div class="col-md-4 d-flex align-items-center">
              <span class="text-muted">Total Internas: {{ filteredInternas.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Internas con sus Visitantes -->
      @if (filteredInternas.length === 0) {
        <div class="card text-center py-5" style="background: rgba(255, 255, 255, 0.3); border-radius: 15px">
          <div class="card-body">
            <i class="bi bi-person-x display-1 text-muted mb-3"></i>
            <h3 class="h5 fw-bold text-dark mb-2">No se encontraron internas</h3>
            <p class="text-muted">{{ searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza registrando la primera interna' }}</p>
          </div>
        </div>
      } @else {
        <div class="row g-4">
          @for (interna of filteredInternas; track interna.id) {
            <div class="col-12">
              <div class="card shadow-sm overflow-hidden" >
                <!-- Interna Header -->
                <div 
                  class="bg-gradient-primary p-4 text-white cursor-pointer"
                  (click)="toggleInternaExpansion(interna.id)"
                >
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      @if (interna.imagen) {
                        <img [src]="interna.imagen" [alt]="interna.nombre" class="rounded-circle me-3" style="width: 64px; height: 64px; object-fit: cover; border: 2px solid white;">
                      } @else {
                        <div class="rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 64px; height: 64px; background-color: rgba(255,255,255,0.2); border: 2px solid white;">
                          <span class="text-white fw-bold fs-4">{{ interna.nombre.charAt(0) }}{{ interna.apellido.charAt(0) }}</span>
                        </div>
                      }
                      <div>
                        <h2 class="h3 fw-bold mb-1">{{ interna.nombre }} {{ interna.apellido }}</h2>
                        <p class="mb-0 opacity-75">{{ interna.fcn }} - Pabellón {{ interna.pabellon }}, Celda {{ interna.celda }}</p>
                      </div>
                    </div>
                    <div class="text-end d-flex align-items-center">
                      <span class="badge bg-white bg-opacity-25 me-3">
                        {{ getVisitantesForInterna(interna.id).length }} visitante(s)
                      </span>
                      <i class="bi bi-chevron-down" 
                         [class.bi-chevron-up]="expandedInternas.has(interna.id)"
                         style="font-size: 1.5rem;"></i>
                    </div>
                  </div>
                </div>

                <!-- Visitantes de esta Interna -->
                @if (expandedInternas.has(interna.id)) {
                  <div class="card-body border-top">
                    <div class="mb-3 d-flex justify-content-end">
                      <button
                        (click)="onAddVisitanteToInterna(interna)"
                        class="btn btn-outline-secondary btn-sm"
                      >
                        <i class="bi bi-plus-circle me-1"></i>Agregar visitante
                      </button>
                    </div>
                    @if (internaFormVisitanteId === interna.id && showVisitanteForm) {
                      <div class="mb-4">
                        <app-visitante-form
                          [visitante]="selectedVisitante"
                          [isSubmitting]="isSubmitting"
                          (submitVisitante)="onSubmitVisitante($event)"
                          (cancel)="onCancelForm()"
                        ></app-visitante-form>
                      </div>
                    }
                    @if (getVisitantesForInterna(interna.id).length === 0) {
                      <div class="text-center py-4">
                        <i class="bi bi-people display-4 text-muted mb-3"></i>
                        <p class="text-muted">Esta interna no tiene visitantes autorizados</p>
                      </div>
                    } @else {
                      <div class="row g-3">
                        @for (visitante of getVisitantesForInterna(interna.id); track visitante.id) {
                          <div class="col-md-6 col-lg-4">
                            <div class="card bg-light border-0 h-100">
                              <div class="card-body">
                                <div class="d-flex align-items-start mb-3">
                                  @if (visitante.imagen) {
                                    <img [src]="visitante.imagen" [alt]="visitante.nombre" class="rounded-circle me-3" style="width: 48px; height: 48px; object-fit: cover;">
                                  } @else {
                                    <div class="rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 48px; height: 48px; background-color: #d1e7dd;">
                                      <span class="text-success fw-medium small">{{ visitante.nombre.charAt(0) }}{{ visitante.apellido.charAt(0) }}</span>
                                    </div>
                                  }
                                  <div class="flex-grow-1">
                                    <h3 class="h6 fw-semibold text-dark mb-1">{{ visitante.nombre }} {{ visitante.apellido }}</h3>
                                    <p class="small text-success mb-2">
                                      Parentesco: {{ visitante.parentesco }} - {{ visitante.vinculo }}
                                    </p>
                                    <div class="d-flex flex-column gap-1">
                                      <span class="badge" [class]="getEstadoClass(visitante.estado)">
                                        {{ visitante.estado | titlecase }}
                                      </span>
                                      <span class="badge" 
                                            [class]="visitante.esMayorDeEdad ? 'bg-primary' : 'bg-warning'">
                                        {{ visitante.esMayorDeEdad ? 'Mayor' : 'Menor' }}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div class="small text-muted mb-3">
                                  <div class="d-flex align-items-center mb-1">
                                    <i class="bi bi-card-text me-2"></i>
                                    <span>DNI: {{ visitante.dni }}</span>
                                  </div>
                                  @if (visitante.telefono) {
                                    <div class="d-flex align-items-center">
                                      <i class="bi bi-telephone me-2"></i>
                                      <span>{{ visitante.telefono }}</span>
                                    </div>
                                  }
                                </div>
                                <div class="d-flex gap-2">
                                  <button
                                    (click)="onEditVisitante(visitante)"
                                    class="btn btn-outline-success btn-sm flex-fill"
                                  >
                                    <i class="bi bi-pencil me-1"></i>Editar
                                  </button>
                                  <button
                                    (click)="onDeleteVisitante(visitante)"
                                    class="btn btn-outline-danger btn-sm"
                                  >
                                    <i class="bi bi-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class VisitantesComponent implements OnInit {
  internas: any[] = [];
  filteredInternas: any[] = [];
  visitantes: Visitante[] = [];
  showVisitanteForm = false;
  selectedVisitante: Visitante | null = null;
  isSubmitting = false;
  isLoading = false;

  searchTerm = '';
  selectedPabellon = '';
  expandedInternas: Set<number> = new Set();
  internaFormVisitanteId: number | null = null;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';
  toastClass = '';
  toastTextClass = '';

  constructor(
    private visitanteService: VisitanteService,
    private internaService: InternaService
  ) {}

  ngOnInit() {
    this.loadData();
    
    this.internaService.internas$.subscribe(internas => {
      this.internas = internas;
      this.filterInternas();
    });

    this.visitanteService.visitantes$.subscribe(visitantes => {
      this.visitantes = visitantes;
    });
  }

  loadData() {
    this.isLoading = true;
    this.internaService.getInternas().subscribe({
      next: (internas) => {
        this.visitanteService.getVisitantes().subscribe({
          next: (visitantes) => {
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  toggleVisitanteForm() {
    this.showVisitanteForm = !this.showVisitanteForm;
    if (!this.showVisitanteForm) {
      this.selectedVisitante = null;
    }
  }

  onSubmitVisitante(visitanteData: any) {
    this.isSubmitting = true;
    
    this.visitanteService.createVisitante(visitanteData).subscribe({
      next: (nuevoVisitante) => {
        if (this.internaFormVisitanteId) {
          this.visitanteService.addVisitanteToInterna(nuevoVisitante.id, this.internaFormVisitanteId).subscribe({
            next: () => {
              this.isSubmitting = false;
              this.showVisitanteForm = false;
              this.internaFormVisitanteId = null;
              this.showToastNotification('Visitante registrado exitosamente!', 'success');
              
              this.visitanteService.getVisitantes().subscribe();
            },
            error: (error: any) => {
              this.isSubmitting = false;
              this.showToastNotification('Visitante creado pero error al asociarlo a la interna', 'error');
            }
          });
        } else {
          this.isSubmitting = false;
          this.showVisitanteForm = false;
          this.internaFormVisitanteId = null;
          this.showToastNotification('Visitante registrado exitosamente!', 'success');
          
          this.visitanteService.getVisitantes().subscribe();
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.showToastNotification('Error al registrar visitante: ' + (error.message || 'Error desconocido'), 'error');
      }
    });
  }

  onCancelForm() {
    this.showVisitanteForm = false;
    this.internaFormVisitanteId = null;
  }

  onEditVisitante(visitante: Visitante) {
    this.selectedVisitante = visitante;
    this.showVisitanteForm = true;
    this.internaFormVisitanteId = null;
  }

  onDeleteVisitante(visitante: Visitante) {
    if (confirm(`¿Está seguro que desea eliminar a ${visitante.nombre} ${visitante.apellido}?`)) {
      this.visitanteService.deleteVisitante(visitante.id).subscribe({
        next: () => {
          this.showToastNotification('Visitante eliminado exitosamente!', 'success');
          this.visitanteService.getVisitantes().subscribe();
        },
        error: (error) => {
          this.showToastNotification('Error al eliminar visitante.', 'error');
        }
      });
    }
  }

  filterInternas() {
    this.filteredInternas = this.internas.filter(interna => {
      const matchesSearch = !this.searchTerm || 
        interna.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        interna.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        interna.fcn.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesPabellon = !this.selectedPabellon || interna.pabellon === parseInt(this.selectedPabellon);
      
      return matchesSearch && matchesPabellon;
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'activo': return 'bg-success text-white';
      case 'suspendido': return 'bg-warning text-dark';
      case 'inhabilitado': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  toggleInternaExpansion(internaId: number) {
    if (this.expandedInternas.has(internaId)) {
      this.expandedInternas.delete(internaId);
    } else {
      this.expandedInternas.add(internaId);
    }
  }

  getVisitantesForInterna(internaId: number): Visitante[] {
    return this.visitantes.filter(visitante => 
      visitante.internasAutorizadas.includes(internaId)
    );
  }

  onAddVisitanteToInterna(interna: any) {
    this.selectedVisitante = null;
    this.internaFormVisitanteId = interna.id;
    this.showVisitanteForm = true;
  }

  showToastNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    
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
    setTimeout(() => this.hideToast(), 3000);
  }

  hideToast() {
    this.showToast = false;
  }
}
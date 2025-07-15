import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Interna, CreateInternaDto, UpdateInternaDto } from '../../interfaces/interna.interface';
import { InternaService } from '../../services/interna.service';

@Component({
  selector: 'app-interna-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <h3 class="h4 fw-semibold text-dark mb-4 d-flex align-items-center">
          <i class="bi bi-person-fill text-primary me-2"></i>
          {{ isEditing ? 'Editar Interna' : 'Registrar Nueva Interna' }}
        </h3>
        
        <form [formGroup]="internaForm" (ngSubmit)="onSubmit()">
          <div class="row g-4">
            <!-- Datos Personales -->
            <div class="col-md-6">
              <div class="card border-0 bg-light">
                <div class="card-header bg-transparent border-0">
                  <h4 class="h6 fw-bold text-dark mb-0">Datos Personales</h4>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label for="nombre" class="form-label fw-medium">
                      Nombre <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      formControlName="nombre"
                      class="form-control"
                      placeholder="Ingrese el nombre"
                    />
                    @if (internaForm.get('nombre')?.invalid && internaForm.get('nombre')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (internaForm.get('nombre')?.errors?.['required']) {
                          El nombre es requerido
                        }
                        @if (internaForm.get('nombre')?.errors?.['minlength']) {
                          El nombre debe tener al menos 2 caracteres
                        }
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="apellido" class="form-label fw-medium">
                      Apellido <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="apellido"
                      formControlName="apellido"
                      class="form-control"
                      placeholder="Ingrese el apellido"
                    />
                    @if (internaForm.get('apellido')?.invalid && internaForm.get('apellido')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (internaForm.get('apellido')?.errors?.['required']) {
                          El apellido es requerido
                        }
                        @if (internaForm.get('apellido')?.errors?.['minlength']) {
                          El apellido debe tener al menos 2 caracteres
                        }
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="dni" class="form-label fw-medium">
                      DNI <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="dni"
                      formControlName="dni"
                      class="form-control"
                      placeholder="12345678"
                      maxlength="8"
                    />
                    @if (internaForm.get('dni')?.invalid && internaForm.get('dni')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (internaForm.get('dni')?.errors?.['required']) {
                          El DNI es requerido
                        }
                        @if (internaForm.get('dni')?.errors?.['pattern']) {
                          El DNI debe contener solo números
                        }
                        @if (internaForm.get('dni')?.errors?.['minlength'] || internaForm.get('dni')?.errors?.['maxlength']) {
                          El DNI debe tener 8 dígitos
                        }
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="fechaNacimiento" class="form-label fw-medium">
                      Fecha de Nacimiento <span class="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="fechaNacimiento"
                      formControlName="fechaNacimiento"
                      class="form-control"
                      [max]="maxDate"
                    />
                    @if (internaForm.get('fechaNacimiento')?.invalid && internaForm.get('fechaNacimiento')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (internaForm.get('fechaNacimiento')?.errors?.['required']) {
                          La fecha de nacimiento es requerida
                        }
                        @if (internaForm.get('fechaNacimiento')?.errors?.['minAge']) {
                          La interna debe ser mayor de 18 años
                        }
                      </div>
                    }
                    @if (internaForm.get('fechaNacimiento')?.valid && internaForm.get('fechaNacimiento')?.value) {
                      <div class="form-text text-success">
                        Edad: {{ calcularEdad(internaForm.get('fechaNacimiento')?.value) }} años
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="domicilio" class="form-label fw-medium">
                      Domicilio <span class="text-danger">*</span>
                    </label>
                    <textarea
                      id="domicilio"
                      formControlName="domicilio"
                      rows="2"
                      class="form-control"
                      placeholder="Dirección completa"
                    ></textarea>
                    @if (internaForm.get('domicilio')?.invalid && internaForm.get('domicilio')?.touched) {
                      <div class="invalid-feedback d-block">El domicilio es requerido</div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Datos del Centro -->
            <div class="col-md-6">
              <div class="card border-0 bg-light">
                <div class="card-header bg-transparent border-0">
                  <h4 class="h6 fw-bold text-dark mb-0">Datos del Centro</h4>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label for="fcn" class="form-label fw-medium">
                      FCN° (Ficha Criminológica) <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="fcn"
                      formControlName="fcn"
                      class="form-control"
                      placeholder="123456"
                      maxlength="6"
                    />
                    @if (internaForm.get('fcn')?.invalid && internaForm.get('fcn')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (internaForm.get('fcn')?.errors?.['required']) {
                          El FCN° es requerido
                        }
                        @if (internaForm.get('fcn')?.errors?.['pattern']) {
                          El FCN° debe contener exactamente 6 dígitos
                        }
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="pabellon" class="form-label fw-medium">
                      Pabellón <span class="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      id="pabellon"
                      formControlName="pabellon"
                      class="form-control"
                      placeholder="Ingrese el número de pabellón"
                      min="1"
                      max="10"
                    />
                    @if (internaForm.get('pabellon')?.invalid && internaForm.get('pabellon')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (internaForm.get('pabellon')?.errors?.['required']) {
                          El pabellón es requerido
                        }
                        @if (internaForm.get('pabellon')?.errors?.['min'] || internaForm.get('pabellon')?.errors?.['max']) {
                          El pabellón debe estar entre 1 y 10
                        }
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="celda" class="form-label fw-medium">
                      Celda <span class="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      id="celda"
                      formControlName="celda"
                      class="form-control"
                      placeholder="Ingrese el número de celda"
                      min="1"
                      max="50"
                    />
                    @if (internaForm.get('celda')?.invalid && internaForm.get('celda')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (internaForm.get('celda')?.errors?.['required']) {
                          La celda es requerida
                        }
                        @if (internaForm.get('celda')?.errors?.['min'] || internaForm.get('celda')?.errors?.['max']) {
                          La celda debe estar entre 1 y 50
                        }
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="fechaIngreso" class="form-label fw-medium">
                      Fecha de Ingreso <span class="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      id="fechaIngreso"
                      formControlName="fechaIngreso"
                      class="form-control"
                      [max]="maxDate"
                    />
                    @if (internaForm.get('fechaIngreso')?.invalid && internaForm.get('fechaIngreso')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (internaForm.get('fechaIngreso')?.errors?.['required']) {
                          La fecha de ingreso es requerida
                        }
                      </div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="estado" class="form-label fw-medium">
                      Estado <span class="text-danger">*</span>
                    </label>
                    <select
                      id="estado"
                      formControlName="estado"
                      class="form-select"
                    >
                      <option value="">Seleccione un estado</option>
                      <option value="activa">Activa</option>
                      <option value="trasladada">Trasladada</option>
                      <option value="liberada">Liberada</option>
                    </select>
                    @if (internaForm.get('estado')?.invalid && internaForm.get('estado')?.touched) {
                      <div class="invalid-feedback d-block">El estado es requerido</div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="imagen" class="form-label fw-medium">
                      Imagen
                    </label>
                    <input
                      type="file"
                      id="imagen"
                      (change)="onFileSelected($event)"
                      class="form-control"
                      accept="image/*"
                    />
                    <div class="form-text">Formatos permitidos: JPG, PNG, GIF. Máximo 5MB.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones -->
          <div class="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
            <button
              type="button"
              (click)="onCancel()"
              class="btn btn-outline-secondary"
              [disabled]="isSubmitting"
            >
              <i class="bi bi-x-circle me-2"></i>Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="internaForm.invalid || isSubmitting"
            >
              @if (isSubmitting) {
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              } @else {
                <i class="bi bi-check-circle me-2"></i>
                {{ isEditing ? 'Actualizar' : 'Registrar' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class InternaFormComponent implements OnInit {
  @Input() interna: Interna | null = null;
  @Input() isSubmitting = false;
  @Output() submitInterna = new EventEmitter<CreateInternaDto | UpdateInternaDto>();
  @Output() cancel = new EventEmitter<void>();

  internaForm: FormGroup;
  isEditing = false;
  availableInternas: Interna[] = [];
  selectedFamiliares: number[] = [];
  selectedFile: File | null = null;
  maxDate: string;

  constructor(
    private fb: FormBuilder,
    private internaService: InternaService
  ) {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = maxDate.toISOString().split('T')[0];
    this.internaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      fcn: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      fechaNacimiento: ['', [Validators.required, this.minAgeValidator()]],
      domicilio: ['', Validators.required],
      pabellon: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      celda: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      fechaIngreso: ['', Validators.required],
      estado: ['activa', Validators.required],
      imagen: [''],
    });
  }

  ngOnInit() {
    this.loadAvailableInternas();
    
    if (this.interna) {
      this.isEditing = true;
      this.selectedFamiliares = [...this.interna.familiares];
      this.internaForm.patchValue({
        nombre: this.interna.nombre,
        apellido: this.interna.apellido,
        fcn: this.interna.fcn,
        dni: this.interna.dni,
        fechaNacimiento: new Date(this.interna.fechaNacimiento).toISOString().split('T')[0],
        domicilio: this.interna.domicilio,
        pabellon: this.interna.pabellon,
        celda: this.interna.celda,
        fechaIngreso: new Date(this.interna.fechaIngreso).toISOString().split('T')[0],
        estado: this.interna.estado,
        imagen: this.interna.imagen || '',
      });
    }
  }

  loadAvailableInternas() {
    this.internaService.getInternas().subscribe(internas => {
      this.availableInternas = internas.filter(i => 
        !this.interna || i.id !== this.interna.id
      );
    });
  }

  onFamiliarChange(event: any, internaId: number) {
    if (event.target.checked) {
      if (!this.selectedFamiliares.includes(internaId)) {
        this.selectedFamiliares.push(internaId);
      }
    } else {
      this.selectedFamiliares = this.selectedFamiliares.filter(id => id !== internaId);
    }
  }

  onSubmit() {
    if (this.internaForm.valid) {
      const formValue = this.internaForm.value;
      
      if (this.isEditing) {
        const updateData: UpdateInternaDto = {
          nombre: formValue.nombre,
          apellido: formValue.apellido,
          fcn: formValue.fcn,
          dni: formValue.dni,
          fechaNacimiento: new Date(formValue.fechaNacimiento),
          domicilio: formValue.domicilio,
          pabellon: parseInt(formValue.pabellon),
          celda: parseInt(formValue.celda),
          imagen: formValue.imagen || undefined,
          fechaIngreso: new Date(formValue.fechaIngreso),
          estado: formValue.estado,
          familiares: this.selectedFamiliares,
          visitantes: this.interna?.visitantes || []
        };
        this.submitInterna.emit(updateData);
      } else {
        const createData: CreateInternaDto = {
          nombre: formValue.nombre,
          apellido: formValue.apellido,
          fcn: formValue.fcn,
          dni: formValue.dni,
          fechaNacimiento: new Date(formValue.fechaNacimiento),
          domicilio: formValue.domicilio,
          pabellon: parseInt(formValue.pabellon),
          celda: parseInt(formValue.celda),
          imagen: formValue.imagen || undefined,
          fechaIngreso: new Date(formValue.fechaIngreso),
          estado: formValue.estado,
          familiares: this.selectedFamiliares
        };
        this.submitInterna.emit(createData);
      }
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.internaForm.patchValue({
          imagen: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  calcularEdad(fechaNacimiento: string): number {
    const fecha = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    
    return edad;
  }

  minAgeValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      
      const fechaNacimiento = new Date(control.value);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      
      return edad >= 18 ? null : { minAge: true };
    };
  }
}
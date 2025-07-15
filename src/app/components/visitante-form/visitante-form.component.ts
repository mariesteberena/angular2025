import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Visitante, CreateVisitanteDto, UpdateVisitanteDto } from '../../interfaces/visitante.interface';

@Component({
  selector: 'app-visitante-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <h3 class="h4 fw-semibold text-dark mb-4 d-flex align-items-center">
          <i class="bi bi-people-fill text-success me-2"></i>
          {{ isEditing ? 'Editar Visitante' : 'Registrar Nuevo Visitante' }}
        </h3>
        
        <form [formGroup]="visitanteForm" (ngSubmit)="onSubmit()">
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
                    @if (visitanteForm.get('nombre')?.invalid && visitanteForm.get('nombre')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (visitanteForm.get('nombre')?.errors?.['required']) {
                          El nombre es requerido
                        }
                        @if (visitanteForm.get('nombre')?.errors?.['minlength']) {
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
                    @if (visitanteForm.get('apellido')?.invalid && visitanteForm.get('apellido')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (visitanteForm.get('apellido')?.errors?.['required']) {
                          El apellido es requerido
                        }
                        @if (visitanteForm.get('apellido')?.errors?.['minlength']) {
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
                    @if (visitanteForm.get('dni')?.invalid && visitanteForm.get('dni')?.touched) {
                      <div class="invalid-feedback d-block">
                        @if (visitanteForm.get('dni')?.errors?.['required']) {
                          El DNI es requerido
                        }
                        @if (visitanteForm.get('dni')?.errors?.['pattern']) {
                          El DNI debe contener solo números
                        }
                        @if (visitanteForm.get('dni')?.errors?.['minlength'] || visitanteForm.get('dni')?.errors?.['maxlength']) {
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
                    />
                    @if (visitanteForm.get('fechaNacimiento')?.invalid && visitanteForm.get('fechaNacimiento')?.touched) {
                      <div class="invalid-feedback d-block">La fecha de nacimiento es requerida</div>
                    }
                    @if (esMayorDeEdad !== null) {
                      <div class="form-text" [class]="esMayorDeEdad ? 'text-success' : 'text-warning'">
                        <i class="bi" [class]="esMayorDeEdad ? 'bi-check-circle' : 'bi-exclamation-triangle'"></i>
                        {{ esMayorDeEdad ? 'Mayor de edad' : 'Menor de edad' }}
                        @if (!esMayorDeEdad) {
                          - No requiere imagen
                        }
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
                    @if (visitanteForm.get('domicilio')?.invalid && visitanteForm.get('domicilio')?.touched) {
                      <div class="invalid-feedback d-block">El domicilio es requerido</div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="telefono" class="form-label fw-medium">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      formControlName="telefono"
                      class="form-control"
                      placeholder="11-1234-5678"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Datos de Relación -->
            <div class="col-md-6">
              <div class="card border-0 bg-light">
                <div class="card-header bg-transparent border-0">
                  <h4 class="h6 fw-bold text-dark mb-0">Datos de Relación</h4>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <label for="parentesco" class="form-label fw-medium">
                      Parentesco <span class="text-danger">*</span>
                    </label>
                    <select
                      id="parentesco"
                      formControlName="parentesco"
                      class="form-select"
                    >
                      <option value="">Seleccione el parentesco</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="F">F</option>
                      <option value="G">G</option>
                      <option value="H">H</option>
                      <option value="I">I</option>
                      <option value="J">J</option>
                      <option value="K">K</option>
                      <option value="L">L</option>
                      <option value="M">M</option>
                      <option value="N">N</option>
                      <option value="O">O</option>
                    </select>
                    @if (visitanteForm.get('parentesco')?.invalid && visitanteForm.get('parentesco')?.touched) {
                      <div class="invalid-feedback d-block">El parentesco es requerido</div>
                    }
                  </div>

                  <div class="mb-3">
                    <label for="vinculo" class="form-label fw-medium">
                      Vínculo <span class="text-danger">*</span>
                    </label>
                    <select
                      id="vinculo"
                      formControlName="vinculo"
                      class="form-select"
                    >
                      <option value="">Seleccione el vínculo</option>
                      <option value="Madre">Madre</option>
                      <option value="Padre">Padre</option>
                      <option value="Hija">Hija</option>
                      <option value="Hijo">Hijo</option>
                      <option value="Hermana">Hermana</option>
                      <option value="Hermano">Hermano</option>
                      <option value="Abuela">Abuela</option>
                      <option value="Abuelo">Abuelo</option>
                      <option value="Tía">Tía</option>
                      <option value="Tío">Tío</option>
                      <option value="Prima">Prima</option>
                      <option value="Primo">Primo</option>
                      <option value="Esposa">Esposa</option>
                      <option value="Esposo">Esposo</option>
                      <option value="Amiga">Amiga</option>
                      <option value="Amigo">Amigo</option>
                      <option value="Otro">Otro</option>
                    </select>
                    @if (visitanteForm.get('vinculo')?.invalid && visitanteForm.get('vinculo')?.touched) {
                      <div class="invalid-feedback d-block">El vínculo es requerido</div>
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
                      <option value="">Seleccione el estado</option>
                      <option value="activo">Activo</option>
                      <option value="suspendido">Suspendido</option>
                      <option value="inhabilitado">Inhabilitado</option>
                    </select>
                    @if (visitanteForm.get('estado')?.invalid && visitanteForm.get('estado')?.touched) {
                      <div class="invalid-feedback d-block">El estado es requerido</div>
                    }
                  </div>

                  @if (esMayorDeEdad) {
                    <div class="mb-3">
                      <label for="imagen" class="form-label fw-medium">
                        Imagen <span class="text-danger">*</span>
                        <small class="text-muted d-block">(Requerida para mayores de edad)</small>
                      </label>
                      <input
                        type="file"
                        id="imagen"
                        (change)="onFileSelected($event)"
                        class="form-control"
                        accept="image/*"
                      />
                      @if (selectedFile) {
                        <div class="form-text text-success">
                          <i class="bi bi-check-circle me-1"></i>
                          Archivo seleccionado: {{ selectedFile.name }}
                        </div>
                      }
                    </div>
                  }
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
              class="btn btn-success"
              [disabled]="visitanteForm.invalid || isSubmitting"
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
export class VisitanteFormComponent implements OnInit {
  @Input() visitante: Visitante | null = null;
  @Input() isSubmitting = false;
  @Output() submitVisitante = new EventEmitter<CreateVisitanteDto | UpdateVisitanteDto>();
  @Output() cancel = new EventEmitter<void>();

  visitanteForm: FormGroup;
  isEditing = false;
  esMayorDeEdad: boolean | null = null;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.visitanteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      fechaNacimiento: ['', Validators.required],
      domicilio: ['', Validators.required],
      parentesco: ['', Validators.required],
      vinculo: ['', Validators.required],
      imagen: [''],
      telefono: [''],
      estado: ['activo']
    });
  }

  ngOnInit() {
    if (this.visitante) {
      this.isEditing = true;
      this.esMayorDeEdad = this.visitante.esMayorDeEdad;
      this.visitanteForm.patchValue({
        nombre: this.visitante.nombre,
        apellido: this.visitante.apellido,
        dni: this.visitante.dni,
        fechaNacimiento: this.visitante.fechaNacimiento.toISOString().split('T')[0],
        domicilio: this.visitante.domicilio,
        parentesco: this.visitante.parentesco,
        vinculo: this.visitante.vinculo,
        imagen: this.visitante.imagen || '',
        telefono: this.visitante.telefono || '',
        estado: this.visitante.estado
      });
      this.updateImageValidation();
    }

    this.visitanteForm.get('fechaNacimiento')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        const fechaNac = new Date(fecha);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fechaNac.getFullYear();
        this.esMayorDeEdad = edad >= 18;
        this.updateImageValidation();
      }
    });
    
    this.visitanteForm.get('parentesco')?.valueChanges.subscribe(parentesco => {
      if (parentesco) {
        this.visitanteForm.patchValue({
          vinculo: parentesco
        });
      }
    });
  }

  updateImageValidation() {
    const imagenControl = this.visitanteForm.get('imagen');
    if (this.esMayorDeEdad) {
      imagenControl?.clearValidators();
    } else {
      imagenControl?.clearValidators();
    }
    imagenControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (!this.visitanteForm.valid) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }
    
    const formValue = this.visitanteForm.value;
    
    const createData: CreateVisitanteDto = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      dni: formValue.dni,
      fechaNacimiento: new Date(formValue.fechaNacimiento),
      domicilio: formValue.domicilio,
      parentesco: formValue.parentesco,
      vinculo: formValue.parentesco,
      imagen: formValue.imagen || undefined,
      telefono: formValue.telefono || undefined
    };

    try {
      this.submitVisitante.emit(createData);
    } catch (error) {
      console.error('Error al emitir evento submitVisitante:', error);
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
        this.visitanteForm.patchValue({
          imagen: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
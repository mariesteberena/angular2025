import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: url('assets/logo-buenosaires-full.png') center center; background-size: cover; background-repeat: no-repeat;">
      <div class="position-absolute w-100 h-100" style="background: rgba(0, 0, 0, 0.4);"></div>
      <div class="card border-0 shadow-lg position-relative" style="max-width: 450px; width: 100%; z-index: 1; background: rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px);">
        <div class="card-body p-5">
          <div class="text-center mb-4">
            <div class="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
              <i class="bi bi-shield-lock-fill text-white fs-3"></i>
            </div>
            <h2 class="h3 fw-bold text-dark mb-2">Iniciar Sesión</h2>
            
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="email" class="form-label fw-medium">Email</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                placeholder="Ingresa tu email"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('email')"
              >
              <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">El email es requerido</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Ingresa un email válido</span>
              </div>
            </div>

            <div class="mb-4">
              <label for="password" class="form-label fw-medium">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                formControlName="password" 
                placeholder="Ingresa tu contraseña"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('password')"
              >
              <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">La contraseña es requerida</span>
              </div>
            </div>

            <div class="alert alert-danger" *ngIf="loginError">
              <i class="bi bi-exclamation-triangle me-2"></i>{{ loginError }}
            </div>

            <button 
              type="submit" 
              class="btn w-100 py-3 fw-semibold" 
              style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white;"
              [disabled]="loginForm.invalid || isLoading"
            >
              @if (isLoading) {
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando...
              } @else {
                <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
              }
            </button>
          </form>

          <div class="mt-4 p-3 bg-light rounded-3 border-start border-primary border-4">
            <h6 class="fw-bold text-dark mb-2">Credenciales de prueba:</h6>
            <div class="small text-muted">
              <p class="mb-1"><strong>Email:</strong> admin&#64;demo.com</p>
              <p class="mb-0"><strong>Contraseña:</strong> 123456</p>             
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      const credentials: LoginCredentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.loginError = error.message || 'Error al iniciar sesión';
        }
      });
    }
  }
} 
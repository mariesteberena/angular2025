import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      // Simular usuario almacenado
      const storedUser = localStorage.getItem('current_user');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Credenciales hardcodeadas para pruebas
    const validCredentials = {
      email: 'admin@demo.com',
      password: '123456'
    };

    // Verificar credenciales
    if (credentials.email === validCredentials.email && credentials.password === validCredentials.password) {
      // Usuario simulado
      const user: User = {
        id: 1,
        name: 'Administrador',
        email: validCredentials.email,
        username: 'admin',
        phone: '123-456-7890',
        website: 'admin.com',
        company: {
          name: 'Sistema Penitenciario',
          catchPhrase: 'Gestión de Internas y Visitantes',
          bs: 'Administración'
        },
        address: {
          street: 'Calle Principal',
          suite: 'Suite 100',
          city: 'Buenos Aires',
          zipcode: '1000',
          geo: {
            lat: '-34.6037',
            lng: '-58.3816'
          }
        }
      };

      const token = this.generateToken();
      const response: AuthResponse = { user, token };
      
      // Almacenar en localStorage
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem('current_user', JSON.stringify(user));
      
      this.currentUserSubject.next(user);
      return of(response);
    } else {
      throw new Error('Email o contraseña incorrectos');
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substr(2, 9);
  }

  // Método para verificar si el token es válido (simulado)
  isTokenValid(): boolean {
    const token = this.getToken();
    return token !== null;
  }
} 
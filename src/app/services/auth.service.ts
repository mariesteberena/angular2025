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
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const validCredentials = {
      email: 'admin@demo.com',
      password: '123456'
    };

    if (credentials.email === validCredentials.email && credentials.password === validCredentials.password) {
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

      const response: AuthResponse = { user };
      
      localStorage.setItem('current_user', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(response);
    } else {
      throw new Error('Email o contraseña incorrectos');
    }
  }

  logout(): void {
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 
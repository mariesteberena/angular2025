import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, tap, switchMap } from 'rxjs';
import { Visitante, CreateVisitanteDto, UpdateVisitanteDto } from '../interfaces/visitante.interface';

@Injectable({
  providedIn: 'root'
})
export class VisitanteService {
  private visitantesSubject = new BehaviorSubject<Visitante[]>([]);
  public visitantes$ = this.visitantesSubject.asObservable();
  private storageKey = 'visitantes_data';

  // Datos iniciales para localStorage
  private initialVisitantes: Visitante[] = [
    {
      id: 1,
      nombre: 'Roberto',
      apellido: 'González',
      dni: '20123456',
      domicilio: 'Rivadavia 890, CABA',
      parentesco: 'A',
      vinculo: 'Padre',
      fechaNacimiento: new Date('1960-05-10'),
      esMayorDeEdad: true,
      imagen: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      internasAutorizadas: [1, 2],
      fechaRegistro: new Date('2023-01-20'),
      estado: 'activo',
      telefono: '11-1234-5678'
    },
    {
      id: 2,
      nombre: 'Sofía',
      apellido: 'González',
      dni: '30987654',
      domicilio: 'Av. Santa Fe 1500, CABA',
      parentesco: 'B',
      vinculo: 'Hija',
      fechaNacimiento: new Date('2010-09-15'),
      esMayorDeEdad: false,
      internasAutorizadas: [1],
      fechaRegistro: new Date('2023-01-25'),
      estado: 'activo'
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellido: 'Martínez',
      dni: '25555666',
      domicilio: 'Belgrano 234, CABA',
      parentesco: 'C',
      vinculo: 'Cónyuge',
      fechaNacimiento: new Date('1987-12-03'),
      esMayorDeEdad: true,
      imagen: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      internasAutorizadas: [2],
      fechaRegistro: new Date('2023-02-15'),
      estado: 'activo',
      telefono: '11-9876-5432'
    },
    {
      id: 4,
      nombre: 'Elena',
      apellido: 'Rodríguez',
      dni: '18777888',
      domicilio: 'Mitre 789, La Plata',
      parentesco: 'D',
      vinculo: 'Madre',
      fechaNacimiento: new Date('1965-04-20'),
      esMayorDeEdad: true,
      imagen: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
      internasAutorizadas: [3],
      fechaRegistro: new Date('2023-03-10'),
      estado: 'activo',
      telefono: '221-456-7890'
    }
  ];

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const visitantes = JSON.parse(stored).map((v: any) => ({
          ...v,
          fechaNacimiento: new Date(v.fechaNacimiento),
          fechaRegistro: new Date(v.fechaRegistro)
        }));
        this.visitantesSubject.next(visitantes);
      } catch (error) {
        console.error('Error loading visitantes from localStorage:', error);
        this.visitantesSubject.next(this.initialVisitantes);
        this.saveToLocalStorage(this.initialVisitantes);
      }
    } else {
      this.visitantesSubject.next(this.initialVisitantes);
      this.saveToLocalStorage(this.initialVisitantes);
    }
  }

  private saveToLocalStorage(visitantes: Visitante[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(visitantes));
    } catch (error) {
      console.error('Error saving visitantes to localStorage:', error);
    }
  }

  getVisitantes(): Observable<Visitante[]> {
    return of(this.visitantesSubject.value).pipe(
      tap(visitantes => this.visitantesSubject.next(visitantes))
    );
  }

  getVisitanteById(id: number): Observable<Visitante | undefined> {
    const visitante = this.visitantesSubject.value.find(v => v.id === id);
    return of(visitante);
  }

  createVisitante(visitanteData: CreateVisitanteDto): Observable<Visitante> {
    const fechaNac = new Date(visitanteData.fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const esMayorDeEdad = edad >= 18;

    const currentVisitantes = this.visitantesSubject.value;
    const newId = Math.max(...currentVisitantes.map(v => v.id), 0) + 1;

    const newVisitante: Visitante = {
      id: newId,
      ...visitanteData,
      esMayorDeEdad,
      internasAutorizadas: [],
      fechaRegistro: new Date(),
      estado: 'activo'
    };

    const updatedVisitantes = [...currentVisitantes, newVisitante];
    
    this.visitantesSubject.next(updatedVisitantes);
    this.saveToLocalStorage(updatedVisitantes);
    
    return of(newVisitante);
  }

  updateVisitante(id: number, updates: UpdateVisitanteDto): Observable<Visitante> {
    const currentVisitantes = this.visitantesSubject.value;
    const index = currentVisitantes.findIndex(v => v.id === id);
    
    if (index !== -1) {
      // Recalcular si es mayor de edad si se actualiza la fecha de nacimiento
      let esMayorDeEdad = currentVisitantes[index].esMayorDeEdad;
      if (updates.fechaNacimiento) {
        const fechaNac = new Date(updates.fechaNacimiento);
        const hoy = new Date();
        const edad = hoy.getFullYear() - fechaNac.getFullYear();
        esMayorDeEdad = edad >= 18;
      }

      const updatedVisitante = { 
        ...currentVisitantes[index], 
        ...updates, 
        esMayorDeEdad 
      };
      
      const updatedVisitantes = [...currentVisitantes];
      updatedVisitantes[index] = updatedVisitante;
      
      this.visitantesSubject.next(updatedVisitantes);
      this.saveToLocalStorage(updatedVisitantes);
      
      return of(updatedVisitante);
    }
    throw new Error('Visitante no encontrado');
  }

  deleteVisitante(id: number): Observable<void> {
    const currentVisitantes = this.visitantesSubject.value;
    const filteredVisitantes = currentVisitantes.filter(v => v.id !== id);
    
    this.visitantesSubject.next(filteredVisitantes);
    this.saveToLocalStorage(filteredVisitantes);
    
    return of(void 0);
  }

  addVisitanteToInterna(visitanteId: number, internaId: number): Observable<void> {
    const currentVisitantes = this.visitantesSubject.value;
    const visitanteIndex = currentVisitantes.findIndex(v => v.id === visitanteId);
    
    if (visitanteIndex !== -1) {
      const visitante = currentVisitantes[visitanteIndex];
      
      // Agregar la interna a la lista de internas autorizadas si no está ya
      if (!visitante.internasAutorizadas.includes(internaId)) {
        visitante.internasAutorizadas.push(internaId);
        
        // Actualizar el visitante en la lista
        const updatedVisitantes = [...currentVisitantes];
        updatedVisitantes[visitanteIndex] = visitante;
        
        this.visitantesSubject.next(updatedVisitantes);
        this.saveToLocalStorage(updatedVisitantes);
      }
    } else {
      console.error('Visitante no encontrado');
    }
    
    return of(void 0);
  }

  canVisitInterna(visitanteId: number, internaId: number, internasService: any): Observable<boolean> {
    const visitante = this.visitantesSubject.value.find(v => v.id === visitanteId);
    if (!visitante) {
      return of(false);
    }

    // Si ya está autorizado para esta interna
    if (visitante.internasAutorizadas.includes(internaId)) {
      return of(true);
    }

    // Si no tiene otras internas autorizadas, puede visitar cualquiera
    if (visitante.internasAutorizadas.length === 0) {
      return of(true);
    }

    // Verificar si las internas son familiares
    return internasService.getInternaById(internaId).pipe(
      switchMap((interna: any) => {
        if (!interna) {
          return of(false);
        }

        // Verificar si alguna de las internas autorizadas es familiar de la nueva interna
        const puedeVisitar = visitante.internasAutorizadas.some(internaAutorizada => 
          interna.familiares.includes(internaAutorizada)
        );

        return of(puedeVisitar);
      })
    );
  }

  getVisitanteStats(): { total: number; activos: number; suspendidos: number; inhabilitados: number; mayores: number; menores: number } {
    const visitantes = this.visitantesSubject.value;
    return {
      total: visitantes.length,
      activos: visitantes.filter(v => v.estado === 'activo').length,
      suspendidos: visitantes.filter(v => v.estado === 'suspendido').length,
      inhabilitados: visitantes.filter(v => v.estado === 'inhabilitado').length,
      mayores: visitantes.filter(v => v.esMayorDeEdad).length,
      menores: visitantes.filter(v => !v.esMayorDeEdad).length
    };
  }
}
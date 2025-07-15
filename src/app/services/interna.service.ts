import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, switchMap } from 'rxjs';
import { Interna, CreateInternaDto, UpdateInternaDto } from '../interfaces/interna.interface';

@Injectable({
  providedIn: 'root'
})
export class InternaService {
  private apiUrl = 'https://686ea97791e85fac429e9879.mockapi.io/internas';
  private internasSubject = new BehaviorSubject<Interna[]>([]);
  public internas$ = this.internasSubject.asObservable();

  constructor(private http: HttpClient) {}

  getInternas(): Observable<Interna[]> {
    return this.http.get<Interna[]>(this.apiUrl).pipe(
      tap(internas => this.internasSubject.next(internas))
    );
  }

  getInternaById(id: number): Observable<Interna> {
    return this.http.get<Interna>(`${this.apiUrl}/${id}`);
  }

  createInterna(internaData: CreateInternaDto): Observable<Interna> {
    return this.http.post<Interna>(this.apiUrl, internaData).pipe(
      tap(() => this.getInternas().subscribe())
    );
  }

  updateInterna(id: number, updates: UpdateInternaDto): Observable<Interna> {
    return this.http.put<Interna>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(() => this.getInternas().subscribe())
    );
  }

  deleteInterna(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getInternas().subscribe())
    );
  }

  addVisitanteToInterna(internaId: number, visitanteId: number): Observable<Interna> {
    return this.getInternaById(internaId).pipe(
      map(interna => {
        if (!interna.visitantes.includes(visitanteId)) {
          interna.visitantes.push(visitanteId);
        }
        return interna;
      }),
      switchMap(interna => this.updateInterna(internaId, { visitantes: interna.visitantes } as any))
    );
  }

  removeVisitanteFromInterna(internaId: number, visitanteId: number): Observable<Interna> {
    return this.getInternaById(internaId).pipe(
      map(interna => {
        interna.visitantes = interna.visitantes.filter(v => v !== visitanteId);
        return interna;
      }),
      switchMap(interna => this.updateInterna(internaId, { visitantes: interna.visitantes } as any))
    );
  }

  getInternaStats(): { total: number; activas: number; trasladadas: number; liberadas: number } {
    const internas = this.internasSubject.value;
    return {
      total: internas.length,
      activas: internas.filter(i => i.estado === 'activa').length,
      trasladadas: internas.filter(i => i.estado === 'trasladada').length,
      liberadas: internas.filter(i => i.estado === 'liberada').length
    };
  }
}
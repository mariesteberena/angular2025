export interface Visitante {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  domicilio: string;
  parentesco: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O';
  vinculo: string;
  fechaNacimiento: Date;
  esMayorDeEdad: boolean;
  imagen?: string;
  internasAutorizadas: number[]; // IDs de internas que puede visitar
  fechaRegistro: Date;
  estado: 'activo' | 'suspendido' | 'inhabilitado';
  telefono?: string;
}

export interface CreateVisitanteDto {
  nombre: string;
  apellido: string;
  dni: string;
  domicilio: string;
  parentesco: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O';
  vinculo: string;
  fechaNacimiento: Date;
  imagen?: string;
  telefono?: string;
}

export interface UpdateVisitanteDto {
  nombre?: string;
  apellido?: string;
  dni?: string;
  domicilio?: string;
  parentesco?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O';
  vinculo?: string;
  fechaNacimiento?: Date;
  imagen?: string;
  internasAutorizadas?: number[];
  estado?: 'activo' | 'suspendido' | 'inhabilitado';
  telefono?: string;
}
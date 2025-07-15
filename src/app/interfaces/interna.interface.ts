export interface Interna {
  id: number;
  nombre: string;
  apellido: string;
  fcn: string;
  dni: string;
  fechaNacimiento: Date;
  domicilio: string;
  pabellon: number;
  celda: number;
  imagen?: string;
  visitantes: number[];
  familiares: number[];
  fechaIngreso: Date;
  estado: 'activa' | 'trasladada' | 'liberada';
}

export interface CreateInternaDto {
  nombre: string;
  apellido: string;
  fcn: string;
  dni: string;
  fechaNacimiento: Date;
  domicilio: string;
  pabellon: number;
  celda: number;
  imagen?: string;
  fechaIngreso: Date;
  estado: 'activa' | 'trasladada' | 'liberada';
  familiares?: number[];
}

export interface UpdateInternaDto {
  nombre?: string;
  apellido?: string;
  fcn?: string;
  dni?: string;
  fechaNacimiento?: Date;
  domicilio?: string;
  pabellon?: number;
  celda?: number;
  imagen?: string;
  fechaIngreso?: Date;
  visitantes?: number[];
  familiares?: number[];
  estado?: 'activa' | 'trasladada' | 'liberada';
}
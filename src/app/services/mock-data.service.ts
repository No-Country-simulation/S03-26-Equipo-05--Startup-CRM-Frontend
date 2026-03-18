import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Cliente, Kpi, Trato } from '../models/models';

const MOCK_CLIENTES: Cliente[] = [
  { id: '1', nombre: 'Ana García', empresa: 'TechCorp', avatar: 'https://i.pravatar.cc/150?u=1', estado: 'Activo', ultimaInteraccion: '2023-10-25' },
  { id: '2', nombre: 'Carlos Ruiz', empresa: 'Global Logistics', avatar: 'https://i.pravatar.cc/150?u=2', estado: 'Inactivo', ultimaInteraccion: '2023-09-15' },
  { id: '3', nombre: 'Elena Mora', empresa: 'Finanza Startup', avatar: 'https://i.pravatar.cc/150?u=3', estado: 'Activo', ultimaInteraccion: '2023-11-02' },
  { id: '4', nombre: 'David Silva', empresa: 'EcoEnergies', avatar: 'https://i.pravatar.cc/150?u=4', estado: 'Activo', ultimaInteraccion: '2023-11-10' }
];

const MOCK_TRATOS: Trato[] = [
  { id: 't1', nombre: 'Renovación Licencias', monto: 15400, etapa: 'Prospecto', clienteId: '1', empresa: 'TechCorp' },
  { id: 't2', nombre: 'Expansión de Servidores', monto: 32000, etapa: 'Negociación', clienteId: '2', empresa: 'Global Logistics' },
  { id: 't3', nombre: 'Consultoría Q4', monto: 8500, etapa: 'Propuesta', clienteId: '3', empresa: 'Finanza Startup' },
  { id: 't4', nombre: 'Implementación CRM', monto: 45000, etapa: 'Cerrado', clienteId: '4', empresa: 'EcoEnergies' },
  { id: 't5', nombre: 'Auditoría de Seguridad', monto: 12000, etapa: 'Negociación', clienteId: '1', empresa: 'TechCorp' },
];

const MOCK_KPIS: Kpi[] = [
  { titulo: 'Total Clientes', valor: 124, tendencia: 12.5, icono: 'users' },
  { titulo: 'Tratos Abiertos', valor: 45, tendencia: 5.2, icono: 'briefcase' },
  { titulo: 'Ingresos Mensuales', valor: '$45,200', tendencia: 8.4, icono: 'dollar-sign' },
  { titulo: 'Tareas Pendientes', valor: 12, tendencia: -2.1, icono: 'check-circle' },
];

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getClientes(): Observable<Cliente[]> {
    return of(MOCK_CLIENTES).pipe(delay(400));
  }

  getTratos(): Observable<Trato[]> {
    return of(MOCK_TRATOS).pipe(delay(300));
  }

  getKpis(): Observable<Kpi[]> {
    return of(MOCK_KPIS).pipe(delay(300));
  }
}

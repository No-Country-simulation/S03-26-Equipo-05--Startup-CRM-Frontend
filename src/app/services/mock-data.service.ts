import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Cliente, Kpi, Trato, EtapaTrato } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:8080/api';

  private clientesSubject = new BehaviorSubject<Cliente[]>([]);
  public clientes$ = this.clientesSubject.asObservable();

  private busquedaGlobalSubject = new BehaviorSubject<string>('');
  public busquedaGlobal$ = this.busquedaGlobalSubject.asObservable();

  private avatarAdminSubject = new BehaviorSubject<string>('https://i.pravatar.cc/150?img=11');
  public avatarAdmin$ = this.avatarAdminSubject.asObservable();

  private nombreAdminSubject = new BehaviorSubject<string>('Administrador');
  public nombreAdmin$ = this.nombreAdminSubject.asObservable();

  private tratosSubject = new BehaviorSubject<Trato[]>([]);
  public tratos$ = this.tratosSubject.asObservable();

  constructor(private http: HttpClient) { 
    this.refreshClientes();
    this.refreshTratos();
  }

  refreshClientes() {
    this.http.get<Cliente[]>(`${this.apiUrl}/clientes`).subscribe({
      next: data => this.clientesSubject.next(data),
      error: err => console.error('Error al cargar clientes:', err)
    });
  }

  getClientes(): Observable<Cliente[]> {
    return this.clientes$;
  }

  addCliente(nuevoCliente: Cliente) {
    this.http.post<Cliente>(`${this.apiUrl}/clientes`, nuevoCliente).subscribe(res => {
      this.refreshClientes();
    });
  }

  updateCliente(actualizado: Cliente) {
    this.http.put<Cliente>(`${this.apiUrl}/clientes/${actualizado.id}`, actualizado).subscribe(res => {
      this.refreshClientes();
    });
  }

  refreshTratos() {
    this.http.get<Trato[]>(`${this.apiUrl}/tratos`).subscribe({
      next: data => this.tratosSubject.next(data),
      error: err => console.error('Error al cargar tratos:', err)
    });
  }

  getTratos(): Observable<Trato[]> {
    return this.tratos$;
  }

  addTrato(nuevo: Trato) {
    this.http.post<Trato>(`${this.apiUrl}/tratos`, nuevo).subscribe(res => {
      this.refreshTratos();
    });
  }

  updateTratoEtapa(id: string, etapa: EtapaTrato) {
    this.http.put<Trato>(`${this.apiUrl}/tratos/${id}/etapa`, { etapa }).subscribe(res => {
      this.refreshTratos();
    });
  }

  getKpis(): Observable<Kpi[]> {
    return this.http.get<Kpi[]>(`${this.apiUrl}/kpis`);
  }

  setBusquedaGlobal(term: string) {
    this.busquedaGlobalSubject.next(term);
  }

  setAvatarAdmin(avatar: string) {
    this.avatarAdminSubject.next(avatar);
  }

  setNombreAdmin(nombre: string) {
    this.nombreAdminSubject.next(nombre);
  }
}

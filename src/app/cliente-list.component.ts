import { Component, OnInit } from '@angular/core';
import { DataService } from './services/mock-data.service';
import { Cliente } from './models/models';

@Component({
  selector: 'app-cliente-list',
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      
      <!-- Cabecera de la Tabla & Filtros Rápidos -->
      <div class="p-6 border-b border-slate-100">
        <h2 class="text-lg font-bold text-slate-800 mb-4">Directorio de Clientes</h2>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
          
          <!-- Buscador Global en Tiempo Real -->
          <div class="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Buscar por nombre o empresa..." 
              (input)="actualizarBusqueda($event)"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-sm outline-none">
            <svg class="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <!-- Píldoras de Filtro por Estado -->
          <div class="flex gap-2 w-full sm:w-auto">
            <button 
              (click)="setFiltroEstado('Todos')"
              [ngClass]="filtroEstado === 'Todos' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              class="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Todos
            </button>
            <button 
              (click)="setFiltroEstado('Activo')"
              [ngClass]="filtroEstado === 'Activo' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'"
              class="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Activos
            </button>
            <button 
              (click)="setFiltroEstado('Inactivo')"
              [ngClass]="filtroEstado === 'Inactivo' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              class="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Inactivos
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla Responsive -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th class="px-6 py-4 font-semibold">Cliente</th>
              <th class="px-6 py-4 font-semibold">Empresa</th>
              <th class="px-6 py-4 font-semibold">Estado</th>
              <th class="px-6 py-4 font-semibold">Última Interacción</th>
              <th class="px-6 py-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr *ngFor="let cliente of getClientesFiltrados()" class="hover:bg-slate-50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img [src]="cliente.avatar" alt="Avatar" class="w-10 h-10 rounded-full shadow-sm">
                  <div>
                    <p class="font-semibold text-slate-800">{{ cliente.nombre }}</p>
                    <p class="text-xs text-slate-500">ID: {{ cliente.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-600 font-medium">{{ cliente.empresa }}</td>
              <td class="px-6 py-4">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  [ngClass]="cliente.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'">
                  {{ cliente.estado }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-500">{{ cliente.ultimaInteraccion | date:'mediumDate' }}</td>
              <td class="px-6 py-4 text-right">
                <!-- Acciones (Solo visibles en Hover para UI más limpia) -->
                <button class="text-slate-400 hover:text-blue-600 transition-colors p-2 opacity-0 group-hover:opacity-100">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
              </td>
            </tr>
            
            <!-- Estado Vacío (Zero State) -->
            <tr *ngIf="getClientesFiltrados().length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                <div class="flex flex-col items-center justify-center">
                  <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                  <p class="text-base font-medium text-slate-600">No se encontraron clientes</p>
                  <p class="text-sm">Intenta ajustar los filtros de búsqueda</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ClienteListComponent implements OnInit {
  
  clientes: Cliente[] = [];
  busqueda: string = '';
  filtroEstado: 'Todos' | 'Activo' | 'Inactivo' = 'Todos';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  actualizarBusqueda(event: Event) {
    const input = event.target as HTMLInputElement;
    this.busqueda = input.value;
  }

  setFiltroEstado(estado: 'Todos' | 'Activo' | 'Inactivo') {
    this.filtroEstado = estado;
  }

  getClientesFiltrados(): Cliente[] {
    const term = this.busqueda.toLowerCase();
    const estado = this.filtroEstado;
    
    return this.clientes.filter(c => {
      const coincideBusqueda = c.nombre.toLowerCase().includes(term) || c.empresa.toLowerCase().includes(term);
      const coincideEstado = estado === 'Todos' || c.estado === estado;
      return coincideBusqueda && coincideEstado;
    });
  }
}

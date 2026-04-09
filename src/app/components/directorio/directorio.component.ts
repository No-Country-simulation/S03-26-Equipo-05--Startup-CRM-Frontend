import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/mock-data.service';
import { Cliente } from '../../models/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export class DirectorioComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  busquedaGlobal: string = '';
  mostrarModalNuevoCliente: boolean = false;
  clienteSeleccionado: Cliente | null = null;
  
  esModoEdicion: boolean = false;
  idEdicion: string | undefined;
  
  nuevoClienteData: {
    nombre: string;
    empresa: string;
    email: string;
    telefono: string;
    estado: 'Activo' | 'Inactivo';
  } = {
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    estado: 'Activo'
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getClientes().subscribe(data => {
      this.clientes = data;
      this.aplicarFiltro();
    });
    this.dataService.busquedaGlobal$.subscribe(term => {
      this.busquedaGlobal = term;
      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    const term = this.busquedaGlobal.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c => 
      c.nombre.toLowerCase().includes(term) || c.empresa.toLowerCase().includes(term)
    );
  }

  abrirModalNuevoCliente() {
    this.esModoEdicion = false;
    this.idEdicion = undefined;
    this.mostrarModalNuevoCliente = true;
    this.nuevoClienteData = { nombre: '', empresa: '', email: '', telefono: '', estado: 'Activo' };
  }

  editarCliente(cliente: Cliente) {
    this.esModoEdicion = true;
    this.idEdicion = cliente.id;
    this.nuevoClienteData = {
      nombre: cliente.nombre,
      empresa: cliente.empresa,
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      estado: cliente.estado as 'Activo' | 'Inactivo'
    };
    this.cerrarDetalleCliente();
    this.mostrarModalNuevoCliente = true;
  }

  cerrarModalNuevoCliente() {
    this.mostrarModalNuevoCliente = false;
  }

  guardarNuevoCliente() {
    if (!this.nuevoClienteData.nombre || !this.nuevoClienteData.empresa || !this.nuevoClienteData.email || !this.nuevoClienteData.telefono) {
      Swal.fire('Error', 'Todos los campos (Nombre, Empresa, Email y Teléfono) son obligatorios', 'error');
      return;
    }

    if (this.esModoEdicion && this.idEdicion) {
      const clienteOriginal = this.clientes.find(c => c.id === this.idEdicion);
      const actualizado: Cliente = {
        id: this.idEdicion,
        nombre: this.nuevoClienteData.nombre,
        empresa: this.nuevoClienteData.empresa,
        email: this.nuevoClienteData.email,
        telefono: this.nuevoClienteData.telefono,
        estado: this.nuevoClienteData.estado,
        avatar: clienteOriginal?.avatar || 'https://i.pravatar.cc/150?img=1',
        ultimaInteraccion: clienteOriginal?.ultimaInteraccion || new Date().toISOString().split('T')[0]
      };
      this.dataService.updateCliente(actualizado);
      Swal.fire('¡Actualizado!', `${actualizado.nombre} ha sido actualizado exitosamente.`, 'success');
    } else {
      const nuevo: Cliente = {
        id: Math.random().toString(36).substr(2, 9),
        nombre: this.nuevoClienteData.nombre,
        empresa: this.nuevoClienteData.empresa,
        email: this.nuevoClienteData.email,
        telefono: this.nuevoClienteData.telefono,
        estado: this.nuevoClienteData.estado,
        avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70),
        ultimaInteraccion: new Date().toISOString().split('T')[0]
      };
      this.dataService.addCliente(nuevo);
      Swal.fire('¡Cliente Agendado!', `${nuevo.nombre} ha sido añadido al directorio exitosamente.`, 'success');
    }

    this.cerrarModalNuevoCliente();
  }

  verDetalleCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
  }

  cerrarDetalleCliente() {
    this.clienteSeleccionado = null;
  }
}

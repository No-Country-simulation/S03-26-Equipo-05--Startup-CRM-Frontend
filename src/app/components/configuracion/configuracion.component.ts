import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/mock-data.service';
import { ThemeService } from '../../services/theme.service';
import { EtapaTrato } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface PerfilAdmin {
  nombre: string;
  email: string;
  telefono: string;
  avatar: string;
}

interface DatosEmpresa {
  nombreComercial: string;
  razonSocial: string;
  cuit: string;
  direccion: string;
  telefono: string;
  sitioWeb: string;
}

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  // Sección activa del sidebar interno
  seccionActiva: string = 'perfil';

  // Se inicializan vacíos esperando la conexión al backend
  perfil: PerfilAdmin = { nombre: '', email: '', telefono: '', avatar: '' };
  empresa: DatosEmpresa = { nombreComercial: '', razonSocial: '', cuit: '', direccion: '', telefono: '', sitioWeb: '' };

  // Etapas del Pipeline
  etapasPipeline: { nombre: string; color: string }[] = [
    { nombre: 'Prospecto', color: 'bg-blue-500' },
    { nombre: 'Negociación', color: 'bg-amber-500' },
    { nombre: 'Propuesta', color: 'bg-purple-500' },
    { nombre: 'Cerrado', color: 'bg-emerald-500' }
  ];
  nuevaEtapa: string = '';

  // Modo Oscuro Automático
  isDarkModeAutomatic: boolean = false;

  // Módulos Próximamente
  modulosProximamente = [
    { titulo: 'Gestión de Usuarios', descripcion: 'Invitar vendedores, asignar roles y permisos.', icono: '👥' },
    { titulo: 'Notificaciones', descripcion: 'Alertas por email y WhatsApp cuando un trato cambia.', icono: '🔔' },
    { titulo: 'Modo Oscuro', descripcion: 'Alternar entre tema claro y oscuro para tu CRM.', icono: '🌙' },
    { titulo: 'Integraciones', descripcion: 'Conectar WhatsApp Business, Mailchimp y Google Calendar.', icono: '🔗' },
    { titulo: 'Exportar Datos', descripcion: 'Descargar clientes y tratos en CSV o Excel.', icono: '📥' },
    { titulo: 'Auditoría', descripcion: 'Historial de cambios realizados por cada usuario.', icono: '📋' }
  ];

  constructor(
    private dataService: DataService,
    private themeService: ThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isDarkModeAutomatic = this.themeService.isDarkModeAutomatic;
    this.cargarPerfil();
    this.cargarEmpresa();
  }

  cargarPerfil(): void {
    this.http.get<PerfilAdmin>('http://localhost:8080/api/admin/profile').subscribe({
      next: (data) => {
        this.perfil = data;
        if (data.avatar) {
          this.dataService.setAvatarAdmin(data.avatar);
        }
        if (data.nombre) {
          this.dataService.setNombreAdmin(data.nombre);
        }
      },
      error: () => console.error('Error al cargar Perfil de Usuario')
    });
  }

  cargarEmpresa(): void {
    this.http.get<DatosEmpresa>('http://localhost:8080/api/company').subscribe({
      next: (data) => this.empresa = data,
      error: () => console.error('Error al cargar Datos de Empresa')
    });
  }

  toggleDarkModeAutomatic(): void {
    this.themeService.setDarkModeAutomatic(this.isDarkModeAutomatic);
    
    // Notificación visual de cambio
    const msg = this.isDarkModeAutomatic 
      ? 'Modo Oscuro automático activado (20:00 - 08:00)' 
      : 'Modo Oscuro automático desactivado';
      
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 2000
    });
  }

  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  guardarPerfil(): void {
    if (this.perfil.telefono) {
      localStorage.setItem('whatsapp_phone', this.perfil.telefono);
    }
    
    if (this.perfil.nombre) {
      this.dataService.setNombreAdmin(this.perfil.nombre);
    }

    this.http.put('http://localhost:8080/api/admin/profile', this.perfil).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: '¡Perfil Actualizado!', confirmButtonColor: '#4A2B65', timer: 3000 });
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el perfil', 'error')
    });
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const archivo = input.files[0];

    // Validar tamaño (máx 5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      Swal.fire('Archivo muy grande', 'La imagen no puede superar los 5MB.', 'warning');
      return;
    }

    // Validar tipo
    if (!archivo.type.startsWith('image/')) {
      Swal.fire('Formato inválido', 'Solo se permiten archivos de imagen (JPG, PNG, WEBP).', 'warning');
      return;
    }

    // Leer como Data URL (base64) para preview inmediato
    const reader = new FileReader();
    reader.onload = () => {
      this.perfil.avatar = reader.result as string;
      this.dataService.setAvatarAdmin(this.perfil.avatar);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Foto de perfil actualizada',
        showConfirmButton: false,
        timer: 2000
      });
    };
    reader.readAsDataURL(archivo);
  }

  guardarEmpresa(): void {
    this.http.put('http://localhost:8080/api/company', this.empresa).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: '¡Datos de Empresa Guardados!', confirmButtonColor: '#4A2B65', timer: 3000 });
      },
      error: () => Swal.fire('Error', 'No se pudieron guardar los datos', 'error')
    });
  }

  agregarEtapa(): void {
    if (!this.nuevaEtapa.trim()) return;
    const colores = ['bg-rose-500', 'bg-cyan-500', 'bg-orange-500', 'bg-fuchsia-500', 'bg-lime-500'];
    const colorRandom = colores[this.etapasPipeline.length % colores.length];
    this.etapasPipeline.push({ nombre: this.nuevaEtapa.trim(), color: colorRandom });
    this.nuevaEtapa = '';

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Etapa agregada al pipeline',
      showConfirmButton: false,
      timer: 2000
    });
  }

  eliminarEtapa(index: number): void {
    if (this.etapasPipeline.length <= 2) {
      Swal.fire('Error', 'El pipeline necesita al menos 2 etapas.', 'warning');
      return;
    }
    const etapa = this.etapasPipeline[index];
    Swal.fire({
      title: `¿Eliminar "${etapa.nombre}"?`,
      text: 'Los tratos en esta etapa se moverán a la primera.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.etapasPipeline.splice(index, 1);
      }
    });
  }
}

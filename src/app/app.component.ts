import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { DataService } from './services/mock-data.service';
import { NotificationService, AppNotification } from './services/notification.service';
import { ThemeService } from './services/theme.service';
import Swal from 'sweetalert2';
import { PhonePipe } from './pipes/phone.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sidebarAbierto: boolean = false;
  isLoggedIn: boolean = false;
  mostrarMenuPerfil: boolean = false;

  mostrarNotificaciones: boolean = false;
  unreadCount: number = 0;
  notifications: AppNotification[] = [];

  isRegistering: boolean = false;
  nombreAdmin: string = 'Administrador';
  avatarAdmin: string = 'https://i.pravatar.cc/150?img=11';
  loginData = {
    nombre: '',
    email: 'admin@sagrada.com',
    password: ''
  };
  isSubmitting: boolean = false;
  zoomActivo: boolean = false;
  altoContrasteActivo: boolean = false;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private notifService: NotificationService,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.notifService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.unreadCount = notifs.filter(n => !n.read).length;
    });

    this.dataService.avatarAdmin$.subscribe(avatar => {
      this.avatarAdmin = avatar;
    });

    this.dataService.nombreAdmin$.subscribe(nombre => {
      if (nombre) {
        this.nombreAdmin = nombre;
      }
    });
  }

  toggleZoom() {
    this.zoomActivo = !this.zoomActivo;
    const bodyStyles = document.body.style as any;
    if (this.zoomActivo) {
      bodyStyles.zoom = "1.15";
    } else {
      bodyStyles.zoom = "1";
    }
  }

  toggleAltoContraste() {
    this.altoContrasteActivo = !this.altoContrasteActivo;
    if (this.altoContrasteActivo) {
      // Un contraste más alto y ligeramente desaturado/saturado dependiendo de la preferencia para mejorar legibilidad general
      document.body.style.filter = "contrast(1.4) saturate(1.3) brightness(0.95)";
    } else {
      document.body.style.filter = "none";
    }
  }

  toggleNotificaciones() {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;
    if (this.mostrarMenuPerfil) this.mostrarMenuPerfil = false;
  }

  marcarTodoLeido() {
    this.notifService.markAllAsRead();
  }

  limpiarNotificaciones() {
    this.notifService.clearAll();
  }

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebarMobile() {
    if (window.innerWidth < 768) {
      this.sidebarAbierto = false;
    }
  }

  toggleMenuPerfil() {
    this.mostrarMenuPerfil = !this.mostrarMenuPerfil;
    if (this.mostrarNotificaciones) this.mostrarNotificaciones = false;
  }

  actualizarBusquedaGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dataService.setBusquedaGlobal(input.value);
  }

  toggleRegister() {
    this.isRegistering = !this.isRegistering;
  }

  doRegister() {
    if (!this.loginData.nombre || !this.loginData.email || !this.loginData.password) {
      Swal.fire('Oops...', 'Por favor completa todos los campos', 'warning');
      return;
    }

    this.isSubmitting = true;

    if (this.loginData.nombre) {
      this.dataService.setNombreAdmin(this.loginData.nombre);
    }

    const payload = {
      nombre: this.loginData.nombre,
      email: this.loginData.email,
      password: this.loginData.password
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: '¡Administrador Creado!',
          text: 'Usuario guardado correctamente en la base de datos.',
          confirmButtonColor: '#4A2B65'
        });
        this.isRegistering = false;
      },
      error: (err) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Error de Registro',
          text: err.error?.message || 'No se pudo registrar el usuario en el backend.',
          confirmButtonColor: '#4A2B65'
        });
      }
    });
  }

  doLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      Swal.fire('Oops...', 'Ingresa tu correo y contraseña', 'warning');
      return;
    }

    this.isSubmitting = true;
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isLoggedIn = true;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Conectado correctamente con el servidor',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'No se puede recuperar la información',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }
    });
  }

  doLogout() {
    this.mostrarMenuPerfil = false;
    this.isLoggedIn = false;
    this.loginData.password = '';
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Sesión cerrada exitosamente',
      showConfirmButton: false,
      timer: 3000
    });
  }

  async configTelefono() {
    this.mostrarMenuPerfil = false;
    const numeroGuardado = localStorage.getItem('whatsapp_phone') || '';

    const { value: telefono } = await Swal.fire({
      title: 'Vincular WhatsApp',
      input: 'text',
      inputValue: numeroGuardado,
      inputLabel: 'Ingresa tu número de teléfono con código de área',
      inputPlaceholder: 'Ej: +54 9 11 1234 5678',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      inputValidator: (value) => {
        if (!value) {
          return '¡Necesitas escribir un número de teléfono!'
        }
        return null;
      }
    });

    if (telefono) {
      const telefonoFormateado = new PhonePipe().transform(telefono);

      localStorage.setItem('whatsapp_phone', telefonoFormateado);
      Swal.fire('Guardado', `Tu número ${telefonoFormateado} ha sido vinculado correctamente para los envíos de WhatsApp.`, 'success');
    }
  }
}

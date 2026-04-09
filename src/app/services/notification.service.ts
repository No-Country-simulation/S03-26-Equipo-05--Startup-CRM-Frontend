import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface WhatsAppPayload {
  phone: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8080/api';

  private notificationsSource = new BehaviorSubject<AppNotification[]>([
    {
      id: '1',
      title: '¡Bienvenido!',
      message: 'Las notificaciones del sistema aparecerán aquí.',
      date: new Date(),
      read: false,
      type: 'info'
    }
  ]);
  public notifications$ = this.notificationsSource.asObservable();

  constructor(private http: HttpClient) { }

  addNotification(title: string, message: string, type: 'info' | 'success' | 'warning' = 'info'): void {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      date: new Date(),
      read: false,
      type
    };

    const current = this.notificationsSource.getValue();
    this.notificationsSource.next([newNotif, ...current]);
  }

  markAllAsRead(): void {
    const current = this.notificationsSource.getValue().map(n => ({ ...n, read: true }));
    this.notificationsSource.next(current);
  }

  clearAll(): void {
    this.notificationsSource.next([]);
  }

  markAsRead(id: string): void {
    const current = this.notificationsSource.getValue().map(n => n.id === id ? { ...n, read: true } : n);
    this.notificationsSource.next(current);
  }

  playSuccessSound(): void {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      // Sonido tipo "Campanita / Ding"
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1567.98, audioCtx.currentTime); // G6 (tono agudo y claro)

      // Envolvente de volumen: ataque rápido y decaimiento largo
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 1.0);
    } catch (e) {
      console.warn('Audio no soportado o bloqueado por el navegador');
    }
  }


  sendEmail(payload: EmailPayload): Observable<any> {
    console.log('📬 Solicitud de envío de Email despachada al servidor:', payload);

    return this.http.post<any>(`${this.apiUrl}/notifications/email`, payload).pipe(
      tap(response => {
        console.log('✅ Email enviado vía servidor SMTP:', response);
        this.addNotification('Correo Enviado', `Se ha despachado el correo a: ${payload.to}`, 'success');
        this.playSuccessSound();
      })
    );
  }

  sendWhatsApp(payload: WhatsAppPayload): Observable<any> {
    console.log('💬 Solicitud de envío de WhatsApp despachada al servidor:', payload);

    return this.http.post<any>(`${this.apiUrl}/notifications/whatsapp`, payload).pipe(
      tap(response => {
        console.log('✅ WhatsApp registrado en servidor:', response);
        this.addNotification('WhatsApp Despachado', `Se ha procesado el envío hacia: ${payload.phone}`, 'success');
        this.playSuccessSound();
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

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

  constructor(private http: HttpClient) { }


  sendEmail(payload: EmailPayload): Observable<any> {
    console.log('📬 [MOCK] Solicitud de envío de Email enviada:', payload);


    return of({ success: true, message: 'Email enviado exitosamente (Mock)' }).pipe(
      delay(1500),
      tap(response => console.log('✅ [MOCK] Respuesta del servidor Email:', response))
    );

  }


  sendWhatsApp(payload: WhatsAppPayload): Observable<any> {
    console.log('💬 [MOCK] Solicitud de envío de WhatsApp enviada:', payload);


    return of({ success: true, message: 'WhatsApp enviado exitosamente (Mock)' }).pipe(
      delay(1500),
      tap(response => console.log('✅ [MOCK] Respuesta del servidor WhatsApp:', response))
    );


  }
}

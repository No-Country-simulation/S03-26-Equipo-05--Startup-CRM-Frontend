import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

export interface LoginPayload {
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  register(payload: any): Observable<any> {
    console.log('📝 Solicitud de Registro Mockeada:', payload.email);
    // return this.http.post<any>(`${this.apiUrl}/register`, payload);
    return of({ success: true, message: 'Mock register success' }).pipe(delay(500));
  }

  login(payload: LoginPayload): Observable<any> {
    console.log('🔒 Solicitud de Login Mockeada:', payload.email);

    const mockResponse = {
      token: 'mock-jwt-token-12345'
    };

    return of(mockResponse).pipe(
      delay(800),
      tap(response => {
        localStorage.setItem('token', response.token);
        console.log('✅ Login Exitoso (MOCK), token guardado en localStorage');
      }),
      map(response => ({
        success: true,
        token: response.token,
        user: { email: payload.email, role: 'admin' }
      }))
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}


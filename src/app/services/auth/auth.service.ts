import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:8083/api/autorizacion';

  constructor(private http: HttpClient) {}

  login(data: { correo: string; contrasenia: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        // Guarda el ID del usuario o el objeto completo
        localStorage.setItem('currentUser', JSON.stringify(response.usuario));
      })
    );
  }

  getCurrentUserId(): number | undefined {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return undefined;

    try {
      const user = JSON.parse(userJson);
      return user.id;
    } catch (e) {
      console.error('Error parsing current user from localStorage:', e);
      return undefined;
    }
  }


}

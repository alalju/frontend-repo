import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:8083/api/autorizacion';

  constructor(private http: HttpClient) {}

  login(data: { correo: string; contrasenia: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }
}

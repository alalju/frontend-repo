import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { Observable } from 'rxjs';
import type { User, UserStats } from "../models/user.model"
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class WorkTeacherService {
  private apiUrl = 'http://localhost:8080/api/trabajos';

  private usersSubject = new BehaviorSubject<User[]>([])
  public users$ = this.usersSubject.asObservable()

  constructor(private http: HttpClient) {}
  
  getTrabajos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getCarreras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/carreras`)
  }

  aprobarTrabajo(id: number, aprobar: boolean): Observable<any[]> {
    return this.http.put<any[]>(`${this.apiUrl}/aprobar/${aprobar}/${id}`, "");
  }

  //  getRoles(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrlRoles}`);
  // }

  // createUser(userData: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}`, userData);
  // }

  // deleteUser(userId: number): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  // }

  // activateUser(userId: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/activar/${userId}`, {});
  // }
}

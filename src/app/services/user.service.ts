import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { Observable } from 'rxjs';
import type { User, UserStats } from "../models/user.model"
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/usuarios';
  private apiUrlRoles = 'http://localhost:8081/api/roles';

  private usersSubject = new BehaviorSubject<User[]>([])
  public users$ = this.usersSubject.asObservable()

  constructor(private http: HttpClient) {}
  
  private mockUsers: User[] = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@universidad.edu",
      role: "student",
      career: "Ing. Desarrollo de Software",
      status: "active",
      lastLogin: "2024-01-15",
      createdAt: new Date("2024-01-01"),
    },
    {
      id: 2,
      name: "María García",
      email: "maria.garcia@universidad.edu",
      role: "student",
      career: "Ing. Forestal",
      status: "active",
      lastLogin: "2024-01-14",
      createdAt: new Date("2024-01-02"),
    },
    {
      id: 3,
      name: "Dr. Carlos López",
      email: "carlos.lopez@universidad.edu",
      role: "works-admin",
      status: "active",
      lastLogin: "2024-01-16",
      createdAt: new Date("2023-12-01"),
    },
  ]

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

   getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlRoles}`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, userData);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }

  activateUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/activar/${userId}`, {});
  }
}

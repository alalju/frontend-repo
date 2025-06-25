import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import type { User, UserStats } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([])
  public users$ = this.usersSubject.asObservable()

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

  constructor() {
    this.usersSubject.next(this.mockUsers)
  }

  getUsers(): Observable<User[]> {
    return this.users$
  }

  getUserStats(): Observable<UserStats> {
    return new BehaviorSubject<UserStats>({
      total: 1270,
      students: 1250,
      admins: 20,
      newToday: 5,
    }).asObservable()
  }

  getUsersByCareer(): Observable<any[]> {
    return new BehaviorSubject([
      { career: "Ing. Software", count: 450 },
      { career: "Ing. Forestal", count: 320 },
      { career: "Lic. Turística", count: 280 },
      { career: "Lic. Biología", count: 350 },
      { career: "Lic. C. Ambientales", count: 250 },
    ]).asObservable()
  }
}

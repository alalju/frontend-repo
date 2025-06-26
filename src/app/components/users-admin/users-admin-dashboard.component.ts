import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { UserService } from "../../services/user.service"
import type { User } from "../../models/user.model"
import { Observable } from "rxjs"

@Component({
  selector: "app-users-admin-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./users-admin-dashboard.component.html",
  styleUrl: "./users-admin-dashboard.component.scss",
})
export class UsersAdminDashboardComponent implements OnInit {
  users: any[] = []
  searchText = ""
  selectedRole = ""
  selectedStatus = ""
  totalUsers = 0
  totalAlumnos = 0
  totalProfesores = 0
  totalAdministradores = 0
  porcentajeAlumnos = 0
  porcentajeProfesores = 0
  porcentajeAdministradores = 0

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      console.log("Usuarios obtenidos:", users)
      this.users = users;
      this.totalUsers = users.length;

      users.forEach((user) => {
        if (user.rol.nombre === "ADMINISTRADOR") {
          this.totalAlumnos++;
        }
        
        if (user.rol.nombre === "PROFESOR") {
          this.totalProfesores++;
        }
        
        if (user.rol.nombre === "ALUMNO") {
          this.totalAdministradores++;
        }
      })

      // Calcular porcentajes
      this.porcentajeAlumnos = this.totalUsers ? Math.round((this.totalAlumnos / this.totalUsers) * 100) : 0;
      this.porcentajeProfesores = this.totalUsers ? Math.round((this.totalProfesores / this.totalUsers) * 100) : 0;
      this.porcentajeAdministradores = this.totalUsers ? Math.round((this.totalAdministradores / this.totalUsers) * 100) : 0;
    })
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case "student":
        return "bg-success"
      case "works-admin":
        return "bg-primary"
      case "users-admin":
        return "bg-info"
      default:
        return "bg-secondary"
    }
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case "student":
        return "bi bi-mortarboard"
      case "works-admin":
        return "bi bi-shield-check"
      case "users-admin":
        return "bi bi-person-gear"
      default:
        return "bi bi-person"
    }
  }

  getRoleText(role: string): string {
    switch (role) {
      case "student":
        return "Estudiante"
      case "works-admin":
        return "Admin. Trabajos"
      case "users-admin":
        return "Admin. Usuarios"
      default:
        return "Desconocido"
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "active":
        return "bg-success"
      case "inactive":
        return "bg-secondary"
      case "blocked":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "active":
        return "Activo"
      case "inactive":
        return "Inactivo"
      case "blocked":
        return "Bloqueado"
      default:
        return "Desconocido"
    }
  }
}

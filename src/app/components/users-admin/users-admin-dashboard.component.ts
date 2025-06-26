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
  roles: any[] = []
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
          this.totalAdministradores++;
        }
        
        if (user.rol.nombre === "PROFESOR") {
          this.totalProfesores++;
        }
        
        if (user.rol.nombre === "ALUMNO") {
          this.totalAlumnos++;
        }
      })

      // Calcular porcentajes
      this.porcentajeAlumnos = this.totalUsers ? Math.round((this.totalAlumnos / this.totalUsers) * 100) : 0;
      this.porcentajeProfesores = this.totalUsers ? Math.round((this.totalProfesores / this.totalUsers) * 100) : 0;
      this.porcentajeAdministradores = this.totalUsers ? Math.round((this.totalAdministradores / this.totalUsers) * 100) : 0;
    })

    this.userService.getRoles().subscribe((roles) => {
      console.log("Roles obtenidos:", roles)
      this.roles = roles;
    })
  }

  get filteredUsers() {
    return this.users.filter(user => {
      const search = (this.searchText || '').toLowerCase();
      const matchesText =
        user.nombre.toLowerCase().includes(search) ||
        user.correo.toLowerCase().includes(search);

      const matchesRole =
        !this.selectedRole || user.rol.nombre === this.selectedRole;

      const matchesStatus =
        !this.selectedStatus ||
        (this.selectedStatus === 'active' && user.activo === true) ||
        (this.selectedStatus === 'inactive' && user.activo === false) ||
        (this.selectedStatus === 'blocked' && user.bloqueado === true);

      return matchesText && matchesRole && matchesStatus;
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case "ALUMNO":
        return "bg-success"
      case "PROFESOR":
        return "bg-primary"
      case "ADMINISTRADOR":
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
      case "ALUMNO":
        return "Alumno"
      case "PROFESOR":
        return "Profesor"
      case "ADMINISTRADOR":
        return "Administrador"
      default:
        return "Desconocido"
    }
  }

  getStatusBadgeClass(status: boolean): string {
    switch (status) {
      case true:
        return "bg-success"
      case false:
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  getStatusText(status: boolean): string {
    switch (status) {
      case true:
        return "Activo"
      case false:
        return "Inactivo"
      default:
        return "Desconocido"
    }
  }
}

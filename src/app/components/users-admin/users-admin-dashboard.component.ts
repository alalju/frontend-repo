import { Component, EventEmitter, Output, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { UserService } from "../../services/user.service"

@Component({
  selector: "app-users-admin-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./users-admin-dashboard.component.html",
  styleUrl: "./users-admin-dashboard.component.scss",
})
export class UsersAdminDashboardComponent implements OnInit {
  @Output() viewChanged = new EventEmitter<string>();

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
  selectedUser: any = null;
  isModalOpen = false;

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
        (this.selectedStatus === 'inactive' && user.activo === false);
      return matchesText && matchesRole && matchesStatus;
    });
  }

  cambiarVista(nuevaVista: string) {
    console.log("Cambiando vista a:", nuevaVista);
    this.viewChanged.emit(nuevaVista);
  }

  viewUser(user: any) {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  editUser(user: any) {
    // Aquí puedes abrir un formulario de edición o navegar a la vista de edición
    console.log('Editar usuario:', user);
    this.viewChanged.emit('add-user'); // Ejemplo de navegación
  }

  blockUser(user: any) {
    if (confirm(`¿Seguro que deseas activar a ${user.nombre}?`)) {
      this.userService.activateUser(user.id).subscribe(() => {
        user.activo = !user.activo;
      });
    }
  }

  deleteUser(user: any) {
    if (confirm(`¿Seguro que deseas eliminar a ${user.nombre}?`)) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== user.id);
      });
    }
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

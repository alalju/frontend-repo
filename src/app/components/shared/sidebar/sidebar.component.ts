import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface MenuItem {
  id: string
  label: string
  icon: string
}

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-success text-white sidebar" style="width: 280px;">
      <div class="p-4">
        <div class="d-flex align-items-center mb-4">
          <i class="bi bi-mortarboard-fill me-2 fs-5"></i>
          <span class="fw-bold">Sistema Académico</span>
        </div>

        <select 
          class="form-select bg-success border-success text-white"
          [(ngModel)]="userRole"
          (ngModelChange)="onRoleChange($event)"
          style="background-image: none;">
          <option value="student">Estudiante</option>
          <option value="works-admin">Admin. Trabajos</option>
          <option value="users-admin">Admin. Usuarios</option>
        </select>
      </div>

      <nav class="px-3 pb-4">
        <button 
          *ngFor="let item of getMenuItems()"
          class="btn w-100 text-start mb-2 d-flex align-items-center"
          [class.btn-light]="activeView === item.id"
          [class.btn-outline-light]="activeView !== item.id"
          [class.text-success]="activeView === item.id"
          [class.text-white]="activeView !== item.id"
          (click)="onMenuClick(item.id)">
          <i [class]="'bi ' + item.icon + ' me-3'"></i>
          {{ item.label }}
        </button>
      </nav>
    </div>
  `,
  styles: [
    `
    .sidebar {
      min-height: 100vh;
      background: linear-gradient(180deg, #198754 0%, #146c43 100%);
    }
    
    .form-select option {
      background-color: #198754;
      color: white;
    }
    
    .btn-outline-light:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
  `,
  ],
})
export class SidebarComponent {
  @Input() activeView!: string
  @Input() userRole!: "student" | "works-admin" | "users-admin"
  @Output() viewChanged = new EventEmitter<string>()
  @Output() roleChanged = new EventEmitter<"student" | "works-admin" | "users-admin">()

  private studentMenuItems: MenuItem[] = [
    { id: "student-dashboard", label: "Dashboard", icon: "bi-house-door" },
    { id: "upload-work", label: "Subir Trabajo", icon: "bi-cloud-upload" },
    { id: "my-works", label: "Mis Trabajos", icon: "bi-file-text" },
    { id: "search-works", label: "Buscar Trabajos", icon: "bi-search" },
    { id: "profile", label: "Mi Perfil", icon: "bi-person-gear" },
  ]

  private worksAdminMenuItems: MenuItem[] = [
    { id: "works-admin-dashboard", label: "Dashboard", icon: "bi-house-door" },
    { id: "manage-works", label: "Gestionar Trabajos", icon: "bi-file-text" },
    { id: "pending-works", label: "Trabajos Pendientes", icon: "bi-clock" },
    { id: "advanced-search", label: "Búsqueda Avanzada", icon: "bi-search" },
    { id: "statistics", label: "Estadísticas", icon: "bi-bar-chart" },
  ]

  private usersAdminMenuItems: MenuItem[] = [
    { id: "users-admin-dashboard", label: "Dashboard", icon: "bi-people" },
    { id: "manage-users", label: "Gestionar Usuarios", icon: "bi-person-gear" },
    { id: "create-user", label: "Crear Usuario", icon: "bi-person-plus" },
    { id: "system-stats", label: "Estadísticas Sistema", icon: "bi-bar-chart" },
    { id: "settings", label: "Configuración", icon: "bi-gear" },
  ]

  getMenuItems(): MenuItem[] {
    switch (this.userRole) {
      case "student":
        return this.studentMenuItems
      case "works-admin":
        return this.worksAdminMenuItems
      case "users-admin":
        return this.usersAdminMenuItems
      default:
        return this.studentMenuItems
    }
  }

  onMenuClick(viewId: string): void {
    this.viewChanged.emit(viewId)
  }

  onRoleChange(role: "student" | "works-admin" | "users-admin"): void {
    this.roleChanged.emit(role)
  }
}

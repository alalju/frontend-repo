import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="bg-white shadow-sm border-bottom">
      <div class="d-flex justify-content-between align-items-center px-4 py-3">
        <div>
          <h1 class="h3 text-success fw-bold mb-0">Universidad Verde</h1>
          <p class="text-muted small mb-0">{{ getRoleTitle() }}</p>
        </div>

        <div class="d-flex align-items-center">
          <div class="input-group me-3" style="width: 300px;">
            <span class="input-group-text bg-light border-end-0">
              <i class="bi bi-search text-muted"></i>
            </span>
            <input 
              type="text" 
              class="form-control border-start-0" 
              placeholder="Buscar trabajos..."
              [(ngModel)]="searchQuery">
          </div>

          <div class="dropdown me-2">
            <button 
              class="btn btn-outline-secondary position-relative"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="bi bi-bell"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
                <span class="visually-hidden">notificaciones no leídas</span>
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">Notificaciones</h6></li>
              <li><a class="dropdown-item" href="#">Nuevo trabajo pendiente</a></li>
              <li><a class="dropdown-item" href="#">Usuario registrado</a></li>
              <li><a class="dropdown-item" href="#">Trabajo aprobado</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-center" href="#">Ver todas</a></li>
            </ul>
          </div>

          <div class="dropdown">
            <button 
              class="btn btn-outline-secondary"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="bi bi-person-circle"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">Mi Cuenta</h6></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Perfil</a></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Configuración</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  @Input() userRole!: "student" | "works-admin" | "users-admin"
  searchQuery = ""

  getRoleTitle(): string {
    switch (this.userRole) {
      case "student":
        return "Portal del Estudiante"
      case "works-admin":
        return "Administración de Trabajos"
      case "users-admin":
        return "Administración de Usuarios"
      default:
        return "Sistema Académico"
    }
  }
}

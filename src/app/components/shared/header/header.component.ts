import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="bg-white shadow-sm border-bottom">
      <div class="d-flex justify-content-between align-items-center px-4 py-3">
        <div>
          <h1 class="h3 text-success fw-bold mb-0">RepoUNSIJ</h1>
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
              placeholder="Buscar {{ getSearch() }}..."
              [(ngModel)]="searchQuery">
          </div>
          <!--
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
          -->

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
              <li>
                <button class="dropdown-item" (click)="abrirModalUsuario()">
                  <i class="bi bi-person me-2"></i>Perfil
                </button>
              </li>
              <!--<li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Configuración</a></li>-->
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger" (click)="cerrarSesion()">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
   <div 
      class="modal fade show d-block" 
      tabindex="-1" 
      *ngIf="showUserModal"
      style="background-color: rgba(0,0,0,0.5);"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header bg-success text-white rounded-top-4">
            <h5 class="modal-title d-flex align-items-center">
              <i class="bi bi-person-circle me-2 fs-4"></i> Información del Usuario
            </h5>
            <button type="button" class="btn-close btn-close-white" (click)="cerrarModalUsuario()" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold text-muted">Nombre</label>
              <div class="form-control bg-light">{{ usuario.nombre }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold text-muted">Correo</label>
              <div class="form-control bg-light">{{ usuario.correo }}</div>
            </div>
            <div class="mb-2">
              <label class="form-label fw-bold text-muted">Rol</label>
              <div class="form-control bg-light">{{ usuario.rol.nombre }}</div>
            </div>
          </div>
          <div class="modal-footer bg-light rounded-bottom-4">
            <button class="btn btn-outline-danger" (click)="cerrarModalUsuario()">
              <i class="bi bi-x-circle me-1"></i> Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HeaderComponent {
  @Input() userRole!: "student" | "works-admin" | "users-admin"
  searchQuery = ""
  showUserModal = false;
  usuario: any = {}

  constructor(private router: Router) {}

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

  getSearch(): string {
    switch (this.userRole) {
      case "student":
        return "estudiante"
      case "works-admin":
        return "trabajo"
      case "users-admin":
        return "usuario"
      default:
        return "Sistema Académico"
    }
  }

  abrirModalUsuario(): void {
    this.showUserModal = true;
    this.usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  }

  cerrarModalUsuario(): void {
    this.showUserModal = false;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario')      // Limpia el usuario
    this.router.navigate(['/login'])        // Redirige al login
  }
}

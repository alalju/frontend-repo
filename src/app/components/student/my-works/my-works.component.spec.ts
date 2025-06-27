import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { BreadcrumbComponent, type BreadcrumbItem } from "../../shared/breadcrumb/breadcrumb.component"
import  { WorkService } from "../../../services/work.service"
import type { Work } from "../../../models/work.model"

@Component({
  selector: "app-my-works",
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  template: `
    <div class="container-fluid">
      <!-- Breadcrumb -->
      <app-breadcrumb [items]="breadcrumbItems" class="mb-3"></app-breadcrumb>
      
      <div class="row mb-4">
        <div class="col">
          <h2 class="display-6 fw-bold text-dark">Mis Trabajos</h2>
          <p class="text-muted">Gestiona y revisa todos tus trabajos académicos</p>
        </div>
        <div class="col-auto">
          <button class="btn btn-success">
            <i class="bi bi-plus-circle me-2"></i>
            Subir Nuevo Trabajo
          </button>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <h3 class="text-primary">{{ getTotalWorks() }}</h3>
              <p class="text-muted mb-0">Total Trabajos</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <h3 class="text-success">{{ getApprovedWorks() }}</h3>
              <p class="text-muted mb-0">Aprobados</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <h3 class="text-warning">{{ getPendingWorks() }}</h3>
              <p class="text-muted mb-0">Pendientes</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <h3 class="text-danger">{{ getRejectedWorks() }}</h3>
              <p class="text-muted mb-0">Rechazados</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-end">
                <div class="col-md-4">
                  <label class="form-label">Buscar por título</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Buscar trabajos..."
                    [(ngModel)]="searchText">
                </div>
                <div class="col-md-3">
                  <label class="form-label">Estado</label>
                  <select class="form-select" [(ngModel)]="filterStatus">
                    <option value="">Todos los estados</option>
                    <option value="approved">Aprobados</option>
                    <option value="pending">Pendientes</option>
                    <option value="rejected">Rechazados</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Materia</label>
                  <select class="form-select" [(ngModel)]="filterSubject">
                    <option value="">Todas las materias</option>
                    <option value="Programación Web">Programación Web</option>
                    <option value="Base de Datos">Base de Datos</option>
                    <option value="Estructuras de Datos">Estructuras de Datos</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <button class="btn btn-outline-secondary w-100" (click)="clearFilters()">
                    <i class="bi bi-x-circle me-1"></i>
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Works List -->
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-header bg-white">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">Lista de Trabajos</h5>
                <div class="btn-group" role="group">
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    [class.active]="viewMode === 'list'"
                    (click)="viewMode = 'list'">
                    <i class="bi bi-list"></i>
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    [class.active]="viewMode === 'grid'"
                    (click)="viewMode = 'grid'">
                    <i class="bi bi-grid"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <!-- List View -->
              <div *ngIf="viewMode === 'list'" class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Materia</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let work of getFilteredWorks()">
                      <td>
                        <div>
                          <h6 class="mb-1">{{ work.title }}</h6>
                          <small class="text-muted">{{ work.career }}</small>
                        </div>
                      </td>
                      <td>{{ work.subject }}</td>
                      <td>{{ work.date }}</td>
                      <td>
                        <span [class]="getStatusBadgeClass(work.status)" class="badge">
                          <i [class]="getStatusIcon(work.status)" class="me-1"></i>
                          {{ getStatusText(work.status) }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group" role="group">
                          <button class="btn btn-sm btn-outline-primary" title="Ver">
                            <i class="bi bi-eye"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" title="Descargar">
                            <i class="bi bi-download"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-outline-warning" 
                            title="Editar"
                            [disabled]="work.status !== 'rejected'">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" title="Eliminar">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Grid View -->
              <div *ngIf="viewMode === 'grid'" class="row">
                <div class="col-md-6 col-lg-4 mb-4" *ngFor="let work of getFilteredWorks()">
                  <div class="card h-100 work-card">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <span [class]="getStatusBadgeClass(work.status)" class="badge">
                          <i [class]="getStatusIcon(work.status)" class="me-1"></i>
                          {{ getStatusText(work.status) }}
                        </span>
                        <div class="dropdown">
                          <button 
                            class="btn btn-sm btn-outline-secondary" 
                            type="button" 
                            data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                          </button>
                          <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#"><i class="bi bi-eye me-2"></i>Ver</a></li>
                            <li><a class="dropdown-item" href="#"><i class="bi bi-download me-2"></i>Descargar</a></li>
                            <li><a class="dropdown-item" href="#" [class.disabled]="work.status !== 'rejected'">
                              <i class="bi bi-pencil me-2"></i>Editar</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Eliminar</a></li>
                          </ul>
                        </div>
                      </div>
                      
                      <h6 class="card-title">{{ work.title }}</h6>
                      <p class="card-text text-muted small mb-2">
                        <i class="bi bi-book me-1"></i>{{ work.subject }}
                      </p>
                      <p class="card-text text-muted small mb-2">
                        <i class="bi bi-mortarboard me-1"></i>{{ work.career }}
                      </p>
                      <p class="card-text small">{{ work.summary }}</p>
                      
                      <div class="mt-auto">
                        <small class="text-muted">
                          <i class="bi bi-calendar3 me-1"></i>{{ work.date }}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div *ngIf="getFilteredWorks().length === 0" class="text-center py-5">
                <i class="bi bi-file-text fs-1 text-muted d-block mb-3"></i>
                <h5 class="text-muted">No se encontraron trabajos</h5>
                <p class="text-muted">No tienes trabajos que coincidan con los filtros seleccionados</p>
                <button class="btn btn-success">
                  <i class="bi bi-plus-circle me-2"></i>
                  Subir tu primer trabajo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .work-card {
      transition: all 0.2s ease;
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .work-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .btn-group .btn.active {
      background-color: #198754;
      border-color: #198754;
      color: white;
    }
    
    .table th {
      border-top: none;
      font-weight: 600;
      color: #495057;
      background-color: #f8f9fa;
    }
    
    .dropdown-item.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  `,
  ],
})
export class MyWorksComponent implements OnInit {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: "Inicio", url: "/" },
    { label: "Dashboard", url: "/student" },
    { label: "Mis Trabajos", active: true },
  ]

  works: Work[] = []
  searchText = ""
  filterStatus = ""
  filterSubject = ""
  viewMode: "list" | "grid" = "list"

  constructor(private workService: WorkService) {}

  ngOnInit(): void {
    this.workService.getWorks().subscribe((works) => {
      this.works = works
    })
  }

  getFilteredWorks(): Work[] {
    return this.works.filter((work) => {
      const matchesSearch = work.title.toLowerCase().includes(this.searchText.toLowerCase())
      const matchesStatus = !this.filterStatus || work.status === this.filterStatus
      const matchesSubject = !this.filterSubject || work.subject === this.filterSubject

      return matchesSearch && matchesStatus && matchesSubject
    })
  }

  getTotalWorks(): number {
    return this.works.length
  }

  getApprovedWorks(): number {
    return this.works.filter((work) => work.status === "approved").length
  }

  getPendingWorks(): number {
    return this.works.filter((work) => work.status === "pending").length
  }

  getRejectedWorks(): number {
    return this.works.filter((work) => work.status === "rejected").length
  }

  clearFilters(): void {
    this.searchText = ""
    this.filterStatus = ""
    this.filterSubject = ""
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "approved":
        return "bg-success"
      case "pending":
        return "bg-warning text-dark"
      case "rejected":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "approved":
        return "bi bi-check-circle"
      case "pending":
        return "bi bi-clock"
      case "rejected":
        return "bi bi-x-circle"
      default:
        return "bi bi-question-circle"
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "approved":
        return "Aprobado"
      case "pending":
        return "Pendiente"
      case "rejected":
        return "Rechazado"
      default:
        return "Desconocido"
    }
  }
}

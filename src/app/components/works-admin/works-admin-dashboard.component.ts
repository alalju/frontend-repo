import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { WorkService } from "../../services/work.service"
import type { Work } from "../../models/work.model"

@Component({
  selector: "app-works-admin-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col">
          <h2 class="display-6 fw-bold text-dark">Administración de Trabajos</h2>
          <p class="text-muted">Gestiona y supervisa todos los trabajos académicos</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2 text-muted">Total Trabajos</h6>
                  <h2 class="card-title mb-0">248</h2>
                  <small class="text-success">+15 esta semana</small>
                </div>
                <i class="bi bi-file-text fs-1 text-muted"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2 text-muted">Pendientes</h6>
                  <h2 class="card-title mb-0 text-warning">42</h2>
                  <small class="text-muted">Requieren revisión</small>
                </div>
                <i class="bi bi-clock fs-1 text-warning"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2 text-muted">Aprobados Hoy</h6>
                  <h2 class="card-title mb-0 text-success">8</h2>
                  <small class="text-muted">+3 vs ayer</small>
                </div>
                <i class="bi bi-check-circle fs-1 text-success"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2 text-muted">Tasa Aprobación</h6>
                  <h2 class="card-title mb-0">87%</h2>
                  <small class="text-success">+2% vs mes anterior</small>
                </div>
                <i class="bi bi-check-circle fs-1 text-success"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="row mb-4">
        <div class="col">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Búsqueda Avanzada</h5>
              <small class="text-muted">Filtra trabajos por múltiples criterios</small>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-3">
                  <input type="text" class="form-control" placeholder="Buscar por título..." [(ngModel)]="searchTitle">
                </div>
                <div class="col-md-3 mb-3">
                  <select class="form-select" [(ngModel)]="selectedCareer">
                    <option value="">Todas las carreras</option>
                    <option value="software">Ing. Desarrollo de Software</option>
                    <option value="forestal">Ing. Forestal</option>
                    <option value="turistica">Lic. Administración Turística</option>
                    <option value="biologia">Lic. Biología</option>
                    <option value="ambientales">Lic. Ciencias Ambientales</option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <select class="form-select" [(ngModel)]="selectedStatus">
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="approved">Aprobado</option>
                    <option value="rejected">Rechazado</option>
                  </select>
                </div>
                <div class="col-md-3 mb-3">
                  <button class="btn btn-success w-100">
                    <i class="bi bi-search me-2"></i>
                    Buscar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Works Table -->
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Trabajos Pendientes de Revisión</h5>
              <small class="text-muted">Trabajos que requieren tu atención</small>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Autor</th>
                      <th>Carrera</th>
                      <th>Materia</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let work of pendingWorks">
                      <td class="fw-bold">{{ work.title }}</td>
                      <td>{{ work.author }}</td>
                      <td>{{ work.career }}</td>
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
                          <button class="btn btn-sm btn-outline-secondary" title="Ver">
                            <i class="bi bi-eye"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" title="Editar">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" title="Descargar">
                            <i class="bi bi-download"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-success" title="Aprobar" (click)="approveWork(work.id)">
                            <i class="bi bi-check"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" title="Rechazar" (click)="rejectWork(work.id)">
                            <i class="bi bi-x"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WorksAdminDashboardComponent implements OnInit {
  pendingWorks: Work[] = []
  searchTitle = ""
  selectedCareer = ""
  selectedStatus = ""

  constructor(private workService: WorkService) {}

  ngOnInit(): void {
    this.workService.getWorks().subscribe((works) => {
      this.pendingWorks = works.filter((work) => work.status === "pending")
    })
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "approved":
        return "bg-success"
      case "pending":
        return "bg-warning"
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

  approveWork(workId: number): void {
    this.workService.updateWorkStatus(workId, "approved")
    this.pendingWorks = this.pendingWorks.filter((work) => work.id !== workId)
  }

  rejectWork(workId: number): void {
    this.workService.updateWorkStatus(workId, "rejected")
    this.pendingWorks = this.pendingWorks.filter((work) => work.id !== workId)
  }
}

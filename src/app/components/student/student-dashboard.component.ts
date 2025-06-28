import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { StatsCardComponent } from "../shared/stats-card/stats-card.component"
import { BreadcrumbComponent, type BreadcrumbItem } from "../shared/breadcrumb/breadcrumb.component"
import { UserService } from "../../services/user.service"
import type { Work } from "../../models/work.model"
import  { WorkService } from "../../services/work.service"

@Component({
  selector: "app-student-dashboard",
  standalone: true,
  imports: [CommonModule, StatsCardComponent, BreadcrumbComponent],
  template: `
    <div class="container-fluid">
      <!-- Breadcrumb -->
      <app-breadcrumb [items]="breadcrumbItems" class="mb-3"></app-breadcrumb>
      
      <div class="row mb-4">
        <div class="col">
          <h2 class="display-6 fw-bold text-dark">Dashboard del Estudiante</h2>
          <p class="text-muted">Bienvenido al sistema de gestión de trabajos académicos</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <app-stats-card
            title="Trabajos Subidos"
            [value]="12"
            subtitle="+2 este mes"
            icon="bi-file-text"
            subtitleClass="text-success">
          </app-stats-card>
        </div>

        <div class="col-md-3 mb-3">
          <app-stats-card
            title="Aprobados"
            [value]="8"
            subtitle="66.7% de aprobación"
            icon="bi-check-circle"
            valueClass="text-success"
            iconClass="text-success">
          </app-stats-card>
        </div>

        <div class="col-md-3 mb-3">
          <app-stats-card
            title="Pendientes"
            [value]="3"
            subtitle="En revisión"
            icon="bi-clock"
            valueClass="text-warning"
            iconClass="text-warning">
          </app-stats-card>
        </div>

        <div class="col-md-3 mb-3">
          <app-stats-card
            title="Rechazados"
            [value]="1"
            subtitle="Requiere revisión"
            icon="bi-x-circle"
            valueClass="text-danger"
            iconClass="text-danger">
          </app-stats-card>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-4">
        <div class="col">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">Acciones Rápidas</h5>
              <small class="text-muted">Gestiona tus trabajos académicos</small>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4 mb-3">
                  <button class="btn btn-success w-100 py-4 action-btn">
                    <i class="bi bi-cloud-upload fs-2 d-block mb-2"></i>
                    <span class="fw-semibold">Subir Nuevo Trabajo</span>
                  </button>
                </div>
                <div class="col-md-4 mb-3">
                  <button class="btn btn-outline-secondary w-100 py-4 action-btn">
                    <i class="bi bi-file-text fs-2 d-block mb-2"></i>
                    <span class="fw-semibold">Ver Mis Trabajos</span>
                  </button>
                </div>
                <div class="col-md-4 mb-3">
                  <button class="btn btn-outline-secondary w-100 py-4 action-btn">
                    <i class="bi bi-search fs-2 d-block mb-2"></i>
                    <span class="fw-semibold">Buscar Trabajos</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Works -->
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">Trabajos Recientes</h5>
              <small class="text-muted">Tus últimos trabajos subidos</small>
            </div>
            <div class="card-body">
              <div *ngFor="let work of recentWorks" class="border rounded p-3 mb-3 work-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="flex-grow-1">
                    <h6 class="fw-bold mb-1">{{ work.title }}</h6>
                    <p class="text-muted small mb-1">
                      <i class="bi bi-book me-1"></i>{{ work.subject }}
                    </p>
                    <small class="text-muted">
                      <i class="bi bi-calendar3 me-1"></i>{{ work.date }}
                    </small>
                  </div>
                  <div class="d-flex align-items-center">
                    <span [class]="getStatusBadgeClass(work.status)" class="badge me-2">
                      <i [class]="getStatusIcon(work.status)" class="me-1"></i>
                      {{ getStatusText(work.status) }}
                    </span>
                    <button class="btn btn-sm btn-outline-primary">
                      <i class="bi bi-eye me-1"></i>Ver
                    </button>
                  </div>
                </div>
              </div>
              
              <div *ngIf="recentWorks.length === 0" class="text-center py-4">
                <i class="bi bi-file-text fs-1 text-muted d-block mb-3"></i>
                <p class="text-muted">No tienes trabajos recientes</p>
                <button class="btn btn-success">
                  <i class="bi bi-plus-circle me-2"></i>Subir tu primer trabajo
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
    .action-btn {
      transition: all 0.3s ease;
      border-radius: 0.5rem;
    }
    
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .work-item {
      transition: all 0.2s ease;
      background-color: #f8f9fa;
    }
    
    .work-item:hover {
      background-color: #e9ecef;
      transform: translateX(5px);
    }
    
    .card-header {
      border-bottom: 1px solid #dee2e6;
    }
  `,
  ],
})
export class StudentDashboardComponent implements OnInit {
  recentWorks: Work[] = []
  breadcrumbItems: BreadcrumbItem[] = [
    { label: "Inicio", url: "/" },
    { label: "Dashboard", active: true },
  ]

  constructor(private workService: WorkService) {}

  ngOnInit(): void {
    this.workService.getPublicWorks().subscribe((works) => {
      this.recentWorks = works.slice(0, 3)
    })
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
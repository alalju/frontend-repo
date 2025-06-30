import { Component, type OnInit, type OnDestroy, Input, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { TrabajoService } from "../../../services/trabajo.service"
import type { TrabajoDTO } from "../../../models/work.model"
import { Subject } from "rxjs"
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators"

interface WorkStats {
  total: number
  approved: number
  pending: number
  rejected: number
  approvalRate: number
}

interface WorkFilter {
  search: string
  status: string
  subject: string
  career: string
  dateFrom?: string
  dateTo?: string
}


 @Component({
  selector: "app-my-works",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Mis Trabajos</h2>
        <button class="btn btn-success" (click)="navigateToUpload()">
          <i class="bi bi-plus-circle me-2"></i> Subir Nuevo Trabajo
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-5 fade-in">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 opacity-50">Cargando trabajos...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
        <i class="bi bi-exclamation-triangle me-2 fs-4"></i>
        <div>{{ errorMessage }}</div>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
        <i class="bi bi-check-circle me-2 fs-4"></i>
        <div class="flex-grow-1">{{ successMessage }}</div>
        <button type="button" class="btn-close" (click)="clearMessages()"></button>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && !errorMessage && allWorks.length === 0" class="text-center py-5 fade-in">
        <i class="bi bi-file-earmark-text display-4 text-muted"></i>
        <h3 class="mt-3 text-muted">No tienes trabajos aún</h3>
        <p class="text-muted">Comienza subiendo tu primer trabajo</p>
        <button class="btn btn-success" (click)="navigateToUpload()">
          <i class="bi bi-plus-circle me-2"></i> Subir Primer Trabajo
        </button>
      </div>

      <!-- Filters Section -->
      <div *ngIf="!isLoading && allWorks.length > 0" class="card mb-4 stats-card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0 d-flex align-items-center">
            <i class="bi bi-funnel me-2"></i> Filtros
          </h5>
          <button class="btn btn-outline-secondary btn-sm" (click)="toggleFilters()">
            <i class="bi" [class.bi-chevron-down]="!showFilters" [class.bi-chevron-up]="showFilters"></i>
          </button>
        </div>
        
        <div class="card-body" [class.d-none]="!showFilters">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Buscar</label>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Título, resumen o autor..." 
                [(ngModel)]="filters.search" 
                (ngModelChange)="onSearchChange($event)" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Estado</label>
              <select class="form-select" [(ngModel)]="filters.status" (ngModelChange)="applyFilters()">
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Materia</label>
              <select class="form-select" [(ngModel)]="filters.subject" (ngModelChange)="applyFilters()">
                <option value="">Todas las materias</option>
                <option *ngFor="let subject of subjects" [value]="subject">{{ subject }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Ordenar por</label>
              <select class="form-select" [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
                <option value="date-desc">Fecha (más reciente)</option>
                <option value="date-asc">Fecha (más antiguo)</option>
                <option value="title-asc">Título (A-Z)</option>
                <option value="title-desc">Título (Z-A)</option>
                <option value="status">Estado</option>
              </select>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12">
              <button class="btn btn-outline-secondary" (click)="clearFilters()">
                <i class="bi bi-x-circle me-2"></i> Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Works List/Grid with toggle -->
      <div *ngIf="!isLoading && filteredWorks.length > 0" class="fade-in">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <p class="mb-0 text-muted">
            Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} - 
            {{ Math.min(currentPage * itemsPerPage, filteredWorks.length) }} 
            de {{ filteredWorks.length }} trabajos
          </p>
          <div class="btn-group" role="group" aria-label="Vista modo toggle">
            <button 
              type="button" 
              class="btn btn-outline-success btn-sm"
              [class.active]="viewMode === 'grid'"
              (click)="viewMode = 'grid'">
              <i class="bi bi-grid-3x3-gap"></i>
            </button>
            <button 
              type="button" 
              class="btn btn-outline-success btn-sm"
              [class.active]="viewMode === 'list'"
              (click)="viewMode = 'list'">
              <i class="bi bi-list"></i>
            </button>
          </div>
        </div>

        <!-- Grid View -->
        <div *ngIf="viewMode === 'grid'" class="row g-4">
          <div *ngFor="let work of getPaginatedWorks(); trackBy: trackByWorkId" class="col-md-6 col-lg-4">
            <div class="card work-card h-100 d-flex flex-column">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <span class="badge" [class]="getStatusBadgeClass(work.estado?.nombre || '')">
                    <i [class]="getStatusIcon(work.estado?.nombre || '')" class="me-1"></i>
                    {{ getStatusText(work.estado?.nombre || '') }}
                  </span>
                  <small class="text-muted">{{ formatDate(work.fechaEnvio) }}</small>
                </div>
                <h5 class="work-title card-title" (click)="viewWorkDetail(work.id!)">
                  {{ work.titulo }}
                </h5>
                <p class="work-summary card-text flex-grow-1">
                  {{ work.resumen | slice:0:100 }}{{ work.resumen && work.resumen.length > 100 ? '...' : '' }}
                </p>
                <div class="mt-auto">
                  <div class="d-flex justify-content-between align-items-center text-small">
                    <span *ngIf="work.carrera" class="badge bg-light text-dark">
                      {{ work.carrera.nombre }}
                    </span>
                    <span *ngIf="work.materia" class="text-muted small">
                      {{ work.materia.nombre }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-transparent d-flex gap-2">
                <button class="btn btn-outline-success btn-sm" (click)="viewWorkDetail(work.id!)" title="Ver detalle">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-outline-primary btn-sm" (click)="editWorkAction(work.id!)" title="Editar trabajo">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-secondary btn-sm" (click)="downloadFile(work.id!, 'pdf')" title="Descargar PDF">
                  <i class="bi bi-file-pdf"></i>
                </button>
                <button class="btn btn-outline-secondary btn-sm" (click)="downloadFile(work.id!, 'codigo')" title="Descargar Código">
                  <i class="bi bi-file-zip"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" (click)="confirmDelete(work)" title="Eliminar trabajo">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div *ngIf="viewMode === 'list'" class="list-group">
          <div *ngFor="let work of getPaginatedWorks(); trackBy: trackByWorkId" class="list-group-item work-row">
            <div class="d-flex w-100 justify-content-between align-items-start flex-wrap gap-3">
              <div class="flex-grow-1 work-info">
                <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                  <h5 class="work-title mb-1" (click)="viewWorkDetail(work.id!)">{{ work.titulo }}</h5>
                  <span class="badge" [class]="getStatusBadgeClass(work.estado?.nombre || '')">
                    <i [class]="getStatusIcon(work.estado?.nombre || '')" class="me-1"></i>
                    {{ getStatusText(work.estado?.nombre || '') }}
                  </span>
                </div>
                <p class="mb-2 text-muted work-summary">{{ work.resumen }}</p>
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div class="d-flex gap-3 flex-wrap">
                    <small *ngIf="work.carrera" class="text-muted d-flex align-items-center gap-1">
                      <i class="bi bi-mortarboard"></i> {{ work.carrera.nombre }}
                    </small>
                    <small *ngIf="work.materia" class="text-muted d-flex align-items-center gap-1">
                      <i class="bi bi-book"></i> {{ work.materia.nombre }}
                    </small>
                    <small class="text-muted d-flex align-items-center gap-1">
                      <i class="bi bi-calendar"></i> {{ formatDate(work.fechaEnvio) }}
                    </small>
                  </div>
                  <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-outline-success btn-sm" (click)="viewWorkDetail(work.id!)" title="Ver detalle">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-primary btn-sm" (click)="editWorkAction(work.id!)" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" (click)="downloadFile(work.id!, 'pdf')" title="PDF">
                      <i class="bi bi-file-pdf"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" (click)="downloadFile(work.id!, 'codigo')" title="Código">
                      <i class="bi bi-file-zip"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" (click)="confirmDelete(work)" title="Eliminar">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <nav *ngIf="totalPages > 1" aria-label="Paginación" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" [class.disabled]="currentPage === 1">
              <button class="page-link" (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">Anterior</button>
            </li>
            <li *ngFor="let page of getPageNumbers()" class="page-item" [class.active]="page === currentPage">
              <button class="page-link" (click)="changePage(page)">{{ page }}</button>
            </li>
            <li class="page-item" [class.disabled]="currentPage === totalPages">
              <button class="page-link" (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages">Siguiente</button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Work Detail Modal -->
      <div *ngIf="showWorkDetail && selectedWorkId" 
           class="modal fade show d-block" 
           tabindex="-1" 
           style="background-color: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Detalle del Trabajo</h5>
              <button type="button" class="btn-close" (click)="closeWorkDetail()"></button>
            </div>
            <div class="modal-body">
              <p>Detalle del trabajo ID: {{ selectedWorkId }}</p>
              <!-- Aquí puedes agregar más detalles del trabajo -->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeWorkDetail()">Cerrar</button>
              <button type="button" class="btn btn-primary" (click)="onEditWorkFromDetail(selectedWorkId)">Editar</button>
              <button type="button" class="btn btn-danger" (click)="onDeleteWorkFromDetail(selectedWorkId)">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="workToDelete" 
           class="modal fade show d-block" 
           tabindex="-1" 
           style="background-color: rgba(0,0,0,0.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmar Eliminación</h5>
              <button type="button" class="btn-close" (click)="cancelDelete()"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que quieres eliminar el trabajo <strong>"{{ workToDelete.titulo }}"</strong>?</p>
              <p class="text-muted">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="cancelDelete()">Cancelar</button>
              <button type="button" class="btn btn-danger" (click)="deleteWorkAction()">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .status-aprobado {
      background-color: #d4edda;
      color: #155724;
    }
    .status-pendiente {
      background-color: #fff3cd;
      color: #856404;
    }
    .status-rechazado {
      background-color: #f8d7da;
      color: #721c24;
    }
    .badge {
      font-size: 0.75em;
      font-weight: 500;
    }
    .opacity-50 {
      opacity: 0.5;
    }
    .stats-card {
      transition: all 0.2s ease;
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    .stats-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    .work-card {
      transition: all 0.2s ease;
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    .work-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    .work-title {
      cursor: pointer;
      transition: color 0.2s ease;
    }
    .work-title:hover {
      color: #198754 !important;
      text-decoration: underline;
    }
    .work-row {
      transition: background-color 0.2s ease;
    }
    .work-row:hover {
      background-color: rgba(25, 135, 84, 0.05) !important;
    }
    .work-info {
      max-width: 400px;
    }
    .work-summary {
      line-height: 1.4;
    }
    .btn-group .btn.active {
      background-color: #198754;
      border-color: #198754;
      color: white;
    }
    .form-control:focus,
    .form-select:focus {
      border-color: #198754;
      box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
    }
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    .pagination .page-link {
      color: #198754;
      border-color: #dee2e6;
      transition: all 0.15s ease;
    }
    .pagination .page-link:hover {
      color: #146c43;
      background-color: #f8f9fa;
      border-color: #dee2e6;
    }
    .pagination .page-item.active .page-link {
      background-color: #198754;
      border-color: #198754;
      color: white;
    }
    @media (max-width: 768px) {
      .stats-card {
        margin-bottom: 1rem;
      }
      .work-info {
        max-width: 100%;
      }
      .btn-group {
        flex-direction: column;
      }
      .btn-group .btn {
        border-radius: 0.375rem !important;
        margin-bottom: 0.25rem;
      }
      .btn-group .btn:last-child {
        margin-bottom: 0;
      }
    }
    @media (max-width: 576px) {
      .display-4 {
        font-size: 2.5rem;
      }
      .card-body {
        padding: 1rem;
      }
      .work-summary {
        display: none;
      }
    }
    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
    `
  ]
})

export class MyWorksComponent {
  private destroy$ = new Subject<void>()
  private searchSubject = new Subject<string>()
  private trabajoService = inject(TrabajoService)

  @Input() usuarioId!: number

  works: TrabajoDTO[] = []

  // Data
  allWorks: TrabajoDTO[] = []
  filteredWorks: TrabajoDTO[] = []
  workStats: WorkStats = { total: 0, approved: 0, pending: 0, rejected: 0, approvalRate: 0 }
  subjects: string[] = []
  recentActivity: any[] = []

  // Filters and UI state
  filters: WorkFilter = {
    search: "",
    status: "",
    subject: "",
    career: "",
  }

  sortBy = "date-desc"
  viewMode: "list" | "grid" = "grid"
  showFilters = false
  isLoading = false
  isDownloading = false
  workToDelete: TrabajoDTO | null = null

  // Messages
  errorMessage = ""
  successMessage = ""

  // Pagination
  currentPage = 1
  itemsPerPage = 9
  totalPages = 1

  // Modal de detalles
  selectedWorkId: number | null = null
  showWorkDetail = false

  constructor() {
    // Setup search debouncing
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.filters.search = searchTerm
        this.applyFilters()
      })
  }

  ngOnInit(): void {
    this.loadData()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadData(): void {
    if (!this.usuarioId) {
      this.errorMessage = "ID de usuario no definido."
      return
    }

    this.isLoading = true
    this.clearMessages()

    this.trabajoService
      .obtenerTrabajosDelUsuario(this.usuarioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (trabajosDTO) => {
          this.allWorks = trabajosDTO
          this.workStats = this.calculateStats(this.allWorks)
          this.subjects = this.getUniqueSubjects()
          this.generateRecentActivity()
          this.applyFilters()
          this.isLoading = false
        },
        error: (error) => {
          this.errorMessage = "Error al cargar los trabajos."
          this.isLoading = false
          console.error("Error cargando trabajos:", error)
        },
      })
  }

  // ✅ MÉTODO PARA CALCULAR ESTADÍSTICAS (reemplaza al adapter)
  private calculateStats(works: TrabajoDTO[]): WorkStats {
    const total = works.length
    const approved = works.filter((w) => w.estado?.nombre?.toLowerCase() === "aprobado").length
    const pending = works.filter((w) => w.estado?.nombre?.toLowerCase() === "pendiente").length
    const rejected = works.filter((w) => w.estado?.nombre?.toLowerCase() === "rechazado").length
    const approvalRate = total > 0 ? (approved / total) * 100 : 0

    return { total, approved, pending, rejected, approvalRate }
  }

  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm)
  }

  applyFilters(): void {
    this.filteredWorks = this.allWorks.filter((work) => {
      const matchesSearch =
        !this.filters.search ||
        work.titulo.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        work.resumen.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        (work.usuario?.nombre + " " + work.usuario?.apellido).toLowerCase().includes(this.filters.search.toLowerCase())

      const matchesStatus =
        !this.filters.status || work.estado?.nombre?.toLowerCase() === this.filters.status.toLowerCase()
      const matchesSubject = !this.filters.subject || work.materia?.nombre === this.filters.subject
      const matchesCareer = !this.filters.career || work.carrera?.nombre === this.filters.career

      let matchesDateRange = true
      if (this.filters.dateFrom || this.filters.dateTo) {
        const workDate = new Date(work.fechaEnvio || "")
        if (this.filters.dateFrom) {
          matchesDateRange = matchesDateRange && workDate >= new Date(this.filters.dateFrom)
        }
        if (this.filters.dateTo) {
          matchesDateRange = matchesDateRange && workDate <= new Date(this.filters.dateTo)
        }
      }

      return matchesSearch && matchesStatus && matchesSubject && matchesCareer && matchesDateRange
    })

    this.applySorting()
    this.updatePagination()
  }

  applySorting(): void {
    this.filteredWorks.sort((a, b) => {
      switch (this.sortBy) {
        case "date-desc":
          return new Date(b.fechaEnvio || "").getTime() - new Date(a.fechaEnvio || "").getTime()
        case "date-asc":
          return new Date(a.fechaEnvio || "").getTime() - new Date(b.fechaEnvio || "").getTime()
        case "title-asc":
          return a.titulo.localeCompare(b.titulo)
        case "title-desc":
          return b.titulo.localeCompare(a.titulo)
        case "status":
          const statusOrder = { pendiente: 0, aprobado: 1, rechazado: 2 }
          const statusA = (a.estado?.nombre?.toLowerCase() as keyof typeof statusOrder) || "pendiente"
          const statusB = (b.estado?.nombre?.toLowerCase() as keyof typeof statusOrder) || "pendiente"
          return statusOrder[statusA] - statusOrder[statusB]
        case "subject":
          return (a.materia?.nombre || "").localeCompare(b.materia?.nombre || "")
        default:
          return 0
      }
    })
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredWorks.length / this.itemsPerPage)
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1
    }
  }

  getPaginatedWorks(): TrabajoDTO[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.filteredWorks.slice(startIndex, endIndex)
  }

  getPageNumbers(): number[] {
    const pages: number[] = []
    const maxPagesToShow = 5
    const halfRange = Math.floor(maxPagesToShow / 2)

    let startPage = Math.max(1, this.currentPage - halfRange)
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  clearFilters(): void {
    this.filters = {
      search: "",
      status: "",
      subject: "",
      career: "",
    }
    this.sortBy = "date-desc"
    this.currentPage = 1
    this.applyFilters()
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
    }
  }

  trackByWorkId(index: number, work: TrabajoDTO): number {
    return work.id || index
  }

  // Navigation methods
  viewWorkDetail(workId: number): void {
    this.selectedWorkId = workId
    this.showWorkDetail = true
  }

  // ✅ RENOMBRADO para evitar conflictos
  editWorkAction(workId: number): void {
    console.log("Navegar a editar trabajo:", workId)
    // Implementar navegación a edición
  }

  navigateToUpload(): void {
    console.log("Navegar a subir trabajo")
    // Implementar navegación a subida
  }

  // File operations
  downloadFile(trabajoId: number, tipoArchivo: "pdf" | "codigo") {
    this.trabajoService.descargarArchivo(trabajoId, tipoArchivo, this.usuarioId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `trabajo_${trabajoId}.${tipoArchivo}`
        a.click()
        window.URL.revokeObjectURL(url)
      },
      error: (error) => {
        console.error("Error al descargar archivo:", error)
        this.errorMessage = "Error al descargar el archivo"
      },
    })
  }

  // Delete operations
  confirmDelete(work: TrabajoDTO): void {
    this.workToDelete = work
  }

  // ✅ RENOMBRADO para evitar conflictos
  deleteWorkAction(): void {
    if (this.workToDelete && this.workToDelete.id) {
      this.trabajoService
        .eliminarTrabajo(this.workToDelete.id, this.usuarioId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.successMessage = "Trabajo eliminado exitosamente"
            this.workToDelete = null
            this.loadData() // Recargar datos
          },
          error: (error) => {
            this.errorMessage = `Error al eliminar trabajo: ${error.message}`
            this.workToDelete = null
          },
        })
    }
  }

  cancelDelete(): void {
    this.workToDelete = null
  }

  // Status helpers
  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case "aprobado":
        return "badge bg-success"
      case "pendiente":
        return "badge bg-warning text-dark"
      case "rechazado":
        return "badge bg-danger"
      default:
        return "badge bg-secondary"
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case "aprobado":
        return "bi bi-check-circle"
      case "pendiente":
        return "bi bi-clock"
      case "rechazado":
        return "bi bi-x-circle"
      default:
        return "bi bi-question-circle"
    }
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case "aprobado":
        return "Aprobado"
      case "pendiente":
        return "Pendiente"
      case "rechazado":
        return "Rechazado"
      default:
        return "Desconocido"
    }
  }

  // Utility methods
  getTimeAgo(date: Date): string {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "hace 1 día"
    if (diffDays < 7) return `hace ${diffDays} días`
    if (diffDays < 30) return `hace ${Math.ceil(diffDays / 7)} semanas`
    return `hace ${Math.ceil(diffDays / 30)} meses`
  }

  getProgressWidth(current: number, total: number): number {
    return total > 0 ? (current / total) * 100 : 0
  }

  formatDate(dateString?: string): string {
    if (!dateString) return ""
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  canEdit(): boolean {
    return true // Implementar lógica de permisos
  }

  // Modal de detalles
  closeWorkDetail(): void {
    this.showWorkDetail = false
    this.selectedWorkId = null
  }

  onEditWorkFromDetail(workId: number): void {
    this.closeWorkDetail()
    this.editWorkAction(workId)
  }

  onDeleteWorkFromDetail(workId: number): void {
    const work = this.allWorks.find((w) => w.id === workId)
    if (work) {
      this.closeWorkDetail()
      this.confirmDelete(work)
    }
  }

  // Helper methods
  private getUniqueSubjects(): string[] {
    return Array.from(new Set(this.allWorks.map((work) => work.materia?.nombre).filter(Boolean) as string[]))
  }

  private generateRecentActivity(): void {
    this.recentActivity = this.allWorks.slice(0, 5).map((work) => ({
      title: `Trabajo "${work.titulo}" ${this.getStatusText(work.estado?.nombre || "").toLowerCase()}`,
      date: this.getTimeAgo(new Date(work.fechaEnvio || "")),
      icon: this.getStatusIcon(work.estado?.nombre || ""),
      color:
        work.estado?.nombre?.toLowerCase() === "aprobado"
          ? "success"
          : work.estado?.nombre?.toLowerCase() === "pendiente"
            ? "warning"
            : "danger",
    }))
  }

  clearMessages(): void {
    this.errorMessage = ""
    this.successMessage = ""
  }

  // Utility method for Math in template
  Math = Math
}

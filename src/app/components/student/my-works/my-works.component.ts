import { Component, type OnInit, type OnDestroy, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { BreadcrumbComponent, type BreadcrumbItem } from "../../shared/breadcrumb/breadcrumb.component"
import  { TrabajoService } from "../../../services/trabajo.service"
import  { TrabajoAdapterService } from "../../../services/trabajo-adapter.service"
import  { Work, WorkStats, WorkFilter } from "../../../models/work.model"
import { Subject } from "rxjs"
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators"
import { WorkDetailComponent } from "../work-detail/work-detail.component"

@Component({
  selector: "app-my-works",
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent, WorkDetailComponent],
  templateUrl: "./my-works.component.html",
  styleUrls: ["./my-works.component.scss"],
})
export class MyWorksComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()
  private searchSubject = new Subject<string>()

  @Input() usuarioId!: number;
  works: Work[] = [];

  breadcrumbItems: BreadcrumbItem[] = [
    { label: "Inicio", url: "/" },
    { label: "Dashboard", url: "/student" },
    { label: "Mis Trabajos", active: true },
  ]

  // Data
  allWorks: Work[] = []
  filteredWorks: Work[] = []
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
  viewMode: "list" | "grid" = "list"
  showFilters = false
  isLoading = false
  isDownloading = false
  workToDelete: Work | null = null

  // Messages
  errorMessage = ""
  successMessage = ""

  // Pagination
  currentPage = 1
  itemsPerPage = 10
  totalPages = 1

  // Modal de detalles
  selectedWorkId: number | null = null
  showWorkDetail = false

  constructor(
    private trabajoService: TrabajoService,
    private adapterService: TrabajoAdapterService,
  ) {
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
        this.allWorks = trabajosDTO.map((dto) => this.adapterService.convertToWork(dto))
        this.workStats = this.adapterService.calculateStats(this.allWorks)
        this.subjects = this.getUniqueSubjects()
        this.generateRecentActivity()
        this.applyFilters()
        this.isLoading = false
      },
      error: (error) => {
        this.errorMessage = "Solicitud inválida. Verifica los datos enviados."
        this.isLoading = false
        console.error("Error cargando trabajos:", error)
      },
    })
}


  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm)
  }

  applyFilters(): void {
    this.filteredWorks = this.allWorks.filter((work) => {
      const matchesSearch =
        !this.filters.search ||
        work.title.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        work.summary.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        work.author.toLowerCase().includes(this.filters.search.toLowerCase())

      const matchesStatus = !this.filters.status || work.status === this.filters.status
      const matchesSubject = !this.filters.subject || work.subject === this.filters.subject
      const matchesCareer = !this.filters.career || work.career === this.filters.career

      let matchesDateRange = true
      if (this.filters.dateFrom || this.filters.dateTo) {
        const workDate = new Date(work.updatedAt)
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
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        case "status":
          const statusOrder = { pending: 0, approved: 1, rejected: 2 }
          return statusOrder[a.status] - statusOrder[b.status]
        case "subject":
          return a.subject.localeCompare(b.subject)
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

  getPaginatedWorks(): Work[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.filteredWorks.slice(startIndex, endIndex)
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

  trackByWorkId(index: number, work: Work): number {
    return work.id
  }

  // Navigation methods
  viewWorkDetail(workId: number): void {
    this.selectedWorkId = workId
    this.showWorkDetail = true
  }

  editWork(workId: number): void {
    console.log("Navegar a editar trabajo:", workId)
    // Implementar navegación a edición
  }

  navigateToUpload(): void {
    console.log("Navegar a subir trabajo")
    // Implementar navegación a subida
  }

  // File operations
  downloadFile(trabajoId: number, tipoArchivo: 'pdf' | 'zip') {

  this.trabajoService.descargarArchivo(trabajoId, tipoArchivo, this.usuarioId).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trabajo_${trabajoId}.${tipoArchivo}`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error("Error al descargar archivo:", error);
      // Aquí puedes mostrar un mensaje al usuario
    }
  });
}



  // Delete operations
  confirmDelete(work: Work): void {
    this.workToDelete = work
  }

  deleteWork(): void {
    if (this.workToDelete) {
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
    return new Date(dateString).toLocaleDateString()
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
    this.editWork(workId)
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
    return Array.from(new Set(this.allWorks.map((work) => work.subject)))
  }

  private generateRecentActivity(): void {
    this.recentActivity = this.allWorks.slice(0, 5).map((work) => ({
      title: `Trabajo "${work.title}" ${this.getStatusText(work.status).toLowerCase()}`,
      date: this.getTimeAgo(work.updatedAt),
      icon: this.getStatusIcon(work.status),
      color: work.status === "approved" ? "success" : work.status === "pending" ? "warning" : "danger",
    }))
  }

  private clearMessages(): void {
    this.errorMessage = ""
    this.successMessage = ""
  }
}

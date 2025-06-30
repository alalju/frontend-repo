import { Component, type OnInit, type OnDestroy, inject } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from "rxjs"
import { TrabajoService, type SearchFilters, type PagedResponse } from "../../../services/trabajo.service"
import { CarreraService } from "../../../services/carrera.service"
import type { TrabajoDTO } from "../../../models/work.model"
import type { CarreraDTO } from "../../../models/carrera.model"


interface BreadcrumbItem {
  label: string
  url?: string
  active?: boolean
}

@Component({
  selector: "app-search-works",
  standalone: true,
  imports: [FormsModule, RouterModule], // ✅ Solo los imports necesarios
  templateUrl: "./search-works.component.html",
  styleUrls: ["./search-works.component.scss"],
})
export class SearchWorksComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()
  private searchSubject = new Subject<void>()

  // Services
  private trabajoService = inject(TrabajoService)
  private carreraService = inject(CarreraService)
  private router = inject(Router)

  // Breadcrumb
  breadcrumbItems: BreadcrumbItem[] = [
    { label: "Inicio", url: "/dashboard" },
    { label: "Buscar Trabajos", active: true },
  ]

  // State variables
  works: TrabajoDTO[] = []
  carreras: CarreraDTO[] = []

  // Search and filters
  filtros: SearchFilters = {
    titulo: "",
    carreraId: undefined,
    page: 0,
    size: 12,
    sortBy: "fechaEnvio",
    sortDir: "desc",
    publicado: false,
  }

  filters = {
    dateFrom: "",
    dateTo: "",
  }

  // UI State
  isSearching = false
  isLoading = false
  hasSearched = false
  errorMessage = ""
  viewMode: "grid" | "list" = "grid"

  // Pagination
  currentPage = 0
  totalPages = 0
  totalElements = 0
  itemsPerPage = 12
  isFirst = true
  isLast = true

  // Sorting
  sortBy = "fechaEnvio"
  sortDir: "asc" | "desc" = "desc"

  ngOnInit(): void {
    console.log("🚀 SearchWorksComponent initialized")
    this.loadCarreras()
    this.setupSearchDebounce()

    this.executeSearch()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => {
      this.searchSubject.pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        console.log("📡 [DEBUG] Debounced search triggered")
        this.executeSearch()
      })
    })
  }

  private loadCarreras(): void {
    this.carreraService
      .obtenerCarreras()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (carreras) => {
          console.log("✅ Carreras loaded:", carreras)
          this.carreras = carreras
        },
        error: (error) => {
          console.error("❌ Error loading carreras:", error)
          this.errorMessage = "Error al cargar las carreras"
        },
      })
  }

  // ✅ MÉTODOS DE FORMATEO (reemplazan los pipes)
  formatDate(dateString?: string): string {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  truncateText(text?: string, maxLength = 100): string {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Search methods
  performSearch(): void {
    console.log("🔍 performSearch called")
    this.filtros.sortBy = this.sortBy
    this.filtros.sortDir = this.sortDir
    this.filtros.page = 0
    this.currentPage = 0
    this.hasSearched = true
    this.searchSubject.next()
  }

  private executeSearch(): void {
    console.log("🔍 executeSearch started")
    this.isSearching = true
    this.errorMessage = ""

    // Preparar filtros
    const searchFilters: SearchFilters = {
      ...this.filtros,
      sortBy: this.sortBy,
      sortDir: this.sortDir,
    }

    // Agregar filtros de fecha si están presentes
    if (this.filters.dateFrom && this.filters.dateFrom.trim()) {
      try {
        searchFilters.fechaInicio = new Date(this.filters.dateFrom)
      } catch (error) {
        console.warn("Invalid dateFrom format:", this.filters.dateFrom)
      }
    }

    if (this.filters.dateTo && this.filters.dateTo.trim()) {
      try {
        searchFilters.fechaFin = new Date(this.filters.dateTo)
      } catch (error) {
        console.warn("Invalid dateTo format:", this.filters.dateTo)
      }
    }

    console.log("🔍 Search filters:", searchFilters)

    this.trabajoService
      .buscarTrabajosPublicos(searchFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PagedResponse<TrabajoDTO>) => {
          console.log("✅ Search response received:", response)
          console.log("✅ Works array:", response.content)
          console.log("✅ Total elements:", response.totalElements)

          this.works = response.content
          this.totalElements = response.totalElements
          this.totalPages = response.totalPages
          this.currentPage = response.number
          this.isFirst = response.first
          this.isLast = response.last
          this.isSearching = false

          // 🔍 DEBUGGING: Verificar estado después de asignar
          console.log("🔍 Component state after assignment:")
          console.log("  - this.works:", this.works)
          console.log("  - this.works.length:", this.works.length)
          console.log("  - this.hasResults:", this.hasResults)
          console.log("  - this.hasSearched:", this.hasSearched)
          console.log("  - this.isSearching:", this.isSearching)
          console.log("  - this.errorMessage:", this.errorMessage)
        },
        error: (error) => {
          console.error("❌ Search error:", error)
          this.errorMessage = error.message || "Error al buscar trabajos"
          this.isSearching = false
          this.works = []

          console.log("❌ Error state:")
          console.log("  - this.errorMessage:", this.errorMessage)
          console.log("  - this.works:", this.works)
        },
      })
  }

  // Filter methods
  onFilterChange(): void {
    console.log("🔍 onFilterChange called");
    this.performSearch(); 
  }

  clearFilters(): void {
    console.log("🔍 clearFilters called")
    this.filtros = {
      titulo: "",
      carreraId: undefined,
      page: 0,
      size: this.itemsPerPage,
      sortBy: "fechaEnvio",
      sortDir: "desc",
      publicado: false,
    }

    this.filters = {
      dateFrom: "",
      dateTo: "",
    }

    this.sortBy = "fechaEnvio"
    this.sortDir = "desc"

    if (this.hasSearched) {
      this.performSearch()
    }
  }

  // Sorting methods
  onSortChange(): void {
    console.log("🔍 onSortChange called")
    this.filtros.sortBy = this.sortBy
    this.filtros.sortDir = this.sortDir

    if (this.hasSearched) {
      this.performSearch()
    }
  }

  // Pagination methods
  changePage(page: number): void {
    console.log("🔍 changePage called with:", page)
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.filtros.page = page
      this.currentPage = page
      this.executeSearch()
    }
  }

  changePageSize(newSize: number): void {
    console.log("🔍 changePageSize called with:", newSize)
    this.itemsPerPage = newSize
    this.filtros.size = newSize
    this.filtros.page = 0
    this.currentPage = 0

    if (this.hasSearched) {
      this.performSearch()
    }
  }

  // View methods
  viewWorkDetail(workId: number): void {
    this.router.navigate(['/work-detail', workId]);
  }

  downloadFile(workId: number, fileType: string): void {
    console.log("🔍 downloadFile called with:", workId, fileType)
    this.trabajoService
      .descargarArchivo(workId, fileType, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `trabajo_${workId}.${fileType}`
          link.click()
          window.URL.revokeObjectURL(url)
        },
        error: (error) => {
          console.error("Download error:", error)
          this.errorMessage = "Error al descargar el archivo"
        },
      })
  }

  // Status methods
  getStatusBadgeClass(status: string): string {
    const baseClasses = "badge "
    switch (status?.toLowerCase()) {
      case "aprobado":
      case "publicado":
        return baseClasses + "status-approved"
      case "pendiente":
        return baseClasses + "status-pending"
      case "rechazado":
        return baseClasses + "status-rejected"
      case "en_revision":
        return baseClasses + "status-review"
      default:
        return baseClasses + "status-default"
    }
  }

  getStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case "aprobado":
        return "Aprobado"
      case "publicado":
        return "Publicado"
      case "pendiente":
        return "Pendiente"
      case "rechazado":
        return "Rechazado"
      case "en_revision":
        return "En Revisión"
      default:
        return status || "Sin Estado"
    }
  }

  // Utility methods
  trackByWorkId(index: number, work: TrabajoDTO): number {
    return work.id || index
  }

  clearError(): void {
    this.errorMessage = ""
  }

  // Computed properties
  get hasResults(): boolean {
    const result = this.works.length > 0
    console.log("🔍 hasResults computed:", result, "works.length:", this.works.length)
    return result
  }

  get showingFrom(): number {
    return this.currentPage * this.itemsPerPage + 1
  }

  get showingTo(): number {
    const to = (this.currentPage + 1) * this.itemsPerPage
    return Math.min(to, this.totalElements)
  }

  get displayedPages(): number[] {
    const pages: number[] = []
    const maxPagesToShow = 5
    const halfRange = Math.floor(maxPagesToShow / 2)

    let startPage = Math.max(0, this.currentPage - halfRange)
    const endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  // 🔍 DEBUGGING: Método para mostrar estado actual
  debugCurrentState(): void {
    console.log("🔍 CURRENT COMPONENT STATE:")
    console.log("  - works:", this.works)
    console.log("  - works.length:", this.works.length)
    console.log("  - hasResults:", this.hasResults)
    console.log("  - hasSearched:", this.hasSearched)
    console.log("  - isSearching:", this.isSearching)
    console.log("  - errorMessage:", this.errorMessage)
    console.log("  - totalElements:", this.totalElements)
    console.log("  - currentPage:", this.currentPage)
    console.log("  - totalPages:", this.totalPages)
  }

  verDetalle(trabajoId: number): void {
    this.router.navigate(['/work-detail', trabajoId]);
  }
}

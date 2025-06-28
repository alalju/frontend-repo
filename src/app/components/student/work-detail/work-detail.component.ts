import { Component, Input, Output, EventEmitter, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { TrabajoService } from "../../../services/trabajo.service"
import  { TrabajoAdapterService } from "../../../services/trabajo-adapter.service"
import  { Work } from "../../../models/work.model"
import { Subject } from "rxjs"
import { takeUntil } from "rxjs/operators"

@Component({
  selector: "app-work-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./work-detail.component.html",
  styleUrls: ["./work-detail.component.scss"],
})
export class WorkDetailComponent implements OnInit, OnDestroy {
  @Input() workId!: number
  @Input() showAsModal = false
  @Output() closeDetail = new EventEmitter<void>()
  @Output() editWork = new EventEmitter<number>()
  @Output() deleteWork = new EventEmitter<number>()

  private destroy$ = new Subject<void>()
  private currentUserId = 1 // Temporal - obtener del servicio de auth

  work: Work | null = null
  isLoading = false
  isDownloading = false
  errorMessage = ""
  successMessage = ""

  constructor(
    private trabajoService: TrabajoService,
    private adapterService: TrabajoAdapterService,
  ) {}

  ngOnInit(): void {
    if (this.workId) {
      this.loadWorkDetail()
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadWorkDetail(): void {
    this.isLoading = true
    this.clearMessages()

    this.trabajoService
      .obtenerTrabajoPorId(this.workId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (trabajoDTO) => {
          this.work = this.adapterService.convertToWork(trabajoDTO)
          this.isLoading = false
        },
        error: (error) => {
          this.errorMessage = error.message
          this.isLoading = false
        },
      })
  }

  downloadFile(tipoArchivo: "pdf" | "codigo"): void {
    if (!this.work) return

    this.isDownloading = true
    this.clearMessages()

    this.trabajoService
      .descargarArchivo(this.work.id, tipoArchivo, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `${this.work?.title}_${tipoArchivo}.${tipoArchivo === "pdf" ? "pdf" : "zip"}`
          link.click()
          window.URL.revokeObjectURL(url)

          this.successMessage = "Descarga iniciada correctamente"
          this.isDownloading = false
        },
        error: (error) => {
          this.errorMessage = `Error al descargar archivo: ${error.message}`
          this.isDownloading = false
        },
      })
  }

  onClose(): void {
    this.closeDetail.emit()
  }

  onEdit(): void {
    if (this.work) {
      this.editWork.emit(this.work.id)
    }
  }

  onDelete(): void {
    if (this.work) {
      this.deleteWork.emit(this.work.id)
    }
  }

  canEdit(): boolean {
    return this.work?.status !== "approved"
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "approved":
        return "status-badge bg-success"
      case "pending":
        return "status-badge bg-warning text-dark"
      case "rejected":
        return "status-badge bg-danger"
      default:
        return "status-badge bg-secondary"
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

  formatDate(dateString?: string): string {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

   clearMessages(): void {
    this.errorMessage = ""
    this.successMessage = ""
  }
}

import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TrabajoService } from '../../../services/trabajo.service'
import { TrabajoDTO } from '../../../models/work.model'
import { AuthService } from '../../../services/auth/auth.service'

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-work-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-detail.component.html',
  styleUrls: ['./work-detail.component.scss'],
})
export class WorkDetailComponent implements OnInit {
  @Input() work?: TrabajoDTO
  @Input() showAsModal = false

  currentUserId: number | undefined;
  isLoading = false
  isDownloading = false
  errorMessage = ''
  successMessage = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private trabajoService: TrabajoService
  ) {}

  ngOnInit(): void {
    
    // Si ya se pasó el trabajo por @Input(), no hacemos nada
    if (this.work) {
      return
    }

    const idFromRoute = this.route.snapshot.paramMap.get('id')
    if (idFromRoute) {
      const trabajoId = parseInt(idFromRoute, 10)
      if (!isNaN(trabajoId)) {
        this.fetchTrabajoById(trabajoId)
      }
    }

    this.currentUserId = this.authService.getCurrentUserId()
  }

  fetchTrabajoById(id: number): void {
    this.isLoading = true
    this.trabajoService.obtenerTrabajoPorId(id).subscribe({
      next: (data: TrabajoDTO) => {
        this.work = data
        this.isLoading = false
      },
      error: (err) => {
        console.error('❌ Error al cargar el trabajo:', err)
        this.errorMessage = 'No se pudo cargar el trabajo.'
        this.isLoading = false
      },
    })
  }

  onClose(): void {
    if (this.showAsModal) {
      // Emitir evento o cerrar modal según sea necesario
    } else {
      this.router.navigate(['/search-works'])
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'Fecha no disponible'; // o simplemente ''
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getStatusBadgeClass(status: any): string {
    return status?.nombre === 'Aprobado' ? 'badge-success' : 'badge-warning'
  }

  getStatusIcon(status: any): string {
    return status?.nombre === 'Aprobado' ? 'bi bi-check-circle' : 'bi bi-clock'
  }

  getStatusText(status: any): string {
    return status?.nombre || 'Desconocido'
  }

  canEdit(): boolean {
    return this.work?.estado?.nombre !== 'Aprobado'
  }

  onEdit(): void {
    if (this.work) {
      this.router.navigate(['/edit-work', this.work.id])
    }
  }

  onDelete(): void {
    if (!this.work) return
    if (!confirm('¿Estás seguro de eliminar este trabajo?')) return
    if (this.work && this.work.id !== undefined && this.currentUserId !== undefined) {
      this.trabajoService.eliminarTrabajo(this.work.id, this.currentUserId).subscribe({
          next: () => {
            console.log("Trabajo eliminado con éxito");
          },
          error: (error) => {
            console.error("Error al eliminar trabajo:", error);
          }
        });
      } else {
        console.error("❌ No se pudo eliminar: falta work o currentUserId.");
      }
  }

  downloadFile(type: 'pdf' | 'codigo'): void {
  if (!this.work || typeof this.work.id !== 'number') return;

  this.isDownloading = true;

  this.trabajoService.descargarArchivo(this.work.id, type).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const extension = type === 'pdf' ? 'pdf' : 'zip';
      const nombre = `${this.work?.titulo} || 'archivo'}_${type}.${extension}`;
      a.download = nombre;
      a.click();

      window.URL.revokeObjectURL(url);
      this.isDownloading = false;
    },
    error: () => {
      this.errorMessage = 'No se pudo descargar el archivo';
      this.isDownloading = false;
    }
  });
}


  clearMessages(): void {
    this.errorMessage = ''
    this.successMessage = ''
  }
}

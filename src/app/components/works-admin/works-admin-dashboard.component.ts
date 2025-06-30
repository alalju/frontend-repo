import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { WorkService } from "../../services/work.service"
import type { Work } from "../../models/work.model"
import { WorkTeacherService } from "../../services/work-teacher.service"
import { TrabajoService } from "../../services/trabajo.service"
import { Subject, takeUntil } from "rxjs"
import { setAlternateWeakRefImpl } from "@angular/core/primitives/signals"

@Component({
  selector: "app-works-admin-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./works-admin-dashboard.component.html" 
})

export class WorksAdminDashboardComponent implements OnInit {
  carreras: any[] = []
  pendingWorks: any[] = []
  searchTitle = ""
  selectedCareer = ""
  selectedStatus = ""
  usuario: any = ""

  worksCarrera: any[] = []
  totalWorks = 0;
  totalPending = 0;
  totalApproved = 0;
  totalRejected = 0;

  isDownloading = false;
  errorMessage = "";
  successMessage = "";
  
  constructor(private workService: WorkService,
    private workTeacherService: WorkTeacherService,
    private trabajoService: TrabajoService) {}
  

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');

    console.log("userr:", this.usuario);

    this.workTeacherService.getCarreras().subscribe((carreras) => {
      this.carreras = carreras;
    });

    this.workTeacherService.getTrabajos().subscribe((works) => {      
      this.totalWorks = works.length;
      this.pendingWorks = works.filter((work) => work.estado.id === 1);
      console.log("pendientes:", this.pendingWorks);
      this.totalPending = works.filter((work) => work.estado.id === 1).length;
      this.totalApproved = works.filter((work) => work.estado.id === 2).length;
      this.totalRejected = works.filter((work) => work.estado.id === 3).length
    });

    /* // Funcionalidad para mostrar solo los trabajos del profesor segun su carrera
    this.workTeacherService.getTrabajos().subscribe((works) => {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      
      this.worksCarrera = works.filter((work) => work.materia.id === usuario.carrera.id);
      console.log("Total Works:", this.worksCarrera);

      this.totalWorks = this.worksCarrera.length;
      this.pendingWorks = this.worksCarrera.filter((work) => work.estado.id === 1);
      this.totalPending = works.filter((work) => work.estado.id === 1).length;
      this.totalApproved = works.filter((work) => work.estado.id === 2).length;
      this.totalRejected = works.filter((work) => work.estado.id === 3).length
    }) */
  }

  selectedWork: any = null;
  showModal = false;

  viewWorkDetails(work: any): void {
    this.selectedWork = work;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  applyFilters(): void {
    this.workTeacherService.getTrabajos().subscribe((works) => {
      let filtered = works.filter((work) => work.estado.id === 1);

      if (this.searchTitle.trim() !== "") {
        filtered = filtered.filter((work) =>
          work.titulo.toLowerCase().includes(this.searchTitle.toLowerCase())
        );
      }

      if (this.selectedCareer !== "") {
        filtered = filtered.filter((work) =>
          work.carrera.id.toString() === this.selectedCareer
        );
      }

      if (this.selectedStatus !== "") {
        filtered = filtered.filter((work) =>
          work.estado.nombre.toLowerCase() === this.selectedStatus.toLowerCase()
        );
      }

      this.pendingWorks = filtered;
    });
  }

  clearMessages(): void {
    this.errorMessage = ""
    this.successMessage = ""
  }

  downloadFile(trabajoId: number, tipoArchivo: 'pdf' | 'zip') {

    this.trabajoService.descargarArchivo(trabajoId, tipoArchivo, this.usuario.id).subscribe({
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


  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "Aprobado":
        return "bg-success"
      case "Pendiente":
        return "bg-warning"
      case "Rechazado":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "Aprobado":
        return "bi bi-check-circle"
      case "Pendiente":
        return "bi bi-clock"
      case "Rechazado":
        return "bi bi-x-circle"
      default:
        return "bi bi-question-circle"
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "Aprobado":
        return "Aprobado"
      case "Pendiente":
        return "Pendiente"
      case "Rechazado":
        return "Rechazado"
      default:
        return "Desconocido"
    }
  }

  approveWork(workId: number, aprobar: boolean): void {
    const mensaje = aprobar
    ? "¿Estás seguro de que deseas aprobar este trabajo?"
    : "¿Estás seguro de que deseas rechazar este trabajo?";

    const confirmado = window.confirm(mensaje);

    if (confirmado) {
      this.workTeacherService.aprobarTrabajo(workId, aprobar).subscribe({
        next: () => {
          // Puedes actualizar tu lista aquí si es necesario
          this.pendingWorks = this.pendingWorks.filter(work => work.id !== workId);
          this.ngOnInit();
        },
        error: (err) => {
          console.error("Error al cambiar el estado:", err);
          alert("Ocurrió un error al cambiar el estado del trabajo.");
        }
      });
    }
  }
}

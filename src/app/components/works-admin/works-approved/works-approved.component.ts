import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkTeacherService } from '../../../services/work-teacher.service';
import { TrabajoService } from '../../../services/trabajo.service';

@Component({
  selector: 'app-works-approved',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './works-approved.component.html'
})
export class WorksApprovedComponent implements OnInit {
  carreras: any[] = [];
  approvedWorks: any[] = [];
  searchTitle = '';
  selectedCareer = '';
  showModal = false;
  selectedWork: any = null;
  usuario: any = '';

  constructor(
    private workTeacherService: WorkTeacherService,
    private trabajoService: TrabajoService
  ) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    this.workTeacherService.getCarreras().subscribe((carreras) => {
      this.carreras = carreras;
    });

    this.fetchApprovedWorks();
  }

  fetchApprovedWorks(): void {
    this.workTeacherService.getTrabajos().subscribe((works) => {
      this.approvedWorks = works.filter((work) => work.estado.id === 2);
    });
  }

  applyFilters(): void {
    this.workTeacherService.getTrabajos().subscribe((works) => {
      let filtered = works.filter((work) => work.estado.id === 2);

      if (this.searchTitle.trim() !== '') {
        filtered = filtered.filter((work) =>
          work.titulo.toLowerCase().includes(this.searchTitle.toLowerCase())
        );
      }

      if (this.selectedCareer !== '') {
        filtered = filtered.filter(
          (work) => work.carrera.id.toString() === this.selectedCareer
        );
      }

      this.approvedWorks = filtered;
    });
  }

  viewWorkDetails(work: any): void {
    this.selectedWork = work;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
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
        console.error('Error al descargar archivo:', error);
        alert('Error al descargar el archivo');
      }
    });
  }
}

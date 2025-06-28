import { Injectable } from "@angular/core"
import type { Work, TrabajoDTO, WorkStats } from "../models/work.model"

@Injectable({
  providedIn: "root",
})
export class TrabajoAdapterService {
  // Convertir TrabajoDTO a Work (modelo del frontend)
  convertToWork(trabajoDTO: TrabajoDTO): Work {
    return {
      id: trabajoDTO.id || 0,
      title: trabajoDTO.titulo,
      summary: trabajoDTO.resumen,
      author: trabajoDTO.autor || "Usuario",
      career: trabajoDTO.carrera || "Sin carrera",
      subject: trabajoDTO.materia || "Sin materia",
      semester: trabajoDTO.semestre,
      date: this.formatDate(trabajoDTO.fechaEnvio),
      status: this.mapEstadoToStatus(trabajoDTO.estadoId),
      pdfFile: trabajoDTO.archivoPdfOriginal,
      sourceCode: trabajoDTO.codigoFuenteOriginal,
      updatedAt: new Date(trabajoDTO.fechaEnvio || new Date()),
      comentariosRevision: trabajoDTO.comentariosRevision,
      fechaAprobacion: trabajoDTO.fechaAprobacion,
      usuarioId: trabajoDTO.usuarioId,
      estadoId: trabajoDTO.estadoId,
      materiaId: trabajoDTO.materiaId,
      carreraId: trabajoDTO.carreraId,
    }
  }

  // Convertir Work a TrabajoDTO (para enviar al backend)
  convertToTrabajoDTO(work: Work, usuarioId: number): TrabajoDTO {
    return {
      id: work.id,
      titulo: work.title,
      resumen: work.summary,
      semestre: work.semester,
      usuarioId: usuarioId,
      estadoId: this.mapStatusToEstado(work.status),
      materiaId: work.materiaId,
      carreraId: work.carreraId,
      archivoPdfOriginal: work.pdfFile,
      codigoFuenteOriginal: work.sourceCode,
      comentariosRevision: work.comentariosRevision,
      fechaAprobacion: work.fechaAprobacion,
    }
  }

  // Mapear estado ID a status del frontend
  private mapEstadoToStatus(estadoId: number): "approved" | "pending" | "rejected" {
    switch (estadoId) {
      case 1:
        return "pending" // Pendiente
      case 2:
        return "approved" // Aprobado
      case 3:
        return "rejected" // Rechazado
      default:
        return "pending"
    }
  }

  // Mapear status del frontend a estado ID
  private mapStatusToEstado(status: "approved" | "pending" | "rejected"): number {
    switch (status) {
      case "pending":
        return 1
      case "approved":
        return 2
      case "rejected":
        return 3
      default:
        return 1
    }
  }

  // Formatear fecha
  private formatDate(fecha?: string): string {
    if (!fecha) return new Date().toLocaleDateString()
    return new Date(fecha).toLocaleDateString()
  }

  // Calcular estadísticas
  calculateStats(trabajos: Work[]): WorkStats {
    const total = trabajos.length
    const approved = trabajos.filter((t) => t.status === "approved").length
    const pending = trabajos.filter((t) => t.status === "pending").length
    const rejected = trabajos.filter((t) => t.status === "rejected").length
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0

    return {
      total,
      approved,
      pending,
      rejected,
      approvalRate,
    }
  }
}

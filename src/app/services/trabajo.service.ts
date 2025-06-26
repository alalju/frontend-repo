import { Injectable, inject } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import { ConfigService } from "./config.service"

export interface TrabajoDTO {
  id?: number
  titulo: string
  resumen: string
  semestre: number
  publicado?: boolean
  fechaEnvio?: string
  fechaAprobacion?: string
  comentariosRevision?: string
  usuarioId: number
  estadoId: number
  materiaId?: number
  carreraId?: number
  archivoPdfOriginal?: string
  codigoFuenteOriginal?: string
}

@Injectable({
  providedIn: "root",
})
export class TrabajoService {
  private http: HttpClient = inject(HttpClient)
  private config: ConfigService = inject(ConfigService)

  // URLs dinámicas basadas en configuración de microservicios
  private get trabajosUrl(): string {
    return this.config.trabajosService
  }

  private get usuariosUrl(): string {
    return this.config.usuariosService
  }

  private get storageUrl(): string {
    return this.config.storageService
  }

  // Crear un nuevo trabajo
  crearTrabajo(trabajoData: any, pdfFile?: File, codigoFile?: File): Observable<TrabajoDTO> {
    const formData = new FormData()

    // Construir FormData
    formData.append("titulo", trabajoData.titulo)
    formData.append("resumen", trabajoData.resumen)
    formData.append("semestre", trabajoData.semestre.toString())
    formData.append("usuarioId", trabajoData.usuarioId.toString())
    formData.append("estadoId", "1")

    if (trabajoData.carreraId) {
      formData.append("carreraId", trabajoData.carreraId.toString())
    }

    if (trabajoData.materiaId) {
      formData.append("materiaId", trabajoData.materiaId.toString())
    }

    if (pdfFile) {
      formData.append("filePdf", pdfFile, pdfFile.name)
    }

    if (codigoFile) {
      formData.append("fileCodigo", codigoFile, codigoFile.name)
    }

    console.log("🌐 [TRABAJOS] Enviando petición POST a:", this.trabajosUrl)
    console.log("📦 FormData:", {
      titulo: trabajoData.titulo,
      resumen: trabajoData.resumen,
      semestre: trabajoData.semestre,
      usuarioId: trabajoData.usuarioId,
      carreraId: trabajoData.carreraId,
      materiaId: trabajoData.materiaId,
      pdfFile: pdfFile?.name,
      codigoFile: codigoFile?.name,
    })

    return this.http.post<TrabajoDTO>(this.trabajosUrl, formData)
  }

  // Obtener trabajos del usuario
  obtenerTrabajosDelUsuario(usuarioId: number): Observable<TrabajoDTO[]> {
    const url = `${this.trabajosUrl}/usuario/${usuarioId}`
    console.log("🌐 [TRABAJOS] GET:", url)
    return this.http.get<TrabajoDTO[]>(url)
  }

  // Obtener trabajo por ID
  obtenerTrabajoPorId(id: number): Observable<TrabajoDTO> {
    const url = `${this.trabajosUrl}/${id}`
    console.log("🌐 [TRABAJOS] GET:", url)
    return this.http.get<TrabajoDTO>(url)
  }

  // Actualizar trabajo
  actualizarTrabajo(id: number, trabajoData: any, pdfFile?: File, codigoFile?: File): Observable<TrabajoDTO> {
    const formData = new FormData()

    formData.append("titulo", trabajoData.titulo)
    formData.append("resumen", trabajoData.resumen)
    formData.append("semestre", trabajoData.semestre.toString())

    if (trabajoData.carreraId) {
      formData.append("carreraId", trabajoData.carreraId.toString())
    }

    if (trabajoData.materiaId) {
      formData.append("materiaId", trabajoData.materiaId.toString())
    }

    if (pdfFile) {
      formData.append("filePdf", pdfFile, pdfFile.name)
    }

    if (codigoFile) {
      formData.append("fileCodigo", codigoFile, codigoFile.name)
    }

    const url = `${this.trabajosUrl}/${id}`
    console.log("🌐 [TRABAJOS] PUT:", url)
    return this.http.put<TrabajoDTO>(url, formData)
  }

  // Eliminar trabajo
  eliminarTrabajo(id: number, usuarioId: number): Observable<void> {
    const params = new HttpParams().set("usuarioId", usuarioId.toString())
    const url = `${this.trabajosUrl}/${id}`
    console.log("🌐 [TRABAJOS] DELETE:", url)
    return this.http.delete<void>(url, { params })
  }

  // Descargar archivo (podría usar microservicio de storage)
  descargarArchivo(trabajoId: number, tipoArchivo: string, usuarioId: number): Observable<Blob> {
    const params = new HttpParams().set("usuarioId", usuarioId.toString())
    const url = `${this.trabajosUrl}/${trabajoId}/descargar/${tipoArchivo}`
    console.log("🌐 [TRABAJOS] GET Blob:", url)
    return this.http.get(url, {
      params,
      responseType: "blob",
    })
  }

  // Buscar trabajos
  buscarTrabajos(
    usuarioId: number,
    filtros: {
      titulo?: string
      autor?: string
      carreraId?: number
      fechaInicio?: Date
      fechaFin?: Date
    },
  ): Observable<TrabajoDTO[]> {
    let params = new HttpParams()

    if (filtros.titulo) params = params.set("titulo", filtros.titulo)
    if (filtros.autor) params = params.set("autor", filtros.autor)
    if (filtros.carreraId) params = params.set("carreraId", filtros.carreraId.toString())
    if (filtros.fechaInicio) params = params.set("fechaInicio", filtros.fechaInicio.toISOString())
    if (filtros.fechaFin) params = params.set("fechaFin", filtros.fechaFin.toISOString())

    const url = `${this.trabajosUrl}/buscar/${usuarioId}`
    console.log("🌐 [TRABAJOS] GET Search:", url)
    return this.http.get<TrabajoDTO[]>(url, { params })
  }
}

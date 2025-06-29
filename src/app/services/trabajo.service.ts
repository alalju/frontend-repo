import { Injectable, inject } from "@angular/core"
import { HttpClient, HttpParams, type HttpErrorResponse } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { ConfigService } from "./config.service"
import type { TrabajoDTO } from "../models/work.model"

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
    formData.append("estadoId", "1") // Estado inicial: Pendiente

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

    return this.http.post<TrabajoDTO>(this.trabajosUrl, formData).pipe(catchError(this.handleError))
  }

  // Obtener trabajos del usuario
  obtenerTrabajosDelUsuario(usuarioId: number): Observable<TrabajoDTO[]> {
    const url = `${this.trabajosUrl}/usuario/${usuarioId}`
    console.log("🌐 [TRABAJOS] GET:", url)

    return this.http.get<TrabajoDTO[]>(url).pipe(catchError(this.handleError))
  }

  // Obtener trabajos públicos y propios
  obtenerTrabajosPublicosYPropios(usuarioId: number): Observable<TrabajoDTO[]> {
    const url = `${this.trabajosUrl}/publicos-propios/${usuarioId}`
    console.log("🌐 [TRABAJOS] GET:", url)

    return this.http.get<TrabajoDTO[]>(url).pipe(catchError(this.handleError))
  }

  // Obtener trabajo por ID
  obtenerTrabajoPorId(id: number): Observable<TrabajoDTO> {
    const url = `${this.trabajosUrl}/${id}`
    console.log("🌐 [TRABAJOS] GET:", url)

    return this.http.get<TrabajoDTO>(url).pipe(catchError(this.handleError))
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

    return this.http.put<TrabajoDTO>(url, formData).pipe(catchError(this.handleError))
  }

  // Eliminar trabajo
  eliminarTrabajo(id: number, usuarioId: number): Observable<void> {
    const params = new HttpParams().set("usuarioId", usuarioId.toString())
    const url = `${this.trabajosUrl}/${id}`
    console.log("🌐 [TRABAJOS] DELETE:", url)

    return this.http.delete<void>(url, { params }).pipe(catchError(this.handleError))
  }

  // Descargar archivo
  descargarArchivo(trabajoId: number, tipoArchivo: string, usuarioId: number): Observable<Blob> {
    const params = new HttpParams().set("usuarioId", usuarioId.toString());
    const url = `${this.trabajosUrl}/${trabajoId}/descargar/${tipoArchivo}`;
    console.log("🌐 [TRABAJOS] GET Blob:", url);

    return this.http
      .get(url, {
        params,
        responseType: "blob",
      })
      .pipe(catchError(this.handleError));
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

    return this.http.get<TrabajoDTO[]>(url, { params }).pipe(catchError(this.handleError))
  }

  // Obtener trabajos públicos
  obtenerTrabajosPublicos(): Observable<TrabajoDTO[]> {
    const url = `${this.trabajosUrl}/publicos`
    console.log("🌐 [TRABAJOS] GET:", url)

    return this.http.get<TrabajoDTO[]>(url).pipe(catchError(this.handleError))
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ha ocurrido un error desconocido"

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = "Solicitud inválida. Verifica los datos enviados."
          break
        case 401:
          errorMessage = "No autorizado. Inicia sesión nuevamente."
          break
        case 403:
          errorMessage = "No tienes permisos para realizar esta acción."
          break
        case 404:
          errorMessage = "Recurso no encontrado."
          break
        case 500:
          errorMessage = "Error interno del servidor. Intenta más tarde."
          break
        default:
          errorMessage = `Error ${error.status}: ${error.message}`
      }
    }

    console.error("Error en TrabajoService:", error)
    return throwError(() => new Error(errorMessage))
  }
}

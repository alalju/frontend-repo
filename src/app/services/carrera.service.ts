import { Injectable, inject } from "@angular/core"
import { HttpClient, type HttpErrorResponse } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { ConfigService } from "./config.service"
import type { CarreraDTO, CreateCarreraRequest, UpdateCarreraRequest } from "../models/carrera.model"

@Injectable({
  providedIn: "root",
})
export class CarreraService {
  private http: HttpClient = inject(HttpClient)
  private config: ConfigService = inject(ConfigService)

  // Usar la URL del microservicio académico
  private get carrerasUrl(): string {
    return this.config.carrerasService
  }

  // Obtener todas las carreras
  obtenerCarreras(): Observable<CarreraDTO[]> {
    const url = this.carrerasUrl
    console.log("🌐 [CARRERAS] GET:", url)
    return this.http.get<CarreraDTO[]>(url).pipe(catchError(this.handleError))
  }

  // Obtener carrera por ID
  obtenerCarreraPorId(id: number): Observable<CarreraDTO> {
    const url = `${this.carrerasUrl}/${id}`
    console.log("🌐 [CARRERAS] GET:", url)
    return this.http.get<CarreraDTO>(url).pipe(catchError(this.handleError))
  }

  // Crear nueva carrera (si tienes permisos de admin)
  crearCarrera(carrera: CreateCarreraRequest): Observable<CarreraDTO> {
    const url = this.carrerasUrl
    console.log("🌐 [CARRERAS] POST:", url)
    return this.http.post<CarreraDTO>(url, carrera).pipe(catchError(this.handleError))
  }

  // Actualizar carrera (si tienes permisos de admin)
  actualizarCarrera(id: number, carrera: UpdateCarreraRequest): Observable<CarreraDTO> {
    const url = `${this.carrerasUrl}/${id}`
    console.log("🌐 [CARRERAS] PUT:", url)
    return this.http.put<CarreraDTO>(url, carrera).pipe(catchError(this.handleError))
  }

  // Eliminar carrera (si tienes permisos de admin)
  eliminarCarrera(id: number): Observable<void> {
    const url = `${this.carrerasUrl}/${id}`
    console.log("🌐 [CARRERAS] DELETE:", url)
    return this.http.delete<void>(url).pipe(catchError(this.handleError))
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
          errorMessage = "Carrera no encontrada."
          break
        case 409:
          errorMessage = "Ya existe una carrera con ese código."
          break
        case 500:
          errorMessage = "Error interno del servidor. Intenta más tarde."
          break
        default:
          errorMessage = `Error ${error.status}: ${error.message}`
      }
    }

    console.error("Error en CarreraService:", error)
    return throwError(() => new Error(errorMessage))
  }
}

import { Injectable, inject } from "@angular/core"
import { HttpClient, HttpParams, type HttpErrorResponse } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import { catchError, map, tap } from "rxjs/operators"
import { ConfigService } from "./config.service"
import type { TrabajoDTO, UsuarioTrabajoDTO, EstadoDTO, MateriaDTO, CarreraDTO } from "../models/work.model"

// Interfaces para el componente de búsqueda
export interface SearchFilters {
  titulo?: string
  carreraId?: number
  materiaId?: number
  estadoId?: number
  fechaInicio?: Date
  fechaFin?: Date
  page?: number
  size?: number
  sortBy?: string
  sortDir?: "asc" | "desc"
  publicado?: boolean
}

export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

// ✅ Interface para los datos que devuelve la API (estructura plana)
interface TrabajoAPIResponse {
  id: number
  titulo: string
  resumen: string
  archivoPdfSistema?: string
  codigoFuenteSistema?: string
  archivoPdfOriginal?: string
  codigoFuenteOriginal?: string
  fechaEnvio: string
  fechaAprobacion?: string
  publicado: boolean
  semestre: number
  comentariosRevision?: string
  usuarioId: number
  usuarioNombre: string
  estadoId: number
  estadoNombre: string
  materiaId: number
  materiaNombre: string
  carreraId: number
  carreraNombre: string
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

  // ✅ MÉTODO ACTUALIZADO con transformación de datos
  buscarTrabajosPublicos(filtros: SearchFilters): Observable<PagedResponse<TrabajoDTO>> {
    console.log("🔍 [SERVICE] buscarTrabajosPublicos called with filters:", filtros)
    console.log("🧪 aplicarFiltros(): Filtros recibidos:", filtros);


    // Obtener usuarioId del localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")
    const usuarioId = usuario?.id || 0

    console.log("🔍 [SERVICE] Usuario from localStorage:", usuario)
    console.log("🔍 [SERVICE] UsuarioId:", usuarioId)

    const url = `${this.trabajosUrl}/publicos-propios/${usuarioId}`
    console.log("🔍 [SERVICE] Full URL:", url)

    return this.http.get<TrabajoAPIResponse[]>(url).pipe(
      tap((trabajos: TrabajoAPIResponse[]) => {
        console.log("✅ [SERVICE] Raw response from API:", trabajos)
        console.log("✅ [SERVICE] Response type:", typeof trabajos)
        console.log("✅ [SERVICE] Is array:", Array.isArray(trabajos))
        console.log("✅ [SERVICE] Array length:", trabajos?.length || 0)

        if (trabajos && trabajos.length > 0) {
          console.log("✅ [SERVICE] First work sample (raw):", trabajos[0])
        }
      }),
      map((trabajosAPI: TrabajoAPIResponse[]) => {
        console.log("🔄 [SERVICE] Starting data transformation...")

        // Verificar que trabajos sea un array
        if (!Array.isArray(trabajosAPI)) {
          console.error("❌ [SERVICE] Response is not an array:", trabajosAPI)
          trabajosAPI = []
        }

        // ✅ TRANSFORMAR datos de API a estructura esperada por el frontend
        const trabajosTransformados: TrabajoDTO[] = trabajosAPI.map((trabajoAPI) => {
          // Separar nombre completo en nombre y apellido
          const nombreCompleto = trabajoAPI.usuarioNombre || ""
          const partesNombre = nombreCompleto.split(" ")
          const nombre = partesNombre[0] || ""
          const apellido = partesNombre.slice(1).join(" ") || ""

          const trabajoTransformado: TrabajoDTO = {
            id: trabajoAPI.id,
            titulo: trabajoAPI.titulo,
            resumen: trabajoAPI.resumen,
            archivoPdfSistema: trabajoAPI.archivoPdfSistema,
            codigoFuenteSistema: trabajoAPI.codigoFuenteSistema,
            archivoPdfOriginal: trabajoAPI.archivoPdfOriginal,
            codigoFuenteOriginal: trabajoAPI.codigoFuenteOriginal,
            fechaEnvio: trabajoAPI.fechaEnvio,
            fechaAprobacion: trabajoAPI.fechaAprobacion,
            publicado: trabajoAPI.publicado,
            semestre: trabajoAPI.semestre,
            comentariosRevision: trabajoAPI.comentariosRevision,
            // ✅ Usar el tipo específico para trabajos
            usuario: {
              id: trabajoAPI.usuarioId,
              nombre: nombre,
              apellido: apellido,
              // correo es opcional, no lo incluimos si no está disponible
            } as UsuarioTrabajoDTO,
            estado: {
              id: trabajoAPI.estadoId,
              nombre: trabajoAPI.estadoNombre,
            } as EstadoDTO,
            materia: {
              id: trabajoAPI.materiaId,
              nombre: trabajoAPI.materiaNombre,
            } as MateriaDTO,
            carrera: {
              id: trabajoAPI.carreraId,
              nombre: trabajoAPI.carreraNombre,
            } as CarreraDTO,
          }

          return trabajoTransformado
        })

        console.log("✅ [SERVICE] Transformed works:", trabajosTransformados)
        if (trabajosTransformados.length > 0) {
          console.log("✅ [SERVICE] First transformed work sample:", trabajosTransformados[0])
        }

        // Aplicar filtros en el frontend
        console.log("🔄 [SERVICE] Applying filters...")
        console.log("🧪 aplicarFiltros(): Filtros recibidos:", filtros);
        let trabajosFiltrados = this.aplicarFiltros(trabajosTransformados, filtros)
        console.log("✅ [SERVICE] After filtering:", trabajosFiltrados.length, "works")

        // Aplicar ordenamiento
        console.log("🔄 [SERVICE] Applying sorting...")
        trabajosFiltrados = this.aplicarOrdenamiento(trabajosFiltrados, filtros.sortBy, filtros.sortDir)
        console.log("✅ [SERVICE] After sorting:", trabajosFiltrados.length, "works")

        // Aplicar paginación
        console.log("🔄 [SERVICE] Applying pagination...")
        const paginaActual = filtros.page || 0
        const tamañoPagina = filtros.size || 12
        const inicio = paginaActual * tamañoPagina
        const fin = inicio + tamañoPagina

        console.log("🔄 [SERVICE] Pagination params:", { paginaActual, tamañoPagina, inicio, fin })

        const trabajosPaginados = trabajosFiltrados.slice(inicio, fin)
        console.log("✅ [SERVICE] After pagination:", trabajosPaginados.length, "works")

        // Crear respuesta paginada
        const response: PagedResponse<TrabajoDTO> = {
          content: trabajosPaginados,
          totalElements: trabajosFiltrados.length,
          totalPages: Math.ceil(trabajosFiltrados.length / tamañoPagina),
          number: paginaActual,
          size: tamañoPagina,
          first: paginaActual === 0,
          last: paginaActual >= Math.ceil(trabajosFiltrados.length / tamañoPagina) - 1,
        }

        console.log("✅ [SERVICE] Final response:", response)
        return response
      }),
      catchError((error) => {
        console.error("❌ [SERVICE] HTTP Error:", error)
        return this.handleError(error)
      }),
    )
  }

  // ✅ MÉTODO AUXILIAR para aplicar filtros
  private aplicarFiltros(trabajos: TrabajoDTO[], filtros: SearchFilters): TrabajoDTO[] {
    console.log("🔍 [FILTER] Starting filter process with", trabajos.length, "works")
    console.log("🔍 [FILTER] Filters to apply:", filtros)

    const resultado = trabajos.filter((trabajo, index) => {
      console.log(`🔍 [FILTER] Processing work ${index + 1}:`, trabajo.titulo)

      // Filtro por título
      if (filtros.titulo && filtros.titulo.trim()) {
        const tituloMatch = trabajo.titulo?.toLowerCase().includes(filtros.titulo.toLowerCase())
        console.log(`  - Title filter: "${filtros.titulo}" -> ${tituloMatch}`)
        if (!tituloMatch) {
          console.log(`  ❌ Work rejected by title filter`)
          return false
        }
      }

      // Filtro por carrera
      if (filtros.carreraId && filtros.carreraId !== undefined) {
        const carreraMatch = trabajo.carrera?.id === filtros.carreraId
        console.log(`  - Career filter: ${filtros.carreraId} -> ${carreraMatch} (work career: ${trabajo.carrera?.id})`)
        if (!carreraMatch) {
          console.log(`  ❌ Work rejected by career filter`)
          return false
        }
      }

      // Filtro por materia
      if (filtros.materiaId && filtros.materiaId !== undefined) {
        const materiaMatch = trabajo.materia?.id === filtros.materiaId
        console.log(`  - Subject filter: ${filtros.materiaId} -> ${materiaMatch}`)
        if (!materiaMatch) {
          console.log(`  ❌ Work rejected by subject filter`)
          return false
        }
      }

      // Filtro por estado
      if (filtros.estadoId && filtros.estadoId !== undefined) {
        const estadoMatch = trabajo.estado?.id === filtros.estadoId
        console.log(`  - Status filter: ${filtros.estadoId} -> ${estadoMatch}`)
        if (!estadoMatch) {
          console.log(`  ❌ Work rejected by status filter`)
          return false
        }
      }

      // Filtro por fecha de inicio
      if (filtros.fechaInicio) {
        const fechaTrabajo = new Date(trabajo.fechaEnvio || "")
        const fechaMatch = fechaTrabajo >= filtros.fechaInicio
        console.log(`  - Start date filter: ${filtros.fechaInicio} -> ${fechaMatch}`)
        if (!fechaMatch) {
          console.log(`  ❌ Work rejected by start date filter`)
          return false
        }
      }

      // Filtro por fecha de fin
      if (filtros.fechaFin) {
        const fechaTrabajo = new Date(trabajo.fechaEnvio || "")
        const fechaMatch = fechaTrabajo <= filtros.fechaFin
        console.log(`  - End date filter: ${filtros.fechaFin} -> ${fechaMatch}`)
        if (!fechaMatch) {
          console.log(`  ❌ Work rejected by end date filter`)
          return false
        }
      }

      // Filtro por publicado - Mostrar todos por defecto
      if (filtros.publicado !== undefined && filtros.publicado) {
        const publicadoMatch = trabajo.publicado === true
        console.log(
          `  - Published filter: ${filtros.publicado} -> ${publicadoMatch} (work published: ${trabajo.publicado})`,
        )
        if (!publicadoMatch) {
          console.log(`  ❌ Work rejected by published filter`)
          return false
        }
      }

      console.log(`  ✅ Work passed all filters`)
      return true
    })

    console.log("✅ [FILTER] Filter result:", resultado.length, "works passed")
    return resultado
  }

  // ✅ MÉTODO AUXILIAR para aplicar ordenamiento
  private aplicarOrdenamiento(trabajos: TrabajoDTO[], sortBy?: string, sortDir?: "asc" | "desc"): TrabajoDTO[] {
    if (!sortBy) {
      console.log("🔍 [SORT] No sorting applied")
      return trabajos
    }

    console.log("🔍 [SORT] Sorting by:", sortBy, "direction:", sortDir)

    return trabajos.sort((a, b) => {
      let valorA: any
      let valorB: any

      switch (sortBy) {
        case "fechaEnvio":
          valorA = new Date(a.fechaEnvio || "")
          valorB = new Date(b.fechaEnvio || "")
          break
        case "titulo":
          valorA = a.titulo?.toLowerCase() || ""
          valorB = b.titulo?.toLowerCase() || ""
          break
        case "carrera":
          valorA = a.carrera?.nombre?.toLowerCase() || ""
          valorB = b.carrera?.nombre?.toLowerCase() || ""
          break
        case "usuario.apellido":
          valorA = a.usuario?.apellido?.toLowerCase() || ""
          valorB = b.usuario?.apellido?.toLowerCase() || ""
          break
        default:
          valorA = a[sortBy as keyof TrabajoDTO] || ""
          valorB = b[sortBy as keyof TrabajoDTO] || ""
      }

      if (valorA < valorB) {
        return sortDir === "desc" ? 1 : -1
      }
      if (valorA > valorB) {
        return sortDir === "desc" ? -1 : 1
      }
      return 0
    })
  }

  // Resto de métodos sin cambios...
  crearTrabajo(trabajoData: any, pdfFile?: File, codigoFile?: File): Observable<TrabajoDTO> {
    const formData = new FormData()

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
    return this.http.post<TrabajoDTO>(this.trabajosUrl, formData).pipe(catchError(this.handleError))
  }

  obtenerTrabajosDelUsuario(usuarioId: number): Observable<TrabajoDTO[]> {
    const url = `${this.trabajosUrl}/usuario/${usuarioId}`
    console.log("🌐 [TRABAJOS] GET:", url)
    return this.http.get<TrabajoDTO[]>(url).pipe(catchError(this.handleError))
  }

  obtenerTrabajosPublicosYPropios(usuarioId: number): Observable<TrabajoDTO[]> {
    const url = `${this.trabajosUrl}/publicos-propios/${usuarioId}`
    console.log("🌐 [TRABAJOS] GET:", url)
    return this.http.get<TrabajoDTO[]>(url).pipe(catchError(this.handleError))
  }

  obtenerTrabajoPorId(id: number): Observable<TrabajoDTO> {
    const url = `${this.trabajosUrl}/${id}`
    console.log("🌐 [TRABAJOS] GET:", url)
    return this.http.get<TrabajoDTO>(url).pipe(catchError(this.handleError))
  }

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

  eliminarTrabajo(id: number, usuarioId: number): Observable<void> {
    const params = new HttpParams().set("usuarioId", usuarioId.toString())
    const url = `${this.trabajosUrl}/${id}`
    console.log("🌐 [TRABAJOS] DELETE:", url)
    return this.http.delete<void>(url, { params }).pipe(catchError(this.handleError))
  }

  descargarArchivo(trabajoId: number, tipoArchivo: string, usuarioId = 0): Observable<Blob> {
    const params = usuarioId > 0 ? new HttpParams().set("usuarioId", usuarioId.toString()) : new HttpParams()
    const url = `${this.trabajosUrl}/descargar/${trabajoId}/${tipoArchivo}`
    console.log("🌐 [TRABAJOS] GET Blob:", url)

    return this.http
      .get(url, {
        params,
        responseType: "blob",
      })
      .pipe(catchError(this.handleError))
  }

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

  obtenerTrabajosPublicos(): Observable<TrabajoDTO[]> {
    const url = `${this.trabajosUrl}/publicos`
    console.log("🌐 [TRABAJOS] GET:", url)
    return this.http.get<TrabajoDTO[]>(url).pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "Ha ocurrido un error desconocido"

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`
    } else {
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

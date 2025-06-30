import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, of } from "rxjs"
import { ConfigService } from "./config.service"

export interface CarreraDTO {
  id: number
  nombre: string
}

export interface MateriaDTO {
  id: number
  nombre: string
  carreraId: number
}

@Injectable({
  providedIn: "root",
})
export class AcademicoService {
  private http: HttpClient = inject(HttpClient)
  private config: ConfigService = inject(ConfigService)

  private get carrerasUrl(): string {
    return this.config.carrerasService
  }

  private get materiasUrl(): string {
    return this.config.materiasService
  }

  // MÉTODO ORIGINAL - NO TOCAR
  obtenerCarreras(): Observable<CarreraDTO[]> {
    console.log("🌐 [ACADEMICO] GET Carreras:", this.carrerasUrl)
    return this.http.get<CarreraDTO[]>(this.carrerasUrl)
  }

  // MÉTODO ORIGINAL - NO TOCAR
  obtenerMateriasPorCarrera(carreraId: number): Observable<MateriaDTO[]> {
    const url = `${this.materiasUrl}/carrera/${carreraId}`
    console.log("🌐 [ACADEMICO] GET Materias:", url)

    // Datos estáticos mientras no tengas endpoint de materias
    const materiasPorCarrera: { [key: number]: MateriaDTO[] } = {
      1: [
        { id: 1, nombre: "Programación Web", carreraId: 1 },
        { id: 2, nombre: "Base de Datos", carreraId: 1 },
        { id: 3, nombre: "Ingeniería de Software", carreraId: 1 },
        { id: 4, nombre: "Desarrollo Móvil", carreraId: 1 },
      ],
      2: [
        { id: 5, nombre: "Silvicultura", carreraId: 2 },
        { id: 6, nombre: "Manejo Forestal", carreraId: 2 },
        { id: 7, nombre: "Ecología Forestal", carreraId: 2 },
      ],
      3: [
        { id: 8, nombre: "Gestión Turística", carreraId: 3 },
        { id: 9, nombre: "Marketing Turístico", carreraId: 3 },
        { id: 10, nombre: "Patrimonio Cultural", carreraId: 3 },
      ],
      4: [
        { id: 11, nombre: "Botánica", carreraId: 4 },
        { id: 12, nombre: "Zoología", carreraId: 4 },
        { id: 13, nombre: "Genética", carreraId: 4 },
      ],
      5: [
        { id: 14, nombre: "Impacto Ambiental", carreraId: 5 },
        { id: 15, nombre: "Gestión Ambiental", carreraId: 5 },
        { id: 16, nombre: "Química Ambiental", carreraId: 5 },
      ],
    }

    return of(materiasPorCarrera[carreraId] || [])
  }

  // MÉTODO ORIGINAL - NO TOCAR
  obtenerTodasLasMaterias(): Observable<MateriaDTO[]> {
    console.log("🌐 [ACADEMICO] GET Todas las materias:", this.materiasUrl)
    return this.http.get<MateriaDTO[]>(this.materiasUrl)
  }

  // MÉTODOS NUEVOS SOLO PARA COMPATIBILIDAD CON EL COMPONENTE DE BÚSQUEDA
  getCarreras(): Observable<CarreraDTO[]> {
    return this.obtenerCarreras()
  }

  getMateriasPorCarrera(carreraId: number): Observable<MateriaDTO[]> {
    return this.obtenerMateriasPorCarrera(carreraId)
  }
}

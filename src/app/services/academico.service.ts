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

  // Obtener carreras desde microservicio académico
  obtenerCarreras(): Observable<CarreraDTO[]> {
    console.log("🌐 [ACADEMICO] GET Carreras:", this.carrerasUrl)

    // Si tienes el microservicio académico disponible:
    // return this.http.get<CarreraDTO[]>(this.carrerasUrl)

    // Mientras tanto, datos estáticos:
    const carreras: CarreraDTO[] = [
      { id: 1, nombre: "Ing. Desarrollo de Software" },
      { id: 2, nombre: "Ing. Forestal" },
      { id: 3, nombre: "Lic. Administración Turística" },
      { id: 4, nombre: "Lic. Biología" },
      { id: 5, nombre: "Lic. Ciencias Ambientales" },
    ]
    return of(carreras)
  }

  // Obtener materias por carrera
  obtenerMateriasPorCarrera(carreraId: number): Observable<MateriaDTO[]> {
    const url = `${this.materiasUrl}/carrera/${carreraId}`
    console.log("🌐 [ACADEMICO] GET Materias:", url)

    // Si tienes el microservicio académico disponible:
    // return this.http.get<MateriaDTO[]>(url)

    // Mientras tanto, datos estáticos:
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
    }

    return of(materiasPorCarrera[carreraId] || [])
  }

  // Obtener todas las materias
  obtenerTodasLasMaterias(): Observable<MateriaDTO[]> {
    console.log("🌐 [ACADEMICO] GET Todas las materias:", this.materiasUrl)
    return this.http.get<MateriaDTO[]>(this.materiasUrl)
  }
}
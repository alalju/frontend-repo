import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, of } from "rxjs"

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
export class CarreraService {
  private readonly API_URL = "http://localhost:8081/api/alumnos"

  constructor(private http: HttpClient) {}

  // Si tienes endpoints para carreras, úsalos. Si no, datos estáticos por ahora
  obtenerCarreras(): Observable<CarreraDTO[]> {
    // Opción 1: Si tienes endpoint
    // return this.http.get<CarreraDTO[]>(`${this.API_URL}/carreras`)

    // Opción 2: Datos estáticos mientras no tengas el endpoint
    const carreras: CarreraDTO[] = [
      { id: 1, nombre: "Ing. Desarrollo de Software" },
      { id: 2, nombre: "Ing. Forestal" },
      { id: 3, nombre: "Lic. Administración Turística" },
      { id: 4, nombre: "Lic. Biología" },
      { id: 5, nombre: "Lic. Ciencias Ambientales" },
    ]
    return of(carreras)
  }

  obtenerMateriasPorCarrera(carreraId: number): Observable<MateriaDTO[]> {
    // Opción 1: Si tienes endpoint
    // return this.http.get<MateriaDTO[]>(`${this.API_URL}/materias/carrera/${carreraId}`)

    // Opción 2: Datos estáticos por carrera
    const materiasPorCarrera: { [key: number]: MateriaDTO[] } = {
      1: [
        // Ing. Desarrollo de Software
        { id: 1, nombre: "Programación Web", carreraId: 1 },
        { id: 2, nombre: "Base de Datos", carreraId: 1 },
        { id: 3, nombre: "Ingeniería de Software", carreraId: 1 },
        { id: 4, nombre: "Desarrollo Móvil", carreraId: 1 },
      ],
      2: [
        // Ing. Forestal
        { id: 5, nombre: "Silvicultura", carreraId: 2 },
        { id: 6, nombre: "Manejo Forestal", carreraId: 2 },
        { id: 7, nombre: "Ecología Forestal", carreraId: 2 },
      ],
      3: [
        // Lic. Administración Turística
        { id: 8, nombre: "Gestión Turística", carreraId: 3 },
        { id: 9, nombre: "Marketing Turístico", carreraId: 3 },
        { id: 10, nombre: "Patrimonio Cultural", carreraId: 3 },
      ],
    }

    return of(materiasPorCarrera[carreraId] || [])
  }
}
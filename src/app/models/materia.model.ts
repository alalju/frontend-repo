
import type { CarreraDTO } from "./carrera.model" 

export interface MateriaDTO {
  id: number
  nombre: string
  codigo?: string
  carreraId?: number
  carrera?: CarreraDTO
}

export interface CreateMateriaRequest {
  nombre: string
  codigo?: string
  carreraId: number
}

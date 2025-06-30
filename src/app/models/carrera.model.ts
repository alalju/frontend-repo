export interface CarreraDTO {
  id: number
  nombre: string
  codigo: string
}

export interface CreateCarreraRequest {
  nombre: string
  codigo: string
}

export interface UpdateCarreraRequest {
  nombre?: string
  codigo?: string
}

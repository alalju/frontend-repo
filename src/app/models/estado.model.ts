// Modelo para los estados de trabajo
export interface EstadoDTO {
  id: number
  nombre: string
  descripcion?: string
}

export const ESTADOS_TRABAJO = {
  PENDIENTE: 1,
  EN_REVISION: 2,
  APROBADO: 3,
  RECHAZADO: 4,
  PUBLICADO: 5,
} as const

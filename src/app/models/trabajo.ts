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
  status: string; 
}

export interface WorkStats {
  total: number
  approved: number
  pending: number
  rejected: number
  approvalRate: number
}

export interface WorkFilter {
  search?: string
  status?: string
  subject?: string
  career?: string
  dateFrom?: string
  dateTo?: string
}

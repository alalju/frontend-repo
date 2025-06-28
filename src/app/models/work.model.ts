export interface Work {
  id: number
  title: string
  summary: string
  author: string
  career: string
  subject: string
  semester: number
  date: string
  status: "approved" | "pending" | "rejected"
  pdfFile?: string
  sourceCode?: string
  updatedAt: Date
  comentariosRevision?: string
  fechaAprobacion?: string
  // Campos adicionales para mapear con el backend
  usuarioId?: number
  estadoId?: number
  materiaId?: number
  carreraId?: number
}

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
  // Campos adicionales para el frontend
  autor?: string
  carrera?: string
  materia?: string
  estado?: string
}

export interface WorkStats {
  total: number
  approved: number
  pending: number
  rejected: number
  approvalRate: number
}

export interface WorkFilter {
  search: string
  status: string
  subject: string
  career: string
  dateFrom?: string
  dateTo?: string
}

export interface UsuarioDTO {
  id?: number
  nombre: string
  correo: string
  contraseña?: string
  activo?: boolean
  fechaRegistro?: string
  telefono?: string
  numeroControl?: string
  rolId?: number
}

export interface EstadoTrabajoDTO {
  id: number
  nombre: string
  descripcion?: string
}

export interface CarreraDTO {
  id: number
  nombre: string
  codigo?: string
}

export interface MateriaDTO {
  id: number
  nombre: string
  codigo?: string
  carreraId?: number
}

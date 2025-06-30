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
  createdAt: Date
  comentariosRevision?: string
  fechaAprobacion?: string
  // Campos adicionales para mapear con el backend
  usuarioId?: number
  estadoId?: number
  materiaId?: number
  carreraId?: number
  publicado?: boolean
}


// ✅ INTERFACES QUE NECESITAN OTROS COMPONENTES - NO TOCAR
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

// ✅ INTERFACES DE SOPORTE
export interface UsuarioDTO {
  id?: number
  nombre: string
  apellido: string
  correo: string
  numeroControl?: string
  telefono?: string
  activo?: boolean
  fechaRegistro?: string
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

// Tipo específico para usuario en el contexto de trabajos
export interface UsuarioTrabajoDTO {
  id: number
  nombre: string
  apellido: string
  correo?: string // Opcional ya que no siempre está disponible
}

// Tipos para otros objetos relacionados
export interface EstadoDTO {
  id: number
  nombre: string
}

export interface MateriaDTO {
  id: number
  nombre: string
}

export interface CarreraDTO {
  id: number
  nombre: string
}

export interface TrabajoDTO {
  id?: number
  titulo: string
  resumen: string
  archivoPdfSistema?: string
  codigoFuenteSistema?: string
  archivoPdfOriginal?: string
  codigoFuenteOriginal?: string
  fechaEnvio?: string
  fechaAprobacion?: string
  publicado?: boolean
  semestre?: number
  comentariosRevision?: string

  // ✅ Usar el tipo específico para trabajos
  usuario?: UsuarioTrabajoDTO
  estado?: EstadoDTO
  materia?: MateriaDTO
  carrera?: CarreraDTO
}

// Tipos para formularios y creación
export interface CreateTrabajoDTO {
  titulo: string
  resumen: string
  semestre: number
  usuarioId: number
  carreraId?: number
  materiaId?: number
}

export interface UpdateTrabajoDTO extends Partial<CreateTrabajoDTO> {
  id: number
}

// Tipos para filtros y búsqueda
export interface TrabajoFilters {
  titulo?: string
  autor?: string
  carrera?: string
  estado?: string
  fechaInicio?: Date
  fechaFin?: Date
}

// Tipos para estadísticas
export interface TrabajoStats {
  total: number
  pendientes: number
  aprobados: number
  rechazados: number
  publicados: number
}

// Tipos para respuestas paginadas
export interface PagedTrabajoResponse {
  content: TrabajoDTO[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import type { Work } from "../models/work.model"

export interface WorkFilter {
  search: string
  status: string
  subject: string
  career: string
  dateFrom?: string
  dateTo?: string
}
export interface SearchFilter {
  query: string
  career: string
  dateFrom?: string
  dateTo?: string
}
export interface WorkStats {
  total: number
  approved: number
  pending: number
  rejected: number
  approvalRate: number
}



@Injectable({
  providedIn: "root",
})
export class StudentWorkManagementService {
  private worksSubject = new BehaviorSubject<Work[]>([])
  public works$ = this.worksSubject.asObservable()

  private mockWorks: Work[] = [
    {
      id: 1,
      title: "Sistema de Gestión Universitaria",
      author: "Juan Pérez",
      career: "Ing. Desarrollo de Software",
      subject: "Programación Web",
      semester: "8vo",
      summary:
        "Sistema completo para gestión académica con funcionalidades de administración de usuarios, cursos y calificaciones.",
      status: "approved",
      date: "2024-01-15",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      pdfFile: "sistema-gestion.pdf",
      sourceCode: "sistema-gestion-code.zip",
    },
    {
      id: 2,
      title: "Análisis de Algoritmos de Ordenamiento",
      author: "Juan Pérez",
      career: "Ing. Desarrollo de Software",
      subject: "Estructuras de Datos",
      semester: "6to",
      summary: "Comparación exhaustiva de diferentes algoritmos de ordenamiento y su complejidad temporal.",
      status: "pending",
      date: "2024-01-10",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
      pdfFile: "algoritmos-ordenamiento.pdf",
    },
    {
      id: 3,
      title: "Base de Datos para E-commerce",
      author: "Juan Pérez",
      career: "Ing. Desarrollo de Software",
      subject: "Base de Datos",
      semester: "7mo",
      summary: "Diseño e implementación de una base de datos relacional para sistema de comercio electrónico.",
      status: "rejected",
      date: "2024-01-05",
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-05"),
      pdfFile: "bd-ecommerce.pdf",
      sourceCode: "bd-ecommerce-scripts.zip",
    },
    {
      id: 4,
      title: "Aplicación Móvil de Turismo",
      author: "Juan Pérez",
      career: "Ing. Desarrollo de Software",
      subject: "Desarrollo Móvil",
      semester: "8vo",
      summary: "Aplicación móvil para promoción turística con geolocalización y realidad aumentada.",
      status: "approved",
      date: "2023-12-20",
      createdAt: new Date("2023-12-20"),
      updatedAt: new Date("2023-12-20"),
      pdfFile: "app-turismo.pdf",
      sourceCode: "app-turismo-code.zip",
    },
    {
      id: 5,
      title: "Sistema de Inventario",
      author: "Juan Pérez",
      career: "Ing. Desarrollo de Software",
      subject: "Ingeniería de Software",
      semester: "7mo",
      summary: "Sistema web para control de inventario con reportes y alertas automáticas.",
      status: "pending",
      date: "2024-01-08",
      createdAt: new Date("2024-01-08"),
      updatedAt: new Date("2024-01-08"),
      pdfFile: "sistema-inventario.pdf",
    },
  ]

  constructor() {
    this.worksSubject.next(this.mockWorks)
  }

  getWorkStats(): WorkStats {
    const total = this.mockWorks.length
    const approved = this.mockWorks.filter(w => w.status === "approved").length
    const pending = this.mockWorks.filter(w => w.status === "pending").length
    const rejected = this.mockWorks.filter(w => w.status === "rejected").length

    const approvalRate = total > 0 ? (approved / total) * 100 : 0

    return { total, approved, pending, rejected, approvalRate }
  }

  getMyWorks(): Observable<Work[]> {
    return this.works$
  }

  getWorkById(id: number): Work | undefined {
    return this.mockWorks.find((work) => work.id === id)
  }

  filterWorks(filter: WorkFilter): Work[] {
    return this.mockWorks.filter((work) => {
      const matchesSearch =
        !filter.search ||
        work.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        work.subject.toLowerCase().includes(filter.search.toLowerCase())

      const matchesStatus = !filter.status || work.status === filter.status
      const matchesSubject = !filter.subject || work.subject === filter.subject
      const matchesCareer = !filter.career || work.career === filter.career

      return matchesSearch && matchesStatus && matchesSubject && matchesCareer
    })
  }

  deleteWork(id: number): void {
    const index = this.mockWorks.findIndex((work) => work.id === id)
    if (index !== -1) {
      this.mockWorks.splice(index, 1)
      this.worksSubject.next([...this.mockWorks])
    }
  }

  updateWork(updatedWork: Work): void {
    const index = this.mockWorks.findIndex((work) => work.id === updatedWork.id)
    if (index !== -1) {
      this.mockWorks[index] = { ...updatedWork, updatedAt: new Date() }
      this.worksSubject.next([...this.mockWorks])
    }
  }
  
  getSearchSuggestions(query: string): Observable<string[]> {
  const suggestions = this.mockWorks
    .filter(work => work.title.toLowerCase().includes(query.toLowerCase()))
    .map(work => work.title)
    .filter((value, index, self) => self.indexOf(value) === index) // eliminar duplicados

  return new BehaviorSubject(suggestions).asObservable()
}

searchWorks(filters: SearchFilter, page: number, pageSize: number, sortBy: string): Observable<SearchResult> {
  let filtered = this.filterWorks({
    search: filters.query,
    status: "", // puedes adaptar si agregas filtros por estado
    subject: "",
    career: filters.career,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo
  })

  // Ordenamiento
  if (sortBy === "date") {
    filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize

  const paginated = filtered.slice(start, end)

  const result: SearchResult = {
    works: paginated,
    total,
    page,
    totalPages
  }

  return new BehaviorSubject(result).asObservable()
}

getCareers(): string[] {
  return Array.from(new Set(this.mockWorks.map(work => work.career)))
}



}
export interface SearchResult {
  works: Work[]
  total: number
  page: number
  totalPages: number
}
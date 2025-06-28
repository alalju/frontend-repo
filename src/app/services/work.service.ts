import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Work } from '../models/work.model'
import { ConfigService } from './config.service'
import { BehaviorSubject, type Observable } from "rxjs"


@Injectable({
  providedIn: 'root',
})
export class WorkService {
    private worksSubject = new BehaviorSubject<Work[]>([])
    public works$ = this.worksSubject.asObservable()

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  // Obtener trabajos públicos
  getPublicWorks(): Observable<Work[]> {
    const url = `${this.configService.trabajosService}/publicos`
    return this.http.get<Work[]>(url)
  }

  // Obtener trabajos públicos y propios de un usuario
  getUserWorks(usuarioId: number): Observable<Work[]> {
    const url = `${this.configService.trabajosService}/publicos-propios/${usuarioId}`;
    return this.http.get<Work[]>(url);
  }

  // Buscar trabajos con filtros
  searchWorks(
    usuarioId: number,
    filters: { title?: string; author?: string; carreraId?: number; fechaInicio?: string; fechaFin?: string }
  ): Observable<Work[]> {
    const url = `${this.configService.trabajosService}/buscar/${usuarioId}`
    let params = new HttpParams()
    if (filters.title) params = params.set('titulo', filters.title)
    if (filters.author) params = params.set('autor', filters.author)
    if (filters.carreraId) params = params.set('carreraId', filters.carreraId.toString())
    if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio)
    if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin)
    
    return this.http.get<Work[]>(url, { params })
  }

  // Obtener trabajo por ID
  getWorkById(id: number): Observable<Work> {
    const url = `${this.configService.trabajosService}/${id}`
    return this.http.get<Work>(url)
  }

  // Descargar archivo (PDF o ZIP)
  downloadFile(trabajoId: number, tipoArchivo: 'pdf' | 'zip', usuarioId: number): Observable<Blob> {
    const url = `${this.configService.trabajosService}/${trabajoId}/descargar/${tipoArchivo}?usuarioId=${usuarioId}`
    return this.http.get(url, { responseType: 'blob' })
  }

  updateWorkStatus(workId: number, status: "approved" | "rejected"): void {
    const works = this.worksSubject.value
    const workIndex = works.findIndex((w) => w.id === workId)
    if (workIndex !== -1) {
      works[workIndex].status = status
      works[workIndex].updatedAt = new Date()
      this.worksSubject.next([...works])
    }
  }

}

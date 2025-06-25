import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import type { Work, WorkStats } from "../models/work.model"

@Injectable({
  providedIn: "root",
})
export class WorkService {
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
      summary: "Sistema completo para gestión académica",
      status: "approved",
      date: "2024-01-15",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: 2,
      title: "Análisis Forestal Sostenible",
      author: "María García",
      career: "Ing. Forestal",
      subject: "Ecología Forestal",
      semester: "6to",
      summary: "Estudio sobre sostenibilidad forestal",
      status: "pending",
      date: "2024-01-14",
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-14"),
    },
    {
      id: 3,
      title: "Plan de Marketing Turístico",
      author: "Carlos López",
      career: "Lic. Administración Turística",
      subject: "Marketing Turístico",
      semester: "7mo",
      summary: "Estrategias de marketing para destinos turísticos",
      status: "rejected",
      date: "2024-01-13",
      createdAt: new Date("2024-01-13"),
      updatedAt: new Date("2024-01-13"),
    },
  ]

  constructor() {
    this.worksSubject.next(this.mockWorks)
  }

  getWorks(): Observable<Work[]> {
    return this.works$
  }

  getWorkStats(): Observable<WorkStats> {
    return new BehaviorSubject<WorkStats>({
      total: 248,
      approved: 195,
      pending: 42,
      rejected: 11,
    }).asObservable()
  }

  getWorksByCareer(): Observable<any[]> {
    return new BehaviorSubject([
      { career: "Ing. Software", approved: 45, pending: 12, rejected: 3 },
      { career: "Ing. Forestal", approved: 32, pending: 8, rejected: 2 },
      { career: "Lic. Turística", approved: 28, pending: 6, rejected: 1 },
      { career: "Lic. Biología", approved: 35, pending: 9, rejected: 2 },
      { career: "Lic. C. Ambientales", approved: 25, pending: 5, rejected: 1 },
    ]).asObservable()
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

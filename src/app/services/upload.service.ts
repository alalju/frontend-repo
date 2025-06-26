import { Injectable } from "@angular/core"
import { BehaviorSubject,  Observable } from "rxjs"

export interface UploadProgress {
  percentage: number
  status: "uploading" | "completed" | "error"
  message?: string
}

@Injectable({
  providedIn: "root",
})
export class UploadService {
  private uploadProgressSubject = new BehaviorSubject<UploadProgress>({ percentage: 0, status: "completed" })
  public uploadProgress$ = this.uploadProgressSubject.asObservable()

  simulateUpload(file: File): Observable<UploadProgress> {
    return new Observable((observer) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          observer.next({ percentage: progress, status: "completed", message: "Archivo subido exitosamente" })
          observer.complete()
          clearInterval(interval)
        } else {
          observer.next({ percentage: Math.floor(progress), status: "uploading" })
        }
      }, 200)
    })
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ["application/pdf", "application/zip", "application/x-zip-compressed"]

    if (file.size > maxSize) {
      return { valid: false, error: "El archivo no puede ser mayor a 10MB" }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "Solo se permiten archivos PDF y ZIP" }
    }

    return { valid: true }
  }
}

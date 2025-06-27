import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  // Configuración de microservicios
  private readonly microservices = {
    // Microservicio de trabajos académicos
    trabajos: {
      baseUrl: "http://localhost:8081",
      contextPath: "/api/alumnos",
      endpoints: {
        trabajos: "/trabajos",
        usuarios: "/usuarios",
        estados: "/estados",
      },
    },
    // Microservicio de gestión académica
    academico: {
      baseUrl: "http://localhost:8082",
      contextPath: "/api/academico",
      endpoints: {
        carreras: "/carreras",
        materias: "/materias",
        semestres: "/semestres",
      },
    },
    // Microservicio de autenticación (para futuro)
    auth: {
      baseUrl: "http://localhost:8083",
      contextPath: "/api/auth",
      endpoints: {
        login: "/login",
        register: "/register",
        profile: "/profile",
      },
    },
    // Microservicio de archivos/storage
    storage: {
      baseUrl: "http://localhost:8084",
      contextPath: "/api/storage",
      endpoints: {
        upload: "/upload",
        download: "/download",
        delete: "/delete",
      },
    },
  }

  // Getters para URLs completas
  get trabajosService(): string {
    const service = this.microservices.trabajos
    return `${service.baseUrl}${service.contextPath}${service.endpoints.trabajos}`
  }

  get carrerasService(): string {
    const service = this.microservices.academico
    return `${service.baseUrl}${service.contextPath}${service.endpoints.carreras}`
  }

  get materiasService(): string {
    const service = this.microservices.academico
    return `${service.baseUrl}${service.contextPath}${service.endpoints.materias}`
  }

  get usuariosService(): string {
    const service = this.microservices.trabajos
    return `${service.baseUrl}${service.contextPath}${service.endpoints.usuarios}`
  }

  get storageService(): string {
    const service = this.microservices.storage
    return `${service.baseUrl}${service.contextPath}${service.endpoints.upload}`
  }

  // Método para obtener URL personalizada
  getServiceUrl(serviceName: keyof typeof this.microservices, endpoint: string): string {
    const service = this.microservices[serviceName]
    return `${service.baseUrl}${service.contextPath}${endpoint}`
  }

  // Método para verificar el estado de los servicios
  getHealthCheckUrls(): { [key: string]: string } {
    return {
      trabajos: `${this.microservices.trabajos.baseUrl}${this.microservices.trabajos.contextPath}/health`,
      academico: `${this.microservices.academico.baseUrl}${this.microservices.academico.contextPath}/health`,
      auth: `${this.microservices.auth.baseUrl}${this.microservices.auth.contextPath}/health`,
      storage: `${this.microservices.storage.baseUrl}${this.microservices.storage.contextPath}/health`,
    }
  }
}
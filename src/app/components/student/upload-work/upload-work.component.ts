import { Component,  OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { TrabajoService } from "../../../services/trabajo.service"
import { AcademicoService, type CarreraDTO, type MateriaDTO } from "../../../services/academico.service"
import { ConfigService } from "../../../services/config.service"

@Component({
  selector: "app-upload-work",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container-fluid">
    <!-- Breadcrumb -->
    <div class="row mb-4">
      <div class="col">
        <h2 class="display-6 fw-bold text-dark">Subir Nuevo Trabajo</h2>
        <p class="text-muted">Completa el formulario para subir tu trabajo académico</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">Información del Trabajo</h5>
            <small class="text-muted">Todos los campos marcados con * son obligatorios</small>
          </div>
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #workForm="ngForm">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="titulo" class="form-label">Título del Trabajo *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="titulo"
                    [(ngModel)]="workData.titulo"
                    name="titulo"
                    required
                    placeholder="Ingresa el título de tu trabajo">
                </div>
                
                <div class="col-md-6 mb-3">
                  <label for="carrera" class="form-label">Carrera *</label>
                  <select 
                    class="form-select" 
                    id="carrera"
                    [(ngModel)]="workData.carreraId"
                    name="carrera"
                    (change)="onCarreraChange()"
                    required>
                    <option value="">Selecciona tu carrera</option>
                    <option *ngFor="let carrera of carreras" [value]="carrera.id">
                      {{ carrera.nombre }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="materia" class="form-label">Materia *</label>
                  <select 
                    class="form-select" 
                    id="materia"
                    [(ngModel)]="workData.materiaId"
                    name="materia"
                    [disabled]="!workData.carreraId">
                    <option value="">Selecciona la materia</option>
                    <option *ngFor="let materia of materias" [value]="materia.id">
                      {{ materia.nombre }}
                    </option>
                  </select>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label for="semestre" class="form-label">Semestre *</label>
                  <select 
                    class="form-select" 
                    id="semestre"
                    [(ngModel)]="workData.semestre"
                    name="semestre"
                    required>
                    <option value="">Selecciona el semestre</option>
                    <option *ngFor="let sem of semestres" [value]="sem">
                      {{ sem }}° Semestre
                    </option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="keywords" class="form-label">Palabras Clave</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="keywords"
                    [(ngModel)]="workData.keywords"
                    name="keywords"
                    placeholder="Ej: programación, web, javascript">
                  <div class="form-text">Separa las palabras con comas</div>
                </div>
                
                <div class="col-md-6 mb-3">
                  <label for="advisor" class="form-label">Asesor/Tutor</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="advisor"
                    [(ngModel)]="workData.advisor"
                    name="advisor"
                    placeholder="Nombre del asesor o tutor">
                </div>
              </div>

              <div class="mb-3">
                <label for="resumen" class="form-label">Resumen del Trabajo *</label>
                <textarea 
                  class="form-control" 
                  id="resumen"
                  [(ngModel)]="workData.resumen"
                  name="resumen"
                  rows="4"
                  required
                  placeholder="Describe brevemente de qué trata tu trabajo (máximo 500 caracteres)"
                  maxlength="500"></textarea>
                <div class="form-text">{{ workData.resumen.length }}/500 caracteres</div>
              </div>

              <!-- File Upload Section -->
              <div class="mb-4">
                <h6 class="fw-bold mb-3">Archivos del Trabajo</h6>
                
                <!-- PDF Upload -->
                <div class="mb-3">
                  <label for="pdfFile" class="form-label">Documento PDF *</label>
                  <div class="input-group">
                    <input 
                      type="file" 
                      class="form-control" 
                      id="pdfFile"
                      (change)="onFileSelected($event, 'pdf')"
                      accept=".pdf"
                      required>
                    <span class="input-group-text">
                      📄
                    </span>
                  </div>
                  <div class="form-text">Archivo PDF del trabajo completo (máximo 10MB)</div>
                  <div *ngIf="selectedFiles.pdf" class="mt-2">
                    <small class="text-success">
                      ✅ Archivo seleccionado: {{ selectedFiles.pdf.name }}
                    </small>
                  </div>
                </div>

                <!-- Source Code Upload -->
                <div class="mb-3">
                  <label for="sourceCode" class="form-label">Código Fuente (Opcional)</label>
                  <div class="input-group">
                    <input 
                      type="file" 
                      class="form-control" 
                      id="sourceCode"
                      (change)="onFileSelected($event, 'source')"
                      accept=".zip,.rar">
                    <span class="input-group-text">
                      📦
                    </span>
                  </div>
                  <div class="form-text">Archivo comprimido con el código fuente (máximo 10MB)</div>
                  <div *ngIf="selectedFiles.source" class="mt-2">
                    <small class="text-success">
                      ✅ Archivo seleccionado: {{ selectedFiles.source.name }}
                    </small>
                  </div>
                </div>

                <!-- Upload Progress -->
                <div *ngIf="isLoading" class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <small class="text-muted">Subiendo archivo...</small>
                    <small class="text-muted">Procesando...</small>
                  </div>
                  <div class="progress">
                    <div 
                      class="progress-bar progress-bar-striped progress-bar-animated" 
                      role="progressbar" 
                      style="width: 100%">
                    </div>
                  </div>
                </div>

                <!-- Upload Success -->
                <div *ngIf="successMessage" class="alert alert-success">
                  ✅ {{ successMessage }}
                </div>

                <!-- Upload Error -->
                <div *ngIf="errorMessage" class="alert alert-danger">
                  ⚠️ {{ errorMessage }}
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="mb-4">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="terms"
                    [(ngModel)]="acceptTerms"
                    name="terms"
                    required>
                  <label class="form-check-label" for="terms">
                    Acepto los <a href="#" class="text-success">términos y condiciones</a> y confirmo que este trabajo es de mi autoría *
                  </label>
                </div>
              </div>

              <!-- Submit Buttons -->
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary" (click)="limpiarFormulario()">
                  ❌ Cancelar
                </button>
                <button type="button" class="btn btn-outline-primary">
                  💾 Guardar Borrador
                </button>
                <button 
                  type="submit" 
                  class="btn btn-success"
                  [disabled]="!workForm.form.valid || !acceptTerms || isLoading">
                  <span *ngIf="!isLoading">☁️ Subir Trabajo</span>
                  <span *ngIf="isLoading">⏳ Subiendo...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Sidebar with Guidelines -->
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header bg-success text-white">
            <h6 class="card-title mb-0">
              📋 Guía de Subida
            </h6>
          </div>
          <div class="card-body">
            <h6 class="fw-bold">Requisitos del Documento:</h6>
            <ul class="list-unstyled">
              <li class="mb-2">
                ✅ Formato PDF únicamente
              </li>
              <li class="mb-2">
                ✅ Tamaño máximo: 10MB
              </li>
              <li class="mb-2">
                ✅ Texto legible y bien estructurado
              </li>
              <li class="mb-2">
                ✅ Incluir portada con datos completos
              </li>
            </ul>

            <hr>

            <h6 class="fw-bold">Proceso de Revisión:</h6>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-marker bg-success"></div>
                <div class="timeline-content">
                  <small class="text-muted">Paso 1</small>
                  <p class="mb-1">Subida del trabajo</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker bg-warning"></div>
                <div class="timeline-content">
                  <small class="text-muted">Paso 2</small>
                  <p class="mb-1">Revisión académica (3-5 días)</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker bg-info"></div>
                <div class="timeline-content">
                  <small class="text-muted">Paso 3</small>
                  <p class="mb-1">Notificación de resultado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card mt-4">
          <div class="card-header bg-white">
            <h6 class="card-title mb-0">
              🕒 Actividad Reciente
            </h6>
          </div>
          <div class="card-body">
            <div class="activity-item mb-3">
              <div class="d-flex align-items-center">
                <div class="activity-icon bg-success rounded-circle me-3">
                  ✅
                </div>
                <div>
                  <p class="mb-0 small">Trabajo "Sistema Web" aprobado</p>
                  <small class="text-muted">Hace 2 días</small>
                </div>
              </div>
            </div>
            
            <div class="activity-item mb-3">
              <div class="d-flex align-items-center">
                <div class="activity-icon bg-warning rounded-circle me-3">
                  ⏰
                </div>
                <div>
                  <p class="mb-0 small">Trabajo "Base de Datos" en revisión</p>
                  <small class="text-muted">Hace 1 semana</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
  styles: [
    `
    .timeline {
      position: relative;
      padding-left: 20px;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #dee2e6;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 20px;
    }
    
    .timeline-marker {
      position: absolute;
      left: -12px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
    }
    
    .timeline-content {
      margin-left: 20px;
    }
    
    .activity-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    
    .form-control:focus,
    .form-select:focus {
      border-color: #198754;
      box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
    }
    
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: none;
    }
  `,
  ],
})
export class UploadWorkComponent implements OnInit {
  // Servicios
  private trabajoService = inject(TrabajoService)
  private academicoService = inject(AcademicoService)
  private config = inject(ConfigService)

  // Datos del formulario
  workData = {
    titulo: "",
    carreraId: null as number | null,
    materiaId: null as number | null,
    semestre: null as number | null,
    resumen: "",
    keywords: "",
    advisor: "",
    usuarioId: 1,
  }

  carreras: CarreraDTO[] = []
  materias: MateriaDTO[] = []
  semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  selectedFiles: { pdf?: File; source?: File } = {}

  // Estados
  isLoading = false
  errorMessage = ""
  successMessage = ""
  backendStatus = "No verificado"
  acceptTerms = false

  // 🔥 AQUÍ ESTÁ EL MÉTODO QUE FALTABA
  ngOnInit(): void {
    console.log("🚀 Componente inicializado")
    //this.config.logUrls()
    this.cargarCarreras()
    this.testConnection()
  }

  cargarCarreras(): void {
    this.academicoService.obtenerCarreras().subscribe({
      next: (carreras) => {
        this.carreras = carreras
        console.log("✅ Carreras cargadas:", carreras.length)
      },
      error: (error) => {
        console.error("❌ Error al cargar carreras:", error)
      },
    })
  }

  onCarreraChange(): void {
    if (this.workData.carreraId) {
      this.academicoService.obtenerMateriasPorCarrera(this.workData.carreraId).subscribe({
        next: (materias) => {
          this.materias = materias
          this.workData.materiaId = null
        },
      })
    } else {
      this.materias = []
      this.workData.materiaId = null
    }
  }

  onFileSelected(event: any, type: "pdf" | "source"): void {
    const file = event.target.files[0]
    if (file) {
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        this.errorMessage = `El archivo ${file.name} excede el tamaño máximo de 10MB`
        event.target.value = ""
        return
      }

      if (type === "pdf" && file.type !== "application/pdf") {
        this.errorMessage = "Solo se permiten archivos PDF"
        event.target.value = ""
        return
      }

      this.selectedFiles[type] = file
      this.errorMessage = ""
      console.log(`📁 Archivo ${type} seleccionado:`, file.name)
    }
  }

  testConnection(): void {
    this.backendStatus = "Verificando..."
    this.trabajoService.obtenerTrabajosDelUsuario(1).subscribe({
      next: () => {
        this.backendStatus = "Conectado"
        console.log("✅ Backend conectado")
      },
      error: (error) => {
        this.backendStatus = "Sin conexión"
        console.error("❌ Error de conexión:", error)
      },
    })
  }

  onSubmit(): void {
    if (!this.selectedFiles.pdf) {
      this.errorMessage = "Por favor selecciona un archivo PDF"
      return
    }

    this.isLoading = true
    this.errorMessage = ""
    this.successMessage = ""

    console.log("🚀 Enviando trabajo...")

    this.trabajoService.crearTrabajo(this.workData, this.selectedFiles.pdf, this.selectedFiles.source).subscribe({
      next: (response) => {
        this.isLoading = false
        this.successMessage = "¡Trabajo subido exitosamente!"
        console.log("✅ Trabajo creado:", response)

        setTimeout(() => {
          this.limpiarFormulario()
        }, 3000)
      },
      error: (error) => {
        this.isLoading = false
        console.error("❌ Error al subir trabajo:", error)

        if (error.status === 0) {
          this.errorMessage = "No se puede conectar con el servidor. ¿Está corriendo en el puerto 8081?"
        } else {
          this.errorMessage = `Error al subir el trabajo: ${error.message || "Error desconocido"}`
        }
      },
    })
  }

  limpiarFormulario(): void {
    this.workData = {
      titulo: "",
      carreraId: null,
      materiaId: null,
      semestre: null,
      resumen: "",
      keywords: "",
      advisor: "",
      usuarioId: 1,
    }
    this.selectedFiles = {}
    this.materias = []
    this.successMessage = ""
    this.errorMessage = ""
    this.acceptTerms = false
  }
}

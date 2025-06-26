import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { AuthService } from "../../../services/auth/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {

  loginData = {
    correo: "adairm1",
    contrasenia: "12345",
  }

  carreras = [
    "Ingeniería en Desarrollo de Software y Sistemas Inteligentes",
    "Ingeniería Forestal",
    "Licenciatura en Administración Turística",
    "Licenciatura en Biología",
    "Licenciatura en Ciencias Ambientales",
  ]

  constructor(private authService: AuthService) {}

  onSubmit() {
    console.log("Login attempt:", this.loginData);

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log("Login successful:", response);
        // Redireccionar o mostrar mensaje de éxito
      },
      error: (error) => {
        console.error("Login failed:", error);
        // Mostrar mensaje de error al usuario
      }
    });
  }
}

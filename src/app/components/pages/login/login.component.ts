import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../../services/auth/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  loginData = {
    correo: "adaiirm",
    contrasenia: "adaiirm",
  };
  showPassword: boolean = false;
  errorMessage: string = '';

  carreras = [
    "Ingeniería en Desarrollo de Software y Sistemas Inteligentes",
    "Ingeniería Forestal",
    "Licenciatura en Administración Turística",
    "Licenciatura en Biología",
    "Licenciatura en Ciencias Ambientales",
  ];

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
  console.log("Login attempt:", this.loginData);

  this.authService.login(this.loginData).subscribe({
    next: (response) => {
      console.log("Login successful:", response);

      // Guardar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(response));

      const tipo = response.rol.nombre;
      console.log("User role:", tipo);
      
      this.router.navigate(["/dashboard"]);
        
    },
    error: (error) => {
      console.error("Login failed:", error);
      if (error.status === 404) {
        this.errorMessage = "Usuario no encontrado.";
      } else if (error.status === 401) {
        this.errorMessage = "Contraseña incorrecta.";
      } else {
        this.errorMessage = "Ocurrió un error al iniciar sesión.";
      }
    }
  });
}

}

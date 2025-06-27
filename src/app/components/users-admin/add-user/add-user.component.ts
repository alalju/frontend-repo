import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-user.component.html'
})
export class AddUserComponent implements OnInit {

  constructor(private userService: UserService) { }

  userData = {
    nombre: '',
    correo: '',
    rol: {
      id: null
    },
    activo: false,
    contrasenia: '',
    confirmPassword: ''
  };

  roles: any[] = []

  ngOnInit() {
    this.userService.getRoles().subscribe((roles) => {
      console.log("Roles obtenidos:", roles)
      this.roles = roles;
    })
  }

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  limpiarFormulario() {
    // ...existing code...
  }

  onSubmit() {
    console.log("Datos del usuario:", this.userData);

    this.userService.createUser(this.userData).subscribe({
      next: (response) => {
        console.log("Usuario creado:", response);
        this.successMessage = 'Usuario creado exitosamente';
        this.errorMessage = '';
        this.limpiarFormulario();
      }
      ,
      error: (error) => {
        console.error("Error al crear el usuario:", error);
        this.errorMessage = 'Error al crear el usuario. Por favor, inténtalo de nuevo.';
        this.successMessage = '';
      } 
    });
  }
}
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userString = localStorage.getItem('usuario');
    if (!userString) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = JSON.parse(userString);
    const userRole = user.rol.nombre; // 'ADMINISTRADOR', 'PROFESOR', 'ALUMNO'

    const allowedRoles = route.data['roles'] as string[];

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/unauthorized']); // Página 403 opcional
    return false;
  }
}

import type { Routes } from "@angular/router"
import { RoleGuard } from "./guards/role.guard"

export const routes: Routes = [
  // redirigir "/" a login (o a dashboard o lo que prefieras)
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'users-admin',
    loadComponent: () => import('./components/users-admin/users-admin-dashboard.component').then(m => m.UsersAdminDashboardComponent),
    canActivate: [RoleGuard],
    data: { roles: ['ADMINISTRADOR'] }
  },
  {
    path: 'student',
    loadComponent: () => import('./components/student/student-dashboard.component').then(m => m.StudentDashboardComponent),
    canActivate: [RoleGuard],
    data: { roles: ['ALUMNO'] }
  },
  {
    path: 'works-admin',
    loadComponent: () => import('./components/works-admin/works-admin-dashboard.component').then(m => m.WorksAdminDashboardComponent),
    canActivate: [RoleGuard],
    data: { roles: ['PROFESOR'] }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [RoleGuard],
    data: { roles: ['PROFESOR', 'ALUMNO', 'ADMINISTRADOR'] }
  },
  {
    path: 'login',
    loadComponent: () => import('./components/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found//not-found/not-found.component').then(m => m.NotFoundComponent)
  }
]

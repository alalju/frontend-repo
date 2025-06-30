import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { SidebarComponent } from "../shared/sidebar/sidebar.component"
import { HeaderComponent } from "../shared/header/header.component"
import { StudentDashboardComponent } from "../student/student-dashboard.component"
import { WorksAdminDashboardComponent } from "../works-admin/works-admin-dashboard.component"
import { UsersAdminDashboardComponent } from "../users-admin/users-admin-dashboard.component"
import { UploadWorkComponent } from "../student/upload-work/upload-work.component"
import { MyWorksComponent } from "../student/my-works/my-works.component"
import { AddUserComponent } from "../users-admin/add-user/add-user.component"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    StudentDashboardComponent,
    WorksAdminDashboardComponent,
    UsersAdminDashboardComponent,
    UploadWorkComponent,
    MyWorksComponent,
    AddUserComponent
  ],
  template: `
    <div class="d-flex vh-100">
      
      <app-sidebar 
        [activeView]="activeView" 
        [userRole]="userRole"
        (viewChanged)="onViewChanged($event)"
        (roleChanged)="onRoleChanged($event)">
      </app-sidebar>
      
      <div class="flex-fill d-flex flex-column overflow-hidden">
        <app-header [userRole]="userRole"></app-header>
        
        <main class="flex-fill overflow-auto bg-light p-4">
          <app-student-dashboard *ngIf="activeView === 'student-dashboard'"></app-student-dashboard>
          <app-works-admin-dashboard *ngIf="activeView === 'works-admin-dashboard'"></app-works-admin-dashboard>
          <app-users-admin-dashboard (viewChanged)="onViewChanged($event)" *ngIf="activeView === 'users-admin-dashboard'" ></app-users-admin-dashboard>
          <app-upload-work *ngIf="activeView === 'upload-work'"></app-upload-work>
          <app-my-works *ngIf="activeView === 'my-works'" [usuarioId]="usuarioId"></app-my-works>
          <app-search-works *ngIf="activeView === 'search-works'"></app-search-works>
          <app-add-user *ngIf="activeView === 'add-user'"></app-add-user>
          <app-works-approved *ngIf="activeView === 'works-approved'"></app-works-approved>
          <app-works-rejected *ngIf="activeView === 'works-rejected'"></app-works-rejected>
          
        </main>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  activeView = ""
  userRole: "student" | "works-admin" | "users-admin" = "student"

  
  usuarioId: number = 0;

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.usuarioId = usuario?.id || 0;
    const rol = usuario?.rol?.nombre;

    switch (rol) {
      case "ADMINISTRADOR":
        this.userRole = "users-admin";
        this.activeView = "users-admin-dashboard";
        break;
      case "PROFESOR":
        this.userRole = "works-admin";
        this.activeView = "works-admin-dashboard";
        break;
      case "ALUMNO":
        this.userRole = "student";
        this.activeView = "student-dashboard";
        break;
      default:
        console.warn("Rol no reconocido o no autenticado.");
        break;
    }
  }


  onViewChanged(view: string): void {
    this.activeView = view
  }

  onRoleChanged(role: "student" | "works-admin" | "users-admin"): void {
    this.userRole = role
    switch (role) {
      case "student":
        this.activeView = "student-dashboard"
        break
      case "works-admin":
        this.activeView = "works-admin-dashboard"
        break
      case "users-admin":
        this.activeView = "users-admin-dashboard"
        break
    }
  }
}

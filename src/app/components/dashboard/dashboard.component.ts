import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { SidebarComponent } from "../shared/sidebar/sidebar.component"
import { HeaderComponent } from "../shared/header/header.component"
import { StudentDashboardComponent } from "../student/student-dashboard.component"
import { WorksAdminDashboardComponent } from "../works-admin/works-admin-dashboard.component"
import { UsersAdminDashboardComponent } from "../users-admin/users-admin-dashboard.component"

// Agregar las nuevas importaciones
import { UploadWorkComponent } from "../student/upload-work/upload-work.component"
import { MyWorksComponent } from "../student/my-works/my-works.component"

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
          <app-users-admin-dashboard *ngIf="activeView === 'users-admin-dashboard'"></app-users-admin-dashboard>
          <app-upload-work *ngIf="activeView === 'upload-work'"></app-upload-work>
          <app-my-works *ngIf="activeView === 'my-works'"></app-my-works>
        </main>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  activeView = "student-dashboard"
  userRole: "student" | "works-admin" | "users-admin" = "student"

  onViewChanged(view: string): void {
    this.activeView = view
  }

  onRoleChanged(role: "student" | "works-admin" | "users-admin"): void {
    this.userRole = role
    // Cambiar vista por defecto según el rol
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

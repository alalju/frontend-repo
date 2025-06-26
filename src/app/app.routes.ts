import type { Routes } from "@angular/router"
import { StudentDashboardComponent } from "./components/student/student-dashboard.component"
import { WorksAdminDashboardComponent } from "./components/works-admin/works-admin-dashboard.component"
import { UsersAdminDashboardComponent } from "./components/users-admin/users-admin-dashboard.component"
import { LoginComponent } from "./components/pages/login/login.component"

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "student", component: StudentDashboardComponent },
  { path: "works-admin", component: WorksAdminDashboardComponent },
  { path: "users-admin", component: UsersAdminDashboardComponent },
]

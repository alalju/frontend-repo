import type { Routes } from "@angular/router"
import { StudentDashboardComponent } from "./components/student/student-dashboard.component"
import { WorksAdminDashboardComponent } from "./components/works-admin/works-admin-dashboard.component"
import { UsersAdminDashboardComponent } from "./components/users-admin/users-admin-dashboard.component"

export const routes: Routes = [
  { path: "", redirectTo: "/student", pathMatch: "full" },
  { path: "student", component: StudentDashboardComponent },
  { path: "works-admin", component: WorksAdminDashboardComponent },
  { path: "users-admin", component: UsersAdminDashboardComponent },
]

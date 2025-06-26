import { Component } from "@angular/core"
import { RouterModule, RouterOutlet } from "@angular/router"
import { DashboardComponent } from "./components/dashboard/dashboard.component"
import { LoginComponent } from "./components/pages/login/login.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, LoginComponent, RouterModule],
  
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
    .app-container {
      height: 100vh;
      overflow: hidden;
    }
  `,
  ],
})
export class AppComponent {
  title = "Sistema Académico Universidad Verde"
}

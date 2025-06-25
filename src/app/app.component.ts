import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { DashboardComponent } from "./components/dashboard/dashboard.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, DashboardComponent],
  template: `
    <div class="app-container">
      <app-dashboard></app-dashboard>
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

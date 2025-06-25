import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-stats-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card h-100 stats-card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="card-subtitle mb-2 text-muted">{{ title }}</h6>
            <h2 class="card-title mb-0" [class]="valueClass">{{ value }}</h2>
            <small [class]="subtitleClass">{{ subtitle }}</small>
          </div>
          <i [class]="'bi ' + icon + ' fs-1 ' + iconClass"></i>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .stats-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .stats-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
  `,
  ],
})
export class StatsCardComponent {
  @Input() title!: string
  @Input() value!: string | number
  @Input() subtitle!: string
  @Input() icon!: string
  @Input() valueClass = ""
  @Input() subtitleClass = "text-muted"
  @Input() iconClass = "text-muted"
}

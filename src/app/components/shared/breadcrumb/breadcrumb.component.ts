import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

export interface BreadcrumbItem {
  label: string
  url?: string
  active?: boolean
}

@Component({
  selector: "app-breadcrumb",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li 
          *ngFor="let item of items; let last = last" 
          class="breadcrumb-item"
          [class.active]="item.active || last">
          <a 
            *ngIf="item.url && !item.active && !last" 
            [routerLink]="item.url"
            class="text-decoration-none">
            {{ item.label }}
          </a>
          <span *ngIf="!item.url || item.active || last">
            {{ item.label }}
          </span>
        </li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = []
}

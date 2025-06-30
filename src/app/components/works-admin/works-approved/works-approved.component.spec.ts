import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksApprovedComponent } from './works-approved.component';

describe('WorksApprovedComponent', () => {
  let component: WorksApprovedComponent;
  let fixture: ComponentFixture<WorksApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorksApprovedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorksApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

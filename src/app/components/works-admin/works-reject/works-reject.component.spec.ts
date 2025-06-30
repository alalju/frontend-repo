import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksRejectedComponent } from './works-rejected.component';

describe('WorksRejectComponent', () => {
  let component: WorksRejectedComponent;
  let fixture: ComponentFixture<WorksRejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorksRejectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorksRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

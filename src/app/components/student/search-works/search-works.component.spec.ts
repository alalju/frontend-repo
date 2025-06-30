import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWorksComponent } from './search-works.component';

describe('SearchWorksComponent', () => {
  let component: SearchWorksComponent;
  let fixture: ComponentFixture<SearchWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchWorksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

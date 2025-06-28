import { TestBed } from '@angular/core/testing';

import { StudentWorkManagementService } from './student-work-management.service';

describe('StudentWorkManagementService', () => {
  let service: StudentWorkManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentWorkManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TrabajoAdapterService } from './trabajo-adapter.service';

describe('TrabajoAdapterService', () => {
  let service: TrabajoAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrabajoAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

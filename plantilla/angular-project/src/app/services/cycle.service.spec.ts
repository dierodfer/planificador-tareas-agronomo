import { TestBed } from '@angular/core/testing';

import { CycleService } from './cycle.service';

describe('CycleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CycleService = TestBed.get(CycleService);
    expect(service).toBeTruthy();
  });
});

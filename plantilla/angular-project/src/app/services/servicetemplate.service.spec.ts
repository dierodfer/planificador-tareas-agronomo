import { TestBed, inject } from '@angular/core/testing';

import { ServicetemplateService } from './servicetemplate.service';

describe('ServicetemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicetemplateService]
    });
  });

  it('should be created', inject([ServicetemplateService], (service: ServicetemplateService) => {
    expect(service).toBeTruthy();
  }));
});

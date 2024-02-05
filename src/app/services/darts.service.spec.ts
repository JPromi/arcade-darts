import { TestBed } from '@angular/core/testing';

import { DartsService } from './darts.service';

describe('DartsService', () => {
  let service: DartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

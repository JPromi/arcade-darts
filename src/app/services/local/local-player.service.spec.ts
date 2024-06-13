import { TestBed } from '@angular/core/testing';

import { LocalPlayerService } from './local-player.service';

describe('LocalPlayerService', () => {
  let service: LocalPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

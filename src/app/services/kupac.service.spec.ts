import { TestBed } from '@angular/core/testing';

import { KupacService } from './kupac.service';

describe('KupacService', () => {
  let service: KupacService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KupacService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

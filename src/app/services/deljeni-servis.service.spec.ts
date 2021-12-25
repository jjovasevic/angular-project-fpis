import { TestBed } from '@angular/core/testing';

import { DeljeniServisService } from './deljeni-servis.service';

describe('DeljeniServisService', () => {
  let service: DeljeniServisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeljeniServisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

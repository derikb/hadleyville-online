import { TestBed } from '@angular/core/testing';

import { NpcsService } from './npcs.service';

describe('NpcsService', () => {
  let service: NpcsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NpcsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

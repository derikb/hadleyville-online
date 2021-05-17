import { TestBed } from '@angular/core/testing';

import { RandomtableService } from './randomtable.service';

describe('RandomtableService', () => {
  let service: RandomtableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomtableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

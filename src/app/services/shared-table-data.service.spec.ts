import { TestBed } from '@angular/core/testing';

import { SharedTableDataService } from './shared-table-data.service';

describe('SharedTableDataService', () => {
  let service: SharedTableDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedTableDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { APIQueriesDetailsService } from './apiqueries-details.service';

describe('APIQueriesDetailsService', () => {
  let service: APIQueriesDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(APIQueriesDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

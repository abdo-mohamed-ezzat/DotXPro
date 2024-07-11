import { TestBed } from '@angular/core/testing';

import { ConnectivityInterceptor } from './connectivity.interceptor';

describe('ConnectivityInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ConnectivityInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ConnectivityInterceptor = TestBed.inject(ConnectivityInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

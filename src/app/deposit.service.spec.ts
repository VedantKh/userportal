import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { DepositService } from './deposit.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DepositService', () => {
  let service: DepositService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(DepositService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

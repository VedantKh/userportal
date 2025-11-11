import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { WithdrawService } from './withdraw.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('WithdrawService', () => {
  let service: WithdrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(WithdrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

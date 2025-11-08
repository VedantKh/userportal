import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DepositService } from './deposit.service';

describe('DepositService', () => {
  let service: DepositService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DepositService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

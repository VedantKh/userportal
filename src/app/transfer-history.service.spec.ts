import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TransferhistoryService } from './transfer-history.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TransferhistoryService', () => {
  let service: TransferhistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(TransferhistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TransferhistoryService } from './transfer-history.service';

describe('TransferhistoryService', () => {
  let service: TransferhistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TransferhistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

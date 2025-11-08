import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { MockBankDataService } from './mock-bank-data.service';

@Injectable({
  providedIn: 'root',
})
export class WithdrawService {
  constructor(private store: MockBankDataService) {}

  insertEntry(account: string, amount: number) {
    const result = this.store.withdraw(account, amount);
    return of({
      withdrawStatus: result.success,
      responseMessage: result.message,
    });
  }
}

import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { MockBankDataService } from './mock-bank-data.service';

@Injectable({
  providedIn: 'root',
})
export class DepositService {
  constructor(private store: MockBankDataService) {}

  insertEntry(account: string, amount: number) {
    const result = this.store.deposit(account, amount);
    return of({
      depositStatus: result.success,
      responseMessage: result.message,
    });
  }
}

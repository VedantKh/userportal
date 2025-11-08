import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { MockBankDataService } from './mock-bank-data.service';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  constructor(private store: MockBankDataService) {}

  insertEntry(
    username: string,
    savingAccount: string,
    ifscNo: string,
    primaryAccount: string,
    amount: number
  ) {
    const result = this.store.transfer(
      username,
      savingAccount,
      ifscNo,
      primaryAccount,
      amount
    );
    return of({
      transferStatus: result.success,
      responseMessage: result.message,
    });
  }
}

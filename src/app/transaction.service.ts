import { Injectable } from '@angular/core';
import { Transaction } from './models/transaction';
import { SavingAccount } from './models/savingaccount';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockBankDataService } from './mock-bank-data.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private store: MockBankDataService) {}
  public getTransactions(accNo): Observable<Transaction[]> {
    // Ignore accNo for demo; return live stream
    return this.store.transactions$;
  }
  public getSavingAccount(username): Observable<SavingAccount> {
    return this.store.savingBalance$.pipe(
      map((balance) => ({
        id: 1,
        accno: this.store.savingAccNo,
        balance: balance,
        username: username,
        user: null,
      }))
    );
  }
}

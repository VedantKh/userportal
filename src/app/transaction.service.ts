import { Injectable } from '@angular/core';
import { Transaction } from './models/transaction';
import { SavingAccount } from './models/savingaccount';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor() {}
  public getTransactions(accNo): Observable<Transaction[]> {
    // Demo transaction history (latest first)
    const mock: Transaction[] = [
      {
        id: 1006,
        date: new Date('2025-11-05T10:15:00Z'),
        action: 'deposit',
        amount: 1200,
      },
      {
        id: 1005,
        date: new Date('2025-11-03T14:40:00Z'),
        action: 'withdraw',
        amount: 200,
      },
      {
        id: 1004,
        date: new Date('2025-11-01T09:05:00Z'),
        action: 'deposit',
        amount: 500,
      },
      {
        id: 1003,
        date: new Date('2025-10-28T18:25:00Z'),
        action: 'withdraw',
        amount: 80,
      },
      {
        id: 1002,
        date: new Date('2025-10-22T12:00:00Z'),
        action: 'deposit',
        amount: 300,
      },
      {
        id: 1001,
        date: new Date('2025-10-18T16:45:00Z'),
        action: 'deposit',
        amount: 250,
      },
    ];
    return of(mock);
  }
  public getSavingAccount(username): Observable<SavingAccount> {
    const mock: SavingAccount = {
      id: 1,
      accno: 123456789012,
      balance: 13450,
      username: username,
      user: null,
    };
    return of(mock);
  }
}

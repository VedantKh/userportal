import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from './models/transaction';
import { TransferHistory } from './models/transferhistory';

@Injectable({
  providedIn: 'root',
})
export class MockBankDataService {
  // Demo constants
  public readonly savingAccNo: number = 123456789012;
  public readonly primaryAccNo: number = 987654321000;

  // State
  private savingBalanceSubject = new BehaviorSubject<number>(13450);
  public savingBalance$: Observable<number> =
    this.savingBalanceSubject.asObservable();

  private transactionsSubject = new BehaviorSubject<Transaction[]>([
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
  ]);
  public transactions$: Observable<Transaction[]> =
    this.transactionsSubject.asObservable();

  private transferHistorySubject = new BehaviorSubject<TransferHistory[]>([
    {
      id: 5003,
      saccount: '123456789012',
      raccount: '222233334444',
      amount: 150,
      date: new Date('2025-11-02T13:20:00Z'),
    },
    {
      id: 5002,
      saccount: '123456789012',
      raccount: '111122223333',
      amount: 75,
      date: new Date('2025-10-27T08:10:00Z'),
    },
    {
      id: 5001,
      saccount: '123456789012',
      raccount: '555566667777',
      amount: 60,
      date: new Date('2025-10-15T11:30:00Z'),
    },
  ]);
  public transferHistory$: Observable<TransferHistory[]> =
    this.transferHistorySubject.asObservable();

  private getNextTransactionId(): number {
    const list = this.transactionsSubject.getValue();
    return list.length ? Math.max(...list.map((t) => t.id)) + 1 : 1001;
  }

  private getNextTransferId(): number {
    const list = this.transferHistorySubject.getValue();
    return list.length ? Math.max(...list.map((t) => t.id)) + 1 : 5001;
  }

  deposit(
    account: string | number,
    amount: number
  ): { success: boolean; message: string } {
    if (!amount || amount <= 0) {
      return { success: false, message: 'Invalid amount' };
    }
    // Update balance
    const current = this.savingBalanceSubject.getValue();
    const next = current + amount;
    this.savingBalanceSubject.next(next);
    // Add transaction (latest first)
    const tx: Transaction = {
      id: this.getNextTransactionId(),
      date: new Date(),
      action: 'deposit',
      amount: amount,
    };
    const list = this.transactionsSubject.getValue();
    this.transactionsSubject.next([tx, ...list]);
    return { success: true, message: 'Amount deposited successfully' };
  }

  withdraw(
    account: string | number,
    amount: number
  ): { success: boolean; message: string } {
    if (!amount || amount <= 0) {
      return { success: false, message: 'Invalid amount' };
    }
    const current = this.savingBalanceSubject.getValue();
    if (amount > current) {
      return { success: false, message: 'Insufficient balance' };
    }
    const next = current - amount;
    this.savingBalanceSubject.next(next);
    const tx: Transaction = {
      id: this.getNextTransactionId(),
      date: new Date(),
      action: 'withdraw',
      amount: amount,
    };
    const list = this.transactionsSubject.getValue();
    this.transactionsSubject.next([tx, ...list]);
    return { success: true, message: 'Amount withdrawn successfully' };
  }

  transfer(
    username: string,
    savingAccount: string | number,
    ifscNo: string,
    primaryAccount: string | number,
    amount: number
  ): { success: boolean; message: string } {
    if (!ifscNo || !primaryAccount) {
      return { success: false, message: 'Missing IFSC or primary account' };
    }
    if (!amount || amount <= 0) {
      return { success: false, message: 'Invalid amount' };
    }
    const current = this.savingBalanceSubject.getValue();
    if (amount > current) {
      return { success: false, message: 'Insufficient balance' };
    }
    // Deduct and record as a withdrawal
    const next = current - amount;
    this.savingBalanceSubject.next(next);
    const tx: Transaction = {
      id: this.getNextTransactionId(),
      date: new Date(),
      action: 'withdraw',
      amount: amount,
    };
    const txList = this.transactionsSubject.getValue();
    this.transactionsSubject.next([tx, ...txList]);
    // Add transfer history
    const th: TransferHistory = {
      id: this.getNextTransferId(),
      saccount: String(savingAccount),
      raccount: String(primaryAccount),
      amount: amount,
      date: new Date(),
    };
    const thList = this.transferHistorySubject.getValue();
    this.transferHistorySubject.next([th, ...thList]);
    return { success: true, message: 'Transfer successful' };
  }
}

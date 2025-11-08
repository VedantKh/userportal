import { Injectable } from '@angular/core';
import { UserDisplay } from './models/userdisplay';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockBankDataService } from './mock-bank-data.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private store: MockBankDataService) {}

  public getUser(username): Observable<UserDisplay> {
    return this.store.savingBalance$.pipe(
      map((balance) => ({
        primaryAccno: this.store.primaryAccNo,
        savingsAccno: this.store.savingAccNo,
        primaryBalance: 2500,
        savingsBalance: balance,
      }))
    );
  }
}

import { Injectable } from '@angular/core';
import { TransferHistory } from './models/transferhistory';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransferhistoryService {
  private url: String;

  constructor() {}
  public getTransferHistory(accNo): Observable<TransferHistory[]> {
    const mock: TransferHistory[] = [
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
    ];
    return of(mock);
  }
  // public getSavingAccount(username):Observable<SavingAccount>{
  //   return this.http.get<SavingAccount>(this.url+"/account/getsaving/"+username);
  // }
}

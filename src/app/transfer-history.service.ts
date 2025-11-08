import { Injectable } from '@angular/core';
import { TransferHistory } from './models/transferhistory';
import { Observable } from 'rxjs';
import { MockBankDataService } from './mock-bank-data.service';

@Injectable({
  providedIn: 'root',
})
export class TransferhistoryService {
  private url: String;

  constructor(private store: MockBankDataService) {}
  public getTransferHistory(accNo): Observable<TransferHistory[]> {
    // Ignore accNo for demo; return live stream
    return this.store.transferHistory$;
  }
  // public getSavingAccount(username):Observable<SavingAccount>{
  //   return this.http.get<SavingAccount>(this.url+"/account/getsaving/"+username);
  // }
}

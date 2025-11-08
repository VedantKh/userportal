import { Injectable } from '@angular/core';
import { UserDisplay } from './models/userdisplay';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  public getUser(username): Observable<UserDisplay> {
    // Demo data for the signed-in user; ignore username parameter
    const mock: UserDisplay = {
      primaryAccno: 987654321000,
      savingsAccno: 123456789012,
      primaryBalance: 2500,
      savingsBalance: 13450,
    };
    return of(mock);
  }
}

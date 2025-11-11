import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { UserService } from '../user.service';
import { TransactionService } from '../transaction.service';
import { TransferhistoryService } from '../transfer-history.service';
import { AuthService } from '../auth.service';
import { MockBankDataService } from '../mock-bank-data.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HomeComponent - Comprehensive Tests with Dummy Data', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let compiled: HTMLElement;
  let userService: UserService;
  let transactionService: TransactionService;
  let transferService: TransferhistoryService;
  let mockBankDataService: MockBankDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [HomeComponent],
    imports: [RouterTestingModule],
    providers: [
        UserService,
        TransactionService,
        TransferhistoryService,
        AuthService,
        MockBankDataService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    localStorage.setItem('username', 'Vedant');
    localStorage.setItem('savingAccNo', '123456789012');
    
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    
    userService = TestBed.inject(UserService);
    transactionService = TestBed.inject(TransactionService);
    transferService = TestBed.inject(TransferhistoryService);
    mockBankDataService = TestBed.inject(MockBankDataService);
    
    spyOn(userService, 'getUser').and.returnValue(of({
      savingsAccno: 123456789012,
      primaryAccno: 987654321000,
      savingsBalance: 13450,
      primaryBalance: 2500
    }));
    
    spyOn(transactionService, 'getTransactions').and.returnValue(of([]));
    spyOn(transferService, 'getTransferHistory').and.returnValue(of([]));
    
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should load username from localStorage', () => {
      expect(component.username).toBe('Vedant');
    });

    it('should initialize with default transaction values', () => {
      expect(component.transaction).toBeDefined();
      expect(component.transaction.count).toBeDefined();
      expect(component.transaction.deposit).toBeDefined();
      expect(component.transaction.withdrawl).toBeDefined();
    });
  });

  describe('Home Page Display with Dummy Data', () => {
    it('should display welcome message with username', () => {
      fixture.detectChanges();
      const welcomeText = compiled.querySelector('h3')?.textContent;
      expect(welcomeText).toContain('Welcome to Bank of America');
      expect(welcomeText).toContain('Vedant');
    });

    it('should display savings account number from dummy data', () => {
      component.savingAcc = mockBankDataService.savingAccNo;
      fixture.detectChanges();
      const accountText = compiled.textContent;
      expect(accountText).toContain('123456789012');
    });

    it('should display savings balance from dummy data', () => {
      component.savingBalanceLocal = 13450;
      fixture.detectChanges();
      const balanceElements = compiled.querySelectorAll('.box-info');
      const savingsBalanceText = balanceElements[0]?.textContent;
      expect(savingsBalanceText).toContain('13450');
    });

    it('should display transaction count from dummy data', () => {
      component.transaction.count = 6;
      fixture.detectChanges();
      const countElement = compiled.querySelector('.box-info-count');
      expect(countElement?.textContent).toContain('6 Total');
    });

    it('should display deposit total from dummy data', () => {
      component.transaction.deposit = 2250;
      fixture.detectChanges();
      const boxInfoElements = compiled.querySelectorAll('.box-info');
      const depositText = Array.from(boxInfoElements).find(el => 
        el.textContent?.includes('2250')
      );
      expect(depositText).toBeTruthy();
    });

    it('should display withdrawal total from dummy data', () => {
      component.transaction.withdrawl = 280;
      fixture.detectChanges();
      const boxInfoElements = compiled.querySelectorAll('.box-info');
      const withdrawalText = Array.from(boxInfoElements).find(el => 
        el.textContent?.includes('280')
      );
      expect(withdrawalText).toBeTruthy();
    });

    it('should display transfer total from dummy data', () => {
      component.transfer = 285;
      fixture.detectChanges();
      const boxInfoElements = compiled.querySelectorAll('.box-info');
      const transferText = Array.from(boxInfoElements).find(el => 
        el.textContent?.includes('285')
      );
      expect(transferText).toBeTruthy();
    });

    it('should display most recent transaction when available', () => {
      component.mostRecentTransaction = {
        id: 1006,
        date: new Date('2025-11-05T10:15:00Z'),
        action: 'deposit',
        amount: 1200
      };
      fixture.detectChanges();
      const transactionAmount = compiled.querySelector('.transaction-amount');
      expect(transactionAmount?.textContent).toContain('1200');
    });

    it('should display "No transactions yet" when no transactions exist', () => {
      component.mostRecentTransaction = null;
      fixture.detectChanges();
      const noTransactionsText = compiled.querySelector('.no-transactions');
      expect(noTransactionsText?.textContent).toContain('No transactions yet');
    });
  });

  describe('Service Integration with Dummy Data', () => {
    it('should call UserService.getUser on initialization', () => {
      (userService.getUser as jasmine.Spy).and.returnValue(of({
        savingsAccno: 123456789012,
        primaryAccno: 987654321000,
        savingsBalance: 13450,
        primaryBalance: 2500
      }));
      
      component.ngOnInit();
      
      expect(userService.getUser).toHaveBeenCalledWith('Vedant');
    });

    it('should call TransactionService.getTransactions on initialization', () => {
      (transactionService.getTransactions as jasmine.Spy).and.returnValue(of([
        { id: 1006, date: new Date(), action: 'deposit', amount: 1200 },
        { id: 1005, date: new Date(), action: 'withdraw', amount: 200 }
      ]));
      
      component.ngOnInit();
      
      expect(transactionService.getTransactions).toHaveBeenCalled();
    });

    it('should call TransferhistoryService.getTransferHistory on initialization', () => {
      (transferService.getTransferHistory as jasmine.Spy).and.returnValue(of([
        { id: 5003, saccount: '123456789012', raccount: '222233334444', amount: 150, date: new Date() }
      ]));
      
      component.ngOnInit();
      
      expect(transferService.getTransferHistory).toHaveBeenCalled();
    });

    it('should correctly aggregate deposit amounts from transactions', () => {
      const mockTransactions = [
        { id: 1, date: new Date(), action: 'deposit', amount: 500 },
        { id: 2, date: new Date(), action: 'deposit', amount: 300 },
        { id: 3, date: new Date(), action: 'withdraw', amount: 100 }
      ];
      
      (transactionService.getTransactions as jasmine.Spy).and.returnValue(of(mockTransactions));
      component.transaction = { count: 0, deposit: 0, withdrawl: 0 };
      component.ngOnInit();
      
      expect(component.transaction.deposit).toBe(800);
    });

    it('should correctly aggregate withdrawal amounts from transactions', () => {
      const mockTransactions = [
        { id: 1, date: new Date(), action: 'withdraw', amount: 200 },
        { id: 2, date: new Date(), action: 'withdraw', amount: 80 },
        { id: 3, date: new Date(), action: 'deposit', amount: 500 }
      ];
      
      (transactionService.getTransactions as jasmine.Spy).and.returnValue(of(mockTransactions));
      component.transaction = { count: 0, deposit: 0, withdrawl: 0 };
      component.ngOnInit();
      
      expect(component.transaction.withdrawl).toBe(280);
    });

    it('should correctly aggregate transfer amounts', () => {
      const mockTransfers = [
        { id: 1, saccount: '123456789012', raccount: '111111111111', amount: 150, date: new Date() },
        { id: 2, saccount: '123456789012', raccount: '222222222222', amount: 75, date: new Date() },
        { id: 3, saccount: '123456789012', raccount: '333333333333', amount: 60, date: new Date() }
      ];
      
      (transferService.getTransferHistory as jasmine.Spy).and.returnValue(of(mockTransfers));
      component.transfer = 0;
      component.ngOnInit();
      
      expect(component.transfer).toBe(285);
    });

    it('should set mostRecentTransaction to the first transaction in the list', () => {
      const mockTransactions = [
        { id: 1006, date: new Date('2025-11-05'), action: 'deposit', amount: 1200 },
        { id: 1005, date: new Date('2025-11-03'), action: 'withdraw', amount: 200 }
      ];
      
      (transactionService.getTransactions as jasmine.Spy).and.returnValue(of(mockTransactions));
      component.ngOnInit();
      
      expect(component.mostRecentTransaction).toEqual(mockTransactions[0]);
    });

    it('should store savingAccNo in localStorage after fetching user data', () => {
      (userService.getUser as jasmine.Spy).and.returnValue(of({
        savingsAccno: 123456789012,
        primaryAccno: 987654321000,
        savingsBalance: 13450,
        primaryBalance: 2500
      }));
      
      component.ngOnInit();
      
      expect(localStorage.getItem('savingAccNo')).toBe('123456789012');
    });
  });

  describe('Navigation Links', () => {
    it('should have a link to transfer page', () => {
      const transferLink = compiled.querySelector('a[routerLink="/transfer"]');
      expect(transferLink).toBeTruthy();
      expect(transferLink?.textContent).toContain('Transfer Money');
    });

    it('should have a link to withdraw page', () => {
      const withdrawLink = compiled.querySelector('a[routerLink="/withdraw"]');
      expect(withdrawLink).toBeTruthy();
      expect(withdrawLink?.textContent).toContain('Withdraw Money');
    });

    it('should have a link to deposit page', () => {
      const depositLink = compiled.querySelector('a[routerLink="/deposit"]');
      expect(depositLink).toBeTruthy();
      expect(depositLink?.textContent).toContain('Deposit Money');
    });

    it('should have a link to transaction history page', () => {
      const transactionLink = compiled.querySelector('a[routerLink="/transactionHistory"]');
      expect(transactionLink).toBeTruthy();
      expect(transactionLink?.textContent).toContain('View Transactions');
    });
  });

  describe('UI Elements', () => {
    it('should display all four main dashboard cards', () => {
      const cards = compiled.querySelectorAll('.card');
      expect(cards.length).toBeGreaterThanOrEqual(5);
    });

    it('should display correct icons for each section', () => {
      fixture.detectChanges();
      const icons = compiled.querySelectorAll('i[class*="fa-"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should display deposit arrow icon for deposit transactions', () => {
      component.mostRecentTransaction = {
        id: 1,
        date: new Date(),
        action: 'deposit',
        amount: 1000
      };
      fixture.detectChanges();
      
      const depositArrow = compiled.querySelector('.fa-arrow-down.deposit-arrow');
      expect(depositArrow).toBeTruthy();
    });

    it('should display withdraw arrow icon for withdraw transactions', () => {
      component.mostRecentTransaction = {
        id: 1,
        date: new Date(),
        action: 'withdraw',
        amount: 500
      };
      fixture.detectChanges();
      
      const withdrawArrow = compiled.querySelector('.fa-arrow-up.withdraw-arrow');
      expect(withdrawArrow).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty transaction list gracefully', () => {
      (transactionService.getTransactions as jasmine.Spy).and.returnValue(of([]));
      component.transaction = { count: 0, deposit: 0, withdrawl: 0 };
      component.mostRecentTransaction = null;
      component.ngOnInit();
      
      expect(component.transaction.count).toBe(0);
      expect(component.transaction.deposit).toBe(0);
      expect(component.transaction.withdrawl).toBe(0);
      expect(component.mostRecentTransaction).toBeNull();
    });

    it('should handle empty transfer history gracefully', () => {
      (transferService.getTransferHistory as jasmine.Spy).and.returnValue(of([]));
      component.transfer = 0;
      component.ngOnInit();
      
      expect(component.transfer).toBe(0);
    });

    it('should handle null response from getTransferHistory', () => {
      (transferService.getTransferHistory as jasmine.Spy).and.returnValue(of(null));
      component.transfer = 0;
      component.ngOnInit();
      
      expect(component.transfer).toBe(0);
    });
  });
});

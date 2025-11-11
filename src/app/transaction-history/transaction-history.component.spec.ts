import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AgGridModule } from 'ag-grid-angular';

import { TransactionHistoryComponent } from './transaction-history.component';
import { TransactionService } from '../transaction.service';
import { MockBankDataService } from '../mock-bank-data.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;
  let transactionService: TransactionService;
  let mockBankDataService: MockBankDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [TransactionHistoryComponent],
    imports: [RouterTestingModule, AgGridModule],
    providers: [TransactionService, MockBankDataService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    mockBankDataService = new MockBankDataService();
    
    TestBed.overrideProvider(MockBankDataService, { useValue: mockBankDataService });
    TestBed.overrideProvider(TransactionService, { useValue: new TransactionService(mockBankDataService) });
    
    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService);
    
    localStorage.setItem('username', 'testuser');
    localStorage.setItem('savingAccNo', '123456789012');
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transaction history on init', (done) => {
    component.ngOnInit();
    
    setTimeout(() => {
      expect(component.transactionList).toBeDefined();
      expect(component.transactionList.length).toBeGreaterThan(0);
      done();
    }, 100);
  });

  it('should update transaction history after a deposit', (done) => {
    let initialTransactionCount: number;
    mockBankDataService.transactions$.subscribe(transactions => {
      initialTransactionCount = transactions.length;
    }).unsubscribe();
    
    const depositAmount = 250;
    
    mockBankDataService.deposit('123456789012', depositAmount);
    
    setTimeout(() => {
      mockBankDataService.transactions$.subscribe(updatedTransactions => {
        expect(updatedTransactions.length).toBe(initialTransactionCount + 1);
        expect(updatedTransactions[0].action).toBe('deposit');
        expect(updatedTransactions[0].amount).toBe(depositAmount);
        done();
      }).unsubscribe();
    }, 100);
  });

  it('should update transaction history after a withdrawal', (done) => {
    let initialTransactionCount: number;
    mockBankDataService.transactions$.subscribe(transactions => {
      initialTransactionCount = transactions.length;
    }).unsubscribe();
    
    const withdrawAmount = 150;
    
    mockBankDataService.withdraw('123456789012', withdrawAmount);
    
    setTimeout(() => {
      mockBankDataService.transactions$.subscribe(updatedTransactions => {
        expect(updatedTransactions.length).toBe(initialTransactionCount + 1);
        expect(updatedTransactions[0].action).toBe('withdraw');
        expect(updatedTransactions[0].amount).toBe(withdrawAmount);
        done();
      }).unsubscribe();
    }, 100);
  });

  it('should update transaction history with both deposit and withdrawal', (done) => {
    let initialTransactionCount: number;
    mockBankDataService.transactions$.subscribe(transactions => {
      initialTransactionCount = transactions.length;
    }).unsubscribe();
    
    const depositAmount = 300;
    const withdrawAmount = 100;
    
    mockBankDataService.deposit('123456789012', depositAmount);
    mockBankDataService.withdraw('123456789012', withdrawAmount);
    
    setTimeout(() => {
      mockBankDataService.transactions$.subscribe(updatedTransactions => {
        expect(updatedTransactions.length).toBe(initialTransactionCount + 2);
        expect(updatedTransactions[0].action).toBe('withdraw');
        expect(updatedTransactions[0].amount).toBe(withdrawAmount);
        expect(updatedTransactions[1].action).toBe('deposit');
        expect(updatedTransactions[1].amount).toBe(depositAmount);
        done();
      }).unsubscribe();
    }, 100);
  });

  it('should display correct balance after transactions', (done) => {
    component.ngOnInit();
    
    setTimeout(() => {
      const currentBalance = component.savingBalance;
      expect(currentBalance).toBeDefined();
      expect(typeof currentBalance).toBe('number');
      done();
    }, 100);
  });
});

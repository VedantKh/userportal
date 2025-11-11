import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { DepositComponent } from './deposit.component';
import { DepositService } from '../deposit.service';
import { MockBankDataService } from '../mock-bank-data.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DepositComponent', () => {
  let component: DepositComponent;
  let fixture: ComponentFixture<DepositComponent>;
  let depositService: DepositService;
  let mockBankDataService: MockBankDataService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DepositComponent],
    imports: [ReactiveFormsModule,
        RouterTestingModule],
    providers: [DepositService, MockBankDataService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    mockBankDataService = new MockBankDataService();
    
    TestBed.overrideProvider(MockBankDataService, { useValue: mockBankDataService });
    TestBed.overrideProvider(DepositService, { useValue: new DepositService(mockBankDataService) });
    
    fixture = TestBed.createComponent(DepositComponent);
    component = fixture.componentInstance;
    depositService = TestBed.inject(DepositService);
    router = TestBed.inject(Router);
    
    localStorage.setItem('savingAccNo', '123456789012');
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should successfully deposit a specified amount', (done) => {
    let initialBalance: number;
    mockBankDataService.savingBalance$.subscribe(balance => {
      initialBalance = balance;
    }).unsubscribe();
    
    expect(initialBalance).toBe(13450); // Verify starting balance
    
    const depositAmount = 500;
    
    component.depositForm.patchValue({
      account: 123456789012,
      amount: depositAmount,
    });

    spyOn(router, 'navigate');
    
    component.deposit();

    setTimeout(() => {
      mockBankDataService.savingBalance$.subscribe(newBalance => {
        expect(newBalance).toBe(13950); // 13450 + 500 = 13950
        expect(component.loading).toBe(false);
        done();
      }).unsubscribe();
    }, 100);
  });

  it('should not allow deposit with invalid form', () => {
    component.depositForm.patchValue({
      account: 123456789012,
      amount: '',
    });

    component.deposit();

    expect(component.submitted).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should reject deposit with zero or negative amount', (done) => {
    let initialBalance: number;
    mockBankDataService.savingBalance$.subscribe(balance => {
      initialBalance = balance;
    }).unsubscribe();
    
    component.depositForm.patchValue({
      account: 123456789012,
      amount: 0,
    });

    component.deposit();

    setTimeout(() => {
      mockBankDataService.savingBalance$.subscribe(balance => {
        expect(balance).toBe(initialBalance);
        expect(component.loading).toBe(false);
        done();
      }).unsubscribe();
    }, 100);
  });
});

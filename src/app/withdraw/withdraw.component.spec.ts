import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { WithdrawComponent } from './withdraw.component';
import { WithdrawService } from '../withdraw.service';
import { MockBankDataService } from '../mock-bank-data.service';

describe('WithdrawComponent', () => {
  let component: WithdrawComponent;
  let fixture: ComponentFixture<WithdrawComponent>;
  let withdrawService: WithdrawService;
  let mockBankDataService: MockBankDataService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WithdrawComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [WithdrawService, MockBankDataService],
    }).compileComponents();
  });

  beforeEach(() => {
    mockBankDataService = new MockBankDataService();
    
    TestBed.overrideProvider(MockBankDataService, { useValue: mockBankDataService });
    TestBed.overrideProvider(WithdrawService, { useValue: new WithdrawService(mockBankDataService) });
    
    fixture = TestBed.createComponent(WithdrawComponent);
    component = fixture.componentInstance;
    withdrawService = TestBed.inject(WithdrawService);
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

  it('should successfully withdraw a specified amount', (done) => {
    let initialBalance: number;
    mockBankDataService.savingBalance$.subscribe(balance => {
      initialBalance = balance;
    }).unsubscribe();
    
    expect(initialBalance).toBe(13450); // Verify starting balance
    
    const withdrawAmount = 200;
    
    component.withdrawForm.patchValue({
      account: 123456789012,
      amount: withdrawAmount,
    });

    spyOn(router, 'navigate');
    
    component.withdraw();

    setTimeout(() => {
      mockBankDataService.savingBalance$.subscribe(newBalance => {
        expect(newBalance).toBe(13250); // 13450 - 200 = 13250
        expect(component.loading).toBe(false);
        done();
      }).unsubscribe();
    }, 100);
  });

  it('should display error message when withdrawal amount exceeds balance', (done) => {
    let currentBalance: number;
    mockBankDataService.savingBalance$.subscribe(balance => {
      currentBalance = balance;
    }).unsubscribe();
    
    expect(currentBalance).toBe(13450); // Verify starting balance
    
    const excessiveAmount = currentBalance + 1000; // 14450
    
    component.withdrawForm.patchValue({
      account: 123456789012,
      amount: excessiveAmount,
    });

    component.withdraw();

    setTimeout(() => {
      mockBankDataService.savingBalance$.subscribe(balance => {
        expect(balance).toBe(13450); // Balance should remain unchanged
        expect(component.loading).toBe(false);
        done();
      }).unsubscribe();
    }, 100);
  });

  it('should not allow withdrawal with invalid form', () => {
    component.withdrawForm.patchValue({
      account: 123456789012,
      amount: '',
    });

    component.withdraw();

    expect(component.submitted).toBe(true);
    expect(component.loading).toBe(false);
  });
});

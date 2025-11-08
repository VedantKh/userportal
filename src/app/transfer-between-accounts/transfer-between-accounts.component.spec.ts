import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TransferBetweenAccountsComponent } from './transfer-between-accounts.component';

describe('TransferBetweenAccountsComponent', () => {
  let component: TransferBetweenAccountsComponent;
  let fixture: ComponentFixture<TransferBetweenAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferBetweenAccountsComponent ],
      imports: [ ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferBetweenAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

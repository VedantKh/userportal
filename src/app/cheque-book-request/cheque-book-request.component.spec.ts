import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ChequeBookRequestComponent } from './cheque-book-request.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ChequeBookRequestComponent', () => {
  let component: ChequeBookRequestComponent;
  let fixture: ComponentFixture<ChequeBookRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChequeBookRequestComponent],
    imports: [ReactiveFormsModule,
        RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

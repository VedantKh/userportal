import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Demo: pre-authenticate and set default user, then go to home
    const defaultUsername = 'Vedant';
    localStorage.setItem('login', 'true');
    localStorage.setItem('username', defaultUsername);
    // Ensure a default savings account number is present for demo services
    localStorage.setItem('savingAccNo', '123456789012');
    this.authService.setUserName(defaultUsername);
    this.authService.authenticate(true);
    this.router.navigate(['/home']);
  }
}

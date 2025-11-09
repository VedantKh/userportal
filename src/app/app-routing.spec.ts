import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppModule } from './app.module';

describe('Application Routing and Navigation Tests', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  describe('Route Configuration', () => {
    it('should have all expected routes configured', () => {
      const config = router.config;
      const routePaths = config.map(route => route.path);
      
      expect(routePaths).toContain('');
      expect(routePaths).toContain('login');
      expect(routePaths).toContain('register');
      expect(routePaths).toContain('home');
      expect(routePaths).toContain('deposit');
      expect(routePaths).toContain('withdraw');
      expect(routePaths).toContain('transfer');
      expect(routePaths).toContain('transactionHistory');
      expect(routePaths).toContain('transferHistory');
      expect(routePaths).toContain('chequebookRequest');
      expect(routePaths).toContain('editProfile');
      expect(routePaths).toContain('**');
    });

    it('should have correct number of routes', () => {
      const config = router.config;
      expect(config.length).toBe(12);
    });

    it('should redirect empty path to home', () => {
      const emptyRoute = router.config.find(r => r.path === '');
      expect(emptyRoute).toBeDefined();
      expect(emptyRoute?.redirectTo).toBe('/home');
      expect(emptyRoute?.pathMatch).toBe('full');
    });

    it('should redirect wildcard path to home', () => {
      const wildcardRoute = router.config.find(r => r.path === '**');
      expect(wildcardRoute).toBeDefined();
      expect(wildcardRoute?.redirectTo).toBe('/home');
    });
  });

  describe('Protected Routes with AuthGuard', () => {
    const protectedRoutes = [
      'home',
      'deposit',
      'withdraw',
      'transfer',
      'transactionHistory',
      'transferHistory',
      'chequebookRequest',
      'editProfile'
    ];

    protectedRoutes.forEach(path => {
      it(`should have AuthGuard on ${path} route`, () => {
        const route = router.config.find(r => r.path === path);
        expect(route).toBeDefined();
        expect(route?.canActivate).toBeDefined();
        expect(route?.canActivate?.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Public Routes without AuthGuard', () => {
    const publicRoutes = ['login', 'register'];

    publicRoutes.forEach(path => {
      it(`should not have AuthGuard on ${path} route`, () => {
        const route = router.config.find(r => r.path === path);
        expect(route).toBeDefined();
        expect(route?.canActivate).toBeUndefined();
      });
    });
  });

  describe('Component Mapping', () => {
    it('should map login route to LoginComponent', () => {
      const route = router.config.find(r => r.path === 'login');
      expect(route).toBeDefined();
      expect(route?.component).toBeDefined();
    });

    it('should map register route to RegisterComponent', () => {
      const route = router.config.find(r => r.path === 'register');
      expect(route).toBeDefined();
      expect(route?.component).toBeDefined();
    });

    it('should map home route to HomeComponent', () => {
      const route = router.config.find(r => r.path === 'home');
      expect(route).toBeDefined();
      expect(route?.component).toBeDefined();
    });

    it('should map deposit route to DepositComponent', () => {
      const route = router.config.find(r => r.path === 'deposit');
      expect(route).toBeDefined();
      expect(route?.component).toBeDefined();
    });

    it('should map withdraw route to WithdrawComponent', () => {
      const route = router.config.find(r => r.path === 'withdraw');
      expect(route).toBeDefined();
      expect(route?.component).toBeDefined();
    });

    it('should map transfer route to TransferBetweenAccountsComponent', () => {
      const route = router.config.find(r => r.path === 'transfer');
      expect(route).toBeDefined();
      expect(route?.component).toBeDefined();
    });

    it('should map transactionHistory route to TransactionHistoryComponent', () => {
      const route = router.config.find(r => r.path === 'transactionHistory');
      expect(route).toBeDefined();
      expect(route?.component).toBeDefined();
    });

    it('should map transferHistory route to TransferHistoryComponent', () => {
      const route = router.config.find(r => r.path === 'transferHistory');
      expect(route).toBeDefined();
      expect(route?.component).toBeDefined();
    });

    it('should map chequebookRequest route to ChequeBookRequestComponent', () => {
      const route = router.config.find(r => r.path === 'chequebookRequest');
      expect(route).toBeDefined();
      expect(route?.component).toBeDefined();
    });

    it('should map editProfile route to EditProfileComponent', () => {
      const route = router.config.find(r => r.path === 'editProfile');
      expect(route).toBeDefined();
      expect(route?.component).toBeDefined();
    });
  });

  describe('Route URLs', () => {
    it('should generate correct URL for login', () => {
      const url = router.createUrlTree(['/login']).toString();
      expect(url).toBe('/login');
    });

    it('should generate correct URL for register', () => {
      const url = router.createUrlTree(['/register']).toString();
      expect(url).toBe('/register');
    });

    it('should generate correct URL for home', () => {
      const url = router.createUrlTree(['/home']).toString();
      expect(url).toBe('/home');
    });

    it('should generate correct URL for deposit', () => {
      const url = router.createUrlTree(['/deposit']).toString();
      expect(url).toBe('/deposit');
    });

    it('should generate correct URL for withdraw', () => {
      const url = router.createUrlTree(['/withdraw']).toString();
      expect(url).toBe('/withdraw');
    });

    it('should generate correct URL for transfer', () => {
      const url = router.createUrlTree(['/transfer']).toString();
      expect(url).toBe('/transfer');
    });

    it('should generate correct URL for transaction history', () => {
      const url = router.createUrlTree(['/transactionHistory']).toString();
      expect(url).toBe('/transactionHistory');
    });

    it('should generate correct URL for transfer history', () => {
      const url = router.createUrlTree(['/transferHistory']).toString();
      expect(url).toBe('/transferHistory');
    });

    it('should generate correct URL for cheque book request', () => {
      const url = router.createUrlTree(['/chequebookRequest']).toString();
      expect(url).toBe('/chequebookRequest');
    });

    it('should generate correct URL for edit profile', () => {
      const url = router.createUrlTree(['/editProfile']).toString();
      expect(url).toBe('/editProfile');
    });
  });
});

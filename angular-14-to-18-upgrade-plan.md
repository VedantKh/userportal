# Angular 14 to 18 Upgrade Plan for UserPortal Repository

## Executive Summary

This document provides a comprehensive plan for upgrading the ICIN Bank UserPortal application from Angular 14 to Angular 18. The upgrade will be performed incrementally through four major version hops (14→15→16→17→18) to minimize risk and isolate potential issues. Each upgrade step will be implemented as a separate pull request with thorough testing and verification.

**Current State:**
- Angular: 14.0.7
- TypeScript: 4.7.4
- Node.js: 22.12.0 (currently unsupported by Angular 14)
- RxJS: 7.5.7
- Zone.js: 0.11.4
- ag-grid-angular: 28.0.0
- sweetalert2: 11.4.38

**Target State:**
- Angular: 18.x
- TypeScript: ~5.4.x
- Node.js: 18.19+ or 20.9+ (recommended)
- RxJS: 7.8.x
- Zone.js: ~0.14.x
- ag-grid-angular: 32.x (compatible with Angular 18)
- sweetalert2: Latest stable

---

## 1. Pre-Upgrade Assessment

### 1.1 Current Architecture Analysis

**Application Type:** Traditional NgModule-based Angular application (not standalone components)

**Key Components:**
- 13 components including: Login, Register, Home (Dashboard), Deposit, Withdraw, Transfer, Transaction History, Edit Profile, Cheque Book Request, Header, Footer
- 14 services for authentication, banking operations, and data management
- Class-based route guards implementing `CanActivate` interface
- Reactive forms with FormBuilder and validation
- HttpClient for REST API communication
- BrowserAnimationsModule for animations

**Third-Party Dependencies:**
- **ag-grid-angular 28.0.0**: Critical dependency for transaction history grids with sorting/filtering
- **sweetalert2 11.4.38**: User notification modals throughout the application
- **Puppeteer**: Used for headless Chrome testing in Karma configuration

**Testing Infrastructure:**
- Karma + Jasmine test framework
- Headless Chrome via Puppeteer with custom ChromeHeadlessCI launcher
- Test entry point: `src/test.ts` with zone.js/testing import
- Verified test command: `npm test -- --watch=false --browsers=ChromeHeadlessCI`

**Build Configuration:**
- Traditional browser builder: `@angular-devkit/build-angular:browser`
- Environment file replacements for production builds
- Performance budgets: 500KB warning / 1MB error for initial bundle
- Polyfills file: `src/polyfills.ts` with zone.js import
- TypeScript strict mode: **disabled** (strict: false in tsconfig.json)
- Target: ES2017, Module: ES2020

**Browser Support:**
- Modern evergreen browsers (last 1-2 versions)
- Chrome, Firefox, Edge, Safari, iOS Safari
- Firefox ESR

### 1.2 Critical Findings

**Node.js Version Mismatch:**
The current Node.js version (22.12.0) is not supported by Angular 14. This will need to be addressed during the upgrade process. Angular 18 requires Node.js 18.19+ or 20.9+.

**Repo Setup Notes:**
According to the repo setup documentation, there are uncommitted changes related to test compilation fixes, headless Chrome configuration, and production environment baseUrl. These should be committed before starting the upgrade to ensure clean diffs.

**No CI/CD Pipeline:**
No GitHub Actions, GitLab CI, or other CI/CD configuration files were found in the repository root. All testing and verification will need to be performed locally.

---

## 2. Major Breaking Changes by Version

### 2.1 Angular 15 (v14 → v15)

**TypeScript Version:**
- Minimum: TypeScript 4.8.x
- Recommended: TypeScript 4.8.2+
- Impact: Stricter type checking may surface previously unnoticed type issues

**Standalone Components (Optional):**
- Angular 15 introduces standalone components, directives, and pipes
- **Recommendation:** Do NOT migrate to standalone during upgrade; keep NgModule architecture
- Migration can be done as a separate refactoring effort after Angular 18 is stable

**Router Changes:**
- `RouterModule.forRoot()` now has stricter typing
- Functional guards introduced (optional, not required)
- **Impact:** Minimal - existing class-based guards continue to work

**Directive Composition API:**
- New feature for composing directives
- **Impact:** None - optional feature

**Image Directive:**
- New NgOptimizedImage directive for performance
- **Impact:** None - optional feature

**Dependency Updates:**
- RxJS: Continue with 7.5.x (7.8.x compatible)
- Zone.js: Upgrade to ~0.12.x

**Deprecations:**
- `providedIn: 'any'` deprecated (not used in this codebase)
- Legacy View Engine removed (already using Ivy)

### 2.2 Angular 16 (v15 → v16)

**TypeScript Version:**
- Minimum: TypeScript 4.9.3
- Recommended: TypeScript 5.0.x
- Impact: TypeScript 5.0 introduces stricter type checking, especially for:
  - Generic type inference
  - Enum handling
  - Union type narrowing
  - Decorator metadata

**Signals (Optional):**
- New reactive primitive for state management
- **Recommendation:** Do NOT adopt during upgrade; evaluate post-v18

**Required Inputs:**
- New `@Input({ required: true })` syntax
- **Impact:** None - optional feature, existing code continues to work

**Router Improvements:**
- Functional guards become more prominent
- **Impact:** Minimal - class-based guards still supported

**Dependency Updates:**
- RxJS: 7.5.x to 7.8.x recommended
- Zone.js: ~0.13.x
- Node.js: 16.14+ or 18.10+ required

**Testing Changes:**
- TestBed configuration may require updates
- **Impact:** Review test.ts and karma.conf.js for compatibility

**Deprecations:**
- `ComponentFactoryResolver` deprecated (not used in this codebase)
- `ngcc` (Angular Compatibility Compiler) removed

### 2.3 Angular 17 (v16 → v17)

**NEW BUILD SYSTEM (CRITICAL):**
- **Major Change:** Default builder switches from Webpack to Vite/esbuild
- Builder changes from `@angular-devkit/build-angular:browser` to `@angular-devkit/build-angular:application`
- **Impact:** HIGH - angular.json will be significantly modified
- Benefits: Faster builds, better development experience
- Potential Issues: Custom webpack configurations will break (none detected in this codebase)

**TypeScript Version:**
- Minimum: TypeScript 5.2.x
- Recommended: TypeScript 5.2.2+

**Control Flow Syntax (Optional):**
- New template syntax: `@if`, `@for`, `@switch` replacing `*ngIf`, `*ngFor`, `*ngSwitch`
- **Recommendation:** Do NOT migrate during upgrade; existing syntax continues to work

**Deferrable Views:**
- New `@defer` syntax for lazy loading
- **Impact:** None - optional feature

**Dependency Updates:**
- Zone.js: ~0.14.x
- Node.js: 18.13+ or 20.9+ required

**Polyfills Changes:**
- `polyfills.ts` file may be replaced with `polyfills` array in angular.json
- **Impact:** Medium - verify zone.js import remains correct

**Testing Changes:**
- Karma builder updated to work with new build system
- **Impact:** Medium - verify ChromeHeadlessCI configuration remains functional

### 2.4 Angular 18 (v17 → v18)

**TypeScript Version:**
- Minimum: TypeScript 5.4.x
- Recommended: TypeScript 5.4.2+

**Zoneless Change Detection (Optional):**
- Experimental support for running without zone.js
- **Recommendation:** Do NOT adopt during upgrade; keep zone.js

**Material 3 Support:**
- Not applicable - this codebase doesn't use Angular Material

**Route Redirects:**
- Enhanced redirect handling
- **Impact:** Minimal - verify wildcard redirect `{ path: '**', redirectTo: '/home' }` works correctly

**Dependency Updates:**
- RxJS: 7.8.x (stable)
- Zone.js: ~0.14.x
- Node.js: 18.19+ or 20.9+ required

**Server-Side Rendering Improvements:**
- Not applicable - this is a client-side only application

**Hydration:**
- Not applicable - no SSR in this codebase

---

## 3. Third-Party Dependency Challenges

### 3.1 ag-grid-angular

**Current Version:** 28.0.0 (compatible with Angular 14)

**Target Version:** 32.x or 33.x (compatible with Angular 18)

**Breaking Changes:**
- Major version upgrades from 28 → 32+ will include API changes
- `ColDef` interface may have modified properties
- Grid options and configuration may have changed
- Theme/CSS imports may have changed

**Migration Strategy:**
- Upgrade ag-grid-angular AFTER Angular 18 is stable
- Create separate PR for ag-grid upgrade
- Consult ag-grid migration guides for versions 29, 30, 31, 32
- Test extensively: transaction history grid, transfer history grid
- Verify: sorting, filtering, column definitions, data binding

**Verification Points:**
- Grid renders without errors
- Sorting functionality works on all columns
- Filtering functionality works on all columns
- Data loads correctly from services
- No TypeScript compilation errors with ColDef types

### 3.2 sweetalert2

**Current Version:** 11.4.38

**Target Version:** Latest stable (11.x or 12.x)

**Breaking Changes:**
- Minimal breaking changes expected within 11.x
- If upgrading to 12.x, review changelog for API changes

**Migration Strategy:**
- Upgrade during or after Angular 18 upgrade
- Low risk - API is stable

**Verification Points:**
- Success modals display correctly (deposit, withdraw, transfer, register, edit profile)
- Error modals display correctly
- Modal styling remains consistent
- ESM/CJS import resolution works with updated TypeScript module settings

### 3.3 Puppeteer

**Current Version:** 24.29.1

**Challenges:**
- Puppeteer version must match compatible Chromium version
- Node.js version changes may affect Puppeteer compatibility
- ChromeHeadlessCI flags may need adjustment

**Migration Strategy:**
- Update Puppeteer if headless tests fail
- Adjust karma.conf.js flags if needed: `--no-sandbox`, `--disable-web-security`, `--disable-gpu`
- Consider using `@puppeteer/browsers` for better version management

**Verification Points:**
- Headless Chrome launches successfully
- All unit tests pass in headless mode
- No browser launch timeout errors

---

## 4. Incremental Upgrade Strategy

### 4.1 Pre-Flight Preparation

**Step 1: Commit Existing Changes**
```bash
# Commit the test fixes and configuration changes mentioned in repo notes
git status
git add .
git commit -m "chore: commit test fixes and headless Chrome configuration before Angular upgrade"
```

**Step 2: Create Baseline Snapshot**
```bash
# Record current state
node -v > upgrade-baseline.txt
npm -v >> upgrade-baseline.txt
npx ng version >> upgrade-baseline.txt
cp package-lock.json package-lock.json.v14.backup
cp angular.json angular.json.v14.backup

# Verify current state works
npm ci
npm run build
npm test -- --watch=false --browsers=ChromeHeadlessCI
```

**Step 3: Address Node.js Version**
```bash
# Install and use Node.js 20 (LTS) for Angular 18 compatibility
# Using nvm (if available):
nvm install 20
nvm use 20

# Or create .nvmrc file
echo "20" > .nvmrc
```

### 4.2 Phase 1: Angular 14 → 15

**Branch:** `devin/angular-15-upgrade`

**Commands:**
```bash
# Create branch
git checkout -b devin/angular-15-upgrade

# Run Angular update
npx ng update @angular/core@15 @angular/cli@15

# Review and accept migrations
# The CLI will automatically update:
# - package.json dependencies
# - angular.json configuration
# - TypeScript files (if migrations are needed)

# Install updated dependencies
npm install

# Update TypeScript if needed
npm install --save-dev typescript@~4.8.0
```

**Expected Changes:**
- Angular packages: 14.0.x → 15.x.x
- TypeScript: 4.7.x → 4.8.x
- Zone.js: 0.11.x → 0.12.x
- Angular CLI: 14.0.x → 15.x.x

**Verification:**
```bash
# Build
npm run build
npm run build -- --configuration production

# Test
npm test -- --watch=false --browsers=ChromeHeadlessCI

# Serve and manual smoke test
npm start
# Test: login flow, dashboard, deposit, withdraw, transfer, transaction history
```

**Potential Issues:**
- TypeScript 4.8 may flag new type errors
- Test imports may need adjustment
- Karma configuration may need updates

### 4.3 Phase 2: Angular 15 → 16

**Branch:** `devin/angular-16-upgrade`

**Commands:**
```bash
# Create branch from main (after Phase 1 is merged)
git checkout main
git pull
git checkout -b devin/angular-16-upgrade

# Run Angular update
npx ng update @angular/core@16 @angular/cli@16

# Install updated dependencies
npm install

# Update TypeScript to 5.0
npm install --save-dev typescript@~5.0.0

# Update RxJS if prompted
npx ng update rxjs
```

**Expected Changes:**
- Angular packages: 15.x.x → 16.x.x
- TypeScript: 4.8.x → 5.0.x
- Zone.js: 0.12.x → 0.13.x
- RxJS: 7.5.x → 7.8.x (if updated)

**Verification:**
```bash
# Build
npm run build
npm run build -- --configuration production

# Test
npm test -- --watch=false --browsers=ChromeHeadlessCI

# Serve and manual smoke test
npm start
```

**Potential Issues:**
- TypeScript 5.0 stricter type checking may surface errors
- Generic type inference changes may require explicit type parameters
- HttpClient calls may need explicit response types
- Form control types may need refinement

### 4.4 Phase 3: Angular 16 → 17 (CRITICAL - Build System Change)

**Branch:** `devin/angular-17-upgrade`

**Commands:**
```bash
# Create branch from main (after Phase 2 is merged)
git checkout main
git pull
git checkout -b devin/angular-17-upgrade

# Run Angular update
npx ng update @angular/core@17 @angular/cli@17

# Install updated dependencies
npm install

# Update TypeScript to 5.2
npm install --save-dev typescript@~5.2.0
```

**Expected Changes (MAJOR):**
- Angular packages: 16.x.x → 17.x.x
- TypeScript: 5.0.x → 5.2.x
- Zone.js: 0.13.x → 0.14.x
- **angular.json:** Builder changes from `browser` to `application` (or remains `browser` with updates)
- **Polyfills:** May move from `src/polyfills.ts` to array in angular.json
- **Build system:** Switches to Vite/esbuild by default

**Critical Verification Points:**
```bash
# Build (may be slower on first build due to cache generation)
npm run build
npm run build -- --configuration production

# Verify output structure
ls -la dist/

# Test (Karma configuration must work with new builder)
npm test -- --watch=false --browsers=ChromeHeadlessCI

# Serve (dev server may behave differently)
npm start
# Verify hot module replacement works
# Verify environment.ts is correctly replaced in production mode
```

**Potential Issues:**
- angular.json structure significantly changed
- Polyfills import may break if not migrated correctly
- Karma test builder may need configuration updates
- ChromeHeadlessCI may need flag adjustments
- Build output path may change
- Source maps may be structured differently
- Performance budgets may need adjustment

**Rollback Plan:**
If the new build system causes critical issues:
1. Keep detailed notes of errors
2. Check Angular CLI migration logs
3. Consult Angular 17 migration guide for builder-specific issues
4. Consider using `--force` flag only after reviewing warnings

### 4.5 Phase 4: Angular 17 → 18

**Branch:** `devin/angular-18-upgrade`

**Commands:**
```bash
# Create branch from main (after Phase 3 is merged)
git checkout main
git pull
git checkout -b devin/angular-18-upgrade

# Run Angular update
npx ng update @angular/core@18 @angular/cli@18

# Install updated dependencies
npm install

# Update TypeScript to 5.4
npm install --save-dev typescript@~5.4.0
```

**Expected Changes:**
- Angular packages: 17.x.x → 18.x.x
- TypeScript: 5.2.x → 5.4.x
- RxJS: Ensure 7.8.x
- Zone.js: Ensure ~0.14.x

**Verification:**
```bash
# Build
npm run build
npm run build -- --configuration production

# Test
npm test -- --watch=false --browsers=ChromeHeadlessCI

# Serve
npm start
```

**Potential Issues:**
- TypeScript 5.4 may introduce additional type checking
- Final API deprecations may need addressing
- Router behavior verification needed

### 4.6 Phase 5: Third-Party Dependency Upgrades

**Branch:** `devin/upgrade-ag-grid-angular`

**Commands:**
```bash
# Create branch from main (after Phase 4 is merged)
git checkout main
git pull
git checkout -b devin/upgrade-ag-grid-angular

# Check compatible ag-grid version for Angular 18
npm info ag-grid-angular versions
npm info ag-grid-angular peerDependencies

# Upgrade ag-grid packages
npm install ag-grid-angular@^32.0.0 ag-grid-community@^32.0.0

# Or use latest compatible version
npm install ag-grid-angular@latest ag-grid-community@latest
```

**Migration Steps:**
1. Review ag-grid migration guides for versions 29, 30, 31, 32
2. Update ColDef interfaces in transaction-history.component.ts and transfer-history.component.ts
3. Update grid options if API changed
4. Update CSS/theme imports if changed
5. Test grid functionality extensively

**Verification:**
```bash
# Build
npm run build

# Test
npm test -- --watch=false --browsers=ChromeHeadlessCI

# Manual testing
npm start
# Navigate to Transaction History
# Verify: grid renders, data loads, sorting works, filtering works
# Navigate to Transfer History
# Verify: same checks
```

**sweetalert2 Update:**
```bash
# Update sweetalert2 to latest
npm install sweetalert2@latest

# Test all modal usages
# Deposit, Withdraw, Transfer, Register, Edit Profile, Cheque Book Request
```

---

## 5. Potential Challenges and Mitigation Strategies

### 5.1 TypeScript Strictness Issues

**Challenge:**
TypeScript versions 4.8 → 5.4 introduce progressively stricter type checking. The codebase has `strict: false` in tsconfig.json, but the compiler may still flag issues.

**Common Issues:**
- Implicit `any` types in service methods
- Missing generic types on HttpClient calls
- Form control types not explicitly typed
- Union type narrowing issues
- Enum handling changes

**Mitigation:**
```typescript
// Before (may cause errors)
this.http.post(url, body).subscribe(response => {
  // response is 'any'
});

// After (explicit typing)
this.http.post<ResponseType>(url, body).subscribe(response => {
  // response is 'ResponseType'
});

// Form controls
// Before
this.depositForm = this.formBuilder.group({
  amount: ['', Validators.required]
});

// After (if needed)
this.depositForm = this.formBuilder.group<DepositFormType>({
  amount: ['', Validators.required]
});
```

**Strategy:**
- Address TypeScript errors incrementally at each version hop
- Do NOT enable strict mode during upgrade
- Consider enabling strict mode as a separate PR after Angular 18 is stable
- Use `skipLibCheck: true` temporarily if third-party library types are problematic (not recommended long-term)

### 5.2 RxJS Observable Typing

**Challenge:**
RxJS 7.8.x with TypeScript 5.x may require more explicit typing for observables.

**Common Issues:**
- Observable generic types not specified
- Subscription types unclear
- Operator chain type inference issues

**Mitigation:**
```typescript
// Explicit return types on service methods
getUser(username: string): Observable<UserData> {
  return this.http.get<UserData>(`${environment.baseUrl}/user/${username}`);
}

// Explicit subscription types
this.authService.isLoggedIn.subscribe((isLoggedIn: boolean) => {
  this.loggedIn = isLoggedIn;
});
```

### 5.3 Zone.js Import Changes

**Challenge:**
Zone.js import paths may change across versions, especially in test.ts and polyfills.ts.

**Current State:**
- polyfills.ts: `import 'zone.js';`
- test.ts: `import 'zone.js/testing';`

**Potential Changes:**
- Import paths may need to be updated
- Polyfills may move to angular.json configuration

**Mitigation:**
- Carefully review migration output for zone.js changes
- Verify tests still run after each upgrade
- Check Angular CLI migration logs for zone.js modifications

### 5.4 Build System Migration (Angular 17)

**Challenge:**
The switch from Webpack to Vite/esbuild in Angular 17 is the most significant change in the upgrade path.

**Potential Issues:**
- angular.json structure changes dramatically
- Polyfills handling changes
- Asset handling may differ
- Source map generation differs
- Build output structure may change
- Development server behavior changes

**Mitigation:**
- Backup angular.json before running ng update
- Review CLI migration output carefully
- Test both development and production builds
- Verify environment file replacement still works
- Check that assets are correctly copied
- Ensure performance budgets are still enforced

**Verification Checklist:**
- [ ] Development build works: `npm run build`
- [ ] Production build works: `npm run build -- --configuration production`
- [ ] Dev server works: `npm start`
- [ ] Hot module replacement works
- [ ] Environment variables are correctly replaced
- [ ] Assets are copied to dist folder
- [ ] Source maps are generated
- [ ] Performance budgets are enforced
- [ ] Output hashing works in production

### 5.5 Karma/Jasmine Test Configuration

**Challenge:**
Karma configuration may need updates to work with the new build system in Angular 17+.

**Current Configuration:**
- Custom ChromeHeadlessCI launcher with Puppeteer
- Flags: `--no-sandbox`, `--disable-web-security`, `--disable-gpu`, `--remote-debugging-port=9222`

**Potential Issues:**
- Karma builder changes in angular.json
- Puppeteer compatibility with newer Node.js
- Chromium version compatibility
- Test file discovery changes

**Mitigation:**
```javascript
// karma.conf.js - may need updates
module.exports = function (config) {
  config.set({
    // Ensure frameworks are correct
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    
    // Verify plugins are loaded
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    
    // Keep custom launcher
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-web-security',
          '--disable-gpu',
          '--remote-debugging-port=9222'
        ]
      }
    }
  });
};
```

**Strategy:**
- Run tests after each version upgrade
- If tests fail, check Puppeteer version compatibility
- Update Puppeteer if needed: `npm install --save-dev puppeteer@latest`
- Adjust Chrome flags if needed
- Check karma.conf.js for migration changes

### 5.6 ag-grid-angular Major Version Upgrade

**Challenge:**
Upgrading from ag-grid-angular 28.x to 32.x+ spans multiple major versions with breaking changes.

**Known Breaking Changes (General):**
- ColDef interface properties may be renamed or removed
- Grid options API changes
- Event handling changes
- Theme/CSS structure changes
- Module imports may change

**Mitigation Strategy:**
1. **Research First:**
   - Read ag-grid migration guides: v28→v29, v29→v30, v30→v31, v31→v32
   - Check ag-grid-angular changelog for Angular-specific changes
   - Review TypeScript type definition changes

2. **Incremental Testing:**
   - Update ag-grid packages
   - Fix TypeScript compilation errors first
   - Test grid rendering
   - Test sorting functionality
   - Test filtering functionality
   - Test data binding

3. **Component Updates:**
   - transaction-history.component.ts: Update ColDef definitions
   - transfer-history.component.ts: Update ColDef definitions
   - Verify @ViewChild(AgGridAngular) still works
   - Update grid options if API changed

4. **CSS/Theme Updates:**
   - Check if theme imports need updating
   - Verify grid styling is correct
   - Test responsive behavior

**Rollback Plan:**
If ag-grid upgrade causes critical issues, it can be deferred to a separate effort after Angular 18 is stable.

### 5.7 Node.js Version Management

**Challenge:**
Current Node.js 22.12.0 is not supported by Angular 14. Angular 18 requires Node.js 18.19+ or 20.9+.

**Strategy:**
1. **Use Node.js 20 (LTS):**
   ```bash
   # Using nvm
   nvm install 20
   nvm use 20
   
   # Create .nvmrc for consistency
   echo "20" > .nvmrc
   ```

2. **Document in README:**
   - Add Node.js version requirement
   - Add instructions for using nvm
   - Add engines field to package.json

3. **Verify at Each Step:**
   ```bash
   node -v  # Should show v20.x.x
   npm -v   # Should show compatible npm version
   ```

### 5.8 Environment Configuration

**Challenge:**
Environment file replacement must continue to work after build system changes.

**Current Configuration:**
- Development: `src/environments/environment.ts` (baseUrl: http://192.168.1.8:8080)
- Production: `src/environments/environment.prod.ts` (baseUrl: http://192.168.1.8:8080)
- Replacement configured in angular.json under `fileReplacements`

**Verification:**
```bash
# Development build
npm run build
# Check that development baseUrl is used

# Production build
npm run build -- --configuration production
# Check that production baseUrl is used

# Verify in browser console
# environment.production should be true in prod build
# environment.baseUrl should match expected value
```

**Mitigation:**
- After Angular 17 upgrade, verify fileReplacements still work
- Test both development and production builds
- Check that API calls use correct baseUrl

---

## 6. Tools and Commands Reference

### 6.1 Angular CLI Update Commands

```bash
# Check what can be updated
npx ng update

# Update to specific version (dry run)
npx ng update @angular/core@15 @angular/cli@15 --dry-run

# Update to specific version (actual)
npx ng update @angular/core@15 @angular/cli@15

# Update with force (use with caution)
npx ng update @angular/core@15 @angular/cli@15 --force

# Update RxJS
npx ng update rxjs
```

### 6.2 Dependency Management

```bash
# Clean install
npm ci

# Install specific version
npm install --save-dev typescript@~5.4.0

# Check installed versions
npm ls @angular/core @angular/cli typescript rxjs zone.js

# Check for outdated packages
npm outdated

# View package info
npm info ag-grid-angular versions
npm info ag-grid-angular peerDependencies
```

### 6.3 Build and Test Commands

```bash
# Development build
npm run build
# or
ng build

# Production build
npm run build -- --configuration production
# or
ng build --configuration production

# Serve development
npm start
# or
ng serve

# Run tests (headless)
npm test -- --watch=false --browsers=ChromeHeadlessCI

# Run tests (watch mode)
npm test

# Run tests with coverage
npm test -- --code-coverage --watch=false --browsers=ChromeHeadlessCI
```

### 6.4 Version Checking

```bash
# Node and npm versions
node -v
npm -v

# Angular CLI version
npx ng version

# List all Angular packages
npm ls @angular/*

# Check TypeScript version
npx tsc --version
```

### 6.5 Git Workflow

```bash
# Create feature branch
git checkout -b devin/angular-15-upgrade

# Check status
git status

# View changes
git diff

# Stage changes
git add package.json package-lock.json angular.json
git add src/

# Commit
git commit -m "chore: upgrade to Angular 15"

# Push
git push origin devin/angular-15-upgrade

# Create PR (use git_create_pr tool)
```

### 6.6 Debugging Commands

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for peer dependency issues
npm ls

# Verbose build output
ng build --verbose

# Check bundle sizes
ng build --stats-json
# Then use webpack-bundle-analyzer or similar
```

---

## 7. Verification Methods for Each Upgrade Step

### 7.1 Automated Verification

**Build Verification:**
```bash
# Development build
npm run build
# Expected: Exit code 0, no errors
# Check: dist/ folder created with expected structure

# Production build
npm run build -- --configuration production
# Expected: Exit code 0, no errors
# Check: Optimized bundles, output hashing applied
# Check: Bundle sizes within performance budgets
```

**Test Verification:**
```bash
# Run all tests
npm test -- --watch=false --browsers=ChromeHeadlessCI
# Expected: All tests pass, exit code 0
# Check: No browser launch errors
# Check: No test failures
# Check: Coverage reports generated (if enabled)
```

**Lint Verification (if configured):**
```bash
# Check if lint script exists
npm run lint
# Expected: No lint errors
```

### 7.2 Manual Smoke Testing

**Test Plan for Each Upgrade:**

1. **Application Bootstrap:**
   - [ ] Run `npm start`
   - [ ] Navigate to http://localhost:4200
   - [ ] Check browser console for errors
   - [ ] Verify no compilation errors in terminal
   - [ ] Verify hot module replacement works (make a small change, verify auto-reload)

2. **Authentication Flow:**
   - [ ] Application loads in demo mode (pre-authenticated)
   - [ ] Header displays correctly with user name
   - [ ] Navigation menu is visible and functional
   - [ ] Footer displays correctly

3. **Dashboard (Home Component):**
   - [ ] Navigate to /home
   - [ ] Verify savings balance displays
   - [ ] Verify primary balance displays
   - [ ] Verify transaction count displays
   - [ ] Verify deposit/withdrawal/transfer totals display
   - [ ] Verify quick action links work

4. **Deposit Feature:**
   - [ ] Navigate to /deposit
   - [ ] Form renders correctly
   - [ ] Account number is pre-filled
   - [ ] Enter amount and submit
   - [ ] Verify SweetAlert2 modal displays (success or error)
   - [ ] Verify form validation works (required field)

5. **Withdraw Feature:**
   - [ ] Navigate to /withdraw
   - [ ] Form renders correctly
   - [ ] Enter amount and submit
   - [ ] Verify SweetAlert2 modal displays
   - [ ] Verify form validation works

6. **Transfer Feature:**
   - [ ] Navigate to /transfer
   - [ ] Form renders correctly with all fields
   - [ ] Enter receiver account, IFSC, amount
   - [ ] Submit form
   - [ ] Verify SweetAlert2 modal displays
   - [ ] Verify form validation works (all required fields)

7. **Transaction History:**
   - [ ] Navigate to /transactionHistory
   - [ ] Verify ag-grid renders without errors
   - [ ] Verify data loads in grid
   - [ ] Test sorting on each column (date, id, action, amount)
   - [ ] Test filtering on each column
   - [ ] Verify grid is responsive

8. **Transfer History:**
   - [ ] Navigate to /transferHistory
   - [ ] Verify ag-grid renders without errors
   - [ ] Verify data loads in grid
   - [ ] Test sorting functionality
   - [ ] Test filtering functionality

9. **Edit Profile:**
   - [ ] Navigate to /editProfile
   - [ ] Form renders with all fields
   - [ ] Enter/modify phone, address, email, password
   - [ ] Submit form
   - [ ] Verify SweetAlert2 modal displays
   - [ ] Verify email validation works
   - [ ] Verify password min-length validation works

10. **Cheque Book Request:**
    - [ ] Navigate to /chequebookRequest
    - [ ] Form renders correctly
    - [ ] Account number is pre-filled
    - [ ] Dropdown shows page options (20, 50, 75)
    - [ ] Select pages and submit
    - [ ] Verify SweetAlert2 modal displays

11. **Register (if accessible):**
    - [ ] Navigate to /register
    - [ ] Form renders with all 10 fields
    - [ ] Identity type dropdown works
    - [ ] Fill all fields and submit
    - [ ] Verify validation works (all required, email format, password length)
    - [ ] Verify SweetAlert2 modal displays

12. **Route Guards:**
    - [ ] Verify protected routes are accessible (demo mode allows all)
    - [ ] Verify wildcard redirect works (navigate to /invalid-route, should redirect to /home)

### 7.3 Production Build Verification

```bash
# Build for production
npm run build -- --configuration production

# Check output
ls -la dist/user-portal/

# Verify files
# - index.html exists
# - main.[hash].js exists (with hash)
# - polyfills.[hash].js exists (if separate)
# - styles.[hash].css exists (with hash)
# - assets/ folder exists
# - favicon.ico exists

# Check bundle sizes
# Initial bundle should be under 1MB (error threshold)
# Should be under 500KB (warning threshold) ideally

# Serve production build locally (using http-server or similar)
npx http-server dist/user-portal -p 8080

# Test in browser at http://localhost:8080
# Verify all functionality works
# Check browser console for errors
# Verify environment.production is true
# Verify baseUrl is production value
```

### 7.4 Regression Testing Checklist

After each upgrade, verify:

- [ ] **No Console Errors:** Browser console shows no errors during normal operation
- [ ] **No Build Warnings:** Build completes without warnings (or only expected warnings)
- [ ] **All Tests Pass:** Unit tests pass without failures
- [ ] **Forms Work:** All forms submit successfully and show appropriate feedback
- [ ] **Grids Work:** ag-grid components render and function correctly
- [ ] **Routing Works:** All routes navigate correctly, guards work as expected
- [ ] **Modals Work:** SweetAlert2 modals display correctly for success/error cases
- [ ] **Styling Intact:** Application styling is consistent with previous version
- [ ] **API Calls Work:** HTTP requests to backend are successful (if backend is available)
- [ ] **Performance:** Application loads and responds quickly, no noticeable degradation
- [ ] **Production Build:** Production build works and is optimized

### 7.5 Performance Verification

```bash
# Build with stats
ng build --configuration production --stats-json

# Analyze bundle (if webpack-bundle-analyzer is installed)
npx webpack-bundle-analyzer dist/user-portal/stats.json

# Check bundle sizes
ls -lh dist/user-portal/*.js

# Lighthouse audit (optional)
# Use Chrome DevTools Lighthouse to audit the production build
# Check: Performance, Accessibility, Best Practices, SEO scores
```

---

## 8. Risk Assessment and Mitigation

### 8.1 Risk Matrix

| Risk | Probability | Impact | Severity | Mitigation |
|------|-------------|--------|----------|------------|
| TypeScript compilation errors | High | Medium | High | Incremental upgrades, fix errors at each step |
| Build system migration issues (v17) | Medium | High | High | Thorough testing, backup angular.json, review migrations |
| ag-grid breaking changes | High | High | High | Separate PR, extensive testing, migration guide review |
| Test configuration breaks | Medium | Medium | Medium | Verify tests at each step, adjust Karma config as needed |
| Puppeteer/Chrome compatibility | Medium | Low | Low | Update Puppeteer, adjust flags if needed |
| RxJS type issues | Medium | Medium | Medium | Add explicit types, fix at each step |
| Zone.js import issues | Low | Medium | Low | Review migration output, verify imports |
| Performance regression | Low | Medium | Low | Monitor bundle sizes, run Lighthouse audits |
| Environment config breaks | Low | High | Medium | Verify fileReplacements, test prod builds |
| Node.js version issues | Medium | Medium | Medium | Use Node 20 LTS, document in README |

### 8.2 Rollback Strategy

**Per-Phase Rollback:**
Each upgrade phase is a separate PR/branch. If critical issues arise:

1. **Do not merge the PR** until issues are resolved
2. **Document the issue** in detail (error messages, stack traces, reproduction steps)
3. **Consult Angular migration guides** for the specific version
4. **Search for similar issues** in Angular GitHub issues, Stack Overflow
5. **Attempt fixes** based on research
6. **If unresolvable:** Close the PR, document findings, escalate to user

**Full Rollback:**
If the entire upgrade path proves problematic:

1. **Revert to Angular 14** using git
2. **Document all issues encountered** at each phase
3. **Reassess strategy:** Consider alternative approaches (e.g., rewrite in Angular 18)
4. **Consult with user** on next steps

### 8.3 Success Criteria

The upgrade is considered successful when:

1. **Angular 18 is installed** and all packages are at compatible versions
2. **Application builds** without errors in both development and production modes
3. **All tests pass** without failures
4. **Manual smoke tests pass** for all major features
5. **No console errors** during normal operation
6. **Performance is maintained** or improved (bundle sizes, load times)
7. **ag-grid is upgraded** and grids function correctly
8. **Production build works** and can be deployed

---

## 9. Post-Upgrade Recommendations

### 9.1 Immediate Follow-Ups

1. **Enable TypeScript Strict Mode:**
   - After Angular 18 is stable, consider enabling strict mode
   - Create separate PR: `devin/enable-typescript-strict`
   - Fix type errors incrementally
   - Benefits: Better type safety, catch bugs earlier

2. **Update Documentation:**
   - Update README.md with new Angular version
   - Document Node.js version requirement
   - Update setup instructions if needed
   - Add upgrade notes for future reference

3. **Performance Optimization:**
   - Review bundle sizes and optimize if needed
   - Consider lazy loading for feature modules
   - Optimize images and assets
   - Review and update performance budgets

4. **Dependency Audit:**
   - Run `npm audit` to check for security vulnerabilities
   - Update other dependencies to latest compatible versions
   - Remove unused dependencies (e.g., core-js if not needed)

### 9.2 Future Enhancements (Optional)

1. **Migrate to Standalone Components:**
   - Angular 18 supports standalone components
   - Benefits: Simpler architecture, better tree-shaking, faster builds
   - Effort: Medium to High (requires refactoring all components)
   - Timeline: Separate project after Angular 18 is stable

2. **Adopt Functional Guards:**
   - Replace class-based guards with functional guards
   - Benefits: Simpler code, better tree-shaking
   - Effort: Low (straightforward conversion)
   - Timeline: Can be done incrementally

3. **Adopt New Control Flow Syntax:**
   - Replace `*ngIf`, `*ngFor`, `*ngSwitch` with `@if`, `@for`, `@switch`
   - Benefits: Better performance, simpler syntax
   - Effort: Medium (requires template updates)
   - Timeline: Can be done incrementally or via automated migration

4. **Adopt Signals:**
   - Replace some RxJS observables with Angular Signals
   - Benefits: Simpler reactivity, better performance
   - Effort: Medium to High (requires architectural changes)
   - Timeline: Evaluate after team is comfortable with Angular 18

5. **Zoneless Change Detection:**
   - Experimental feature to run without zone.js
   - Benefits: Better performance, smaller bundle size
   - Effort: High (requires careful testing and refactoring)
   - Timeline: Wait for stable release and broader adoption

6. **Upgrade to Angular Material (Optional):**
   - If UI component library is desired
   - Replace custom form controls with Material components
   - Benefits: Consistent UI, accessibility, mobile support
   - Effort: High (requires UI refactoring)

### 9.3 Maintenance Plan

1. **Regular Updates:**
   - Keep Angular updated to latest minor/patch versions
   - Update dependencies monthly or quarterly
   - Monitor Angular blog for security updates

2. **Testing:**
   - Maintain test coverage
   - Add tests for new features
   - Run tests before each deployment

3. **Monitoring:**
   - Monitor application performance in production
   - Track bundle sizes over time
   - Monitor for console errors in production

4. **Documentation:**
   - Keep README and documentation up to date
   - Document architectural decisions
   - Maintain upgrade notes for future reference

---

## 10. Timeline and Effort Estimation

### 10.1 Estimated Timeline

| Phase | Duration | Effort | Risk |
|-------|----------|--------|------|
| Pre-flight preparation | 1-2 hours | Low | Low |
| Angular 14 → 15 | 4-6 hours | Medium | Medium |
| Angular 15 → 16 | 4-6 hours | Medium | Medium |
| Angular 16 → 17 | 6-8 hours | High | High |
| Angular 17 → 18 | 4-6 hours | Medium | Medium |
| ag-grid upgrade | 4-8 hours | High | High |
| Testing and verification | 4-6 hours | Medium | Low |
| Documentation | 2-3 hours | Low | Low |
| **Total** | **28-45 hours** | **High** | **Medium-High** |

### 10.2 Effort Breakdown

**Development:**
- Running ng update commands: 10%
- Fixing TypeScript errors: 30%
- Testing and verification: 30%
- Fixing build/test configuration: 15%
- ag-grid migration: 10%
- Documentation: 5%

**Critical Path:**
1. Pre-flight preparation (blocking)
2. Angular 14 → 15 (blocking)
3. Angular 15 → 16 (blocking)
4. Angular 16 → 17 (blocking, highest risk)
5. Angular 17 → 18 (blocking)
6. ag-grid upgrade (can be deferred if needed)

### 10.3 Resource Requirements

**Technical Skills Required:**
- Angular framework knowledge (intermediate to advanced)
- TypeScript expertise
- Build system understanding (Webpack, Vite/esbuild)
- Testing framework knowledge (Karma, Jasmine)
- Git workflow proficiency
- Debugging skills

**Tools Required:**
- Node.js 20 LTS
- npm or yarn
- Git
- Code editor (VS Code recommended)
- Chrome browser for testing
- Terminal/command line

---

## 11. Communication Plan

### 11.1 Stakeholder Updates

**Before Starting:**
- Share this upgrade plan with stakeholders
- Get approval for timeline and approach
- Identify any concerns or constraints

**During Upgrade:**
- Create PR for each phase with detailed description
- Share PR links for review
- Report any blockers or issues immediately
- Provide status updates at each phase completion

**After Completion:**
- Share final PR with all changes
- Provide summary of changes and any issues encountered
- Document lessons learned
- Provide training if needed on new features

### 11.2 PR Description Template

```markdown
## Angular [Version] Upgrade

### Summary
This PR upgrades the UserPortal application from Angular [X] to Angular [Y].

### Changes
- Angular packages: [X.x.x] → [Y.y.y]
- TypeScript: [X.x.x] → [Y.y.y]
- Other dependencies: [list]

### Breaking Changes
[List any breaking changes and how they were addressed]

### Migration Notes
[Any important notes about the migration process]

### Testing
- [x] Development build passes
- [x] Production build passes
- [x] All unit tests pass
- [x] Manual smoke testing completed
- [x] No console errors

### Verification Steps
1. `npm ci`
2. `npm run build`
3. `npm test -- --watch=false --browsers=ChromeHeadlessCI`
4. `npm start` and test manually

### Screenshots
[If applicable, add screenshots of the application working]

### Related Issues
[Link to any related issues or tickets]

### Checklist
- [x] Code builds without errors
- [x] Tests pass
- [x] Manual testing completed
- [x] Documentation updated (if needed)
- [x] No console errors or warnings

---

**Link to Devin run:** https://app.devin.ai/sessions/ae5ad6c7e5af41a2a1a98e1b5a5c4ef5
**Requested by:** Vedant Khanna (vedantkhanna@gmail.com) / @VedantKh
```

---

## 12. Conclusion

This comprehensive upgrade plan provides a structured approach to migrating the ICIN Bank UserPortal from Angular 14 to Angular 18. The incremental strategy minimizes risk by isolating changes to individual PRs, allowing for thorough testing and verification at each step.

**Key Success Factors:**
1. **Incremental approach:** Four separate version hops reduce complexity
2. **Thorough testing:** Automated and manual testing at each phase
3. **Risk mitigation:** Identified challenges with mitigation strategies
4. **Clear verification:** Detailed verification methods for each step
5. **Rollback capability:** Each phase is a separate PR that can be reverted if needed

**Critical Phases:**
- **Angular 16 → 17:** Build system migration (highest risk)
- **ag-grid upgrade:** Major version upgrade with breaking changes

**Timeline:**
Estimated 28-45 hours of development effort spread across 6 phases.

**Next Steps:**
1. Review and approve this plan
2. Commit existing changes in the repository
3. Set up Node.js 20 environment
4. Begin Phase 1: Angular 14 → 15 upgrade

**Questions or Concerns:**
If any questions arise during the upgrade process, consult:
- Angular Update Guide: https://update.angular.io/
- Angular documentation: https://angular.io/docs
- ag-grid migration guides: https://www.ag-grid.com/angular-data-grid/upgrading/
- This upgrade plan document

---

## Appendix A: Reference Links

### Angular Resources
- Angular Update Guide: https://update.angular.io/
- Angular Documentation: https://angular.io/docs
- Angular Blog: https://blog.angular.io/
- Angular GitHub: https://github.com/angular/angular
- Angular CLI Documentation: https://angular.io/cli

### Version-Specific Migration Guides
- Angular 15: https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8
- Angular 16: https://blog.angular.io/angular-v16-is-here-4d7a28ec680d
- Angular 17: https://blog.angular.io/introducing-angular-v17-4d7033312e4b
- Angular 18: https://blog.angular.io/angular-v18-is-now-available-e79d5ac0affe

### Third-Party Resources
- ag-grid Angular: https://www.ag-grid.com/angular-data-grid/
- ag-grid Migration Guides: https://www.ag-grid.com/angular-data-grid/upgrading/
- SweetAlert2: https://sweetalert2.github.io/
- RxJS Documentation: https://rxjs.dev/

### TypeScript Resources
- TypeScript Documentation: https://www.typescriptlang.org/docs/
- TypeScript 5.0 Release Notes: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/
- TypeScript 5.4 Release Notes: https://devblogs.microsoft.com/typescript/announcing-typescript-5-4/

### Testing Resources
- Karma Documentation: https://karma-runner.github.io/
- Jasmine Documentation: https://jasmine.github.io/
- Puppeteer Documentation: https://pptr.dev/

---

## Appendix B: Command Quick Reference

```bash
# Version checks
node -v
npm -v
npx ng version

# Angular updates
npx ng update
npx ng update @angular/core@15 @angular/cli@15
npx ng update @angular/core@16 @angular/cli@16
npx ng update @angular/core@17 @angular/cli@17
npx ng update @angular/core@18 @angular/cli@18

# Build commands
npm run build
npm run build -- --configuration production

# Test commands
npm test
npm test -- --watch=false --browsers=ChromeHeadlessCI

# Serve commands
npm start
ng serve

# Dependency management
npm ci
npm install
npm ls @angular/*
npm outdated

# Git commands
git checkout -b devin/angular-15-upgrade
git status
git diff
git add .
git commit -m "chore: upgrade to Angular 15"
git push origin devin/angular-15-upgrade

# Cleanup commands
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

**Document Version:** 1.0  
**Created:** November 8, 2025  
**Author:** Devin (AI Software Engineer)  
**For:** Vedant Khanna (vedantkhanna@gmail.com)  
**Repository:** VedantKh/userportal

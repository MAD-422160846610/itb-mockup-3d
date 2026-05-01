# ITB Maritime Services - Setup Guide

## Testing & Standards Implementation

This file documents the complete testing and security infrastructure for the ITB Maritime website.

## ✅ Completed (Auto-generated)

The following files have been automatically created:

1. **package.json** - Updated with all dependencies and scripts
2. **.eslintrc.json** - ESLint configuration for JavaScript
3. **.stylelintrc.json** - Stylelint configuration for CSS
4. **lighthouserc.js** - Lighthouse CI configuration
5. **tests/unit/form.test.js** - Unit tests for contact form
6. **tests/unit/theme.test.js** - Unit tests for theme toggle
7. **tests/e2e/navigation.spec.js** - E2E tests with Playwright

## ⚠️ Manual Setup Required

Due to GitHub API limitations, the following must be created manually via the GitHub web interface:

### 1. Create `.github/workflows/test.yml`

**Steps:**
1. Go to: https://github.com/MAD-422160846610/itb-mockup-3d/new/master
2. Type `.github/workflows/test.yml` in the filename field
3. Paste the following content:

```yaml
name: Tests and Linting

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint:js
        continue-on-error: true
      
      - name: Run Stylelint
        run: npm run lint:css
        continue-on-error: true
      
      - name: Validate HTML
        run: npm run lint:html
        continue-on-error: true

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Unit Tests
        run: npm run test:unit -- --coverage
      
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report
          path: coverage/

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E Tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Pa11y CI
        run: npm run test:a11y
        continue-on-error: true

  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Run npm audit
        run: npm run audit
        continue-on-error: true
```

4. Commit the file

### 2. Update `index.html` with Security Headers

Add the following inside the `<head>` section of `index.html`, after the existing meta tags:

```html
<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self';
               script-src 'self' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://apis.googleapis.com 'unsafe-inline';
               style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
               font-src 'self' https://fonts.gstatic.com;
               img-src 'self' data: https:;
               frame-src 'none';">

<!-- Security Headers -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
```

## Running Tests Locally

After cloning the repository:

```bash
# Install dependencies
npm install

# Run linters
npm run lint

# Run unit tests
npm run test:unit

# Run E2E tests (requires Playwright browsers)
npx playwright install
npm run test:e2e

# Run accessibility tests
npm run test:a11y

# Run security audit
npm run audit
```

## Project Structure

```
itb-mockup-3d/
├── .eslintrc.json          # ESLint config
├── .stylelintrc.json      # Stylelint config
├── lighthouserc.js        # Lighthouse CI config
├── package.json           # Updated with deps and scripts
├── tests/
│   ├── unit/
│   │   ├── form.test.js
│   │   └── theme.test.js
│   └── e2e/
│       └── navigation.spec.js
├── .github/
│   └── workflows/
│       └── test.yml      # Manual creation required
└── index.html             # Add CSP meta tags manually
```

## Next Steps

1. Create `.github/workflows/test.yml` manually via GitHub web interface
2. Update `index.html` with CSP and security meta tags
3. Configure EmailJS with real credentials (replace TU_PUBLIC_KEY, etc.)
4. Run initial tests locally: `npm install && npm run lint && npm run test:unit`

## Notes

- The GitHub Actions workflow will run automatically on push/PR to master
- Lighthouse CI requires a temporary public storage token for uploads
- EmailJS configuration should be done in `script.js` with real credentials

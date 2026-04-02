# Health Plan Calculator — QA Assessment

A comprehensive QA assessment of a React-based health calculator app. This submission goes beyond bug identification to include automated test coverage, E2E testing, accessibility auditing, and CI/CD configuration.

## Quick Start

```bash
npm install
npm test              # Unit + integration tests (21 tests)
npm run test:coverage # Tests with coverage report
npm run test:e2e      # E2E tests with Playwright
npm run dev           # Dev server at localhost:5173
```

## Repository Structure

| Branch | Purpose |
|--------|---------|
| `main` | Original code + failing tests that **prove bugs exist** |
| `fix/bugs` | All bugs fixed, all tests passing, enhancements added |

## What I Found

### Bugs (7 total)

| ID | Bug | Severity | Details |
|----|-----|----------|---------|
| BUG-001 | BMI thresholds wrong (< 18/< 24 instead of WHO < 18.5/< 25) | Critical | [Report](docs/bug-report.md#bug-001-bmi-classification-thresholds-deviate-from-who-standards) |
| BUG-002 | Meal Simulator shows stale data after recalculation | Major | [Report](docs/bug-report.md#bug-002-meal-simulator-uses-stale-calorieprotein-targets-after-recalculation) |
| BUG-003 | Age collected but never used in calculations | Major | [Report](docs/bug-report.md#bug-003-age-is-collected-but-never-used-in-calculations) |
| BUG-004 | Calorie calculation can return negative values | Major | [Report](docs/bug-report.md#bug-004-calorie-calculation-can-produce-negative-values) |
| BUG-005 | No input validation — NaN/Infinity displayed | Major | [Report](docs/bug-report.md#bug-005-no-input-validation--nan-infinity-and-empty-submissions-accepted) |
| BUG-006 | Existing tests validate bugs as correct behavior | Minor | [Report](docs/bug-report.md#bug-006-existing-test-suite-validates-bugs-as-correct-behavior) |
| BUG-007 | Inputs use type="text" instead of type="number" | Minor | [Report](docs/bug-report.md#bug-007-inputs-use-typetext-instead-of-typenumber) |

### How to Verify

**On `main` branch** — see the bugs proven by failing tests:

```bash
git checkout main
npm install
npm test  # 9 bug-exposure tests FAIL, 7 original tests pass
```

**On `fix/bugs` branch** — see everything fixed:

```bash
git checkout fix/bugs
npm install
npm test  # All 21 tests pass
```

## Deliverables

### 1. [Bug Report](docs/bug-report.md)
Professional QA report with severity ratings, reproduction steps, spec references, and risk assessments for all 7 bugs. Includes 8 improvement suggestions.

### 2. [Test Strategy](docs/test-strategy.md)
Five-layer testing strategy covering unit tests, integration tests, accessibility, E2E, and performance/security — with a testing pyramid recommendation and CI/CD proposal.

### 3. Automated Tests

| Layer | File | Count | What It Tests |
|-------|------|-------|---------------|
| Unit (bug exposure) | `src/lib/calculator.bugs.test.ts` | 7 | Calculator logic bugs |
| Integration (bug exposure) | `src/App.bugs.test.tsx` | 2 | UI state management bugs |
| Accessibility | `src/App.a11y.test.tsx` | 5 | WCAG compliance via axe-core |
| E2E | `e2e/health-calculator.spec.ts` | 4 | Full user flows with Playwright |

### 4. Fix Branch (`fix/bugs`)
Each bug fixed in a separate atomic commit, traceable by bug ID:
- `fix(BUG-001)` — Corrected BMI thresholds to WHO standards
- `fix(BUG-002)` — MealSimulator uses props directly
- `fix(BUG-003)` — Age incorporated into calorie formula
- `fix(BUG-004)` — Calorie floor of 1200 kcal
- `fix(BUG-005a)` — Height zero guard
- `fix(BUG-005b, BUG-007)` — Input validation + type="number"

### 5. CI/CD Pipeline
GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push:
- TypeScript type checking
- Unit + integration tests with coverage
- Production build verification
- E2E tests with Playwright

### 6. Code Coverage

```
File               | % Stmts | % Branch | % Funcs | % Lines
-------------------|---------|----------|---------|--------
All files          |   99.38 |    95.55 |   94.44 |   99.38
  App.tsx          |     100 |      100 |     100 |     100
  MealSimulator.tsx|   96.55 |       50 |   66.66 |   96.55
  ResultsCard.tsx  |     100 |      100 |     100 |     100
  UserForm.tsx     |     100 |      100 |     100 |     100
  calculator.ts    |     100 |      100 |     100 |     100
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + TypeScript | Application framework |
| Vitest + React Testing Library | Unit & integration testing |
| Playwright | E2E browser testing |
| jest-axe | Automated accessibility auditing |
| @vitest/coverage-v8 | Code coverage reporting |
| GitHub Actions | CI/CD pipeline |

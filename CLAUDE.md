# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

QA assessment: **Health Plan Calculator** — a single-page React/Vite/TypeScript web app with comprehensive QA deliverables.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 6
- **Unit/Integration Testing**: Vitest + React Testing Library + jsdom
- **E2E Testing**: Playwright
- **Accessibility**: jest-axe
- **Coverage**: @vitest/coverage-v8
- **CI**: GitHub Actions
- **Build**: `tsc -b && vite build`
- **No backend** — all logic is client-side in `src/lib/calculator.ts`

## Commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm start` or `npm run dev` |
| Run tests | `npm test` |
| Watch tests | `npm run test:watch` |
| Test with coverage | `npm run test:coverage` |
| E2E tests | `npm run test:e2e` |
| Build | `npm run build` |
| Preview build | `npm run preview` |

## Project Structure

```
src/
  lib/calculator.ts            # Core business logic (BMI, calories, macros)
  lib/calculator.test.ts       # Unit tests for calculator
  lib/calculator.bugs.test.ts  # Bug exposure tests
  types.ts                     # TypeScript types (FormValues, PlanResult)
  App.tsx                      # Main app component + state management
  App.test.tsx                 # Integration tests for the app
  App.bugs.test.tsx            # Bug exposure integration tests
  App.a11y.test.tsx            # Accessibility audit tests
  components/
    UserForm.tsx               # Input form (weight, height, age, activity, goal)
    ResultsCard.tsx            # Displays BMI, status, calories, macros
    MealSimulator.tsx          # Calorie/protein tracking simulator
  styles.css                   # All styles (single file)
  main.tsx                     # React entry point
e2e/
  health-calculator.spec.ts    # Playwright E2E tests
docs/
  bug-report.md                # QA bug report
  test-strategy.md             # Test strategy document
```

## Business Rules (from task spec)

- BMI = weight / (height in meters)^2
- BMI status based on standard WHO ranges (Underweight < 18.5, Normal 18.5-24.9, Overweight >= 25)
- Daily calories depend on weight, age, activity level, and goal
- Macronutrients derived from calorie target
- Meal Simulator should use the **latest** calculated plan values

## Branches

- `main` — original code + failing bug-exposure tests (proves bugs exist)
- `fix/bugs` — all bugs fixed, all tests passing, enhancements added

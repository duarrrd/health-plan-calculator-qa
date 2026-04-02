# Test Strategy — Health Plan Calculator

**Project:** Health Plan Calculator
**Date:** 2026-04-02
**Scope:** Comprehensive test strategy for a client-side health calculator with form input, BMI/calorie/macro calculations, and meal tracking simulation.

---

## Current Test Coverage Assessment

### What exists:
- **5 unit tests** (`calculator.test.ts`) covering BMI calculation, status classification, calorie calculation, macro rounding, and end-to-end plan generation
- **2 integration tests** (`App.test.tsx`) covering form submission flow and recalculation behavior

### What's missing:
- No boundary/edge case testing for calculation thresholds
- No input validation testing (empty, non-numeric, zero, negative)
- No accessibility testing
- No visual/layout testing
- No error state testing
- 2 of 7 existing tests validate incorrect behavior (see Bug Report BUG-006)

### Coverage gaps by risk:

| Area | Current Coverage | Risk if Untested |
|------|-----------------|------------------|
| BMI threshold boundaries | Tested but with wrong values | High — incorrect health classifications |
| Input validation | None | High — NaN/Infinity displayed to users |
| Meal Simulator state sync | Tested but asserts wrong behavior | High — misleading tracking data |
| Age in calculations | None | Medium — silently ignored input |
| Negative calorie output | Tested but asserts it's acceptable | Medium — nonsensical recommendations |
| Accessibility | None | Medium — excludes users with disabilities |
| Mobile responsiveness | None | Low — layout issues on small screens |

---

## Proposed Test Strategy

### Layer 1: Unit Tests (High Priority)

**Target:** `src/lib/calculator.ts`
**Tool:** Vitest
**Run frequency:** On every commit (CI) and during development (watch mode)

| Test Category | Test Cases | Priority |
|---------------|-----------|----------|
| BMI calculation | Standard values, decimal inputs, very large/small people | High |
| BMI boundaries | Exactly 18.5 (Normal boundary), exactly 25.0 (Overweight boundary), values just above/below | High |
| Calorie calculation | All activity × goal combinations (3×3 = 9 combos) | High |
| Calorie with age | Same person at different ages produces different results | High |
| Calorie floor | No combination produces negative or dangerously low calories | High |
| Macro calculation | Protein/fat/carbs sum correctly against calorie target | Medium |
| Macro edge cases | Very low calories, very high calories, rounding consistency | Medium |
| Input guards | Zero height, negative weight, NaN inputs throw or return safe defaults | High |

### Layer 2: Component/Integration Tests (High Priority)

**Target:** `src/App.tsx`, `src/components/*.tsx`
**Tool:** Vitest + React Testing Library + jsdom
**Run frequency:** On every commit

| Test Category | Test Cases | Priority |
|---------------|-----------|----------|
| Form submission | Happy path: fill form → calculate → see results | High |
| Form validation | Empty fields, non-numeric input, zero height → error shown | High |
| Recalculation | Change values → recalculate → results AND simulator update | High |
| Meal Simulator sync | Simulator always reflects latest calculated values | High |
| Meal Simulator status | Over/under/on-track logic with various inputs | Medium |
| Protein warning | Appears when protein eaten < target, disappears when >= | Medium |
| Form state | Fields retain values, select defaults work correctly | Low |

### Layer 3: Accessibility Tests (Medium Priority)

**Target:** All components
**Tool:** jest-axe (automated), manual screen reader testing
**Run frequency:** On PRs touching UI components

| Test Category | Test Cases | Priority |
|---------------|-----------|----------|
| ARIA labels | All inputs have accessible labels | High |
| Keyboard navigation | Tab order through form → button → results → simulator | Medium |
| Focus management | Focus moves to results after calculation | Medium |
| Screen reader | Results announced on calculation, status changes announced | Medium |
| Color contrast | All text meets WCAG AA (4.5:1 ratio) | Medium |

### Layer 4: E2E Smoke Tests (Medium Priority)

**Target:** Full application
**Tool:** Playwright or Cypress
**Run frequency:** Before releases, on PRs to main

| Test Category | Test Cases | Priority |
|---------------|-----------|----------|
| Happy path | Fill form → calculate → verify results → use simulator | High |
| Cross-browser | Same happy path on Chrome, Firefox, Safari | Medium |
| Mobile viewport | Form usable at 320px width, no overflow | Medium |
| Error recovery | Invalid input → error shown → fix input → calculate works | Medium |

### Layer 5: Performance & Security (Low Priority)

**Target:** Application bundle and runtime behavior
**Tool:** Lighthouse, React DevTools profiler

| Test Category | Test Cases | Priority |
|---------------|-----------|----------|
| Bundle size | No unexpected large dependencies | Low |
| Re-render count | Input changes don't cause unnecessary component re-renders | Low |
| XSS | Input values rendered safely (React handles by default, but verify) | Low |

---

## Testing Pyramid Summary

```
        /  E2E  \          ← 2-3 tests (slow, expensive, high confidence)
       /----------\
      / Integration \       ← 8-12 tests (medium speed, real DOM behavior)
     /----------------\
    /    Unit Tests     \   ← 20-30 tests (fast, cheap, core logic)
   /--------------------\
```

**Recommended total:** ~40 tests for full coverage of this app size.
**Current:** 7 tests (2 incorrect).
**Gap:** ~33 tests.

---

## CI/CD Recommendations

1. Run unit + integration tests on every push (`npm test`)
2. Run accessibility checks on PRs touching `src/components/`
3. Run E2E smoke test before merging to main
4. Add test coverage reporting (Vitest has built-in Istanbul support)
5. Enforce minimum coverage thresholds: 90% for `calculator.ts`, 70% for components

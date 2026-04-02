# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

QA assessment test task: **Health Plan Calculator** — a small single-page React/Vite/TypeScript web app.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 6
- **Testing**: Vitest + React Testing Library + jsdom
- **Build**: `tsc -b && vite build`
- **No backend** — all logic is client-side in `src/lib/calculator.ts`

## Commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm start` or `npm run dev` |
| Run tests | `npm test` |
| Watch tests | `npm run test:watch` |
| Build | `npm run build` |
| Preview build | `npm run preview` |

All commands must be run from the `test_task/` directory.

## Project Structure

```
test_task/
  src/
    lib/calculator.ts        # Core business logic (BMI, calories, macros)
    lib/calculator.test.ts   # Unit tests for calculator
    types.ts                 # TypeScript types (FormValues, PlanResult)
    App.tsx                  # Main app component + state management
    App.test.tsx             # Integration tests for the app
    components/
      UserForm.tsx           # Input form (weight, height, age, activity, goal)
      ResultsCard.tsx        # Displays BMI, status, calories, macros
      MealSimulator.tsx      # Calorie/protein tracking simulator
    styles.css               # All styles (single file)
    main.tsx                 # React entry point
```

## Business Rules (from task spec)

- BMI = weight / (height in meters)^2
- BMI status based on standard WHO ranges (Underweight < 18.5, Normal 18.5-24.9, Overweight >= 25)
- Daily calories depend on weight, activity level, and goal
- Macronutrients derived from calorie target
- Meal Simulator should use the **latest** calculated plan values

## QA Context

This app is a QA assessment — it contains intentionally planted bugs and questionable behaviors.
The task is to find issues, describe risks, and suggest improvements.

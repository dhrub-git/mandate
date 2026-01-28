# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mandate is an open-source tool that generates AI governance policies for Australian organizations in 30 minutes, grounded in ASIC, APRA, and Privacy Act regulations. The MVP generates sector-specific (Finance, Public Sector) policies with regulatory references.

## Development Commands

### Monorepo Commands (from root)
```bash
# Development
npm run dev              # Start all workspace dev servers
npm run build            # Build all workspaces
npm run test             # Run tests across all workspaces
npm run test:coverage    # Generate coverage reports
npm run lint             # Lint all workspaces
npm run type-check       # Type check all workspaces

# Clean
npm run clean            # Remove all build artifacts and node_modules
```

### Web App Commands (from apps/web)
```bash
# Development
npm run dev              # Start Next.js dev server with Turbopack
npm run build            # Production build
npm run start            # Start production server

# Testing
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Open Vitest UI
npm run test:coverage    # Generate coverage report

# Run single test file
npm test -- path/to/test.test.tsx

# Type checking
npm run type-check       # TypeScript type checking without emitting
```

## Architecture

### Monorepo Structure (Turborepo + npm workspaces)
- **apps/web** - Next.js 14 app (App Router, React 19, Tailwind CSS 4)
- **packages/ui** - Shared React component library (Radix UI + CVA)
- **packages/typescript-config** - Shared TypeScript configs
- **packages/eslint-config** - Shared ESLint configs

### Web App Structure (apps/web)
```
app/
  page.tsx                    # Landing page
  generate/page.tsx           # Questionnaire form
  preview/[id]/page.tsx       # Generated policy preview
  api/generate/route.ts       # Policy generation endpoint
  api/policy/[id]/route.ts    # Policy retrieval endpoint

lib/
  generation/
    policyGenerator.ts        # Core policy generation logic
    types.ts                  # Generation type definitions
  validation/
    questionnaireSchema.ts    # Zod schemas for form validation
  store/
    policyStore.ts           # Zustand state management
```

### Key Technology Decisions

**State Management**: Uses Zustand for client-side state (questionnaire answers, generated policies). Each page/feature has its own store file (e.g., `useQuestionnaireStore.ts`).

**Form Handling**: React Hook Form with Zod validation for type-safe forms with minimal re-renders.

**Styling**: Tailwind CSS 4 with CVA (class-variance-authority) for component variants. All components in `packages/ui` use this pattern.

**Testing**: Vitest + Testing Library with TDD approach. Tests are colocated in `__tests__` directories. See TDD_STATUS.md for current test coverage.

**API Routes**: Next.js App Router API routes in `app/api/`. All routes validate input with Zod schemas before processing.

## Testing Philosophy (TDD)

This project follows strict Test-Driven Development:

1. **Tests live in `__tests__` directories** colocated with source files
2. **Red-Green-Refactor cycle**: Write failing test → Implement minimal code → Refactor
3. **Vitest config** at `apps/web/vitest.config.ts` uses happy-dom environment
4. **Test utilities** in `apps/web/tests/` (setup, mocks, custom render)
5. **Current status**: See `docs/TDD_STATUS.md` for test pass rates and next steps

When adding features:
- Write test first in appropriate `__tests__/` directory
- Run `npm test -- path/to/test.test.tsx` to verify it fails
- Implement minimal code to pass
- Refactor while keeping tests green

## Shared UI Package (@mandate/ui)

The UI package exports individual components via package.json exports field:
```typescript
import { Button } from '@mandate/ui/button'
import { Card } from '@mandate/ui/card'
```

All components use:
- Radix UI primitives for accessibility
- Tailwind merge (`cn` utility) for composable styles
- CVA for type-safe variants

When creating new UI components, add export to `packages/ui/package.json` exports field.

## Policy Generation Flow

1. **Questionnaire** (`app/generate/page.tsx`) collects:
   - Organization context (sector, size, jurisdiction)
   - AI use cases (chatbots, analytics, automation)
   - Governance maturity and risk appetite

2. **API Route** (`app/api/generate/route.ts`) validates input and calls:

3. **Policy Generator** (`lib/generation/policyGenerator.ts`) creates:
   - Executive Summary (2000+ words)
   - Purpose & Scope
   - Governance Structure
   - Risk Framework
   - Regulatory Mapping (ASIC, APRA, Privacy Act references)

4. **Result**: JSON policy object (8000+ words total) with regulatory references

## Environment Variables

Policy generation requires (not yet configured in MVP):
- `OPENAI_API_KEY` - GPT-4 for policy generation
- `CONTEXT7_API_KEY` - Regulatory content RAG

## Path Aliases

All web app imports use TypeScript path aliases (configured in tsconfig.json):
```typescript
import { Component } from '@/components/...'
import { util } from '@/lib/...'
import { Page } from '@/app/...'
```

## Important Notes

- **Monorepo coordination**: Changes to `packages/*` require rebuilding dependent apps
- **Next.js config**: Transpiles `@mandate/ui` package (see next.config.js)
- **Turbo caching**: Build outputs cached by Turborepo, use `npm run clean` if stale
- **Test isolation**: Each test suite is independent, uses mocks from `tests/mocks/`
- **Regulatory compliance**: All policy content must reference specific regulatory clauses (ASIC INFO 255, APRA CPS 234, Privacy Act 1988)

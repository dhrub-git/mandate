# Mandate MVP - TDD Test Plan

**Project**: Mandate - AI Governance Policy Generator  
**Approach**: Test-Driven Development (TDD)  
**Total Test Cases**: 30  
**Test Framework**: Vitest + React Testing Library

---

## Overview

This test plan follows strict TDD principles:
1. **RED**: Write test first (watch it fail)
2. **GREEN**: Write minimal code to pass
3. **REFACTOR**: Clean up while keeping tests green

All tests are written BEFORE implementation. No production code without a failing test first.

---

## Test Suite Summary

| Suite | Category | Tests | Status | Priority |
|-------|----------|-------|--------|----------|
| **1. Landing Page** | Frontend | 8 | ✅ 7/8 passing | P0 |
| **2. Questionnaire Form** | Frontend | 17 | ❌ 0/17 passing | P0 |
| **3. Generation API** | Backend | 11 | ⚠️ 5/11 passing | P0 |
| **4. Policy Generator** | Backend | 14 | ❌ 0/14 passing | P0 |
| **5. Export Functionality** | Integration | 12 | ❌ Not started | P1 |
| **6. Policy Preview** | Frontend | 8 | ❌ Not started | P1 |

**Total**: 70 test cases across 6 suites

---

## Suite 1: Landing Page Tests ✅

**File**: `app/__tests__/page.test.tsx`  
**Status**: 7/8 passing (87%)

### Test Cases

1. ✅ **renders hero headline** - Verify main H1 exists
2. ✅ **renders "Generate My Policy" CTA button** - CTA is visible
3. ✅ **links to /generate on CTA click** - Button links correctly
4. ✅ **renders 3 "How It Works" steps** - All 3 steps present
5. ✅ **renders 4 feature cards** - All 4 features visible
6. ❌ **includes GitHub link in nav** - GitHub link exists (FAILING)
7. ✅ **renders value proposition subheadline** - Subhead present
8. ✅ **renders CTA in footer section** - Footer CTA exists

**Blockers**: Test #6 failing - needs GitHub link text adjustment

---

## Suite 2: Questionnaire Form Tests ❌

**File**: `app/generate/__tests__/GeneratePage.test.tsx`  
**Status**: 0/17 passing (0%)

### Group A: Form Rendering & Navigation (11 tests)

1. ❌ **renders first page with organization questions** 
   - Should show sector radio buttons (Finance/Public Sector)
   - Labels for ASIC, APRA visible

2. ❌ **shows progress bar at 33% on page 1**
   - Progress indicator shows "Page 1 of 3"
   - Percentage shows "33%"

3. ❌ **displays correct page title for page 1**
   - Title reads "Organization Context"

4. ❌ **allows selecting radio options**
   - User can select Finance option
   - Selection is checked

5. ❌ **allows checking multiple checkboxes for regulators**
   - ASIC and APRA checkboxes can both be checked
   - Both remain checked

6. ❌ **advances to page 2 on Next click**
   - After filling required fields, Next button works
   - Page 2 loads with correct questions

7. ❌ **Back button is disabled on page 1**
   - Previous button is disabled initially

8. ❌ **allows going back from page 2 to page 1**
   - Previous button works on page 2
   - Returns to page 1

9. ❌ **preserves answers when navigating back**
   - Answers persist when going back
   - Selected options remain checked

10. ❌ **shows progress bar at 100% on page 3**
    - Final page shows "Page 3 of 3"
    - Shows "100%"

11. ❌ **shows "Generate Policy" button on final page**
    - Submit button visible on page 3
    - Button says "Generate Policy"

### Group B: Form Submission (3 tests)

12. ❌ **disables Generate button while loading**
    - Button disabled during API call
    - Shows loading state

13. ❌ **calls /api/generate with correct payload**
    - POST request to /api/generate
    - Body contains all form answers

14. ❌ **shows error message on API failure**
    - Error UI appears on 500 response
    - Message says "generation failed"

### Group C: Local Storage Persistence (3 tests)

15. ❌ **saves answers to localStorage on change**
    - localStorage updated on input change
    - Data structure correct (JSON)

16. ❌ **loads saved answers on page load**
    - Saved answers pre-populate form
    - All fields restore correctly

17. ❌ **clears localStorage after successful submission**
    - localStorage cleared after success
    - No stale data remains

---

## Suite 3: Generation API Tests ⚠️

**File**: `app/api/generate/__tests__/route.test.ts`  
**Status**: 5/11 passing (45%)

### Group A: Request Validation (6 tests)

1. ✅ **returns 200 with valid request body** - Valid request succeeds
2. ❌ **returns 400 with missing sector field** - Rejects missing sector
3. ❌ **returns 400 with missing jurisdiction field** - Rejects missing jurisdiction
4. ❌ **returns 400 with invalid sector value** - Validates sector enum
5. ❌ **returns 400 with invalid jurisdiction value** - Validates jurisdiction enum
6. ❌ **returns 400 with empty request body** - Rejects empty body

### Group B: Generation Logic (3 tests)

7. ✅ **generates policy with all required sections** - Returns policyId
8. ✅ **returns policy ID for preview** - policyId format valid
9. ✅ **includes sector-specific content in policy** - Content tailored

### Group C: Error Handling (2 tests)

10. ✅ **returns 500 on generation error** - Handles errors gracefully
11. ❌ **logs errors to console** - Error logging works

**Blockers**: Need input validation middleware

---

## Suite 4: Policy Generator Tests ❌

**File**: `lib/generation/__tests__/policyGenerator.test.ts`  
**Status**: 0/14 passing (0%)

### Group A: Policy Structure (6 tests)

1. ❌ **generates policy with executive summary**
   - executiveSummary field exists
   - At least 100 characters long

2. ❌ **generates policy with purpose & scope section**
   - purposeAndScope field exists
   - Contains "purpose" keyword

3. ❌ **generates policy with governance structure**
   - governanceStructure field exists
   - Contains "governance" keyword

4. ❌ **generates policy with risk framework**
   - riskFramework field exists
   - Not empty

5. ❌ **policy is at least 8000 words**
   - wordCount >= 8000
   - Meets compliance minimum

6. ❌ **includes regulatory references**
   - regulatoryMapping array exists
   - Not empty

### Group B: Sector Customization (4 tests)

7. ❌ **includes finance-specific content for finance sector**
   - Contains "ASIC" reference
   - Finance-specific language

8. ❌ **includes public sector content for public sector**
   - Contains "public accountability"
   - Public sector language

9. ❌ **adjusts governance structure based on org size**
   - Small orgs get appropriate recommendations
   - No "5+ team members" for small orgs

10. ❌ **references correct regulators based on sector**
    - Finance sector: ASIC, APRA
    - Public sector: OAIC, FOI

### Group C: Validation (2 tests)

11. ❌ **validates policy completeness**
    - All required sections present
    - No null/undefined fields

12. ❌ **checks for minimum regulation references (5+)**
    - At least 5 regulatory citations
    - Specific clause numbers

### Group D: Error Handling (2 tests)

13. ❌ **throws error with invalid sector**
    - Rejects invalid sector enum
    - Clear error message

14. ❌ **throws error with missing required fields**
    - Rejects undefined/null fields
    - Validation error thrown

**Blockers**: Need to implement `generatePolicy()` function

---

## Suite 5: Export Functionality Tests ❌

**File**: `app/preview/[id]/__tests__/export.test.tsx` (TO CREATE)  
**Status**: Not started

### Test Cases (12 tests)

#### Group A: PDF Export (4 tests)

1. ❌ **exports policy as PDF with correct formatting**
   - PDF generated successfully
   - File size > 0 bytes

2. ❌ **PDF includes table of contents**
   - TOC present on page 2
   - Hyperlinks work

3. ❌ **PDF preserves markdown formatting**
   - Headings styled correctly
   - Lists formatted properly

4. ❌ **PDF includes page numbers and footer**
   - Page numbers on all pages
   - Footer with org name

#### Group B: DOCX Export (4 tests)

5. ❌ **exports policy as DOCX with correct structure**
   - DOCX file generated
   - Valid docx format

6. ❌ **DOCX preserves heading hierarchy**
   - H1, H2, H3 styles correct
   - TOC auto-generated

7. ❌ **DOCX is editable in Microsoft Word**
   - No formatting errors
   - Fonts embedded

8. ❌ **DOCX includes metadata (title, author)**
   - Document properties set
   - Author, title, date present

#### Group C: Markdown Export (2 tests)

9. ❌ **exports policy as raw markdown**
   - .md file downloaded
   - Valid markdown syntax

10. ❌ **markdown includes frontmatter metadata**
    - YAML frontmatter present
    - Contains sector, date, version

#### Group D: Export UI (2 tests)

11. ❌ **shows loading state while generating export**
    - Button shows spinner during export
    - Disabled while processing

12. ❌ **displays success toast after download**
    - Success notification appears
    - Includes file name

**Implementation Priority**: P1 (after core generation works)

---

## Suite 6: Policy Preview Tests ❌

**File**: `app/preview/[id]/__tests__/page.test.tsx` (TO CREATE)  
**Status**: Not started

### Test Cases (8 tests)

#### Group A: Rendering (4 tests)

1. ❌ **loads policy by ID from URL param**
   - Fetches correct policy
   - Renders content

2. ❌ **renders markdown content as HTML**
   - Headings styled
   - Lists formatted

3. ❌ **displays table of contents with links**
   - TOC sidebar visible
   - Anchor links work

4. ❌ **shows metadata (sector, date, word count)**
   - Metadata card visible
   - All fields populated

#### Group B: Navigation (2 tests)

5. ❌ **TOC links scroll to correct section**
   - Clicking TOC scrolls page
   - Smooth scroll behavior

6. ❌ **highlights current section in TOC**
   - Active section highlighted
   - Updates on scroll

#### Group C: Export Actions (2 tests)

7. ❌ **shows export buttons (PDF, DOCX, MD)**
   - 3 export buttons visible
   - Correctly labeled

8. ❌ **handles 404 for invalid policy ID**
   - Shows 404 page
   - Error message displayed

**Implementation Priority**: P1 (after export works)

---

## Testing Strategy

### 1. Unit Tests
- Individual functions (validators, formatters)
- Pure logic without side effects
- Fast execution (<1ms per test)

### 2. Integration Tests
- API routes with database
- Form submission to backend
- End-to-end generation flow

### 3. Component Tests
- React components in isolation
- User interactions (clicks, typing)
- State management

### 4. E2E Tests (Future)
- Full user journey (not in MVP)
- Browser automation (Playwright)
- Cross-browser testing

---

## Test Execution Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific suite
npm test app/__tests__/page.test.tsx

# Run with coverage
npm run test:coverage

# UI mode (visual test explorer)
npm run test:ui
```

---

## Test Coverage Goals

| Component | Target Coverage | Current |
|-----------|----------------|---------|
| Components | 90% | ~30% |
| API Routes | 95% | ~40% |
| Utilities | 100% | ~10% |
| Overall | 85%+ | ~25% |

---

## TDD Workflow

For each feature:

1. **Write Test First** (RED)
   ```bash
   # Create test file
   touch app/feature/__tests__/Component.test.tsx
   
   # Write failing test
   test('should do X', () => {
     expect(myFunction()).toBe('expected')
   })
   ```

2. **Run Test & Watch It Fail**
   ```bash
   npm test -- Component.test.tsx
   # Expected: RED (test fails)
   ```

3. **Write Minimal Code** (GREEN)
   ```typescript
   // Implement just enough to pass
   export function myFunction() {
     return 'expected'
   }
   ```

4. **Run Test Again**
   ```bash
   npm test -- Component.test.tsx
   # Expected: GREEN (test passes)
   ```

5. **Refactor** (while keeping tests green)
   ```typescript
   // Clean up, extract helpers, improve names
   // Tests still pass
   ```

6. **Commit**
   ```bash
   git add .
   git commit -m "feat: add myFunction with tests"
   ```

---

## Next Steps (Implementation Order)

### Phase 1: Complete Questionnaire (Week 1, Days 1-2)
- [ ] Fix failing questionnaire tests (0/17)
- [ ] Implement form state management
- [ ] Add localStorage persistence
- [ ] Validate inputs

### Phase 2: Generation Backend (Week 1, Days 3-4)
- [ ] Fix API validation tests (5/11)
- [ ] Implement policy generator (0/14)
- [ ] Integrate OpenAI GPT-4
- [ ] Add Context7 for regulations

### Phase 3: Preview & Export (Week 1, Day 5)
- [ ] Create preview page tests (0/8)
- [ ] Implement preview UI
- [ ] Create export tests (0/12)
- [ ] Implement PDF/DOCX/MD export

### Phase 4: Polish (Week 2)
- [ ] Fix remaining failing tests
- [ ] Achieve 85%+ coverage
- [ ] Add E2E tests (optional)
- [ ] Performance testing

---

## Success Criteria

✅ **MVP Complete When**:
- All 70 test cases passing
- Coverage >= 85%
- No console errors
- Manual smoke test passes:
  1. Fill questionnaire (3 pages)
  2. Generate policy (< 60 seconds)
  3. Preview renders correctly
  4. Export all 3 formats work

---

## Testing Anti-Patterns to Avoid

❌ **Don't**:
- Write implementation before tests
- Keep test that passes immediately
- Test implementation details
- Mock excessively (test real behavior)
- Skip "watch test fail" step

✅ **Do**:
- Write test first, watch it fail
- Test behavior, not implementation
- Use real objects over mocks when possible
- Refactor tests as you refactor code
- Run full suite before commit

---

## Resources

- **TDD Skill**: `/skills/test-driven-development/SKILL.md`
- **Frontend Design**: `/skills/frontend-design/SKILL.md`
- **Vitest Docs**: https://vitest.dev
- **Testing Library**: https://testing-library.com/react
- **Context7 API**: Use `context7-api` skill

---

**Last Updated**: 2025-01-28  
**Test Framework**: Vitest 4.0.18  
**Coverage Tool**: Vitest Coverage (c8)

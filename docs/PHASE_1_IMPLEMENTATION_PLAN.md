# Phase 1 TDD Implementation Plan

**Created**: 2025-01-28  
**Agent**: frontend-dev subagent  
**Goal**: 42/42 tests passing (Questionnaire + API + Generator)

---

## Executive Summary

This plan follows strict TDD to implement Mandate's core features:
1. Multi-step questionnaire form (17 tests)
2. API with validation (11 tests)
3. Policy generator with OpenAI (14 tests)

**Approach**: RED → GREEN → REFACTOR for each component

---

## Current State Analysis

### ✅ What Works
- Landing page (7/8 tests passing)
- Basic test infrastructure
- Next.js 14 + Vitest configured
- Project structure in place

### ❌ What Needs Implementation
- **Questionnaire Form**: 0/17 passing
  - Multi-step navigation
  - Form state management
  - localStorage persistence
  - Input validation
  
- **API Validation**: 5/11 passing
  - Missing Zod validation
  - Error handling incomplete
  
- **Policy Generator**: 0/14 passing
  - `generatePolicy()` function doesn't exist
  - No OpenAI integration
  - No validation logic

---

## Implementation Strategy

### Phase 1A: Dependencies (15 min)

Install missing packages:

```bash
# Validation
npm install zod

# State management
npm install zustand

# OpenAI integration
npm install openai

# Export (for later phases)
npm install jspdf html2canvas docx react-markdown remark-gfm
```

---

### Phase 1B: Questionnaire Form (4-6 hours)

**Goal**: 0/17 → 17/17 tests passing

#### TDD Workflow

**1. Create State Management** (30 min)
- File: `app/generate/useQuestionnaireStore.ts`
- Use Zustand with localStorage persistence
- Run tests → Watch some pass ✅

**2. Update Form Component** (2 hours)
- File: `app/generate/page.tsx`
- Implement 3-page multi-step form
- Use shadcn/ui components (Input, Radio, Checkbox, Button)
- Connect to Zustand store
- Run tests → Watch more pass ✅

**3. Add Navigation Logic** (1 hour)
- Next/Previous buttons
- Progress indicator
- Page validation
- Run tests → More passing ✅

**4. Add localStorage** (30 min)
- Persist on change
- Load on mount
- Clear on submit
- Run tests → More passing ✅

**5. Refactor** (1 hour)
- Extract components
- Clean up code
- Improve types
- Run tests → All still passing ✅

**Success Criteria**: 17/17 tests passing ✅

#### Key Components to Create

1. **State Store** (`useQuestionnaireStore.ts`):
```typescript
interface QuestionnaireState {
  currentPage: number
  answers: {
    // Page 1: Organization Context
    sector?: 'Finance' | 'Public Sector'
    size?: string
    jurisdiction?: string
    regulated?: string[]
    
    // Page 2: AI Systems
    aiSystems?: string[]
    dataTypes?: string[]
    highRisk?: 'Yes' | 'No'
    customerFacing?: 'Yes' | 'No'
    
    // Page 3: Governance
    existing?: 'Yes' | 'No' | 'Partial'
    riskAppetite?: 'Conservative' | 'Moderate' | 'Progressive'
    owner?: string
    timeline?: string
  }
  setAnswer: (key: string, value: any) => void
  nextPage: () => void
  prevPage: () => void
  reset: () => void
}
```

2. **Form Pages** (in `page.tsx`):
- Page 1: Organization Context (sector, size, jurisdiction, regulators)
- Page 2: AI Systems (systems, data types, risk level)
- Page 3: Governance (existing policies, risk appetite, owner)

3. **Progress Component**:
```typescript
<ProgressBar current={currentPage + 1} total={3} />
```

---

### Phase 1C: API Validation (2-3 hours)

**Goal**: 5/11 → 11/11 tests passing

#### TDD Workflow

**1. Create Validation Schema** (30 min)
- File: `lib/validation/questionnaireSchema.ts`
- Use Zod for type-safe validation
- Define all required fields
- Run tests → Watch validation tests pass ✅

**2. Update API Route** (1 hour)
- File: `app/api/generate/route.ts`
- Add validation middleware
- Return 400 with proper error messages
- Run tests → Watch more pass ✅

**3. Add Error Logging** (30 min)
- Console error logging
- Error context
- Run tests → All passing ✅

**4. Refactor** (30 min)
- Extract validation helper
- Improve error messages
- Run tests → Still passing ✅

**Success Criteria**: 11/11 tests passing ✅

#### Validation Schema

```typescript
// lib/validation/questionnaireSchema.ts
import { z } from 'zod'

export const questionnaireSchema = z.object({
  // Organization Context
  sector: z.enum(['Finance', 'Public Sector'], {
    required_error: 'Sector is required',
    invalid_type_error: 'Invalid sector value',
  }),
  
  size: z.string().min(1, 'Organization size is required'),
  
  jurisdiction: z.enum([
    'Federal',
    'NSW',
    'VIC',
    'QLD',
    'SA',
    'WA',
    'TAS',
    'NT',
    'ACT',
  ], {
    required_error: 'Jurisdiction is required',
    invalid_type_error: 'Invalid jurisdiction value',
  }),
  
  regulated: z.array(z.string()).min(1, 'At least one regulator required'),
  
  // AI Systems
  aiSystems: z.array(z.string()),
  dataTypes: z.array(z.string()),
  highRisk: z.enum(['Yes', 'No']),
  customerFacing: z.enum(['Yes', 'No']),
  
  // Governance
  existing: z.enum(['Yes', 'No', 'Partial']),
  riskAppetite: z.enum(['Conservative', 'Moderate', 'Progressive']),
  owner: z.string().min(1),
  timeline: z.string().min(1),
})

export type QuestionnaireInput = z.infer<typeof questionnaireSchema>
```

#### API Route Update

```typescript
// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { questionnaireSchema } from '@/lib/validation/questionnaireSchema'
import { generatePolicy } from '@/lib/generation/policyGenerator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = questionnaireSchema.safeParse(body)
    
    if (!validation.success) {
      const error = validation.error.errors[0]
      console.error('Validation error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    // Generate policy
    const policy = await generatePolicy(validation.data)
    
    return NextResponse.json({
      policyId: policy.id,
      policy,
    })
    
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Policy generation failed' },
      { status: 500 }
    )
  }
}
```

---

### Phase 1D: Policy Generator (6-8 hours)

**Goal**: 0/14 → 14/14 tests passing

#### TDD Workflow

**1. Create Generator Interface** (1 hour)
- File: `lib/generation/policyGenerator.ts`
- Define types and interfaces
- Create empty `generatePolicy()` function
- Run tests → Watch type errors disappear ✅

**2. Implement Basic Structure** (2 hours)
- Add policy section builders
- Create validation logic
- Run 1 test at a time → Watch pass incrementally ✅

**3. Add OpenAI Integration** (2 hours)
- File: `lib/generation/openaiClient.ts`
- Configure OpenAI client
- Build prompts
- Parse responses
- Run tests → Watch generation tests pass ✅

**4. Add Sector Customization** (1 hour)
- Finance-specific content
- Public sector content
- Regulatory mapping
- Run tests → Watch customization tests pass ✅

**5. Add Validation** (1 hour)
- Word count check (≥8000)
- Section completeness
- Regulatory references (≥5)
- Run tests → All passing ✅

**6. Refactor** (1 hour)
- Extract prompt builders
- Improve parsing
- Add error handling
- Run tests → Still passing ✅

**Success Criteria**: 14/14 tests passing ✅

#### Generator Implementation

**Types & Interfaces**:
```typescript
// lib/generation/types.ts
export interface GenerationInput {
  sector: 'Finance' | 'Public Sector'
  size: string
  jurisdiction: string
  regulated: string[]
  aiSystems: string[]
  dataTypes: string[]
  highRisk: 'Yes' | 'No'
  customerFacing: 'Yes' | 'No'
  existing: 'Yes' | 'No' | 'Partial'
  riskAppetite: 'Conservative' | 'Moderate' | 'Progressive'
  owner: string
  timeline: string
}

export interface GeneratedPolicy {
  id: string
  executiveSummary: string
  purposeAndScope: string
  governanceStructure: string
  riskFramework: string
  dataGovernance: string
  complianceMonitoring: string
  incidentResponse: string
  regulatoryMapping: RegulatoryReference[]
  wordCount: number
  createdAt: string
}

export interface RegulatoryReference {
  regulation: string
  clause: string
  requirement: string
}
```

**OpenAI Client**:
```typescript
// lib/generation/openaiClient.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generatePolicyContent(
  prompt: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert in AI governance policy writing for Australian organizations.
You create comprehensive, legally sound policies that comply with:
- Australian Privacy Act
- OAIC guidelines
- Sector-specific regulations (ASIC, APRA, etc.)
- International standards (ISO, NIST)

Policies must be:
- At least 8000 words
- Structured with clear sections
- Include specific regulatory references
- Tailored to organization context`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 12000,
    })
    
    return completion.choices[0].message.content || ''
  } catch (error) {
    console.error('OpenAI error:', error)
    throw new Error('Failed to generate policy content')
  }
}
```

**Policy Generator**:
```typescript
// lib/generation/policyGenerator.ts
import { v4 as uuidv4 } from 'uuid'
import { generatePolicyContent } from './openaiClient'
import { GenerationInput, GeneratedPolicy } from './types'

export async function generatePolicy(
  input: GenerationInput
): Promise<GeneratedPolicy> {
  // 1. Validate input
  validateInput(input)
  
  // 2. Build prompt
  const prompt = buildPrompt(input)
  
  // 3. Generate content
  const content = await generatePolicyContent(prompt)
  
  // 4. Parse into sections
  const policy = parsePolicy(content, input)
  
  // 5. Validate output
  validatePolicy(policy)
  
  return policy
}

function validateInput(input: GenerationInput): void {
  if (!input.sector) {
    throw new Error('Sector is required')
  }
  
  const validSectors = ['Finance', 'Public Sector']
  if (!validSectors.includes(input.sector)) {
    throw new Error('Invalid sector')
  }
  
  if (!input.jurisdiction) {
    throw new Error('Jurisdiction is required')
  }
}

function buildPrompt(input: GenerationInput): string {
  const { sector, size, jurisdiction, regulated, aiSystems } = input
  
  return `Generate a comprehensive AI Governance Policy for:

**Organization Context:**
- Sector: ${sector}
- Size: ${size}
- Jurisdiction: ${jurisdiction}
- Regulators: ${regulated.join(', ')}

**AI Systems:**
- Systems: ${aiSystems.join(', ')}
- High Risk: ${input.highRisk}
- Customer Facing: ${input.customerFacing}

**Governance:**
- Existing Policies: ${input.existing}
- Risk Appetite: ${input.riskAppetite}

**Requirements:**
1. Minimum 8000 words
2. Include these sections:
   - Executive Summary
   - Purpose and Scope
   - Governance Structure
   - Risk Framework
   - Data Governance
   - Compliance and Monitoring
   - Incident Response

3. Include at least 5 specific regulatory references with:
   - Regulation name
   - Clause number
   - Requirement description

4. Tailor content to ${sector} sector:
   ${sector === 'Finance' 
     ? '- Include ASIC/APRA requirements\n   - Address financial system risk\n   - Include AML/CTF considerations'
     : '- Include OAIC guidelines\n   - Address public accountability\n   - Include FOI considerations'
   }

5. Adjust governance recommendations for ${size} organization

Format each section with:
## [Section Name]

[Content]

---

Start generating now:`
}

function parsePolicy(
  content: string,
  input: GenerationInput
): GeneratedPolicy {
  // Extract sections using markdown headers
  const sections = extractSections(content)
  
  // Extract regulatory references
  const regulatoryMapping = extractRegulations(content)
  
  // Calculate word count
  const wordCount = content.split(/\s+/).length
  
  return {
    id: uuidv4(),
    executiveSummary: sections['Executive Summary'] || '',
    purposeAndScope: sections['Purpose and Scope'] || '',
    governanceStructure: sections['Governance Structure'] || '',
    riskFramework: sections['Risk Framework'] || '',
    dataGovernance: sections['Data Governance'] || '',
    complianceMonitoring: sections['Compliance and Monitoring'] || '',
    incidentResponse: sections['Incident Response'] || '',
    regulatoryMapping,
    wordCount,
    createdAt: new Date().toISOString(),
  }
}

function extractSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {}
  const headerRegex = /^##\s+(.+)$/gm
  
  const matches = [...content.matchAll(headerRegex)]
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const nextMatch = matches[i + 1]
    
    const sectionName = match[1].trim()
    const startIndex = match.index! + match[0].length
    const endIndex = nextMatch ? nextMatch.index! : content.length
    
    sections[sectionName] = content.slice(startIndex, endIndex).trim()
  }
  
  return sections
}

function extractRegulations(content: string): any[] {
  const regulations: any[] = []
  
  // Pattern: "Privacy Act 1988 (Cth) s 6" or similar
  const regexPatterns = [
    /([A-Z][A-Za-z\s]+Act\s+\d{4}\s*\(Cth\))\s+s\s+(\d+[A-Z]?)/g,
    /(ASIC|APRA|OAIC)\s+([A-Z]{2,5})\s+(\d+\.\d+)/g,
  ]
  
  regexPatterns.forEach(regex => {
    const matches = [...content.matchAll(regex)]
    matches.forEach(match => {
      regulations.push({
        regulation: match[1],
        clause: match[2],
        requirement: 'Extracted from policy',
      })
    })
  })
  
  return regulations
}

function validatePolicy(policy: GeneratedPolicy): void {
  // Check word count
  if (policy.wordCount < 8000) {
    throw new Error(`Policy too short: ${policy.wordCount} words (minimum 8000)`)
  }
  
  // Check all sections exist
  const requiredSections = [
    'executiveSummary',
    'purposeAndScope',
    'governanceStructure',
    'riskFramework',
  ]
  
  for (const section of requiredSections) {
    if (!policy[section as keyof GeneratedPolicy]) {
      throw new Error(`Missing required section: ${section}`)
    }
  }
  
  // Check regulatory references
  if (policy.regulatoryMapping.length < 5) {
    throw new Error(`Insufficient regulatory references: ${policy.regulatoryMapping.length} (minimum 5)`)
  }
}
```

---

## Testing Strategy

### Running Tests

```bash
# Run all tests
npm test

# Run specific suite
npm test -- app/generate/__tests__/GeneratePage.test.tsx

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# UI mode
npm run test:ui
```

### Test-Driven Workflow

For **EACH** feature:

1. **RED** - Run test, watch it fail
   ```bash
   npm test -- path/to/test.tsx
   # Expected: ❌ Test fails
   ```

2. **GREEN** - Write minimal code to pass
   ```typescript
   // Implement just enough
   export function myFunction() {
     return 'expected'
   }
   ```

3. **Run test again**
   ```bash
   npm test -- path/to/test.tsx
   # Expected: ✅ Test passes
   ```

4. **REFACTOR** - Clean up while tests stay green
   ```typescript
   // Improve code quality
   // Extract helpers
   // Better names
   ```

5. **Verify tests still pass**
   ```bash
   npm test
   # Expected: ✅ All tests still pass
   ```

6. **Commit**
   ```bash
   git add .
   git commit -m "feat: implement X with tests"
   ```

---

## Verification Checklist

### Before Declaring Done

- [ ] All 42 tests passing (17 + 11 + 14)
- [ ] No console errors
- [ ] Test coverage ≥ 85%
- [ ] shadcn/ui components used
- [ ] TypeScript strict mode passing
- [ ] No any types (except where necessary)
- [ ] Error handling implemented
- [ ] Code refactored and clean
- [ ] Git committed with good messages

### Manual Smoke Test

1. [ ] Open http://localhost:3000
2. [ ] Click "Generate My Policy"
3. [ ] Fill Page 1 (sector, jurisdiction, regulators)
4. [ ] Click Next → Progress shows 66%
5. [ ] Fill Page 2 (AI systems, risk level)
6. [ ] Click Next → Progress shows 100%
7. [ ] Fill Page 3 (governance, timeline)
8. [ ] Click "Generate Policy"
9. [ ] Loading state shows
10. [ ] Policy generates successfully
11. [ ] No console errors

---

## Dependencies Installation

```bash
cd /Users/dhrubajyotibiswas/clawd/mandate

# Core dependencies
npm install zod zustand openai

# Export (Phase 2)
npm install jspdf html2canvas docx react-markdown remark-gfm

# UUID generation
npm install uuid
npm install --save-dev @types/uuid
```

---

## Environment Setup

```bash
# Create .env.local
cat > .env.local << 'EOF'
OPENAI_API_KEY=sk-your-key-here
NODE_ENV=development
EOF

# Verify
cat .env.local
```

---

## Timeline Estimate

| Task | Estimated Time | Tests |
|------|---------------|-------|
| Dependencies | 15 min | - |
| Questionnaire Form | 4-6 hours | 0/17 → 17/17 |
| API Validation | 2-3 hours | 5/11 → 11/11 |
| Policy Generator | 6-8 hours | 0/14 → 14/14 |
| Verification | 1 hour | Manual testing |
| **Total** | **13-18 hours** | **42/42** |

---

## Success Criteria

✅ **Phase 1 Complete When:**
1. All 42 tests passing ✅
2. Questionnaire form works (3 pages)
3. Form persists to localStorage
4. API validates input correctly
5. Policy generates from OpenAI
6. Policy meets all requirements (8000+ words, 5+ regulations)
7. No console errors
8. Code is clean and refactored

---

## Next Steps After Phase 1

After 42/42 tests passing:

1. **Phase 2: Export** (12 tests)
   - PDF export
   - DOCX export
   - Markdown export

2. **Phase 3: Preview** (8 tests)
   - Policy preview page
   - Table of contents
   - Export UI

3. **Phase 4: Polish**
   - Error boundaries
   - Loading states
   - Performance optimization
   - Deploy to Vercel

---

**Plan Created**: 2025-01-28  
**Ready to Execute**: ✅ YES  
**First Action**: Install dependencies

🚀 **Let's build Mandate with TDD!**

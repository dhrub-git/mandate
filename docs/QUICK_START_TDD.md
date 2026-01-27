# 🚀 Quick Start: TDD Implementation

**Start here** to begin implementing Mandate following Test-Driven Development.

---

## Current Status

```
📊 Test Coverage: 17% (12/70 passing)
🔴 RED Phase: 58 tests failing (by design)
🟢 Ready for: GREEN phase (implementation)
⏱️  Estimated Time: 25-30 hours
```

---

## Step 1: Install Dependencies (5 min)

```bash
cd /Users/dhrubajyotibiswas/clawd/mandate

# Install missing dependencies
npm install zod openai zustand jspdf html2canvas docx react-markdown remark-gfm

# Verify installation
npm list --depth=0 | grep -E "(zod|openai|zustand)"
```

---

## Step 2: Set Up Environment Variables

```bash
# Create .env.local file
cat > .env.local << EOF
OPENAI_API_KEY=your-api-key-here
CONTEXT7_API_KEY=your-context7-key-here
NODE_ENV=development
EOF

# Add to .gitignore (should already be there)
echo ".env.local" >> .gitignore
```

---

## Step 3: Start TDD Cycle

### 3A. Questionnaire Form (Priority 0)

**Goal**: Get 17 tests from RED → GREEN

```bash
# Run tests (they should FAIL)
npm test -- app/generate/__tests__/GeneratePage.test.tsx

# Expected output: ❌ 0/17 passing
```

**Implementation Steps**:

1. **Create state management** (`app/generate/useQuestionnaireStore.ts`):

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface QuestionnaireState {
  currentPage: number
  answers: Record<string, any>
  setAnswer: (key: string, value: any) => void
  nextPage: () => void
  prevPage: () => void
  reset: () => void
}

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set) => ({
      currentPage: 0,
      answers: {},
      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),
      nextPage: () =>
        set((state) => ({
          currentPage: Math.min(state.currentPage + 1, 2),
        })),
      prevPage: () =>
        set((state) => ({
          currentPage: Math.max(state.currentPage - 1, 0),
        })),
      reset: () => set({ currentPage: 0, answers: {} }),
    }),
    { name: 'mandate-questionnaire' }
  )
)
```

2. **Update `app/generate/page.tsx`** to use the store

3. **Run tests again**:
```bash
npm test -- app/generate/__tests__/GeneratePage.test.tsx
# Goal: ✅ 17/17 passing
```

---

### 3B. API Validation (Priority 0)

**Goal**: Get 6 validation tests from RED → GREEN

```bash
# Run tests (5/11 passing, need 11/11)
npm test -- app/api/generate/__tests__/route.test.ts
```

**Implementation Steps**:

1. **Create validation schema** (`lib/validation/questionnaireSchema.ts`):

```typescript
import { z } from 'zod'

export const questionnaireSchema = z.object({
  sector: z.enum(['Finance', 'Public Sector'], {
    required_error: 'Sector is required',
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
  }),
  regulated: z.array(z.string()).min(1, 'At least one regulator required'),
  aiSystems: z.array(z.string()),
  dataTypes: z.array(z.string()),
  highRisk: z.enum(['Yes', 'No']),
  customerFacing: z.enum(['Yes', 'No']),
  existing: z.enum(['Yes', 'No', 'Partial']),
  riskAppetite: z.enum(['Conservative', 'Moderate', 'Progressive']),
  owner: z.string(),
  timeline: z.string(),
})

export type QuestionnaireInput = z.infer<typeof questionnaireSchema>
```

2. **Update `app/api/generate/route.ts`** to validate:

```typescript
import { questionnaireSchema } from '@/lib/validation/questionnaireSchema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validated = questionnaireSchema.safeParse(body)
    
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      )
    }
    
    // Continue with generation...
  } catch (error) {
    // Handle errors...
  }
}
```

3. **Run tests**:
```bash
npm test -- app/api/generate/__tests__/route.test.ts
# Goal: ✅ 11/11 passing
```

---

### 3C. Policy Generator (Priority 0)

**Goal**: Get 14 tests from RED → GREEN

```bash
# Run tests (should all FAIL)
npm test -- lib/generation/__tests__/policyGenerator.test.ts
```

**Implementation Steps**:

1. **Create OpenAI client** (`lib/generation/openaiClient.ts`):

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generatePolicyContent(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are an expert in AI governance policy writing...',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 8000,
  })
  
  return completion.choices[0].message.content || ''
}
```

2. **Create policy generator** (`lib/generation/policyGenerator.ts`):

```typescript
import { generatePolicyContent } from './openaiClient'

export interface GenerationInput {
  sector: 'Finance' | 'Public Sector'
  jurisdiction: string
  organizationSize: string
  aiSystems: string[]
  dataTypes: string[]
  highRisk: string
  riskAppetite: string
}

export interface GeneratedPolicy {
  id: string
  executiveSummary: string
  purposeAndScope: string
  governanceStructure: string
  riskFramework: string
  regulatoryMapping: string[]
  wordCount: number
}

export async function generatePolicy(
  input: GenerationInput
): Promise<GeneratedPolicy> {
  // 1. Build prompt from input
  const prompt = buildPrompt(input)
  
  // 2. Call OpenAI
  const content = await generatePolicyContent(prompt)
  
  // 3. Parse response into sections
  const policy = parsePolicy(content)
  
  // 4. Validate completeness
  validatePolicy(policy)
  
  // 5. Return
  return policy
}

function buildPrompt(input: GenerationInput): string {
  return `Generate an AI governance policy for:
  Sector: ${input.sector}
  Jurisdiction: ${input.jurisdiction}
  Organization Size: ${input.organizationSize}
  ...
  `
}

function parsePolicy(content: string): GeneratedPolicy {
  // Parse the generated content into structured sections
  // Extract executive summary, governance structure, etc.
  return {
    id: generateId(),
    executiveSummary: extractSection(content, 'Executive Summary'),
    purposeAndScope: extractSection(content, 'Purpose and Scope'),
    governanceStructure: extractSection(content, 'Governance Structure'),
    riskFramework: extractSection(content, 'Risk Framework'),
    regulatoryMapping: extractRegulations(content),
    wordCount: content.split(/\s+/).length,
  }
}

function validatePolicy(policy: GeneratedPolicy): void {
  if (policy.wordCount < 8000) {
    throw new Error('Policy too short')
  }
  if (policy.regulatoryMapping.length < 5) {
    throw new Error('Insufficient regulatory references')
  }
}
```

3. **Run tests**:
```bash
npm test -- lib/generation/__tests__/policyGenerator.test.ts
# Goal: ✅ 14/14 passing
```

---

## Step 4: Run Full Test Suite

```bash
# Run all tests
npm test

# Expected after Steps 1-3:
# ✅ Landing Page: 8/8 passing (100%)
# ✅ Questionnaire: 17/17 passing (100%)
# ✅ API: 11/11 passing (100%)
# ✅ Generator: 14/14 passing (100%)
# Total: 50/50 (100%) for Phase 1
```

---

## Step 5: Export & Preview (Priority 1)

After core generation works, implement export:

### 5A. Create Export Tests
```bash
# Create test file
touch app/preview/[id]/__tests__/export.test.tsx

# Write 12 export tests (see TDD_TEST_PLAN.md)
```

### 5B. Implement Export
```typescript
// lib/export/pdfExport.ts
import jsPDF from 'jspdf'

export async function exportToPDF(policy: GeneratedPolicy): Promise<Blob> {
  const doc = new jsPDF()
  // Add content to PDF
  return doc.output('blob')
}

// lib/export/docxExport.ts
import { Document, Packer, Paragraph } from 'docx'

export async function exportToDOCX(policy: GeneratedPolicy): Promise<Blob> {
  const doc = new Document({
    sections: [/* ... */]
  })
  return await Packer.toBlob(doc)
}
```

---

## Step 6: Verify & Deploy

```bash
# Run all tests
npm test

# Check coverage
npm run test:coverage

# Build for production
npm run build

# Test production build
npm start

# Deploy to Vercel
vercel --prod
```

---

## TDD Red Flags - STOP If You See These

❌ **Writing code before test** → Delete code, write test first  
❌ **Test passes immediately** → Test is wrong, fix it  
❌ **Skipping "watch test fail"** → Not TDD, start over  
❌ **"I'll test it later"** → No. Test first. Always.  

✅ **Test written → fails → code written → passes** → ✨ This is TDD

---

## Progress Tracking

### Phase 1: Core (Week 1)
- [ ] Day 1-2: Questionnaire (0/17 → 17/17) ⏱️ 4-6h
- [ ] Day 3: API Validation (5/11 → 11/11) ⏱️ 2-3h
- [ ] Day 4-5: Policy Generator (0/14 → 14/14) ⏱️ 6-8h

### Phase 2: Export (Week 2)
- [ ] Day 6-7: Export (0/12 → 12/12) ⏱️ 4-5h
- [ ] Day 8: Preview (0/8 → 8/8) ⏱️ 2-3h
- [ ] Day 9-10: Integration & Deploy ⏱️ 4-5h

---

## Resources

- **Full Test Plan**: `TDD_TEST_PLAN.md`
- **Detailed Report**: `TDD_IMPLEMENTATION_REPORT.md`
- **TDD Skill**: `/skills/test-driven-development/SKILL.md`
- **Frontend Skill**: `/skills/frontend-design/SKILL.md`

---

## Getting Help

**Stuck?** Check these in order:
1. Read the failing test error message
2. Check `TDD_TEST_PLAN.md` for expected behavior
3. Review TDD skill: `/skills/test-driven-development/SKILL.md`
4. Look at similar passing tests for patterns

**Remember**: TDD saves time by catching bugs early. Trust the process.

---

**Last Updated**: 2025-01-28  
**Next Action**: Install dependencies and start Step 3A

🚀 **Let's build Mandate with TDD!**

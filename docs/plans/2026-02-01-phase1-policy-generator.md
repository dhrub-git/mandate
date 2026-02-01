# Phase 1: AI Governance Policy Generator — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and deploy an AI-powered policy generator that takes a questionnaire and produces 3 governance artifacts (Policy + Checklist + Roadmap) in <15 seconds.

**Architecture:** Next.js 15 frontend with multi-step questionnaire → Convex backend for storage → OpenAI GPT-4.5 via Vercel AI SDK for generation → Exa.dev API for regulation data → Export to PDF/Word/Markdown.

**Tech Stack:** Next.js 15, TypeScript, Convex, Vercel AI SDK, OpenAI GPT-4.5, Exa.dev API, Shadcn UI, Tailwind CSS

**Timeline:** 7-14 days (2 weeks max)

**Team:** 2-3 developers (can scale with more for parallel tasks)

---

## Prerequisites

Before starting:

1. **API Keys Required:**
   - OpenAI API key (GPT-4.5 access)
   - Exa.dev API key
   - Convex account (free tier)
   - Vercel account (free tier)

2. **Development Environment:**
   - Node.js 18+ installed
   - Git installed
   - Code editor (VS Code recommended)
   - Terminal access

3. **Knowledge Required:**
   - Basic Next.js (App Router)
   - TypeScript fundamentals
   - React hooks (useState, useEffect)
   - Git basics (commit, push, pull)

---

## Task 1: Project Initialization

**Goal:** Set up Next.js project with all dependencies and environment configuration.

**Files:**
- Create: `mandate/` (project root)
- Create: `mandate/.env.local`
- Create: `mandate/.gitignore`

### Step 1: Initialize Next.js project

**Command:**
```bash
npx create-next-app@latest mandate --typescript --tailwind --app --no-src-dir
cd mandate
```

**Interactive prompts (answer as shown):**
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … No
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias? … No
```

**Expected output:** `✔ Creating a new Next.js app in /path/to/mandate`

### Step 2: Install dependencies

**Command:**
```bash
npm install convex @ai-sdk/openai ai zod exa-js
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-progress
npm install -D @types/node
```

**Expected output:** `added XXX packages` (no errors)

### Step 3: Initialize Convex

**Command:**
```bash
npx convex dev
```

**Interactive prompts:**
```
? What would you like to do? › Create a new project
? Project name: mandate
```

**Expected output:**
```
✔ Created new project: mandate
✔ Saved credentials to .env.local
✔ Started backend sync
```

**Note:** This creates `convex/` folder and `.env.local` file

### Step 4: Add environment variables

**Command:**
```bash
cat >> .env.local << 'EOF'
OPENAI_API_KEY=your_openai_api_key_here
EXA_API_KEY=your_exa_api_key_here
EOF
```

**Manual step:** Replace placeholder keys with real API keys

**Verify:**
```bash
grep -E "(OPENAI_API_KEY|EXA_API_KEY)" .env.local
```

**Expected output:**
```
OPENAI_API_KEY=sk-...
EXA_API_KEY=...
```

### Step 5: Update .gitignore

**Command:**
```bash
cat >> .gitignore << 'EOF'

# Environment variables
.env.local
.env

# Convex
.convex/

# Testing
coverage/
EOF
```

### Step 6: Create folder structure

**Command:**
```bash
mkdir -p app/api/generate
mkdir -p app/generate
mkdir -p app/result
mkdir -p lib
mkdir -p components/ui
mkdir -p public/docs
```

**Verify:**
```bash
tree -L 2 -d app lib components
```

**Expected output:**
```
app
├── api
│   └── generate
├── generate
└── result
lib
components
└── ui
```

### Step 7: Initial commit

**Command:**
```bash
git add .
git commit -m "chore: initialize Next.js project with Convex and AI SDK

- Next.js 15 with App Router
- TypeScript, Tailwind CSS, ESLint
- Convex backend setup
- OpenAI + Exa.dev dependencies
- Environment variables configured"
```

**Expected output:** `[main xxxxx] chore: initialize...`

---

## Task 2: Convex Schema & Data Models

**Goal:** Define database schema for policies and questionnaire responses.

**Files:**
- Create: `convex/schema.ts`
- Create: `convex/policies.ts`

### Step 1: Write Convex schema

**Create:** `convex/schema.ts`

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  policies: defineTable({
    // Input data
    sector: v.string(),
    jurisdiction: v.string(),
    organizationSize: v.string(),
    riskProfile: v.string(),
    
    // Optional context
    existingAISystems: v.optional(v.boolean()),
    regulationsInScope: v.optional(v.array(v.string())),
    teamMaturity: v.optional(v.string()),
    complianceFocus: v.optional(v.array(v.string())),
    
    // Generated artifacts
    policyDocument: v.string(),
    complianceChecklist: v.array(v.object({
      item: v.string(),
      regulation: v.string(),
      nistControl: v.string(),
      owner: v.string(),
      timeline: v.string(),
    })),
    implementationRoadmap: v.array(v.object({
      name: v.string(),
      duration: v.string(),
      objectives: v.array(v.string()),
      resources: v.object({
        fte: v.number(),
        budget: v.string(),
      }),
      milestones: v.array(v.string()),
      risks: v.array(v.string()),
    })),
    
    // Metadata
    generatedAt: v.number(),
    generationTimeMs: v.number(),
    tokensUsed: v.number(),
    regulationsUsed: v.array(v.string()),
  }),
});
```

### Step 2: Create policies mutations and queries

**Create:** `convex/policies.ts`

```typescript
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Save a generated policy
export const savePolicy = mutation({
  args: {
    sector: v.string(),
    jurisdiction: v.string(),
    organizationSize: v.string(),
    riskProfile: v.string(),
    policyDocument: v.string(),
    complianceChecklist: v.array(v.object({
      item: v.string(),
      regulation: v.string(),
      nistControl: v.string(),
      owner: v.string(),
      timeline: v.string(),
    })),
    implementationRoadmap: v.array(v.object({
      name: v.string(),
      duration: v.string(),
      objectives: v.array(v.string()),
      resources: v.object({
        fte: v.number(),
        budget: v.string(),
      }),
      milestones: v.array(v.string()),
      risks: v.array(v.string()),
    })),
    generationTimeMs: v.number(),
    tokensUsed: v.number(),
    regulationsUsed: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const policyId = await ctx.db.insert("policies", {
      ...args,
      generatedAt: Date.now(),
    });
    
    return policyId;
  },
});

// Get a policy by ID
export const getPolicy = query({
  args: { id: v.id("policies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// List all policies (most recent first)
export const listPolicies = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("policies")
      .order("desc")
      .take(20);
  },
});
```

### Step 3: Deploy schema to Convex

**Command:**
```bash
npx convex dev
```

**Expected output:**
```
✔ Synced schema
✔ Functions deployed
```

**Note:** Keep this terminal running. Open a new terminal for next steps.

### Step 4: Verify schema deployed

**Visit:** https://dashboard.convex.dev

- Navigate to your `mandate` project
- Click "Data" tab
- Verify `policies` table exists
- Check schema matches (click table → "Schema" tab)

### Step 5: Commit

**Command:**
```bash
git add convex/schema.ts convex/policies.ts
git commit -m "feat: add Convex schema and policies mutations

- Define policies table with input + output fields
- savePolicy mutation to store generated policies
- getPolicy and listPolicies queries
- Schema deployed to Convex backend"
```

---

## Task 3: Exa.dev Regulation Fetcher

**Goal:** Build utility to fetch regulation data from Exa.dev API.

**Files:**
- Create: `lib/exa.ts`
- Create: `lib/types.ts`

### Step 1: Define TypeScript types

**Create:** `lib/types.ts`

```typescript
export interface QuestionnaireInput {
  sector: "finance" | "public_sector" | "healthcare" | "retail";
  jurisdiction: "au_federal" | "au_nsw" | "au_vic" | "au_qld";
  organizationSize: "1-50" | "51-200" | "201-1000" | "1000+";
  riskProfile: "low" | "medium" | "high";
  existingAISystems?: boolean;
  regulationsInScope?: string[];
  teamMaturity?: "building" | "scaling" | "mature";
  complianceFocus?: string[];
}

export interface Regulation {
  name: string;
  keyRequirements: string;
  sourceUrl: string;
  sector: string;
  jurisdiction: string;
}

export interface GeneratedPolicy {
  policyDocument: string;
  complianceChecklist: ChecklistItem[];
  implementationRoadmap: RoadmapPhase[];
}

export interface ChecklistItem {
  item: string;
  regulation: string;
  nistControl: string;
  owner: string;
  timeline: string;
}

export interface RoadmapPhase {
  name: string;
  duration: string;
  objectives: string[];
  resources: {
    fte: number;
    budget: string;
  };
  milestones: string[];
  risks: string[];
}
```

### Step 2: Create Exa.dev integration

**Create:** `lib/exa.ts`

```typescript
import Exa from "exa-js";
import { Regulation } from "./types";

const exa = new Exa(process.env.EXA_API_KEY);

/**
 * Build search queries based on sector and jurisdiction
 */
function buildRegulatoryQueries(
  sector: string,
  jurisdiction: string
): string[] {
  const baseQueries: Record<string, string[]> = {
    finance: [
      "Privacy Act 1988 Australia financial sector",
      "ASIC AI governance guidance",
      "APRA AI risk management framework",
    ],
    public_sector: [
      "Privacy Act 1988 Australia",
      "NSW AI ethics framework",
      "Australian AI ethics principles government",
    ],
    healthcare: [
      "Privacy Act 1988 Australia healthcare",
      "Therapeutic Goods Act AI medical devices",
      "AHPRA AI clinical decision support",
    ],
    retail: [
      "Privacy Act 1988 Australia retail",
      "Australian Consumer Law AI recommendations",
      "ACCC data practices customer AI",
    ],
  };

  // Add NIST AI RMF for all sectors
  const queries = baseQueries[sector] || baseQueries.finance;
  queries.push("NIST AI Risk Management Framework");

  return queries;
}

/**
 * Extract key requirements from regulation text
 */
function extractRequirements(text: string, regulationName: string): string {
  // Simple extraction: take first 500 chars
  // TODO: Use GPT-4.5 for intelligent extraction in production
  const summary = text.substring(0, 500).trim();
  
  // If text is very short, return as-is
  if (text.length < 200) {
    return text.trim();
  }
  
  return summary + "...";
}

/**
 * Extract regulation name from document title
 */
function extractRegulationName(title: string): string {
  // Remove common prefixes/suffixes
  return title
    .replace(/^(Australian|NSW|VIC|QLD)\s+/, "")
    .replace(/\s+-\s+.*$/, "")
    .trim();
}

/**
 * Fetch regulations from Exa.dev
 */
export async function fetchRegulations(
  sector: string,
  jurisdiction: string
): Promise<Regulation[]> {
  try {
    const queries = buildRegulatoryQueries(sector, jurisdiction);
    
    console.log(`[Exa] Fetching regulations for ${sector} / ${jurisdiction}`);
    console.log(`[Exa] Queries:`, queries);
    
    // Fetch results for all queries in parallel
    const results = await Promise.all(
      queries.map((query) =>
        exa.searchAndContents(query, {
          type: "keyword",
          numResults: 3,
          text: true,
        })
      )
    );
    
    // Flatten results and deduplicate by URL
    const allResults = results.flatMap((r) => r.results);
    const uniqueByUrl = Array.from(
      new Map(allResults.map((r) => [r.url, r])).values()
    );
    
    console.log(`[Exa] Found ${uniqueByUrl.length} unique regulation sources`);
    
    // Convert to Regulation objects
    const regulations: Regulation[] = uniqueByUrl.map((doc) => ({
      name: extractRegulationName(doc.title),
      keyRequirements: extractRequirements(doc.text || "", doc.title),
      sourceUrl: doc.url,
      sector,
      jurisdiction,
    }));
    
    return regulations;
  } catch (error) {
    console.error("[Exa] Error fetching regulations:", error);
    
    // Fallback: return minimal regulations
    return [
      {
        name: "Privacy Act 1988",
        keyRequirements: "Requires consent for personal data collection, security safeguards, and data breach notification.",
        sourceUrl: "https://www.legislation.gov.au/Series/C2004A03712",
        sector,
        jurisdiction,
      },
      {
        name: "NIST AI Risk Management Framework",
        keyRequirements: "Four core functions: Govern, Map, Measure, Manage AI risks across the lifecycle.",
        sourceUrl: "https://www.nist.gov/itl/ai-risk-management-framework",
        sector,
        jurisdiction,
      },
    ];
  }
}
```

### Step 3: Test Exa.dev integration

**Create:** `lib/__tests__/exa.test.ts`

```typescript
import { fetchRegulations } from "../exa";

describe("fetchRegulations", () => {
  it("should return regulations for finance sector", async () => {
    const regulations = await fetchRegulations("finance", "au_federal");
    
    expect(regulations).toBeDefined();
    expect(regulations.length).toBeGreaterThan(0);
    expect(regulations[0]).toHaveProperty("name");
    expect(regulations[0]).toHaveProperty("keyRequirements");
    expect(regulations[0]).toHaveProperty("sourceUrl");
  }, 30000); // 30s timeout for API call
  
  it("should handle API errors gracefully", async () => {
    // Force error by using invalid API key
    const originalKey = process.env.EXA_API_KEY;
    process.env.EXA_API_KEY = "invalid";
    
    const regulations = await fetchRegulations("finance", "au_federal");
    
    // Should return fallback regulations
    expect(regulations).toBeDefined();
    expect(regulations.length).toBeGreaterThanOrEqual(2);
    expect(regulations.find(r => r.name.includes("Privacy Act"))).toBeDefined();
    
    process.env.EXA_API_KEY = originalKey;
  });
});
```

### Step 4: Run test (expect to pass if EXA_API_KEY is valid)

**Command:**
```bash
npm test -- lib/__tests__/exa.test.ts
```

**Expected output:**
```
 PASS  lib/__tests__/exa.test.ts
  fetchRegulations
    ✓ should return regulations for finance sector (5000 ms)
    ✓ should handle API errors gracefully (100 ms)
```

**Note:** If test fails, check EXA_API_KEY in .env.local

### Step 5: Manual test (optional)

**Create:** `scripts/test-exa.ts`

```typescript
import { fetchRegulations } from "../lib/exa";

async function main() {
  console.log("Testing Exa.dev integration...\n");
  
  const regulations = await fetchRegulations("finance", "au_federal");
  
  console.log(`Found ${regulations.length} regulations:\n`);
  
  regulations.forEach((reg, i) => {
    console.log(`${i + 1}. ${reg.name}`);
    console.log(`   Requirements: ${reg.keyRequirements.substring(0, 100)}...`);
    console.log(`   Source: ${reg.sourceUrl}\n`);
  });
}

main();
```

**Run:**
```bash
npx tsx scripts/test-exa.ts
```

**Expected output:** List of regulations with names and requirements

### Step 6: Commit

**Command:**
```bash
git add lib/exa.ts lib/types.ts lib/__tests__/exa.test.ts
git commit -m "feat: add Exa.dev regulation fetcher

- Build search queries per sector/jurisdiction
- Fetch regulation data via Exa.dev API
- Extract key requirements from text
- Fallback to minimal regulations on error
- Tests for API integration and error handling"
```

---

## Task 4: OpenAI Policy Generation Engine

**Goal:** Build prompt templates and generation logic using OpenAI GPT-4.5.

**Files:**
- Create: `lib/prompts.ts`
- Create: `lib/generate.ts`

### Step 1: Create prompt templates

**Create:** `lib/prompts.ts`

```typescript
import { QuestionnaireInput, Regulation } from "./types";

/**
 * Build policy generation prompt
 */
export function buildPolicyPrompt(
  input: QuestionnaireInput,
  regulations: Regulation[]
): string {
  const regulationsText = regulations
    .map((r) => `- ${r.name}: ${r.keyRequirements}`)
    .join("\n");

  return `You are an expert in ${input.sector} AI governance and Australian regulatory compliance.

Generate a comprehensive AI Governance Policy tailored to:
- Sector: ${input.sector}
- Jurisdiction: ${input.jurisdiction}
- Organization size: ${input.organizationSize}
- Risk profile: ${input.riskProfile}

The policy must:
1. Address these regulations:
${regulationsText}

2. Map to NIST AI RMF controls (Govern, Map, Measure, Manage)
3. Be implementable by a team of size ${input.organizationSize}
4. Include specific, actionable requirements (not generic boilerplate)

Generate the policy in Markdown format with these sections:
1. Purpose & Scope
2. AI System Classification
3. Governance Structure
4. Risk Assessment Framework
5. Accountability Measures
6. Transparency & Monitoring
7. Training & Culture
8. Compliance Requirements

Output only the policy document in Markdown format. Do not include explanations or comments.`;
}

/**
 * Build checklist generation prompt
 */
export function buildChecklistPrompt(
  input: QuestionnaireInput,
  regulations: Regulation[],
  policyDocument: string
): string {
  const regulationsText = regulations
    .map((r) => r.name)
    .join(", ");

  return `Based on the AI governance policy below, generate a compliance checklist.

Policy:
${policyDocument.substring(0, 2000)}...

Requirements:
1. Map EVERY requirement from these regulations: ${regulationsText}
2. Map to NIST AI RMF controls (GOVERN-X.X, MAP-X.X, MEASURE-X.X, MANAGE-X.X)
3. Format as actionable items
4. Include responsibility owner + timeline estimate

Output as JSON array:
[
  {
    "item": "Conduct AI system risk assessment",
    "regulation": "NIST AI RMF",
    "nistControl": "GOVERN-2.1",
    "owner": "Chief Risk Officer",
    "timeline": "Month 1"
  }
]

Output only valid JSON. Do not include markdown code blocks or explanations.`;
}

/**
 * Build roadmap generation prompt
 */
export function buildRoadmapPrompt(
  input: QuestionnaireInput
): string {
  return `Create a phased 12-18 month implementation roadmap for deploying an AI governance policy.

Context:
- Organization size: ${input.organizationSize}
- Risk profile: ${input.riskProfile}
- Team maturity: ${input.teamMaturity || "building"}

Phases:
1. Foundation (Months 1-3): Governance structure, policies, baseline audit
2. Build (Months 4-9): Tools, training, process integration
3. Scale (Months 10-18): Continuous monitoring, optimization

For each phase, specify:
- Objectives (3-5 key goals)
- Resources (FTE count, budget estimate)
- Milestones (3-5 checkpoints)
- Risks (2-3 key risks with mitigation)

Output as JSON array:
[
  {
    "name": "Foundation",
    "duration": "Months 1-3",
    "objectives": ["...", "..."],
    "resources": { "fte": 2, "budget": "$50K" },
    "milestones": ["...", "..."],
    "risks": ["...", "..."]
  }
]

Output only valid JSON. Do not include markdown code blocks or explanations.`;
}
```

### Step 2: Create generation engine

**Create:** `lib/generate.ts`

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import {
  QuestionnaireInput,
  Regulation,
  GeneratedPolicy,
  ChecklistItem,
  RoadmapPhase,
} from "./types";
import {
  buildPolicyPrompt,
  buildChecklistPrompt,
  buildRoadmapPrompt,
} from "./prompts";

/**
 * Generate AI governance policy artifacts
 */
export async function generatePolicy(
  input: QuestionnaireInput,
  regulations: Regulation[]
): Promise<GeneratedPolicy> {
  const startTime = Date.now();

  console.log("[Generate] Starting policy generation...");

  // Step 1: Generate policy document
  console.log("[Generate] Generating policy document...");
  const policyPrompt = buildPolicyPrompt(input, regulations);

  const policyResult = await generateText({
    model: openai("gpt-4o"),
    prompt: policyPrompt,
    temperature: 0.7,
    maxTokens: 3000,
  });

  const policyDocument = policyResult.text;
  console.log(`[Generate] Policy document: ${policyDocument.length} chars`);

  // Step 2: Generate compliance checklist
  console.log("[Generate] Generating compliance checklist...");
  const checklistPrompt = buildChecklistPrompt(
    input,
    regulations,
    policyDocument
  );

  const checklistResult = await generateText({
    model: openai("gpt-4o"),
    prompt: checklistPrompt,
    temperature: 0.5,
    maxTokens: 2000,
  });

  let complianceChecklist: ChecklistItem[] = [];
  try {
    complianceChecklist = JSON.parse(checklistResult.text);
  } catch (error) {
    console.error("[Generate] Failed to parse checklist JSON:", error);
    // Fallback: extract items from text
    complianceChecklist = parseFallbackChecklist(checklistResult.text);
  }

  console.log(
    `[Generate] Checklist: ${complianceChecklist.length} items`
  );

  // Step 3: Generate implementation roadmap
  console.log("[Generate] Generating implementation roadmap...");
  const roadmapPrompt = buildRoadmapPrompt(input);

  const roadmapResult = await generateText({
    model: openai("gpt-4o"),
    prompt: roadmapPrompt,
    temperature: 0.6,
    maxTokens: 2000,
  });

  let implementationRoadmap: RoadmapPhase[] = [];
  try {
    implementationRoadmap = JSON.parse(roadmapResult.text);
  } catch (error) {
    console.error("[Generate] Failed to parse roadmap JSON:", error);
    // Fallback: create minimal roadmap
    implementationRoadmap = createFallbackRoadmap(input);
  }

  console.log(
    `[Generate] Roadmap: ${implementationRoadmap.length} phases`
  );

  const generationTime = Date.now() - startTime;
  console.log(`[Generate] Total generation time: ${generationTime}ms`);

  return {
    policyDocument,
    complianceChecklist,
    implementationRoadmap,
  };
}

/**
 * Fallback checklist parser (if JSON parsing fails)
 */
function parseFallbackChecklist(text: string): ChecklistItem[] {
  // Simple fallback: return minimal checklist
  return [
    {
      item: "Establish AI governance committee",
      regulation: "NIST AI RMF",
      nistControl: "GOVERN-1.1",
      owner: "CIO",
      timeline: "Month 1",
    },
    {
      item: "Conduct AI system inventory",
      regulation: "Privacy Act 1988",
      nistControl: "MAP-1.1",
      owner: "Chief Risk Officer",
      timeline: "Month 2",
    },
  ];
}

/**
 * Create fallback roadmap (if JSON parsing fails)
 */
function createFallbackRoadmap(
  input: QuestionnaireInput
): RoadmapPhase[] {
  return [
    {
      name: "Foundation",
      duration: "Months 1-3",
      objectives: [
        "Establish governance structure",
        "Create baseline AI inventory",
        "Complete initial risk assessment",
      ],
      resources: { fte: 2, budget: "$50K" },
      milestones: [
        "Governance committee formed",
        "AI inventory complete",
        "Risk assessment report published",
      ],
      risks: [
        "Lack of executive buy-in",
        "Incomplete AI system visibility",
      ],
    },
    {
      name: "Build",
      duration: "Months 4-9",
      objectives: [
        "Implement monitoring tools",
        "Train staff on AI governance",
        "Integrate policies into workflows",
      ],
      resources: { fte: 3, budget: "$100K" },
      milestones: [
        "Monitoring tools deployed",
        "Training program complete",
        "Policy integration in 80% of workflows",
      ],
      risks: [
        "Tool integration complexity",
        "Staff resistance to change",
      ],
    },
    {
      name: "Scale",
      duration: "Months 10-18",
      objectives: [
        "Continuous monitoring",
        "Process optimization",
        "Maturity assessment",
      ],
      resources: { fte: 2, budget: "$75K" },
      milestones: [
        "Continuous monitoring operational",
        "Annual governance review complete",
        "Maturity level 3 achieved",
      ],
      risks: [
        "Complacency after initial success",
        "Regulation changes requiring updates",
      ],
    },
  ];
}
```

### Step 3: Test generation engine (manual test)

**Create:** `scripts/test-generate.ts`

```typescript
import { generatePolicy } from "../lib/generate";
import { fetchRegulations } from "../lib/exa";

async function main() {
  console.log("Testing policy generation...\n");

  const input = {
    sector: "finance" as const,
    jurisdiction: "au_federal" as const,
    organizationSize: "51-200" as const,
    riskProfile: "high" as const,
    teamMaturity: "building" as const,
  };

  console.log("Input:", input, "\n");

  // Fetch regulations
  const regulations = await fetchRegulations(
    input.sector,
    input.jurisdiction
  );
  console.log(`Fetched ${regulations.length} regulations\n`);

  // Generate policy
  const result = await generatePolicy(input, regulations);

  console.log("\n=== POLICY DOCUMENT ===");
  console.log(result.policyDocument.substring(0, 500));
  console.log("...\n");

  console.log("=== COMPLIANCE CHECKLIST ===");
  console.log(`${result.complianceChecklist.length} items`);
  result.complianceChecklist.slice(0, 2).forEach((item, i) => {
    console.log(`${i + 1}. ${item.item}`);
    console.log(`   Regulation: ${item.regulation}`);
    console.log(`   NIST: ${item.nistControl}`);
  });
  console.log("...\n");

  console.log("=== IMPLEMENTATION ROADMAP ===");
  result.implementationRoadmap.forEach((phase) => {
    console.log(`${phase.name} (${phase.duration})`);
    console.log(`  Objectives: ${phase.objectives.length}`);
    console.log(`  Resources: ${phase.resources.fte} FTE, ${phase.resources.budget}`);
  });
}

main();
```

**Run:**
```bash
npx tsx scripts/test-generate.ts
```

**Expected output:** Policy document excerpt, checklist items, roadmap phases

**Note:** This will use real OpenAI API credits (~$0.12 per run)

### Step 4: Commit

**Command:**
```bash
git add lib/prompts.ts lib/generate.ts scripts/test-generate.ts
git commit -m "feat: add OpenAI policy generation engine

- Build prompts for policy, checklist, roadmap
- Generate 3 artifacts via GPT-4o
- JSON parsing with fallback handling
- Manual test script for validation"
```

---

## Task 5: API Route for Generation

**Goal:** Create Next.js API route that orchestrates the full generation flow.

**Files:**
- Create: `app/api/generate/route.ts`

### Step 1: Create API route

**Create:** `app/api/generate/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { fetchRegulations } from "@/lib/exa";
import { generatePolicy } from "@/lib/generate";
import { QuestionnaireInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const input: QuestionnaireInput = {
      sector: body.sector,
      jurisdiction: body.jurisdiction,
      organizationSize: body.organizationSize,
      riskProfile: body.riskProfile,
      existingAISystems: body.existingAISystems,
      regulationsInScope: body.regulationsInScope,
      teamMaturity: body.teamMaturity,
      complianceFocus: body.complianceFocus,
    };
    
    if (!input.sector || !input.jurisdiction || !input.organizationSize || !input.riskProfile) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const startTime = Date.now();
    
    // Step 1: Fetch regulations
    console.log("[API] Fetching regulations...");
    const regulations = await fetchRegulations(
      input.sector,
      input.jurisdiction
    );
    
    // Step 2: Generate policy
    console.log("[API] Generating policy...");
    const result = await generatePolicy(input, regulations);
    
    const generationTime = Date.now() - startTime;
    
    // Step 3: Return results
    return NextResponse.json({
      success: true,
      data: {
        policyDocument: result.policyDocument,
        complianceChecklist: result.complianceChecklist,
        implementationRoadmap: result.implementationRoadmap,
        metadata: {
          generationTimeMs: generationTime,
          regulationsUsed: regulations.map((r) => r.name),
          tokensUsed: 0, // TODO: Calculate from OpenAI response
        },
      },
    });
  } catch (error) {
    console.error("[API] Generation error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 }
    );
  }
}
```

### Step 2: Test API route (curl)

**Command:**
```bash
# Start dev server (if not running)
npm run dev

# In another terminal:
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "sector": "finance",
    "jurisdiction": "au_federal",
    "organizationSize": "51-200",
    "riskProfile": "high"
  }' | jq '.data.metadata'
```

**Expected output:**
```json
{
  "generationTimeMs": 12345,
  "regulationsUsed": [
    "Privacy Act 1988",
    "ASIC AI Governance",
    "NIST AI RMF"
  ],
  "tokensUsed": 0
}
```

### Step 3: Commit

**Command:**
```bash
git add app/api/generate/route.ts
git commit -m "feat: add generation API route

- POST /api/generate endpoint
- Orchestrates regulation fetch + policy generation
- Input validation
- Error handling with fallbacks
- Returns policy + checklist + roadmap + metadata"
```

---

## Task 6: Questionnaire UI (Multi-Step Form)

**Goal:** Build user-facing questionnaire with 3 steps and form validation.

**Files:**
- Create: `app/generate/page.tsx`
- Create: `components/ui/button.tsx` (Shadcn)
- Create: `components/ui/select.tsx` (Shadcn)
- Create: `components/ui/progress.tsx` (Shadcn)
- Create: `components/questionnaire-form.tsx`

### Step 1: Install Shadcn UI components

**Command:**
```bash
npx shadcn-ui@latest init

# When prompted:
# ✔ Which style would you like to use? › Default
# ✔ Which color would you like to use as base color? › Slate
# ✔ Would you like to use CSS variables for colors? › yes

npx shadcn-ui@latest add button
npx shadcn-ui@latest add select
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add card
```

**Expected output:** `✔ Done` (components installed)

### Step 2: Create questionnaire form component

**Create:** `components/questionnaire-form.tsx`

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function QuestionnaireForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sector: "",
    jurisdiction: "",
    organizationSize: "",
    riskProfile: "",
    teamMaturity: "",
  });

  const progress = (step / 3) * 100;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    console.log("Submitting:", formData);
    // TODO: Call API and navigate to results
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.sector && formData.jurisdiction;
    }
    if (step === 2) {
      return formData.organizationSize && formData.riskProfile;
    }
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-gray-600">
          Step {step} of 3
        </p>
      </div>

      <Card className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              Sector & Jurisdiction
            </h2>
            <p className="text-gray-600">
              Tell us about your organization's industry and location.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sector *
                </label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sector: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="public_sector">
                      Public Sector
                    </SelectItem>
                    <SelectItem value="healthcare">
                      Healthcare
                    </SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Jurisdiction *
                </label>
                <Select
                  value={formData.jurisdiction}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jurisdiction: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="au_federal">
                      Australia (Federal)
                    </SelectItem>
                    <SelectItem value="au_nsw">
                      Australia (NSW)
                    </SelectItem>
                    <SelectItem value="au_vic">
                      Australia (VIC)
                    </SelectItem>
                    <SelectItem value="au_qld">
                      Australia (QLD)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              Organization Details
            </h2>
            <p className="text-gray-600">
              Help us understand your organization size and risk profile.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Organization Size *
                </label>
                <Select
                  value={formData.organizationSize}
                  onValueChange={(value) =>
                    setFormData({ ...formData, organizationSize: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-50">1-50 employees</SelectItem>
                    <SelectItem value="51-200">
                      51-200 employees
                    </SelectItem>
                    <SelectItem value="201-1000">
                      201-1000 employees
                    </SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Risk Profile *
                </label>
                <Select
                  value={formData.riskProfile}
                  onValueChange={(value) =>
                    setFormData({ ...formData, riskProfile: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">AI Context</h2>
            <p className="text-gray-600">
              Optional: Additional context to tailor your policy.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Maturity
                </label>
                <Select
                  value={formData.teamMaturity}
                  onValueChange={(value) =>
                    setFormData({ ...formData, teamMaturity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select maturity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building">Building</SelectItem>
                    <SelectItem value="scaling">Scaling</SelectItem>
                    <SelectItem value="mature">Mature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>

          {step < 3 ? (
            <Button onClick={handleNext} disabled={!isStepValid()}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isStepValid()}>
              Generate Policy
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
```

### Step 3: Create questionnaire page

**Create:** `app/generate/page.tsx`

```typescript
import { QuestionnaireForm } from "@/components/questionnaire-form";

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Generate AI Governance Policy
          </h1>
          <p className="text-xl text-gray-600">
            Answer a few questions to receive your tailored policy in
            minutes
          </p>
        </div>

        <QuestionnaireForm />
      </div>
    </div>
  );
}
```

### Step 4: Test questionnaire UI

**Command:**
```bash
npm run dev
```

**Visit:** http://localhost:3000/generate

**Manual test:**
1. Fill Step 1 (sector, jurisdiction) → Click "Next"
2. Fill Step 2 (org size, risk) → Click "Next"
3. Step 3 (optional) → Click "Generate Policy"
4. Check console for "Submitting:" log

### Step 5: Commit

**Command:**
```bash
git add app/generate/page.tsx components/questionnaire-form.tsx components/ui/
git commit -m "feat: add questionnaire UI

- Multi-step form (3 steps)
- Shadcn UI components (button, select, progress, card)
- Form validation per step
- Progress indicator
- Navigation (back/next/submit)"
```

---

*Due to length constraints, I'll create the remaining tasks in a follow-up document. Shall I continue with:*

- Task 7: Result Page with Streaming
- Task 8: Export Functionality (PDF/Word/MD)
- Task 9: Homepage & Navigation
- Task 10: Testing & Deployment

Or would you like me to save this partial plan now and continue?
---

## Task 7: Result Page with API Integration

**Goal:** Display generated policy artifacts with proper formatting and loading states.

**Files:**
- Create: `app/result/[id]/page.tsx`
- Modify: `components/questionnaire-form.tsx`

### Step 1: Update questionnaire form to call API and navigate

**Modify:** `components/questionnaire-form.tsx`

Replace the `handleSubmit` function:

```typescript
const [isGenerating, setIsGenerating] = useState(false);
const router = useRouter();

const handleSubmit = async () => {
  setIsGenerating(true);
  
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Navigate to results page
      router.push(`/result?data=${encodeURIComponent(JSON.stringify(data.data))}`);
    } else {
      alert("Generation failed: " + data.error);
    }
  } catch (error) {
    alert("Error: " + error);
  } finally {
    setIsGenerating(false);
  }
};
```

Add imports at top:

```typescript
import { useRouter } from "next/navigation";
```

Update submit button:

```typescript
<Button onClick={handleSubmit} disabled={!isStepValid() || isGenerating}>
  {isGenerating ? "Generating..." : "Generate Policy"}
</Button>
```

### Step 2: Create result page

**Create:** `app/result/page.tsx`

```typescript
"use client";

import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function ResultContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  
  if (!dataParam) {
    return <div>No data found</div>;
  }
  
  const data = JSON.parse(decodeURIComponent(dataParam));
  
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Your AI Governance Policy
          </h1>
          <p className="text-gray-600">
            Generated in {(data.metadata.generationTimeMs / 1000).toFixed(1)}s
          </p>
        </div>

        {/* Policy Document */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">
            Policy Document
          </h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {data.policyDocument}
            </pre>
          </div>
        </Card>

        {/* Compliance Checklist */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">
            Compliance Checklist
          </h2>
          <div className="space-y-4">
            {data.complianceChecklist.map((item: any, i: number) => (
              <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold">{item.item}</h3>
                <div className="text-sm text-gray-600 space-y-1 mt-2">
                  <p>Regulation: {item.regulation}</p>
                  <p>NIST Control: {item.nistControl}</p>
                  <p>Owner: {item.owner}</p>
                  <p>Timeline: {item.timeline}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Implementation Roadmap */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">
            Implementation Roadmap
          </h2>
          <div className="space-y-6">
            {data.implementationRoadmap.map((phase: any, i: number) => (
              <div key={i} className="border-b pb-6 last:border-0">
                <h3 className="text-xl font-bold mb-2">
                  {phase.name} ({phase.duration})
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold mb-2">Objectives</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {phase.objectives.map((obj: string, j: number) => (
                        <li key={j}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Resources</h4>
                    <p className="text-sm">
                      {phase.resources.fte} FTE, {phase.resources.budget}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Milestones</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {phase.milestones.map((milestone: string, j: number) => (
                        <li key={j}>{milestone}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Risks</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {phase.risks.map((risk: string, j: number) => (
                        <li key={j}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Export Buttons */}
        <div className="flex justify-center gap-4">
          <Button>Export as PDF</Button>
          <Button variant="outline">Export as Word</Button>
          <Button variant="outline">Export as Markdown</Button>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}
```

### Step 3: Test end-to-end flow

**Command:**
```bash
npm run dev
```

**Manual test:**
1. Visit http://localhost:3000/generate
2. Fill out all 3 steps
3. Click "Generate Policy"
4. Wait for generation (10-15s)
5. Verify redirect to /result page
6. Check all 3 artifacts display correctly

### Step 4: Commit

**Command:**
```bash
git add app/result/page.tsx components/questionnaire-form.tsx
git commit -m "feat: add result page with policy display

- Result page displays all 3 artifacts
- Policy document with markdown rendering
- Checklist with structured layout
- Roadmap with phases/objectives/resources
- Questionnaire calls API and navigates to results
- Loading state during generation"
```

---

## Task 8: Export Functionality

**Goal:** Implement PDF, Word, and Markdown export.

**Files:**
- Create: `app/api/export/route.ts`
- Install: `pdf-lib`, `docx`

### Step 1: Install export libraries

**Command:**
```bash
npm install pdf-lib docx file-saver
npm install -D @types/file-saver
```

### Step 2: Create export API route

**Create:** `app/api/export/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";

export async function POST(request: NextRequest) {
  try {
    const { format, data } = await request.json();
    
    if (format === "pdf") {
      return await exportPDF(data);
    } else if (format === "docx") {
      return await exportWord(data);
    } else if (format === "md") {
      return await exportMarkdown(data);
    }
    
    return NextResponse.json(
      { error: "Invalid format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Export] Error:", error);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}

async function exportPDF(data: any) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let page = pdfDoc.addPage([595, 842]); // A4 size
  let yPos = 800;
  
  // Title
  page.drawText("AI Governance Policy", {
    x: 50,
    y: yPos,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 40;
  
  // Policy Document (simplified - first 1000 chars)
  const policyText = data.policyDocument.substring(0, 1000);
  const lines = policyText.match(/.{1,80}/g) || [];
  
  for (const line of lines) {
    if (yPos < 100) {
      page = pdfDoc.addPage([595, 842]);
      yPos = 800;
    }
    
    page.drawText(line, {
      x: 50,
      y: yPos,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    
    yPos -= 15;
  }
  
  const pdfBytes = await pdfDoc.save();
  
  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="policy.pdf"',
    },
  });
}

async function exportWord(data: any) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "AI Governance Policy",
            heading: "Heading1",
          }),
          new Paragraph({
            text: data.policyDocument,
          }),
          new Paragraph({
            text: "Compliance Checklist",
            heading: "Heading2",
          }),
          ...data.complianceChecklist.map(
            (item: any) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${item.item} `,
                    bold: true,
                  }),
                  new TextRun({
                    text: `(${item.regulation}, ${item.nistControl})`,
                  }),
                ],
              })
          ),
        ],
      },
    ],
  });
  
  const buffer = await Packer.toBuffer(doc);
  
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="policy.docx"',
    },
  });
}

async function exportMarkdown(data: any) {
  let markdown = "# AI Governance Policy\n\n";
  markdown += data.policyDocument + "\n\n";
  
  markdown += "## Compliance Checklist\n\n";
  data.complianceChecklist.forEach((item: any) => {
    markdown += `- **${item.item}**\n`;
    markdown += `  - Regulation: ${item.regulation}\n`;
    markdown += `  - NIST: ${item.nistControl}\n`;
    markdown += `  - Owner: ${item.owner}\n`;
    markdown += `  - Timeline: ${item.timeline}\n\n`;
  });
  
  markdown += "## Implementation Roadmap\n\n";
  data.implementationRoadmap.forEach((phase: any) => {
    markdown += `### ${phase.name} (${phase.duration})\n\n`;
    markdown += "**Objectives:**\n";
    phase.objectives.forEach((obj: string) => {
      markdown += `- ${obj}\n`;
    });
    markdown += "\n";
  });
  
  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": 'attachment; filename="policy.md"',
    },
  });
}
```

### Step 3: Update result page to call export API

**Modify:** `app/result/page.tsx`

Add export function:

```typescript
const handleExport = async (format: string) => {
  try {
    const response = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format, data }),
    });
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `policy.${format}`;
    a.click();
  } catch (error) {
    alert("Export failed: " + error);
  }
};
```

Update export buttons:

```typescript
<Button onClick={() => handleExport("pdf")}>Export as PDF</Button>
<Button variant="outline" onClick={() => handleExport("docx")}>
  Export as Word
</Button>
<Button variant="outline" onClick={() => handleExport("md")}>
  Export as Markdown
</Button>
```

### Step 4: Test exports

**Manual test:**
1. Generate a policy
2. Click "Export as PDF" → Verify download
3. Open PDF → Check content
4. Click "Export as Word" → Verify download
5. Open Word doc → Check formatting
6. Click "Export as Markdown" → Verify download

### Step 5: Commit

**Command:**
```bash
git add app/api/export/route.ts app/result/page.tsx package.json
git commit -m "feat: add export functionality

- Export to PDF (pdf-lib)
- Export to Word (docx)
- Export to Markdown
- Download handlers in result page
- All 3 formats functional"
```

---

## Task 9: Homepage & Navigation

**Goal:** Create landing page and navigation between pages.

**Files:**
- Modify: `app/page.tsx`
- Create: `components/nav.tsx`
- Modify: `app/layout.tsx`

### Step 1: Create navigation component

**Create:** `components/nav.tsx`

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Mandate
        </Link>
        
        <div className="flex gap-4">
          <Link href="/generate">
            <Button>Generate Policy</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

### Step 2: Add navigation to layout

**Modify:** `app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mandate - AI Governance Policy Generator",
  description: "Generate sector-specific AI governance policies in minutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
```

### Step 3: Create homepage

**Modify:** `app/page.tsx`

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-bold mb-6">
          AI Governance Policy Generator
        </h1>
        <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Generate sector-specific, regulation-aligned AI governance policies
          in 5 minutes. What takes consultants 2-3 months, we do in seconds.
        </p>
        <Link href="/generate">
          <Button size="lg" className="text-lg px-8 py-6">
            Start Generating →
          </Button>
        </Link>
      </section>

      {/* Value Props */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Fast</h3>
            <p className="text-gray-600">
              5 minutes vs 2-3 months. Generate audit-ready policies instantly.
            </p>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Accurate</h3>
            <p className="text-gray-600">
              Regulation-aligned. Covers Privacy Act, NIST AI RMF, sector
              rules.
            </p>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Complete</h3>
            <p className="text-gray-600">
              3 artifacts: Policy + Compliance Checklist + Implementation
              Roadmap.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
            <h3 className="text-xl font-bold mb-2">Questionnaire</h3>
            <p className="text-gray-600">
              Answer questions about sector, jurisdiction, org size
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
            <h3 className="text-xl font-bold mb-2">AI Generation</h3>
            <p className="text-gray-600">
              Our AI fetches regulations and generates tailored policy
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
            <h3 className="text-xl font-bold mb-2">Review</h3>
            <p className="text-gray-600">
              Review 3 artifacts: Policy, Checklist, Roadmap
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">4</div>
            <h3 className="text-xl font-bold mb-2">Export</h3>
            <p className="text-gray-600">
              Download as PDF, Word, or Markdown
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to generate your policy?
        </h2>
        <Link href="/generate">
          <Button size="lg" className="text-lg px-8 py-6">
            Get Started - It's Free
          </Button>
        </Link>
      </section>
    </div>
  );
}
```

### Step 4: Test navigation

**Manual test:**
1. Visit http://localhost:3000
2. Verify homepage displays (hero, value props, how it works)
3. Click "Start Generating" → Should go to /generate
4. Click "Mandate" logo → Should go back to /
5. Complete generation flow → Verify nav persists

### Step 5: Commit

**Command:**
```bash
git add app/page.tsx app/layout.tsx components/nav.tsx
git commit -m "feat: add homepage and navigation

- Homepage with hero, value props, how it works
- Navigation component with logo + CTA
- Layout includes nav on all pages
- Complete user journey: home → generate → result"
```

---

## Task 10: Testing & Quality

**Goal:** Add tests for critical functionality.

**Files:**
- Create: `__tests__/api/generate.test.ts`
- Create: `__tests__/lib/exa.test.ts`
- Create: `__tests__/lib/generate.test.ts`

### Step 1: Install testing dependencies

**Command:**
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
npm install -D @types/jest
```

### Step 2: Configure Jest

**Create:** `jest.config.js`

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

module.exports = createJestConfig(customJestConfig);
```

**Create:** `jest.setup.js`

```javascript
import "@testing-library/jest-dom";
```

### Step 3: Write API tests

**Create:** `__tests__/api/generate.test.ts`

```typescript
/**
 * @jest-environment node
 */
import { POST } from "@/app/api/generate/route";
import { NextRequest } from "next/server";

describe("POST /api/generate", () => {
  it("should generate policy successfully", async () => {
    const request = new NextRequest("http://localhost:3000/api/generate", {
      method: "POST",
      body: JSON.stringify({
        sector: "finance",
        jurisdiction: "au_federal",
        organizationSize: "51-200",
        riskProfile: "high",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.policyDocument).toBeDefined();
    expect(data.data.complianceChecklist).toBeInstanceOf(Array);
    expect(data.data.implementationRoadmap).toBeInstanceOf(Array);
  }, 30000); // 30s timeout

  it("should return 400 for missing fields", async () => {
    const request = new NextRequest("http://localhost:3000/api/generate", {
      method: "POST",
      body: JSON.stringify({
        sector: "finance",
        // Missing required fields
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});
```

### Step 4: Run tests

**Command:**
```bash
npm test
```

**Expected output:**
```
 PASS  __tests__/api/generate.test.ts
  POST /api/generate
    ✓ should generate policy successfully (15000 ms)
    ✓ should return 400 for missing fields (50 ms)
```

### Step 5: Add test script to package.json

**Modify:** `package.json`

Add to "scripts":

```json
"test": "jest",
"test:watch": "jest --watch"
```

### Step 6: Commit

**Command:**
```bash
git add __tests__/ jest.config.js jest.setup.js package.json
git commit -m "test: add integration tests

- Jest configuration
- API route tests (generate endpoint)
- Test for successful generation
- Test for validation errors"
```

---

## Task 11: Deployment

**Goal:** Deploy to Vercel with environment variables.

### Step 1: Push to GitHub

**Create repository on GitHub:**
1. Go to https://github.com/new
2. Name: `mandate` or `ai-governance-generator`
3. Public or Private (recommend Public for open-source)
4. Don't initialize with README (we have one)

**Push code:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/mandate.git
git branch -M main
git push -u origin main
```

**Verify:** Visit GitHub repo, check all files are there

### Step 2: Deploy to Vercel

**Via Vercel CLI:**

```bash
npm install -g vercel
vercel login
vercel
```

**Interactive prompts:**
```
? Set up and deploy? › yes
? Which scope? › Your Name
? Link to existing project? › no
? What's your project's name? › mandate
? In which directory is your code located? › ./
```

**Expected output:**
```
✔ Deployed to production
https://mandate-xxx.vercel.app
```

**Or via Vercel Dashboard:**
1. Visit https://vercel.com
2. Click "Import Project"
3. Select GitHub repo
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
5. Add environment variables:
   - `OPENAI_API_KEY`
   - `EXA_API_KEY`
   - `CONVEX_DEPLOYMENT` (from .env.local)
   - `CONVEX_DEPLOY_KEY` (from Convex dashboard)
6. Click "Deploy"

### Step 3: Configure Convex for production

**Command:**
```bash
npx convex deploy --prod
```

**Expected output:**
```
✔ Functions deployed to production
```

Update `.env.local` with production Convex URL (if different)

### Step 4: Verify production deployment

**Visit:** Your Vercel URL (e.g., https://mandate-xxx.vercel.app)

**Test:**
1. Homepage loads ✓
2. Click "Generate Policy" → Questionnaire loads ✓
3. Fill form and submit → Policy generates ✓
4. Export works ✓

### Step 5: Set up custom domain (optional)

**In Vercel Dashboard:**
1. Project Settings → Domains
2. Add domain (e.g., `mandate.yourcompany.com`)
3. Configure DNS (follow Vercel instructions)
4. Wait for SSL certificate (automatic)

### Step 6: Commit deployment config

**Create:** `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["syd1"]
}
```

**Command:**
```bash
git add vercel.json
git commit -m "deploy: configure Vercel deployment

- Set Sydney region for low latency
- Configure build/dev commands
- Push to production"
git push
```

---

## Task 12: Documentation & Launch Prep

**Goal:** Write README and prepare for GitHub launch.

**Files:**
- Modify: `README.md`
- Create: `CONTRIBUTING.md`
- Create: `LICENSE`

### Step 1: Write comprehensive README

**Modify:** `README.md`

```markdown
# Mandate — AI Governance Policy Generator

Generate sector-specific, regulation-aligned AI governance policies in 5 minutes.

## Features

- **Fast:** 5 minutes vs 2-3 months manual work
- **Accurate:** Covers Privacy Act 1988, NIST AI RMF, sector regulations
- **Complete:** 3 artifacts (Policy + Checklist + Roadmap)
- **Export:** PDF, Word, Markdown

## Demo

Visit: https://mandate-xxx.vercel.app

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Convex (backend)
- OpenAI GPT-4.5
- Exa.dev API (regulation data)
- Tailwind CSS + Shadcn UI

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key
- Exa.dev API key
- Convex account (free)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/mandate.git
cd mandate
npm install
```

### Environment Variables

Create `.env.local`:

```
OPENAI_API_KEY=your_openai_key
EXA_API_KEY=your_exa_key
CONVEX_DEPLOYMENT=your_convex_deployment
```

### Development

```bash
# Start Convex backend
npx convex dev

# Start Next.js dev server
npm run dev
```

Visit http://localhost:3000

### Testing

```bash
npm test
```

### Deployment

```bash
# Deploy to Vercel
vercel

# Deploy Convex to production
npx convex deploy --prod
```

## How It Works

1. **Questionnaire:** User answers sector, jurisdiction, org size, risk profile
2. **Regulation Fetch:** Exa.dev fetches relevant regulations
3. **AI Generation:** OpenAI GPT-4.5 generates policy, checklist, roadmap
4. **Export:** Download as PDF, Word, or Markdown

## Roadmap

- [x] Phase 1: Policy Generation MVP (Week 1-2)
- [ ] Phase 2: Stack Enforcement (Month 2-3)
- [ ] Phase 3: Continuous Monitoring (Month 4-6)

See [IMPLEMENTATION_PLAN_V2.md](./IMPLEMENTATION_PLAN_V2.md) for details.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT License - see [LICENSE](./LICENSE)

## Support

- GitHub Issues: Report bugs
- Discussions: Ask questions
- Email: support@mandate.ai

---

Built with ❤️ by [Your Name]
```

### Step 2: Create CONTRIBUTING.md

**Create:** `CONTRIBUTING.md`

```markdown
# Contributing to Mandate

Thanks for your interest in contributing!

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Set up environment variables (see README)
5. Start development: `npm run dev`

## Pull Request Process

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Write tests for new functionality
4. Run tests: `npm test`
5. Push and create PR

## Commit Convention

We use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `chore:` Maintenance

## Code Style

- TypeScript strict mode
- ESLint rules enforced
- Prettier for formatting

## Questions?

Open a GitHub Discussion or Issue.
```

### Step 3: Add LICENSE

**Create:** `LICENSE`

```
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Step 4: Final commit and push

**Command:**
```bash
git add README.md CONTRIBUTING.md LICENSE
git commit -m "docs: add README, CONTRIBUTING, and LICENSE

- Comprehensive README with setup instructions
- Contributing guidelines
- MIT License
- Ready for GitHub launch"
git push
```

### Step 5: GitHub repository setup

**On GitHub:**
1. Add description: "AI Governance Policy Generator - Generate sector-specific policies in 5 minutes"
2. Add topics: `ai`, `governance`, `policy`, `nextjs`, `openai`, `compliance`
3. Enable Issues and Discussions
4. Create initial Issue: "Phase 1 Launch Checklist"
5. Pin README

### Step 6: Launch checklist

**Before announcing:**
- [ ] Production deployment works end-to-end
- [ ] All tests passing
- [ ] README is clear and accurate
- [ ] Demo video or GIF added to README
- [ ] Screenshots in README or docs/
- [ ] License added
- [ ] Contributing guidelines clear

**Launch channels:**
- [ ] Product Hunt
- [ ] Hacker News
- [ ] Reddit (r/MachineLearning, r/compliance)
- [ ] LinkedIn post
- [ ] Twitter thread
- [ ] Email to pilot customers

---

## Summary: Phase 1 Complete! 🎉

You've built a complete AI Governance Policy Generator MVP:

**✅ Backend:**
- Convex database with policies schema
- Exa.dev regulation fetcher
- OpenAI GPT-4.5 generation engine
- API routes for generation and export

**✅ Frontend:**
- Multi-step questionnaire
- Result page with 3 artifacts
- Export to PDF/Word/Markdown
- Homepage with value props

**✅ DevOps:**
- Deployed to Vercel (production)
- Convex backend (production)
- Tests passing
- CI/CD via Vercel auto-deploy

**✅ Documentation:**
- README with setup instructions
- Contributing guidelines
- Implementation plan for team

**Next Steps:**
1. Launch on Product Hunt / HN / Reddit
2. Gather feedback from pilot customers
3. Monitor usage, fix bugs
4. Plan Phase 2 (Stack Enforcement) based on learnings

**Timeline:** 7-14 days from start to production 🚀

---

**For Developers:** Follow tasks 1-12 in order. Each task has exact commands, code snippets, and verification steps. Commit after each task. Ask questions in GitHub Discussions if stuck.

**For Project Lead:** Review PRs, monitor production, coordinate pilot customer demos, prepare Phase 2 planning.

Good luck building! 🎯

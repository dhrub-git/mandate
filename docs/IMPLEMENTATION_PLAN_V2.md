# AI Governance Lifecycle Platform — Implementation Plan

**Version:** 2.0  
**Date:** 2026-02-01  
**Status:** Ready for Execution  
**Owner:** Dhrub Biswas  
**Timeline:** Week 1 → Month 12 (3 phases)

---

## 1. Overview

This document provides a week-by-week implementation roadmap for building the **AI Governance Lifecycle Platform** across three phases:

- **Phase 1 (Week 1-2):** Policy Generation MVP
- **Phase 2 (Month 2-3):** Stack Enforcement Engine
- **Phase 3 (Month 4-6):** Continuous Monitoring System

**Team Assumptions:**
- 1-2 full-time engineers (can scale with junior team members)
- Access to OpenAI API, Exa.dev API, scrape.do
- Familiarity with Next.js, Convex, TypeScript

**Development Approach:**
- TDD where applicable (critical business logic)
- Incremental delivery (ship working features weekly)
- Continuous deployment (Vercel auto-deploy from main)
- Weekly demos/reviews

---

## 2. Phase 1: Policy Generation MVP (Week 1-2)

**Goal:** Ship open-source policy generator that works end-to-end

**Success Criteria:**
- User completes questionnaire → receives 3 artifacts
- Export to PDF/Word/Markdown works
- <15s generation time (p95)
- Deploy to Vercel (public URL)
- Push to GitHub (public repo)

---

### **Week 1: Foundation + Core Generation**

#### **Day 1: Project Setup**

**Morning (4 hours):**
- [ ] Initialize Next.js 15 project with App Router
- [ ] Install dependencies:
  ```bash
  npx create-next-app@latest mandate --typescript --tailwind --app
  cd mandate
  npm install convex @ai-sdk/openai ai zod
  npm install @radix-ui/react-* (shadcn components)
  ```
- [ ] Set up Convex:
  ```bash
  npx convex dev
  ```
- [ ] Configure environment variables:
  ```
  OPENAI_API_KEY=
  EXA_API_KEY=
  CONVEX_DEPLOYMENT=
  ```
- [ ] Create basic folder structure:
  ```
  app/
    ├── page.tsx (homepage)
    ├── generate/
    │   └── page.tsx (questionnaire)
    ├── api/
    │   └── generate/
    │       └── route.ts (generation endpoint)
  convex/
    ├── schema.ts
    └── policies.ts (mutations/queries)
  ```

**Afternoon (4 hours):**
- [ ] Design Convex schema (policies collection)
- [ ] Create homepage UI (hero, value props, CTA)
- [ ] Set up shadcn UI components (Button, Card, Form)
- [ ] Commit: "chore: initial project setup"

---

#### **Day 2-3: Questionnaire + Form Logic**

**Day 2 (8 hours):**
- [ ] Build multi-step questionnaire component
  - Step 1: Sector + Jurisdiction (dropdowns)
  - Step 2: Organization details (size, risk, maturity)
  - Step 3: AI context (existing systems, focus areas)
- [ ] Implement form validation (Zod schemas)
- [ ] Add progress indicator (step 1/3, 2/3, 3/3)
- [ ] Local state management (useState or useReducer)
- [ ] Test: Fill form → see values in console
- [ ] Commit: "feat: questionnaire UI with 3 steps"

**Day 3 (8 hours):**
- [ ] Build Exa.dev integration utility:
  ```typescript
  // lib/exa.ts
  export async function fetchRegulations(sector: string, jurisdiction: string) {
    const exa = new Exa(process.env.EXA_API_KEY);
    const queries = buildQueries(sector, jurisdiction);
    const results = await Promise.all(queries.map(q => exa.searchAndContents(q)));
    return parseRegulations(results);
  }
  ```
- [ ] Test Exa.dev integration (console.log results)
- [ ] Create prompt templates for 3 artifacts:
  - Policy prompt template
  - Checklist prompt template
  - Roadmap prompt template
- [ ] Commit: "feat: Exa.dev regulation fetching + prompt templates"

---

#### **Day 4-5: Generation Engine**

**Day 4 (8 hours):**
- [ ] Build API route `/api/generate`:
  ```typescript
  // app/api/generate/route.ts
  export async function POST(req: Request) {
    const input = await req.json();
    
    // 1. Fetch regulations
    const regulations = await fetchRegulations(input.sector, input.jurisdiction);
    
    // 2. Build prompts
    const prompts = buildPrompts(input, regulations);
    
    // 3. Stream generation
    const stream = await streamPolicy(prompts);
    
    return new Response(stream);
  }
  ```
- [ ] Implement streaming with Vercel AI SDK:
  ```typescript
  import { streamText } from 'ai';
  import { openai } from '@ai-sdk/openai';
  
  async function streamPolicy(prompts) {
    const result = await streamText({
      model: openai('gpt-4o'),
      system: prompts.policyPrompt,
      temperature: 0.7,
    });
    
    return result.toAIStreamResponse();
  }
  ```
- [ ] Test: curl API endpoint → see streamed response
- [ ] Commit: "feat: generation API with GPT-4o streaming"

**Day 5 (8 hours):**
- [ ] Build frontend streaming UI:
  ```typescript
  // app/generate/page.tsx
  const { messages, setInput, handleSubmit } = useChat({
    api: '/api/generate',
  });
  
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
    </div>
  );
  ```
- [ ] Add loading states (spinner, progress messages)
- [ ] Display 3 artifacts as they stream in
- [ ] Store generated policy in Convex:
  ```typescript
  const policyId = await ctx.db.insert("policies", {
    sector: input.sector,
    policyDocument: result.policy,
    complianceChecklist: result.checklist,
    implementationRoadmap: result.roadmap,
    generatedAt: Date.now(),
  });
  ```
- [ ] Test: Complete questionnaire → see artifacts streaming
- [ ] Commit: "feat: streaming UI + Convex storage"

---

#### **Day 6-7: Export + Polish**

**Day 6 (8 hours):**
- [ ] Build export functionality:
  ```typescript
  // app/api/export/route.ts
  export async function GET(req: Request) {
    const { policyId, format } = parseQuery(req.url);
    const policy = await getPolicy(policyId);
    
    if (format === 'pdf') {
      return generatePDF(policy);
    } else if (format === 'docx') {
      return generateDOCX(policy);
    } else {
      return new Response(policy.policyDocument, {
        headers: { 'Content-Type': 'text/markdown' }
      });
    }
  }
  ```
- [ ] Implement PDF generation (use `pdf-lib` or headless browser)
- [ ] Implement Word export (use `docx` library)
- [ ] Add export buttons to results page
- [ ] Test: Export all 3 formats
- [ ] Commit: "feat: export to PDF/Word/Markdown"

**Day 7 (8 hours):**
- [ ] Polish UI/UX:
  - Responsive design (mobile, tablet, desktop)
  - Error handling (API failures, Exa.dev timeouts)
  - Empty states, loading skeletons
  - Copy-to-clipboard buttons
- [ ] Add analytics (Vercel Analytics)
- [ ] Write README.md:
  - Project description
  - Setup instructions
  - Environment variables
  - Deployment guide
- [ ] Commit: "polish: UI improvements + README"

---

### **Week 2: Testing + Launch**

#### **Day 8-9: Testing**

**Day 8 (8 hours):**
- [ ] Write integration tests:
  ```typescript
  // __tests__/generate.test.ts
  test('generates policy for finance sector', async () => {
    const input = {
      sector: 'finance',
      jurisdiction: 'au_federal',
      organization_size: '51-200',
      risk_profile: 'high',
    };
    
    const response = await POST('/api/generate', { body: input });
    expect(response.status).toBe(200);
    
    const policy = await response.json();
    expect(policy.policyDocument).toContain('Privacy Act');
  });
  ```
- [ ] Test questionnaire flow (Playwright E2E)
- [ ] Test streaming (verify chunks arrive)
- [ ] Test export (download files, verify content)
- [ ] Fix bugs found during testing
- [ ] Commit: "test: integration + E2E tests"

**Day 9 (8 hours):**
- [ ] Performance testing:
  - Measure generation time (aim <15s p95)
  - Optimize Exa.dev queries (parallel fetching)
  - Cache regulation data (Convex)
- [ ] Security review:
  - API rate limiting
  - Input validation (prevent prompt injection)
  - CORS configuration
- [ ] Accessibility audit (a11y)
- [ ] Commit: "perf: optimize generation time + security"

---

#### **Day 10-12: Deployment + Launch**

**Day 10 (4 hours):**
- [ ] Deploy to Vercel:
  ```bash
  vercel --prod
  ```
- [ ] Configure custom domain (if available)
- [ ] Set up environment variables in Vercel dashboard
- [ ] Verify production deployment works
- [ ] Smoke test: Generate policy on production

**Day 10 (4 hours):**
- [ ] Prepare GitHub repo:
  - Clean up commit history
  - Write CONTRIBUTING.md
  - Add LICENSE (MIT or Apache 2.0)
  - Create GitHub Issues templates
- [ ] Push to GitHub:
  ```bash
  git remote add origin https://github.com/dhrub-git/ai-governance-platform.git
  git push -u origin main
  ```
- [ ] Make repo public

**Day 11 (8 hours):**
- [ ] Create launch materials:
  - Product Hunt submission
  - Hacker News post
  - Reddit (r/MachineLearning, r/LegalAdvice, r/compliance)
  - LinkedIn announcement
  - Twitter thread
- [ ] Prepare demo video (2-3 minutes)
- [ ] Set up GitHub Discussions for community
- [ ] Launch on Product Hunt

**Day 12 (8 hours):**
- [ ] Monitor launch:
  - Respond to comments
  - Fix critical bugs
  - Track GitHub stars
  - Gather feedback
- [ ] Document learnings in `docs/LAUNCH_RETROSPECTIVE.md`
- [ ] Plan pilot customer outreach (3-5 targets)
- [ ] Celebrate 🎉

---

## 3. Phase 2: Stack Enforcement Engine (Month 2-3)

**Goal:** Map AI infrastructure against policy, show compliance gaps

**Success Criteria:**
- User can inventory 50+ tools across 5 layers
- Compliance dashboard shows R/Y/G status
- Gap analysis export works (PDF/CSV)
- 20+ paying SaaS customers

---

### **Week 3-4: Data Model + Inventory UI**

#### **Week 3: Convex Schema + Basic UI**

**Day 1-2 (16 hours):**
- [ ] Extend Convex schema:
  ```typescript
  // convex/schema.ts
  tools: defineTable({
    organizationId: v.string(),
    layer: v.number(), // 1-5
    name: v.string(),
    vendor: v.string(),
    useCase: v.optional(v.string()),
    riskLevel: v.optional(v.string()),
    // ... other fields
  }),
  
  requirements: defineTable({
    policyId: v.id("policies"),
    text: v.string(),
    section: v.string(),
    criticality: v.string(),
    layers: v.array(v.number()),
  }),
  
  assessments: defineTable({
    toolId: v.id("tools"),
    requirementId: v.id("requirements"),
    status: v.string(), // compliant/warning/violation
    reasoning: v.string(),
    remediation: v.string(),
    assessedAt: v.number(),
  }),
  ```
- [ ] Run migration: `npx convex dev`
- [ ] Commit: "feat: Phase 2 data model"

**Day 3-4 (16 hours):**
- [ ] Create `/enforce` route
- [ ] Build stack inventory table component:
  - Columns: Layer, Tool, Vendor, Risk, Status
  - Sortable, filterable
  - Add/Edit/Delete actions
- [ ] Build "Add Tool" modal:
  - Form with required + optional fields
  - Validation (Zod)
  - Submit → Save to Convex
- [ ] Test: Add 10 sample tools
- [ ] Commit: "feat: stack inventory UI"

**Day 5 (8 hours):**
- [ ] Build CSV bulk import:
  ```typescript
  // app/api/stack/import/route.ts
  export async function POST(req: Request) {
    const csv = await req.text();
    const tools = parseCSV(csv);
    
    for (const tool of tools) {
      await ctx.db.insert("tools", tool);
    }
    
    return { imported: tools.length };
  }
  ```
- [ ] Create CSV template download
- [ ] Test: Import 50 tools via CSV
- [ ] Commit: "feat: CSV bulk import"

---

#### **Week 4: Requirement Parser + Tool Matcher**

**Day 1-2 (16 hours):**
- [ ] Build requirement parser:
  ```typescript
  // lib/parseRequirements.ts
  export async function parseRequirements(policyDocument: string) {
    const prompt = `
      Extract compliance requirements from this policy.
      Output JSON: [{ text, section, criticality, layers }]
    `;
    
    const result = await generateText({
      model: openai('gpt-4o'),
      prompt: `${prompt}\n\n${policyDocument}`,
      temperature: 0.3,
    });
    
    return JSON.parse(result.text);
  }
  ```
- [ ] Parse all existing policies → store requirements
- [ ] Test: Verify requirements extracted correctly
- [ ] Commit: "feat: requirement parser"

**Day 3-4 (16 hours):**
- [ ] Build vendor compliance fetcher:
  ```typescript
  // lib/fetchVendorCompliance.ts
  export async function fetchVendorCompliance(vendor: string, tool: string) {
    const queries = [
      `${vendor} ${tool} data residency`,
      `${vendor} ${tool} terms of service`,
      `${vendor} ${tool} security compliance`,
    ];
    
    const results = await Promise.all(
      queries.map(q => exa.searchAndContents(q))
    );
    
    return {
      vendor,
      tool,
      dataResidency: extractDataResidency(results),
      termsOfService: extractToS(results),
      sources: results.map(r => r.url),
    };
  }
  ```
- [ ] Add caching (Convex `vendorCompliance` table)
- [ ] Test: Fetch OpenAI, Anthropic, AWS compliance data
- [ ] Commit: "feat: vendor compliance fetcher (Exa.dev)"

**Day 5 (8 hours):**
- [ ] Build tool assessment engine:
  ```typescript
  // lib/assessTool.ts
  export async function assessTool(tool: Tool, requirements: Requirement[]) {
    const vendorData = await fetchVendorCompliance(tool.vendor, tool.name);
    const applicable = requirements.filter(r => r.layers.includes(tool.layer));
    
    const assessments = await Promise.all(
      applicable.map(req => checkCompliance(tool, req, vendorData))
    );
    
    return assessments;
  }
  
  async function checkCompliance(tool, req, vendorData) {
    const prompt = `
      Tool: ${tool.name}
      Requirement: ${req.text}
      Vendor data: ${JSON.stringify(vendorData)}
      
      Does tool meet requirement?
      Output JSON: { status, reasoning, remediation }
    `;
    
    const result = await generateText({ model: openai('gpt-4o'), prompt });
    return JSON.parse(result.text);
  }
  ```
- [ ] Test: Assess 5 tools against policy
- [ ] Commit: "feat: tool assessment engine"

---

### **Week 5-6: Compliance Dashboard + Gap Analysis**

#### **Week 5: Dashboard UI**

**Day 1-2 (16 hours):**
- [ ] Create `/enforce/dashboard` route
- [ ] Build overview widgets:
  - Overall compliance score (donut chart)
  - Breakdown by layer (bar chart)
  - Critical gaps alert card
- [ ] Use Recharts for visualizations
- [ ] Fetch assessment data from Convex
- [ ] Test: Render dashboard with sample data
- [ ] Commit: "feat: compliance dashboard overview"

**Day 3-4 (16 hours):**
- [ ] Build drill-down view (per tool):
  - Tool card with status badges
  - Violation details (requirement, reasoning, remediation)
  - Warning details
  - Compliant requirements
- [ ] Add filtering (by layer, status, criticality)
- [ ] Add search (tool name, vendor)
- [ ] Test: Navigate from overview → drill-down
- [ ] Commit: "feat: drill-down compliance view"

**Day 5 (8 hours):**
- [ ] Build gap analysis export:
  ```typescript
  // app/api/stack/export/route.ts
  export async function GET(req: Request) {
    const assessments = await getAllAssessments();
    const report = buildAuditReport(assessments);
    
    if (format === 'pdf') {
      return generatePDF(report);
    } else if (format === 'csv') {
      return generateCSV(report);
    }
  }
  ```
- [ ] Test: Export PDF, CSV, JSON
- [ ] Commit: "feat: gap analysis export"

---

#### **Week 6: Testing + SaaS Launch**

**Day 1-2 (16 hours):**
- [ ] Write integration tests (stack inventory → assessment → dashboard)
- [ ] E2E tests (Playwright):
  - Add tool → trigger assessment → view dashboard
  - Export report
- [ ] Performance testing (50 tools assessment <30s)
- [ ] Fix bugs
- [ ] Commit: "test: Phase 2 integration tests"

**Day 3-4 (16 hours):**
- [ ] Integrate Stripe billing:
  ```bash
  npm install @stripe/stripe-js stripe
  ```
- [ ] Create pricing tiers:
  - Starter: $99/mo (10 tools)
  - Professional: $299/mo (50 tools)
  - Enterprise: $499/mo (unlimited)
- [ ] Build subscription flow (checkout → webhook → Convex)
- [ ] Add usage limits (check tool count before allowing add)
- [ ] Test: Subscribe → add tools → hit limit
- [ ] Commit: "feat: Stripe billing + subscriptions"

**Day 5 (8 hours):**
- [ ] Deploy Phase 2 to production
- [ ] Soft launch to Phase 1 pilot customers (email invite)
- [ ] Offer early adopter pricing ($49/mo for first 3 months)
- [ ] Monitor feedback, usage, errors
- [ ] Commit: "deploy: Phase 2 SaaS launch"

---

### **Week 7-8: Customer Onboarding + Iteration**

**Week 7-8 (10 days):**
- [ ] Customer onboarding:
  - Schedule 1:1 demos with pilot customers
  - Help import their AI stack (CSV or manual)
  - Walk through compliance dashboard
  - Gather feedback on accuracy, UX, missing features
- [ ] Fix bugs reported by customers
- [ ] Improve remediation suggestions (add more detail)
- [ ] Add requested features:
  - Multi-user organizations (invite team members)
  - Custom requirement editing
  - Assessment history (track changes over time)
- [ ] Marketing:
  - Case study (with customer permission)
  - LinkedIn post (Phase 2 announcement)
  - Product Hunt update
- [ ] Goal: 10+ paying customers by end of Week 8

---

## 4. Phase 3: Continuous Monitoring System (Month 4-6)

**Goal:** Track regulation/vendor/org changes, alert on compliance impact

**Success Criteria:**
- Daily monitoring runs (framework + vendor updates)
- AI filtering achieves 90%+ precision (material changes)
- <24hr alert delivery time
- 50+ monitoring subscribers

---

### **Week 9-10: Framework Monitoring**

#### **Week 9: Data Collection + AI Filtering**

**Day 1-2 (16 hours):**
- [ ] Extend Convex schema:
  ```typescript
  changeEvents: defineTable({
    type: v.string(), // framework/vendor/organization
    source: v.string(),
    description: v.string(),
    impactedToolIds: v.array(v.id("tools")),
    impactedRequirementIds: v.array(v.id("requirements")),
    isMaterial: v.boolean(),
    detectedAt: v.number(),
  }),
  
  alerts: defineTable({
    organizationId: v.string(),
    changeEventId: v.id("changeEvents"),
    criticality: v.string(), // critical/warning/resolved
    message: v.string(),
    actionable: v.string(),
    sentAt: v.number(),
    readAt: v.optional(v.number()),
  }),
  ```
- [ ] Commit: "feat: Phase 3 data model"

**Day 3-4 (16 hours):**
- [ ] Build framework monitoring:
  ```typescript
  // convex/monitoring/frameworks.ts
  export const checkFrameworkChanges = internalMutation({
    handler: async (ctx) => {
      const frameworks = [
        { name: "EU AI Act", rssUrl: "https://...", type: "rss" },
        { name: "NIST AI RMF", rssUrl: "https://...", type: "rss" },
        { name: "APRA", search: "APRA AI governance updates", type: "exa" },
      ];
      
      for (const framework of frameworks) {
        const updates = await fetchUpdates(framework);
        
        for (const update of updates) {
          const impact = await analyzeImpact(update, framework.name);
          
          if (impact.isMaterial) {
            await ctx.db.insert("changeEvents", {
              type: "framework",
              source: framework.name,
              description: update.description,
              impactedToolIds: impact.tools,
              impactedRequirementIds: impact.requirements,
              isMaterial: true,
              detectedAt: Date.now(),
            });
          }
        }
      }
    },
  });
  ```
- [ ] Implement RSS feed parser
- [ ] Implement Exa.dev semantic monitoring
- [ ] Test: Manually trigger, verify updates detected
- [ ] Commit: "feat: framework monitoring"

**Day 5 (8 hours):**
- [ ] Build AI impact analyzer:
  ```typescript
  async function analyzeImpact(update, frameworkName) {
    const policies = await getAllPolicies();
    
    const prompt = `
      Framework: ${frameworkName}
      Update: ${update.description}
      
      Existing policies: ${policies.map(p => p.policyDocument.substring(0, 500))}
      
      Is this material for compliance?
      Which requirements does it affect?
      
      Output JSON: { isMaterial, affectedRequirements, reasoning }
    `;
    
    const result = await generateText({ model: openai('gpt-4o'), prompt, temperature: 0.2 });
    const analysis = JSON.parse(result.text);
    
    const tools = await findToolsByRequirements(analysis.affectedRequirements);
    
    return {
      isMaterial: analysis.isMaterial,
      tools: tools.map(t => t._id),
      requirements: analysis.affectedRequirements,
    };
  }
  ```
- [ ] Test: Feed sample EU AI Act update → verify filtering
- [ ] Commit: "feat: AI impact analyzer"

---

#### **Week 10: Vendor Monitoring**

**Day 1-3 (24 hours):**
- [ ] Build vendor monitoring:
  ```typescript
  // convex/monitoring/vendors.ts
  export const checkVendorChanges = internalMutation({
    handler: async (ctx) => {
      const tools = await ctx.db.query("tools").collect();
      const vendors = [...new Set(tools.map(t => t.vendor))];
      
      for (const vendor of vendors) {
        const updates = await fetchVendorUpdates(vendor);
        
        for (const update of updates) {
          const impact = await analyzeVendorImpact(update, vendor, tools);
          
          if (impact.isMaterial) {
            await ctx.db.insert("changeEvents", {
              type: "vendor",
              source: vendor,
              description: update.description,
              impactedToolIds: impact.tools,
              isMaterial: true,
              detectedAt: Date.now(),
            });
          }
        }
      }
    },
  });
  ```
- [ ] Implement vendor changelog scraping (scrape.do):
  ```typescript
  async function fetchVendorUpdates(vendor) {
    const changelogUrl = getVendorChangelogURL(vendor);
    if (!changelogUrl) return [];
    
    const response = await fetch('https://api.scrape.do', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.SCRAPE_DO_API_KEY}` },
      body: JSON.stringify({ url: changelogUrl, country: 'AU' }),
    });
    
    const data = await response.json();
    return parseChangelog(data.content);
  }
  ```
- [ ] Add GitHub release monitoring (for open-source tools)
- [ ] Test: Scrape OpenAI, Anthropic, AWS changelogs
- [ ] Commit: "feat: vendor monitoring (scrape.do)"

**Day 4-5 (16 hours):**
- [ ] Build material change filtering:
  ```typescript
  async function analyzeVendorImpact(update, vendor, tools) {
    const vendorTools = tools.filter(t => t.vendor === vendor);
    
    const prompt = `
      Vendor: ${vendor}
      Update: ${update.description}
      
      Tools: ${vendorTools.map(t => t.name)}
      
      Is this material for compliance?
      (Material = security, data residency, ToS, privacy, compliance features)
      (Not material = UI, pricing, marketing)
      
      Output JSON: { isMaterial, affectedTools, affectedAspects }
    `;
    
    const result = await generateText({ model: openai('gpt-4o'), prompt, temperature: 0.2 });
    return JSON.parse(result.text);
  }
  ```
- [ ] Test: Feed sample vendor updates → verify precision
- [ ] Measure false positive rate (aim <10%)
- [ ] Commit: "feat: vendor material change filtering"

---

### **Week 11-12: Alert System + Monitoring Dashboard**

#### **Week 11: Alerts (Email + Slack)**

**Day 1-2 (16 hours):**
- [ ] Integrate SendGrid:
  ```bash
  npm install @sendgrid/mail
  ```
- [ ] Build alert generation:
  ```typescript
  // convex/monitoring/alerts.ts
  export const processAlerts = internalMutation({
    handler: async (ctx) => {
      const changes = await ctx.db
        .query("changeEvents")
        .filter(q => q.gte(q.field("detectedAt"), Date.now() - 86400000))
        .collect();
      
      for (const change of changes) {
        const existingAlert = await ctx.db
          .query("alerts")
          .withIndex("by_change_event", q => q.eq("changeEventId", change._id))
          .first();
        
        if (!existingAlert) {
          const alert = await generateAlert(change);
          await ctx.db.insert("alerts", alert);
          
          await sendEmailAlert(alert);
          await sendSlackAlert(alert);
        }
      }
    },
  });
  ```
- [ ] Test: Trigger alert → verify email sent
- [ ] Commit: "feat: alert generation + email"

**Day 3-4 (16 hours):**
- [ ] Integrate Slack:
  ```bash
  npm install @slack/web-api
  ```
- [ ] Build Slack notification:
  ```typescript
  async function sendSlackAlert(alert: Alert) {
    const user = await getUser(alert.organizationId);
    
    if (user.slackWebhookUrl) {
      const slack = new WebClient();
      
      await slack.chat.postMessage({
        channel: user.slackChannelId,
        text: alert.message,
        blocks: [
          {
            type: "section",
            text: { type: "mrkdwn", text: `*${alert.message}*` },
          },
          {
            type: "section",
            text: { type: "mrkdwn", text: `*Action:* ${alert.actionable}` },
          },
        ],
      });
    }
  }
  ```
- [ ] Add alert preferences UI (user settings)
- [ ] Test: Send Slack alert
- [ ] Commit: "feat: Slack alerts"

**Day 5 (8 hours):**
- [ ] Build automated re-assessment:
  ```typescript
  async function reAssessAffectedTools(change: ChangeEvent) {
    const tools = await getToolsByIds(change.impactedToolIds);
    const requirements = await getRequirementsByIds(change.impactedRequirementIds);
    
    for (const tool of tools) {
      const assessments = await assessTool(tool, requirements);
      
      // Compare with previous
      const previous = await getPreviousAssessments(tool._id);
      const scoreChanged = compareAssessments(previous, assessments);
      
      if (scoreChanged < 0) {
        await generateDriftAlert(tool, scoreChanged);
      }
    }
  }
  ```
- [ ] Test: Framework update → re-assess tools → alert if score drops
- [ ] Commit: "feat: automated re-assessment"

---

#### **Week 12: Monitoring Dashboard + Scheduled Jobs**

**Day 1-2 (16 hours):**
- [ ] Create `/monitor` route
- [ ] Build monitoring dashboard widgets:
  - Recent alerts (last 7 days)
  - Compliance drift chart (line graph, 90 days)
  - Upcoming framework changes
  - Monitoring status (frameworks, vendors, auto-discovery)
- [ ] Fetch data from Convex (changeEvents, alerts, complianceHistory)
- [ ] Test: Render dashboard with sample data
- [ ] Commit: "feat: monitoring dashboard"

**Day 3-4 (16 hours):**
- [ ] Set up Convex scheduled functions:
  ```typescript
  // convex/crons.ts
  export const dailyMonitoring = internalMutation({
    handler: async (ctx) => {
      await checkFrameworkChanges(ctx);
      await checkVendorChanges(ctx);
      await checkOrgChanges(ctx);
      await processAlerts(ctx);
    },
  });
  
  // Schedule in convex.config.ts
  export default {
    functions: {
      "crons:dailyMonitoring": {
        schedule: "0 2 * * *", // Daily 02:00 UTC
      },
    },
  };
  ```
- [ ] Test: Manually trigger cron → verify monitoring runs
- [ ] Monitor logs, errors
- [ ] Commit: "feat: scheduled daily monitoring"

**Day 5 (8 hours):**
- [ ] Build weekly summary report:
  ```typescript
  async function generateWeeklySummary(organizationId: string) {
    const weekStart = Date.now() - 7 * 86400000;
    
    const changes = await getChangesSince(organizationId, weekStart);
    const currentScore = await getComplianceScore(organizationId);
    const previousScore = await getComplianceScore(organizationId, weekStart);
    
    return {
      weekStart: formatDate(weekStart),
      weekEnd: formatDate(Date.now()),
      complianceScore: {
        current: currentScore,
        change: currentScore - previousScore,
      },
      activity: {
        frameworkUpdates: changes.filter(c => c.type === 'framework').length,
        vendorUpdates: changes.filter(c => c.type === 'vendor').length,
        newTools: changes.filter(c => c.type === 'organization').length,
      },
      topPriority: getTopPriorityAlert(organizationId),
    };
  }
  ```
- [ ] Schedule weekly email (Monday 9am AEDT)
- [ ] Test: Send sample weekly summary
- [ ] Commit: "feat: weekly summary report"

---

### **Week 13-14: Testing + Premium Launch**

**Week 13 (5 days):**
- [ ] Integration testing (end-to-end monitoring flow):
  - Daily monitoring runs
  - Change detected → Alert sent → User notified
  - Re-assessment triggered → Dashboard updated
- [ ] Performance testing:
  - Monitoring 50 orgs (stress test scheduled functions)
  - Alert delivery <5 minutes
  - Dashboard load <2 seconds
- [ ] Security review:
  - Scrape.do API key protection
  - Alert content sanitization (no sensitive data in emails)
- [ ] Fix bugs
- [ ] Commit: "test: Phase 3 integration tests"

**Week 14 (5 days):**
- [ ] Billing integration (Phase 3 premium tier):
  - Monitoring Add-On: $200-500/mo (on top of Phase 2 tier)
  - Enterprise Monitoring: $2K/mo
- [ ] Deploy Phase 3 to production
- [ ] Launch to existing Phase 2 customers:
  - Email announcement
  - Free 1-month trial
  - Goal: 50%+ attach rate
- [ ] Marketing:
  - LinkedIn post (Phase 3 launch)
  - Case study (customer using monitoring)
  - Webinar (invite Phase 2 customers)
- [ ] Monitor: Alerts, errors, customer feedback

---

## 5. Month 4-6: Auto-Discovery + Enterprise Features

### **Month 4: AWS/Azure/GCP Auto-Discovery (Optional)**

**Week 15-16:**
- [ ] AWS integration (SageMaker, Bedrock detection)
- [ ] Azure integration (Azure OpenAI, Azure ML)
- [ ] GCP integration (Vertex AI, AI Platform)
- [ ] UI: Connect cloud accounts (OAuth)
- [ ] Test: Detect tools automatically
- [ ] Launch: Premium feature ($500/mo add-on)

### **Month 5: Code Repo Scanning (Optional)**

**Week 17-18:**
- [ ] GitHub integration (scan for AI agent usage, LangChain imports)
- [ ] Detect AI tools in code (parse package.json, requirements.txt)
- [ ] Alert on new deployments
- [ ] Test: Scan sample repos
- [ ] Launch: Enterprise feature

### **Month 6: Enterprise Features**

**Week 19-20:**
- [ ] Multi-user organizations (invite team, role-based access)
- [ ] Custom framework monitoring (add private regulations)
- [ ] API access (programmatic compliance checks)
- [ ] White-label option (custom branding)
- [ ] Dedicated support (Slack channel, CSM)

**Week 21-22:**
- [ ] SOC 2 preparation (audit logs, incident response)
- [ ] Enterprise customer onboarding (top 3 customers)
- [ ] Case studies, testimonials
- [ ] Annual pricing (20% discount)

**Week 23-24:**
- [ ] Retrospective (what worked, what didn't)
- [ ] Plan Year 2 roadmap
- [ ] Celebrate hitting $100K MRR 🎉

---

## 6. Team Coordination

### **Roles (if team scales)**

**Phase 1 (Week 1-2):**
- 1 full-stack engineer (can be solo founder)

**Phase 2 (Month 2-3):**
- 1 senior engineer (enforcement engine, dashboard)
- 1 junior engineer (UI polish, testing, CSV import)

**Phase 3 (Month 4-6):**
- 1 backend engineer (monitoring, scraping, alerts)
- 1 frontend engineer (dashboard, UX improvements)
- 1 junior engineer (testing, DevOps, customer support)

### **Weekly Rituals**

**Monday:**
- Sprint planning (2 hours)
- Review last week's metrics (GitHub stars, paying customers, MRR)
- Set goals for this week

**Wednesday:**
- Mid-week check-in (30 min)
- Blocker removal

**Friday:**
- Demo day (1 hour)
- Show what shipped this week
- Gather feedback from pilot customers

### **Communication**

- **Daily standup:** Async (Slack thread)
- **Code reviews:** GitHub PRs (required before merge)
- **Documentation:** Update PRD/Architecture as features evolve
- **Customer feedback:** Notion database (feature requests, bugs, praise)

---

## 7. Risks & Mitigation

### **Phase 1 Risks**

**Risk:** GPT-4o generates inaccurate policies  
**Mitigation:** 
- Human review for first 10 policies
- Feedback loop: Users can report errors
- Hire compliance consultant to validate

**Risk:** Exa.dev API quota/rate limits  
**Mitigation:**
- Cache regulation data in Convex
- Fall back to manual regulation upload
- Upgrade to paid Exa.dev plan if needed

### **Phase 2 Risks**

**Risk:** Vendor compliance data is incomplete  
**Mitigation:**
- Allow manual override (user provides vendor compliance info)
- Community contributions (crowdsource vendor data)
- Partnerships with vendors for official compliance APIs

**Risk:** Assessment accuracy is low  
**Mitigation:**
- Confidence scores (don't show low-confidence assessments)
- User feedback: "Is this assessment correct?"
- Improve prompts based on feedback

### **Phase 3 Risks**

**Risk:** Too many false alerts (alert fatigue)  
**Mitigation:**
- AI filtering (already in design)
- User-configurable thresholds
- Weekly summaries (batch noise)

**Risk:** scrape.do reliability issues  
**Mitigation:**
- Retry logic (3 attempts)
- Fallback to manual checks
- Monitor scrape.do uptime, switch provider if needed

---

## 8. Success Metrics (Review Weekly)

### **Phase 1 (Week 2)**
- ✅ GitHub stars: 50+
- ✅ Website visitors: 500+
- ✅ Pilot customers: 3-5 signed

### **Phase 2 (Month 3)**
- ✅ Paying customers: 20+
- ✅ MRR: $50K
- ✅ Average compliance score: 80%+

### **Phase 3 (Month 6)**
- ✅ Monitoring subscribers: 50+
- ✅ MRR: $100K
- ✅ Alert delivery: <24hr
- ✅ AI filtering precision: 90%+

---

## 9. Next Steps After This Plan

**Month 7-12:**
- Scale to 100+ customers
- Expand to US/EU jurisdictions (beyond AU)
- Add sectors: Healthcare, Retail, Manufacturing
- Build partner ecosystem (consultants, law firms)
- Raise seed round (if needed) or bootstrap to profitability

**Year 2:**
- Enterprise focus ($2K+ ARR per customer)
- International expansion (EU AI Act heavy)
- Industry certifications (SOC 2, ISO 27001)
- Open-source community growth (1000+ GitHub stars)

---

**Plan Status:** ✅ Ready for Execution  
**Start Date:** TBD (align with team availability)  
**Owner:** Dhrub + junior team (7 members)

---

This is your roadmap. Ship fast, iterate based on feedback, and remember: **Phase 1 is just the beginning.** The real value is in enforcement + monitoring.

Let's build this. 🚀

# Mandate MVP Implementation Plan

**Timeline**: Week 1-2 (10 business days)  
**Team**: You (full-stack), AI agents (frontend design, systematic debugging)  
**Deliverable**: Functional MVP deployed to Vercel

---

## Week 1: Foundation & Frontend

### Day 1: Project Setup & Architecture
**Goal**: Solid foundation for rapid development

**Tasks**:
- [x] Initialize Next.js 14 (App Router)
- [x] Set up Tailwind CSS + shadcn/ui component library
- [x] Configure TypeScript + ESLint
- [x] Create folder structure (app, components, lib, hooks)
- [x] Initialize Convex backend (local dev)
- [x] Add environment variables (.env.local)
- [ ] Create `docs/architecture/ARCHITECTURE.md` (already have from Vishwakarma)
- [ ] Deploy staging to Vercel (preview)

**Deliverable**: Working dev environment, `npm run dev` works

**Time**: 2-3 hours

---

### Day 2: Landing Page (Frontend Priority)
**Goal**: Conversion-optimized homepage

**Using frontend-design skill**: Build a distinctive, high-converting landing page that stands out

**Sections**:
1. **Hero** (above fold)
   - Headline: "Generate Your AI Governance Policy in 30 Minutes"
   - Subheadline: "Tailored to Australian regulations. Free and open-source."
   - CTA: [Generate My Policy →] button
   - Social proof: "500+ policies generated this week"
   
2. **How It Works** (3-step visual flow)
   - Answer questionnaire → AI generates policy → Download PDF/DOCX
   - Icons + animations (Framer Motion)
   
3. **Features Grid** (4 columns, 2 rows)
   - Regulation-grounded | Sector-specific | Jurisdiction-aware | Export-ready
   
4. **Testimonials** (3 beta user quotes)
   - Name, title, org
   
5. **FAQ Section** (8 questions, accordion)
   - Is this really free? | Who should use this? | etc.
   
6. **CTA Footer** ("Start generating now")

**Design Direction** (using frontend-design approach):
- **Aesthetic**: Professional but approachable (NOT stodgy corporate)
- **Colors**: Navy blue (#1e3a5f) + Bright green (#10b981) + White
- **Typography**: 
  - Display: Space Mono (for headlines, tech credibility)
  - Body: Geist (clean, modern, minimalist)
- **Animations**: Smooth page load with staggered reveals (Framer Motion)
- **Layouts**: Asymmetrical, grid-breaking, generous whitespace
- **Details**: Subtle gradients, animated SVG icons, custom cursor

**Deliverable**: Beautiful, conversion-optimized landing page

**Time**: 4-5 hours

---

### Day 3: Questionnaire UI & State Management
**Goal**: 12-question form that guides users smoothly

**Features**:
- [ ] 3-page questionnaire (4 questions per page)
- [ ] Progress bar (visual indicator)
- [ ] Form validation (React Hook Form)
- [ ] Save to localStorage (resume progress)
- [ ] Tooltips for regulatory terms
- [ ] Mobile-responsive (40% of traffic)
- [ ] Smooth transitions between pages

**Questionnaire Structure**:

**Page 1: Organization Context**
```
Q1: Sector (Radio: Finance / Public Sector)
Q2: Organization size (Radio: 1-100 / 100-500 / 500-2000 / 2000+)
Q3: Jurisdiction (Dropdown: Federal / NSW / VIC / QLD / SA / WA / TAS / NT / ACT)
Q4: Regulated by (Checkboxes: ASIC / APRA / OAIC / Other)
```

**Page 2: AI Use Cases**
```
Q5: AI systems (Checkboxes: Chatbots / Predictive analytics / Decision automation / CV / NLP / Other)
Q6: Data types (Checkboxes: Personal info / Financial / Health / Biometric / Public)
Q7: High-risk decisions? (Radio: Yes / No)
Q8: Customer-facing AI? (Radio: Yes / No)
```

**Page 3: Governance Maturity**
```
Q9: Existing framework? (Radio: Yes / No / Partial)
Q10: Risk appetite (Radio: Conservative / Moderate / Progressive)
Q11: Governance owner (Radio: Compliance / IT / Risk / Dedicated team)
Q12: Timeline (Radio: Urgent <1mo / Normal 1-3mo / Planning >3mo)
```

**State Management** (Zustand):
```typescript
interface QuestionnaireState {
  page: number;
  answers: Record<string, any>;
  setAnswer: (key: string, value: any) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}
```

**Deliverable**: Fully functional questionnaire with validation

**Time**: 3-4 hours

---

### Day 4: Generation API Integration & Loading State
**Goal**: Hook questionnaire to generation backend

**Tasks**:
- [ ] Create Convex schema for policies
- [ ] Create `generatePolicy` mutation
- [ ] Create generation endpoint (POST /api/generate)
- [ ] Implement progress tracking (streaming response)
- [ ] Build loading state UI (skeleton screens, progress bar)
- [ ] Error handling & retry logic

**Generation Flow**:
```
1. User submits questionnaire → Zustand store
2. Frontend sends to /api/generate → Convex mutation
3. Convex calls:
   - Context7 API (query regulations)
   - OpenAI GPT-4 (generate policy)
   - Validation engine (check completeness)
4. Store result in Convex database
5. Return policy to frontend (streaming or polling)
6. Show preview
```

**Deliverable**: Generation API wired to frontend

**Time**: 3-4 hours

---

### Day 5: Policy Preview & Export Service
**Goal**: Display generated policy with export options

**Preview Component**:
- [ ] Markdown renderer (react-markdown)
- [ ] Table of contents (sticky sidebar)
- [ ] Syntax highlighting
- [ ] Word count + reading time
- [ ] "Edit" button (Phase 2)

**Export Service**:
- [ ] PDF export (Puppeteer + styled HTML)
- [ ] DOCX export (docx.js)
- [ ] Markdown download
- [ ] One-click download (no email gate)

**Export UI**:
- [ ] 3 format buttons (PDF / DOCX / Markdown)
- [ ] Loading state while generating
- [ ] Success toast notification

**Deliverable**: Policy preview + export working

**Time**: 3-4 hours

---

### Week 1 Recap
- ✅ Landing page (beautiful, conversion-focused)
- ✅ Questionnaire (all 12 questions, validation)
- ✅ Generation API (Convex + OpenAI wired)
- ✅ Policy preview & export (3 formats)

**By End of Week 1**: 
- Vercel staging deployment working
- User can generate full policy end-to-end
- NPS survey link embedded

---

## Week 2: Backend, Documentation, & Launch

### Day 6: Context7 Integration & Regulatory Data
**Goal**: Ground policy generation in real regulations

**Tasks**:
- [ ] Set up Context7 API client
- [ ] Create regulatory document schema
- [ ] Seed regulations database (ASIC, APRA, Privacy Act snippets)
- [ ] Implement semantic search function
- [ ] Test query relevance (manual spot check)
- [ ] Add fallback regulations (if Context7 fails)

**Context7 Query Flow**:
```typescript
async function queryRegulations(
  sector: string,
  jurisdiction: string,
  regulations: string[]
): Promise<RegulationChunk[]> {
  const response = await context7.query({
    query: `${sector} AI governance regulations in ${jurisdiction}`,
    filters: { source: regulations },
    limit: 10
  });
  return response.chunks;
}
```

**Deliverable**: Regulations properly grounded in Context7

**Time**: 2-3 hours

---

### Day 7: Validation Engine & Quality Assurance
**Goal**: Ensure generated policies meet compliance standards

**Validation Checks**:
- [ ] All mandatory sections present (per regulation)
- [ ] At least 5 regulation clause references
- [ ] No contradictory statements (LLM re-check)
- [ ] Minimum word count (8,000 words)
- [ ] Completes within 60 seconds

**Validation Output**:
```json
{
  "valid": true,
  "completeness_score": 0.95,
  "missing_sections": [],
  "warnings": ["Consider adding quantitative risk thresholds"],
  "compliance_coverage": {
    "Privacy Act": 1.0,
    "ASIC": 0.92
  }
}
```

**Deliverable**: Validation engine rejecting invalid policies

**Time**: 2-3 hours

---

### Day 8: Error Handling, Monitoring, & Rate Limiting
**Goal**: Production-ready reliability

**Tasks**:
- [ ] Sentry error tracking (all exceptions logged)
- [ ] PostHog analytics (track funnel: visit → generate → export)
- [ ] Rate limiting (10 generations/hour per IP)
- [ ] API timeout handling (graceful degradation)
- [ ] Retry logic (failed OpenAI calls)
- [ ] User-friendly error messages

**Monitoring Dashboard**:
- [ ] Error rate
- [ ] Generation time (p50, p95, p99)
- [ ] API cost tracking
- [ ] Funnel metrics (conversion, dropout)

**Deliverable**: Production monitoring in place

**Time**: 2-3 hours

---

### Day 9: Documentation & GitHub Setup
**Goal**: Public repo ready for launch

**Tasks**:
- [ ] Write comprehensive README.md
  - Product overview
  - Quick start (5 minutes)
  - Screenshots/GIFs
  - Architecture overview
  - Contributing guide
  
- [ ] Move docs to `/docs/` folder
  - ARCHITECTURE.md (from Vishwakarma)
  - PRD.md (from Vishwakarma)
  - IMPLEMENTATION_PLAN.md (this file)
  
- [ ] Create CONTRIBUTING.md
  - How to contribute
  - Code style guide
  - Local dev setup
  
- [ ] Add LICENSE (MIT)
  
- [ ] Create .gitignore (Node, Next.js, env files)
  
- [ ] Push to GitHub (github.com/dhrub-git/mandate)

**README Outline**:
```markdown
# Mandate

Generate AI governance policies in 30 minutes.

## Features
- Regulation-grounded (ASIC, APRA, Privacy Act)
- Sector-specific (Finance, Public Sector)
- Multiple export formats (PDF, DOCX, MD)

## Quick Start
```

**Deliverable**: Beautiful public GitHub repo

**Time**: 2-3 hours

---

### Day 10: Testing, Launch Prep, & Deployment
**Goal**: Ship to production

**Testing Checklist**:
- [ ] Manual questionnaire completion (end-to-end)
- [ ] All 3 export formats working
- [ ] Mobile responsiveness (iPhone 12, iPad)
- [ ] Error scenarios (network failure, API timeout)
- [ ] Analytics events firing
- [ ] Rate limiting working
- [ ] Load test (100 concurrent requests)

**Pre-Launch**:
- [ ] GitHub repo public + stars enabled
- [ ] Vercel production deployment
- [ ] Custom domain (mandate.sh)
- [ ] DNS configured
- [ ] SSL certificate (automatic via Vercel)

**Launch Plan**:
- Day 1: Soft launch (share with 50 beta testers)
- Day 2: Product Hunt submission
- Day 3-4: Social media + LinkedIn outreach
- Day 5: Follow-up with feedback

**Success Metrics** (Week 2 end):
- 500 policies generated
- 50 GitHub stars
- 5 enterprise leads
- NPS >50

**Deliverable**: Live on production

**Time**: 3-4 hours

---

## Technical Stack (Final)

**Frontend**:
- Next.js 14 (App Router, RSC)
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- React Hook Form (questionnaire)
- React Markdown (policy preview)

**Backend**:
- Convex (database + API)
- OpenAI GPT-4-turbo
- Context7 (semantic search)

**Infrastructure**:
- Vercel (hosting + edge functions)
- Sentry (error tracking)
- PostHog (analytics)

**Deployment**:
- GitHub Actions (CI/CD)
- Vercel (automatic staging + production)

---

## Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| OpenAI API rate limits | Queue system, upgrade to Tier 4 |
| Context7 latency | Parallel queries, caching |
| Hallucination in policies | Validation engine, Context7 grounding |
| PDF generation slow | Use Convex actions, async export |
| Regulatory data stale | Weekly cron scrape, manual updates |

---

## Success Definition

**MVP Success** (Week 2):
- ✅ 500 policies generated
- ✅ 50 GitHub stars
- ✅ 5 enterprise leads
- ✅ NPS >50
- ✅ One case study published

**Phase 2** (Month 2-3):
- User authentication
- Policy history
- Custom branding
- $10k MRR (200 Pro users)

---

## Next Actions

1. **Today**: Initialize Next.js, start frontend design
2. **Day 2**: Landing page complete
3. **Day 3**: Questionnaire complete
4. **Day 4**: API integration complete
5. **Day 5**: Exports working
6. **Days 6-10**: Backend, testing, launch

**Ready to start? Let's build mandate. 🚀**

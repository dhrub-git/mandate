# AI Governance Lifecycle Platform — Product Design

**Date:** 2026-02-01  
**Status:** Design Complete — Ready for PRD  
**Owner:** Dhrub Biswas

---

## Executive Summary

Expanding from a policy generator to a **full AI Governance Lifecycle Platform** with three phases:

1. **Generate Policy** (Week 1-2) — AI-generated governance policies
2. **Enforce on Stack** (Month 2-3) — Map AI infrastructure against policy, identify gaps
3. **Monitor Changes** (Month 4-6) — Continuous tracking of framework/vendor/org changes

**Key Innovation:** Moving from one-time policy generation to continuous governance-as-a-service.

---

## Product Vision & Structure

### Product Name
**AI Governance Lifecycle Platform** (working title)

### Tagline
"Generate, Enforce, and Monitor AI Governance at Scale"

### Three-Phase Evolution

**Phase 1: Policy Generation (Week 1-2, MVP)**
- **What:** Questionnaire → AI-generated policy + checklist + roadmap
- **Value:** Get audit-ready governance in 5 minutes
- **Revenue:** Open-source → Consulting for customization
- **Success:** 50+ GitHub stars, 3-5 pilot customers
- **Tech:** Next.js + Convex + OpenAI GPT-4.5 + Exa.dev

**Phase 2: Stack Enforcement (Month 2-3)**
- **What:** Map AI infrastructure (5 layers) against generated policy
- **Value:** Know exactly which tools violate which policy clauses
- **Revenue:** SaaS subscription ($99-499/mo based on stack size)
- **Success:** 20+ paying customers, 80%+ compliance scores
- **Inventory:** Manual (MVP) → Auto-discovery (future)

**Phase 3: Continuous Monitoring (Month 4-6)**
- **What:** Track framework/vendor/org changes, alert on compliance impacts
- **Value:** Stay compliant as regulations and vendors evolve
- **Revenue:** Premium tier ($499-2K/mo for enterprise monitoring)
- **Success:** 50+ monitoring subscribers, <24hr alert time
- **Tech:** AI-powered change filtering (only surface material changes)

### Platform UX (Day 1)
Navigation shows all 3 phases from MVP launch:
- ✅ **Generate Policy** (Live)
- 🔜 **Enforce on Stack** (Coming Soon - Month 2)
- 🔜 **Monitor Changes** (Coming Soon - Month 4)

**Why:** Positions as full platform, not one-trick tool. Sets expectations for enterprise buyers.

---

## AI Stack Model (5 Layers)

### Layer 1: Foundation Models
- **What:** GPT-4, Claude, Llama, Gemini, Mistral, etc.
- **Policy Concerns:** Data residency, training data provenance, bias, IP rights
- **Example Tools:** OpenAI API, Anthropic API, Azure OpenAI, AWS Bedrock

### Layer 2: Model Training & Fine-Tuning
- **What:** Platforms for training/fine-tuning custom models
- **Policy Concerns:** Training data governance, model versioning, experiment tracking
- **Example Tools:** AWS SageMaker, Azure ML, Databricks, Hugging Face, Weights & Biases

### Layer 3: AI Agents (Reasoning Layer)
- **What:** Single-purpose AI agents performing reasoning tasks
- **Policy Concerns:** Decision transparency, prompt injection risks, output validation
- **Example Tools:** LangChain, LlamaIndex, Custom frameworks, AutoGPT

### Layer 4: Multi-Agent Communication
- **What:** Orchestration systems coordinating multiple agents
- **Policy Concerns:** Agent interaction logs, decision chains, accountability across agents
- **Example Tools:** CrewAI, AutoGen, Semantic Kernel, custom orchestration

### Layer 5: Autonomous Agents
- **What:** Self-directed systems making decisions without human oversight
- **Policy Concerns:** Human-in-the-loop requirements, kill switches, audit trails
- **Example Tools:** Fully autonomous systems, RPA with AI

---

## Stack Inventory Data Model (Tiered)

### Required Fields (Fast MVP)
- **Layer:** Dropdown (1-5)
- **Tool Name:** Text ("OpenAI GPT-4")
- **Vendor:** Text ("OpenAI")

### Optional Fields (Power Users)
- **Use Case:** Text ("Customer support chatbot")
- **Risk Level:** Dropdown (Critical/High/Medium/Low)
- **Data Sensitivity:** Dropdown (PII/Financial/Health/Public)
- **Deployment:** Dropdown (Cloud/On-Prem/Hybrid)
- **Users/Departments:** Text ("Marketing, Sales")

### Data Collection Strategy
**Phase 2 (MVP):** Manual inventory form  
**Phase 3+:** Auto-discovery via cloud account integrations (AWS/Azure/GCP), code repo scanning

**Why Tiered:** Get tool names quickly for basic compliance check. Let power users add context for deeper analysis.

---

## Policy Enforcement Engine (Phase 2)

### How It Works

**Step 1: Policy Parsing**
- Extract compliance requirements from generated policy
- Example requirements:
  - "All foundation models must support data residency in AU"
  - "Training data must be documented and versioned"
  - "High-risk AI systems require human-in-the-loop approval"
  - "Vendor contracts must include liability clauses for algorithmic bias"

**Step 2: Tool-to-Policy Matching**
- For each tool in inventory, check against policy requirements
- Use AI (GPT-4.5) to analyze:
  - Vendor documentation
  - Terms of Service
  - Compliance pages (via Exa.dev + scrape.do)
- Example: "Does OpenAI GPT-4 support AU data residency?" 
  → Fetch OpenAI docs → Answer: No (US/EU only) → Flag violation

**Step 3: Gap Identification**
- **Red (Critical):** Tool violates mandatory policy requirement
- **Yellow (Warning):** Tool may violate, needs manual review
- **Green (Compliant):** Tool meets requirement

**Step 4: Remediation Suggestions**
For each gap, AI suggests fixes:
- "Switch to Azure OpenAI with AU region enabled"
- "Add data processing agreement with vendor"
- "Implement human review workflow before deployment"
- "Document training data lineage in MLOps platform"

---

## Compliance Dashboard (Phase 2)

### Overview Page
- **Overall Score:** "73% compliant (22 tools assessed)"
- **Breakdown by Layer:** Layer 1 (80%), Layer 2 (65%), Layer 3 (70%)...
- **Critical Gaps:** "5 critical violations require immediate action"

### Drill-Down View (Per Tool)
**Example: OpenAI GPT-4**
- **Status:** Red (2 violations), Yellow (1 warning)
- **Violations:**
  - ❌ **Data Residency (Policy §3.2):** No AU region  
    → **Remediation:** Switch to Azure OpenAI AU
  - ❌ **Vendor Liability (Policy §7.1):** Standard ToS lacks bias clause  
    → **Remediation:** Negotiate enterprise agreement
  - ⚠️ **Output Monitoring (Policy §5.3):** No automated output validation  
    → **Remediation:** Implement content filtering

### Export
- **PDF Audit Report:** All gaps + remediation roadmap
- **Use Case:** Compliance officers present to auditors/executives

---

## Continuous Monitoring System (Phase 3)

### What We Monitor (3 Dimensions)

**1. Framework Changes**
- **Sources:** EU AI Act updates, NIST AI RMF revisions, ISO standards, GDPR amendments, sector regulations (APRA, ASIC)
- **Method:** RSS feeds + Exa.dev semantic search + scrape.do
- **Example Alert:** "EU AI Act updated Annex III (high-risk systems) - affects your customer scoring model"

**2. Vendor Changes**
- **Sources:** Vendor changelogs, release notes, API updates, ToS changes, security bulletins
- **Method:** Vendor APIs (where available) + scrape.do + GitHub releases
- **Example Alert:** "OpenAI released GPT-4.5 with improved AU data residency - resolves your Policy §3.2 violation"

**3. Organization Changes**
- **Sources:** User-added tools, cloud account integrations (future), code repo scanning (future)
- **Method:** Manual updates (Phase 2) → Auto-discovery (Phase 3+)
- **Example Alert:** "New tool detected: AWS Bedrock - needs compliance assessment"

### AI-Powered Change Filtering

**The Problem:** Too much noise (100s of vendor updates/week, most irrelevant)

**The Solution:** AI agent (GPT-4.5) analyzes each change:
1. Does this affect any policy requirement we generated?
2. Does this impact any tool in the user's stack?
3. Is this material (security/compliance) or minor (UI change)?

**Only Surface Material Changes:**
- ✅ "OpenAI updated data retention policy - affects your §4.1 requirement"
- ❌ "OpenAI released new playground UI" (ignore)

### Monitoring Outputs

**Alerts (Real-time):**
- Email/Slack notification: "Critical: EU AI Act Amendment affects 3 of your tools"
- In-app alert: "Vendor Update: Claude now supports AU region - resolves 2 gaps"

**Weekly Summary Report:**
- Framework updates this week: 2
- Vendor updates affecting your stack: 5
- New compliance gaps: 1
- Resolved gaps: 3

**Automated Re-assessment:**
- When material change detected → Re-run policy enforcement for affected tools
- Update compliance dashboard automatically
- Track drift over time: "Compliance score dropped from 73% to 68% this month"

---

## Technical Architecture

### System Architecture (3-Phase Integration)

**Phase 1: Policy Generation Engine**
- **Input:** Questionnaire responses (sector, jurisdiction, org size, risk profile)
- **Processing:** OpenAI GPT-4.5 + Exa.dev API (regulation data) + prompt engineering
- **Output:** Policy document + Compliance checklist + Implementation roadmap
- **Storage:** Convex DB (policies, user responses)

**Phase 2: Stack Enforcement Engine**
- **Input:** AI stack inventory (5 layers, tool details)
- **Processing:**
  - Parse policy requirements (AI extracts compliance clauses)
  - Fetch vendor compliance data (Exa.dev + scrape.do + cached knowledge)
  - Match tools → requirements → generate gap analysis
- **Output:** Compliance dashboard + Gap report + Remediation steps
- **Storage:** Convex DB (inventory, gaps, assessments)

**Phase 3: Monitoring Engine**
- **Input:** Framework feeds, vendor changelogs, org updates
- **Processing:**
  - Fetch updates (RSS/Exa.dev/scrape.do)
  - AI filtering: "Is this material for compliance?"
  - Re-run enforcement for affected tools
  - Generate alerts
- **Output:** Alerts, weekly reports, drift tracking
- **Storage:** Convex DB (change events, alert history)

### Core Data Model

```
Organization
  ├── Policies (generated documents)
  ├── AIStack (5-layer inventory)
  │     ├── Tools (name, vendor, layer, details)
  │     └── Assessments (compliance status per tool)
  ├── Frameworks (regulations mapped to policy)
  ├── Monitoring
  │     ├── ChangeEvents (framework/vendor updates)
  │     ├── Alerts (triggered notifications)
  │     └── DriftHistory (compliance over time)
  └── Settings (alert preferences, integrations)
```

### Tech Stack

**Frontend:**
- Next.js 15
- Shadcn UI
- Tailwind CSS

**Backend:**
- Convex (serverless DB + real-time sync)
  - Phase 1: Policy storage
  - Phase 2: + Stack inventory + Assessments
  - Phase 3: + Monitoring data + Alert queue

**AI Infrastructure:**
- **OpenAI GPT-4.5** (via Vercel AI SDK)
  - Policy generation
  - Requirement parsing
  - Change filtering
  - Gap analysis + remediation suggestions
- **Exa.dev API** (primary data source)
  - Regulation text search & scraping
  - Semantic search for relevant clauses
  - Real-time regulation updates
- **scrape.do** (residential proxy for deep scraping)
  - Vendor changelogs (when no API)
  - Framework update pages
  - Terms of Service / compliance pages

**Monitoring Infrastructure:**
- Cron jobs (Vercel Cron or Convex scheduled functions)
- RSS feed parser
- Exa.dev for semantic web monitoring
- scrape.do for resilient scraping (residential proxies)
- Vendor APIs (OpenAI, Anthropic, AWS where available)

**Future Integrations:**
- Cloud account connectors (AWS/Azure/GCP for auto-discovery)
- Slack/Email for alerts
- GitHub for code repo scanning

### API Design (Phase 2-3 Additions)

```
POST /api/stack/inventory        - Add tools to stack
GET  /api/stack/assessment       - Run compliance check
GET  /api/stack/gaps             - Get gap analysis
POST /api/monitoring/subscribe   - Enable monitoring
GET  /api/monitoring/alerts      - Fetch alerts
POST /api/monitoring/check       - Trigger manual check
```

---

## Revenue Model (3-Phase)

### Phase 1: Policy Generation
- **Free:** Open-source MVP on GitHub
- **Consulting:** $50-100K/year for enterprise customization
- **Target:** 3-5 pilot customers, $50-100K ARR Year 1

### Phase 2: Stack Enforcement
- **SaaS Tiers:**
  - **Starter:** $99/mo (up to 10 tools)
  - **Professional:** $299/mo (up to 50 tools)
  - **Enterprise:** $499/mo (unlimited tools + custom integrations)
- **Target:** 20+ paying customers, $50K MRR by Month 6

### Phase 3: Continuous Monitoring
- **Premium Add-On:** $200-500/mo on top of enforcement tier
- **Enterprise:** $2K/mo (dedicated monitoring, custom alerts, API access)
- **Target:** 50+ monitoring subscribers, $100K MRR by Month 12

---

## Success Metrics

### Phase 1 (Week 1-2)
- ✅ 50+ GitHub stars
- ✅ 500+ website visitors
- ✅ 3-5 pilot customers signed (consulting pipeline)

### Phase 2 (Month 2-3)
- ✅ 20+ paying SaaS customers
- ✅ 80%+ average compliance score across customers
- ✅ $50K MRR

### Phase 3 (Month 4-6)
- ✅ 50+ monitoring subscribers
- ✅ <24hr alert delivery time
- ✅ $100K MRR
- ✅ 10+ framework integrations (EU AI Act, NIST, ISO, GDPR, APRA, ASIC)

---

## Design Decisions Summary

All decisions followed **Option C (Hybrid/Tiered/Phased)** pattern:

1. **Stack Discovery:** Manual inventory (MVP) → Auto-discovery (later)
2. **Inventory Detail:** Required tool names → Optional deep context
3. **Monitoring Data:** Hybrid (APIs + Scraping + AI filtering)
4. **Compliance View:** Dashboard (quick) + Drill-down (detailed) + Export (audit)
5. **Product Architecture:** Phased platform (ship Phase 1 fast, design for 3 phases upfront)

**Why This Pattern:** Fast MVP validation + clear premium upsell path + enterprise positioning from day 1

---

## Next Steps

1. **Create Updated PRD** incorporating this 3-phase design
2. **Update Architecture Document** with Phase 2-3 technical specs
3. **Create New Implementation Plan** (7-14 days Phase 1 → 2-3 months Phase 2 → 4-6 months Phase 3)
4. **Validate with Pilot Customers** (show vision, get feedback on Phase 2-3 priorities)

---

**Design Status:** ✅ Complete — Ready for PRD Development

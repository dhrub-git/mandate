# AI Governance Lifecycle Platform — Product Requirements Document

**Version:** 2.0  
**Date:** 2026-02-01  
**Status:** Design Complete — Ready for Development  
**Owner:** Dhrub Biswas  
**Previous Version:** PRD.md (v1.0 - Policy Generator only)

---

## 1. Executive Summary

The **AI Governance Lifecycle Platform** is a SaaS platform that automates the full governance lifecycle: **Generate** policies, **Enforce** them across AI infrastructure, and **Monitor** continuous compliance.

**Key Promise:** From policy generation (5 minutes) to ongoing compliance management (continuous monitoring).

**Product Evolution:**
- **Phase 1 (Week 1-2):** Policy Generation MVP (same as v1.0)
- **Phase 2 (Month 2-3):** Stack Enforcement (map AI infrastructure, identify gaps)
- **Phase 3 (Month 4-6):** Continuous Monitoring (track framework/vendor/org changes)

**Go-to-Market:** 
- Open-source Phase 1 on GitHub → 
- SaaS Phase 2 ($99-499/mo) → 
- Premium Phase 3 ($2K/mo enterprise monitoring)

**Target Year 1 Revenue:** $50-100K ARR (Phase 1 consulting) → $600K ARR (Phase 2-3 SaaS)

---

## 2. Problem Statement

### Current Situation

**Problem 1: Policy Creation is Slow**
- 2-3 months manual work
- $50-200K in consulting fees
- Enterprises need policies but can't move fast

**Problem 2: Policies Don't Track Reality** ✨ *NEW*
- Policies written once, infrastructure evolves constantly
- No mapping between policy clauses and actual AI tools
- Compliance teams discover violations months later (audits, incidents)

**Problem 3: Staying Compliant is Manual** ✨ *NEW*
- EU AI Act updates → manually re-assess all tools
- OpenAI releases GPT-5 → manually check if it affects compliance
- Company adds new AI agent → manually verify against policy
- No automation = drift = violations

### Impact

**Compliance Officers:**
- Paralyzed by policy writing (Phase 1 problem)
- Can't track what's actually deployed (Phase 2 problem)
- Can't keep up with changes (Phase 3 problem)

**CIOs:**
- Need governance but can't slow down AI adoption
- Want visibility into AI stack compliance
- Need continuous assurance, not point-in-time audits

**Startups/SMBs:**
- Can't afford $100K consultants
- Can't hire compliance teams
- Need automated governance

---

## 3. Product Vision

### What We Build

**An AI-powered platform that answers three questions:**

1. **"What should our AI governance policy be?"** → Generate tailored policy
2. **"Are we compliant with our policy?"** → Map stack, identify gaps
3. **"Are we staying compliant over time?"** → Monitor changes, alert on drift

### Three-Phase Evolution

#### **Phase 1: Generate Policy** (Week 1-2, MVP)

**What:** AI-generated governance policies tailored to sector + jurisdiction + risk profile

**Output:**
- AI Governance Policy (2-3 page document)
- Compliance Checklist (controls mapped to regulations + NIST AI RMF)
- Implementation Roadmap (12-18 month phased rollout)

**Value Prop:** 5 minutes vs 2-3 months

**Revenue:** Open-source MVP → Consulting for enterprise customization

---

#### **Phase 2: Enforce on Stack** (Month 2-3) ✨ *NEW*

**What:** Map AI infrastructure (5 layers) against generated policy

**How It Works:**
1. User inventories their AI stack (manual form initially)
2. Platform analyzes each tool against policy requirements
3. AI (GPT-4.5) fetches vendor compliance data (Exa.dev + scrape.do)
4. Platform generates gap analysis with remediation steps

**Output:**
- Compliance Dashboard (Red/Yellow/Green status per tool)
- Drill-down reports (which tools violate which policy clauses)
- Remediation suggestions ("Switch to Azure OpenAI AU region")
- PDF audit reports (for regulators, executives)

**Value Prop:** Know exactly where you're non-compliant, with actionable fixes

**Revenue:** SaaS subscription ($99-499/mo based on stack size)

---

#### **Phase 3: Continuous Monitoring** (Month 4-6) ✨ *NEW*

**What:** Track 3 dimensions of change that impact compliance

**What We Monitor:**

1. **Framework Changes**
   - EU AI Act updates, NIST revisions, ISO standards, GDPR amendments
   - Sources: RSS feeds, Exa.dev semantic search, regulation sites
   
2. **Vendor Changes**
   - OpenAI releases GPT-5, Anthropic updates Claude, AWS adds Bedrock features
   - Sources: Vendor APIs, changelogs (scrape.do), GitHub releases
   
3. **Organization Changes**
   - Company adds new AI tool, changes deployment, updates use case
   - Sources: Manual updates (Phase 2) → Auto-discovery (Phase 3+)

**AI-Powered Filtering:**
- Problem: 100s of updates/week, most irrelevant
- Solution: AI agent (GPT-4.5) analyzes each change:
  - Does this affect our policy requirements?
  - Does this impact tools in our stack?
  - Is this material (compliance) or minor (UI change)?
- Only surface material changes

**Output:**
- Real-time alerts (Email/Slack): "EU AI Act amendment affects 3 of your tools"
- Weekly summary reports
- Automated re-assessment (compliance score updates automatically)
- Drift tracking over time

**Value Prop:** Stay compliant as regulations and vendors evolve, without manual re-work

**Revenue:** Premium tier ($499-2K/mo for enterprise monitoring)

---

### Platform UX (Day 1)

Even in Phase 1 MVP, navigation shows full roadmap:

- ✅ **Generate Policy** (Live)
- 🔜 **Enforce on Stack** (Coming Month 2)
- 🔜 **Monitor Changes** (Coming Month 4)

**Why:** Positions as full platform from day 1. Enterprise buyers see we're building lifecycle management, not a one-off tool.

---

## 4. Target Users

### Persona 1: Compliance Officer
- **Name:** Sarah, Head of Compliance, Regional Bank (500-person org)
- **Pain:** 
  - Phase 1: Policy writing is bottleneck
  - Phase 2: Can't track which tools violate which policy clauses
  - Phase 3: Can't keep up with regulation changes (EU AI Act, APRA)
- **Goals:**
  - Get audit-ready policy in <2 weeks
  - Know compliance status in real-time
  - Get alerts when regulations change
- **Budget:** $200-500K/year for governance tools + consulting
- **How we help:**
  - Phase 1: Pre-built policy → faster approval
  - Phase 2: Compliance dashboard → audit-ready reports
  - Phase 3: Automated monitoring → stay ahead of regulators

### Persona 2: CIO / IT Leader
- **Name:** Raj, CIO, Government Agency (2000-person org)
- **Pain:**
  - Phase 1: Need enterprise AI governance foundation
  - Phase 2: No visibility into AI tools deployed across departments
  - Phase 3: Can't track vendor updates (security, compliance)
- **Goals:**
  - Foundation policy they can customize per division
  - Centralized view of all AI tools + compliance status
  - Continuous assurance (not point-in-time audits)
- **Budget:** Governance platform budget; willing to pay for enterprise features
- **How we help:**
  - Phase 1: Policy + roadmap → tailored for departments
  - Phase 2: Stack inventory → centralized visibility
  - Phase 3: Monitoring → continuous compliance tracking

### Persona 3: AI Governance Lead (Startup)
- **Name:** Alex, AI/Ethics Lead, Fintech (100-person org)
- **Pain:**
  - Phase 1: No budget for $100K consultants
  - Phase 2: Don't know if their AI tools are compliant
  - Phase 3: Can't afford compliance team to track changes
- **Goals:**
  - Get governance baseline ASAP (free tool)
  - Understand compliance gaps before auditors find them
  - Automate monitoring (can't hire full-time compliance)
- **Budget:** Eventually consulting ($50-150K) as they scale
- **How we help:**
  - Phase 1: Free MVP → get started
  - Phase 2: SaaS tier → affordable compliance visibility
  - Phase 3: Monitoring → automation instead of hiring

---

## 5. AI Stack Model (5 Layers)

### **Layer 1: Foundation Models**
- **What:** GPT-4, Claude, Llama, Gemini, Mistral, etc.
- **Policy Concerns:** Data residency, training data provenance, bias, IP rights
- **Example Tools:** OpenAI API, Anthropic API, Azure OpenAI, AWS Bedrock, Google Vertex AI

### **Layer 2: Model Training & Fine-Tuning**
- **What:** Platforms for training/fine-tuning custom models
- **Policy Concerns:** Training data governance, model versioning, experiment tracking, reproducibility
- **Example Tools:** AWS SageMaker, Azure ML, Databricks, Google AI Platform, Hugging Face, Weights & Biases

### **Layer 3: AI Agents (Reasoning Layer)**
- **What:** Single-purpose AI agents performing reasoning tasks
- **Policy Concerns:** Decision transparency, prompt injection risks, output validation, hallucination handling
- **Example Tools:** LangChain, LlamaIndex, Haystack, custom frameworks, AutoGPT

### **Layer 4: Multi-Agent Communication**
- **What:** Orchestration systems coordinating multiple agents
- **Policy Concerns:** Agent interaction logs, decision chains, accountability across agents, failure handling
- **Example Tools:** CrewAI, AutoGen, Semantic Kernel, LangGraph, custom orchestration

### **Layer 5: Autonomous Agents**
- **What:** Self-directed systems making decisions without human oversight
- **Policy Concerns:** Human-in-the-loop requirements, kill switches, audit trails, accountability frameworks
- **Example Tools:** Fully autonomous systems, AI-powered RPA, self-learning agents

### **Inventory Data Model (Tiered)**

**Required Fields (Fast MVP):**
- Layer (dropdown: 1-5)
- Tool Name (text: "OpenAI GPT-4")
- Vendor (text: "OpenAI")

**Optional Fields (Power Users):**
- Use Case (text: "Customer support chatbot")
- Risk Level (dropdown: Critical/High/Medium/Low)
- Data Sensitivity (dropdown: PII/Financial/Health/Public)
- Deployment (dropdown: Cloud/On-Prem/Hybrid)
- Users/Departments (text: "Marketing, Sales")

**Data Collection Strategy:**
- **Phase 2 MVP:** Manual inventory form
- **Phase 3+:** Auto-discovery via cloud account integrations (AWS/Azure/GCP), code repo scanning

---

## 6. Feature Specifications

### **Phase 1: Policy Generation (Week 1-2)**

Same as PRD v1.0 — no changes.

**Features:**
1. Interactive questionnaire (sector, jurisdiction, org size, risk profile)
2. AI-powered policy generation (GPT-4.5 + Exa.dev for regulation data)
3. Three-artifact output (Policy + Checklist + Roadmap)
4. Export to Word/PDF/Markdown
5. Open-source on GitHub

**Tech Stack:**
- Frontend: Next.js 15 + Shadcn UI + Tailwind
- Backend: Convex (serverless DB)
- AI: OpenAI GPT-4.5 via Vercel AI SDK
- Data: Exa.dev API (regulation search)

---

### **Phase 2: Stack Enforcement (Month 2-3)** ✨ *NEW*

#### **Feature 2.1: AI Stack Inventory**

**User Flow:**
1. User navigates to "Enforce on Stack" tab
2. Clicks "Add Tool" → Form appears
3. Fills required fields: Layer, Tool Name, Vendor
4. (Optional) Adds: Use Case, Risk Level, Data Sensitivity, Deployment
5. Saves tool → Added to inventory table

**UI Components:**
- Inventory table (sortable by layer, risk level, compliance status)
- Add/Edit/Delete tool modals
- Bulk import (CSV upload for large orgs)

#### **Feature 2.2: Policy Requirement Parsing**

**Backend Logic:**
1. Parse generated policy document (Phase 1 output)
2. Extract compliance requirements using GPT-4.5:
   - "All foundation models must support data residency in AU"
   - "Training data must be documented and versioned"
   - "High-risk AI systems require human-in-the-loop approval"
3. Store requirements as structured data (requirement text, policy section, criticality)

**Example Output:**
```json
{
  "requirements": [
    {
      "id": "req-1",
      "text": "All foundation models must support data residency in AU",
      "policySection": "3.2",
      "criticality": "critical",
      "applicableLayers": [1]
    }
  ]
}
```

#### **Feature 2.3: Tool-to-Policy Matching**

**Backend Logic:**
1. For each tool in inventory, fetch vendor compliance data:
   - Use Exa.dev API to search vendor compliance pages, documentation
   - Use scrape.do for Terms of Service, security whitepapers (when needed)
   - Cache vendor data to avoid repeated fetching
2. Use GPT-4.5 to analyze: "Does [Tool] meet [Requirement]?"
3. Return verdict: Compliant (Green) / Warning (Yellow) / Violation (Red)

**Example:**
- Tool: OpenAI GPT-4
- Requirement: "Must support data residency in AU"
- Analysis: Fetch OpenAI docs → "GPT-4 supports US and EU regions only"
- Verdict: Red (Violation)

#### **Feature 2.4: Compliance Dashboard**

**Overview Page:**
- Overall compliance score: "73% compliant (22 tools assessed)"
- Breakdown by layer: Layer 1 (80%), Layer 2 (65%), Layer 3 (70%)...
- Critical gaps count: "5 critical violations require immediate action"
- Visual: Donut chart (Red/Yellow/Green proportions)

**Drill-Down View (Per Tool):**
- Tool card: Name, Vendor, Layer, Risk Level
- Status badges: Red (violations count), Yellow (warnings count), Green (compliant)
- Violation details:
  - Policy section violated
  - Why it's a violation
  - Remediation suggestion (actionable next step)

**Example Card:**
```
OpenAI GPT-4
Foundation Model | High Risk

Status: 🔴 2 violations | ⚠️ 1 warning

Violations:
❌ Data Residency (Policy §3.2)
   Problem: No AU region support (only US/EU)
   Fix: Switch to Azure OpenAI with AU region enabled

❌ Vendor Liability (Policy §7.1)
   Problem: Standard ToS lacks algorithmic bias clause
   Fix: Negotiate enterprise agreement with liability terms

Warnings:
⚠️ Output Monitoring (Policy §5.3)
   Problem: No automated output validation
   Fix: Implement content filtering layer
```

#### **Feature 2.5: Gap Analysis Export**

**Formats:**
- PDF Audit Report (for regulators, executives)
- CSV (for tracking in Excel)
- JSON (for API integrations)

**Report Contents:**
- Executive Summary (compliance score, critical gaps count)
- Tool Inventory (all tools with status)
- Violation Details (per tool, with remediation steps)
- Remediation Roadmap (prioritized by criticality)

---

### **Phase 3: Continuous Monitoring (Month 4-6)** ✨ *NEW*

#### **Feature 3.1: Framework Change Monitoring**

**Data Sources:**
- EU AI Act updates (Official Journal of the EU, RSS feeds)
- NIST AI RMF revisions (NIST website, RSS)
- ISO standards (ISO.org, paid feeds)
- GDPR amendments (EUR-Lex)
- Sector-specific: APRA, ASIC, FDA, etc.

**Collection Method:**
- RSS feeds (where available)
- Exa.dev semantic search (check for updates weekly)
- scrape.do (for sites without feeds)

**Processing:**
1. Fetch new framework updates daily
2. GPT-4.5 analyzes: "Does this update affect any requirement in user's policy?"
3. If yes → Generate alert with impact summary

**Example Alert:**
```
🚨 Framework Update: EU AI Act

Amendment: Annex III updated (high-risk AI systems definition)

Impact: Your customer credit scoring model (Layer 3, High Risk)
now falls under stricter requirements.

New Requirements:
- Mandatory conformity assessment before deployment
- Enhanced human oversight requirements
- Quarterly bias audits

Action: Review policy §5.2 and update compliance checklist.
```

#### **Feature 3.2: Vendor Change Monitoring**

**Data Sources:**
- Vendor APIs (OpenAI, Anthropic, AWS changelogs where available)
- GitHub releases (for open-source tools: Llama, Mistral, LangChain)
- Vendor blogs, security bulletins (via scrape.do)

**Collection Method:**
- Poll vendor APIs daily (OpenAI: https://api.openai.com/v1/updates, etc.)
- GitHub webhook subscriptions (for repos user's tools depend on)
- scrape.do for vendor pages without APIs

**Processing:**
1. Fetch vendor updates daily
2. GPT-4.5 filters: "Is this update material for compliance?"
   - Material: Security patches, ToS changes, data residency updates, feature deprecations
   - Not material: UI changes, pricing updates, marketing announcements
3. If material → Check if user's stack uses this tool
4. If yes → Run re-assessment for that tool

**Example Alert:**
```
✅ Vendor Update: OpenAI

Release: GPT-4.5 with AU region support (2026-02-15)

Impact: Resolves your data residency violation (Policy §3.2)

Previously: GPT-4 (US/EU only) → Red violation
Now: GPT-4.5 (AU region available) → Green compliant

Action: Upgrade to GPT-4.5 and configure AU region.
Estimated compliance score improvement: +8%
```

#### **Feature 3.3: Organization Change Tracking**

**Phase 2 (Manual):**
- User adds/removes tools in inventory → Auto-triggers re-assessment

**Phase 3+ (Auto-Discovery):**
- Integrate with cloud accounts (AWS/Azure/GCP)
  - Detect new AI services (SageMaker endpoints, Azure OpenAI deployments)
  - Alert: "New tool detected: AWS Bedrock - needs compliance assessment"
- Code repo scanning (GitHub integration)
  - Detect new AI agent deployments, LangChain usage, model imports
  - Alert: "New AI agent detected in production - add to inventory"

#### **Feature 3.4: Automated Re-Assessment**

**Trigger Events:**
- Framework update affects policy requirements
- Vendor update affects tool in user's stack
- User adds/removes tool from inventory

**Process:**
1. Identify affected tools
2. Re-run tool-to-policy matching (Feature 2.3)
3. Update compliance dashboard
4. If score drops → Alert user
5. Track drift: "Compliance score: 73% → 68% (this month)"

#### **Feature 3.5: Alert Management**

**Alert Channels:**
- In-app notifications (bell icon, notification center)
- Email (configurable frequency: real-time, daily digest, weekly summary)
- Slack integration (post to dedicated channel)

**Alert Types:**
- 🚨 Critical (framework update, new violation detected)
- ⚠️ Warning (vendor update may affect compliance, manual review needed)
- ✅ Resolved (violation fixed, compliance improved)

**Alert Settings:**
- User configures per alert type: Email on/off, Slack on/off
- Frequency: Real-time, Daily digest (9am), Weekly summary (Monday 9am)
- Filter by criticality: Only critical, All alerts

#### **Feature 3.6: Monitoring Dashboard**

**New Tab: "Monitor Changes"**

**Widgets:**
1. **Recent Alerts** (last 7 days)
   - 3 framework updates
   - 5 vendor updates
   - 1 new tool added
   
2. **Compliance Drift Chart** (line graph, last 90 days)
   - X-axis: Date
   - Y-axis: Compliance score (%)
   - Shows score fluctuations over time
   
3. **Upcoming Framework Changes** (next 30 days)
   - EU AI Act: Final implementation deadline (Feb 2027)
   - NIST AI RMF 2.0: Public comment period ends
   
4. **Monitoring Status**
   - ✅ 12 frameworks monitored
   - ✅ 8 vendors monitored
   - ✅ Auto-discovery: Enabled (AWS, Azure)

**Weekly Summary Report (Email):**
```
Week of Feb 1-7, 2026

Compliance Score: 73% (↓ 5% from last week)

Activity:
- Framework updates: 2
- Vendor updates affecting your stack: 5
- New tools added: 1
- New violations: 1
- Resolved violations: 3

Top Priority:
🚨 EU AI Act Amendment affects customer scoring model
Action required by: Feb 15, 2026
```

---

## 7. Technical Architecture

### **System Components**

```
Frontend (Next.js 15)
  ├── Policy Generation UI (Phase 1)
  ├── Stack Inventory UI (Phase 2)
  ├── Compliance Dashboard (Phase 2)
  └── Monitoring Dashboard (Phase 3)

Backend (Convex)
  ├── Policy Storage
  ├── Stack Inventory Storage
  ├── Assessments Storage
  ├── Monitoring Data (change events, alerts)
  └── Scheduled Functions (cron jobs for monitoring)

AI Layer (GPT-4.5 via Vercel AI SDK)
  ├── Policy Generation
  ├── Requirement Parsing
  ├── Tool-to-Policy Matching
  ├── Change Filtering
  └── Remediation Suggestions

Data Sources
  ├── Exa.dev API (regulation search, semantic web data)
  ├── scrape.do (vendor changelogs, ToS, compliance pages)
  ├── Vendor APIs (OpenAI, Anthropic, AWS)
  └── RSS Feeds (framework updates)
```

### **Data Model**

```typescript
// Phase 1: Policy
type Policy = {
  id: string;
  organizationId: string;
  sector: string;
  jurisdiction: string;
  policyDocument: string; // markdown
  complianceChecklist: string; // markdown
  implementationRoadmap: string; // markdown
  createdAt: number;
};

// Phase 2: AI Stack
type Tool = {
  id: string;
  organizationId: string;
  layer: 1 | 2 | 3 | 4 | 5;
  name: string;
  vendor: string;
  useCase?: string;
  riskLevel?: "critical" | "high" | "medium" | "low";
  dataSensitivity?: "pii" | "financial" | "health" | "public";
  deployment?: "cloud" | "on-prem" | "hybrid";
  departments?: string;
};

type Requirement = {
  id: string;
  policyId: string;
  text: string;
  policySection: string;
  criticality: "critical" | "high" | "medium" | "low";
  applicableLayers: number[];
};

type Assessment = {
  id: string;
  toolId: string;
  requirementId: string;
  status: "compliant" | "warning" | "violation";
  reasoning: string; // AI explanation
  remediation: string; // suggested fix
  assessedAt: number;
};

// Phase 3: Monitoring
type ChangeEvent = {
  id: string;
  type: "framework" | "vendor" | "organization";
  source: string; // "EU AI Act", "OpenAI", "AWS", etc.
  description: string;
  impactedToolIds: string[];
  impactedRequirementIds: string[];
  isMaterial: boolean;
  detectedAt: number;
};

type Alert = {
  id: string;
  organizationId: string;
  changeEventId: string;
  criticality: "critical" | "warning" | "resolved";
  message: string;
  actionable: string; // what user should do
  sentAt: number;
  readAt?: number;
};

type ComplianceHistory = {
  organizationId: string;
  date: number;
  score: number; // 0-100
  toolCount: number;
  violationCount: number;
  warningCount: number;
};
```

### **Tech Stack**

**Frontend:**
- Next.js 15 (App Router)
- Shadcn UI (component library)
- Tailwind CSS (styling)
- Recharts (dashboard charts)

**Backend:**
- Convex (serverless DB + real-time sync + scheduled functions)
- Vercel (hosting)

**AI:**
- OpenAI GPT-4.5 (via Vercel AI SDK)
  - Streaming responses
  - Function calling for data fetching
  
**Data Sources:**
- Exa.dev API (primary for regulation search + semantic web scraping)
- scrape.do (residential proxy for vendor changelog scraping)
- Vendor APIs (OpenAI, Anthropic, AWS where available)
- RSS feeds (framework updates)

**Monitoring Infrastructure:**
- Convex scheduled functions (cron jobs for daily monitoring)
- Email: SendGrid or Resend
- Slack: Slack API for notifications

**Future Integrations:**
- AWS/Azure/GCP SDKs (auto-discovery)
- GitHub API (code repo scanning)

---

## 8. Revenue Model

### **Phase 1: Policy Generation**
- **Free Tier:** Open-source MVP on GitHub (unlimited use)
- **Consulting:** $50-100K/engagement for enterprise customization
- **Target Year 1:** $50-100K ARR (3-5 consulting clients)

### **Phase 2: Stack Enforcement**
- **Starter:** $99/mo (up to 10 tools)
- **Professional:** $299/mo (up to 50 tools)
- **Enterprise:** $499/mo (unlimited tools + priority support)
- **Target Month 6:** 20+ customers, $50K MRR ($600K ARR)

### **Phase 3: Continuous Monitoring**
- **Monitoring Add-On:** $200-500/mo (on top of enforcement tier)
- **Enterprise Monitoring:** $2K/mo (dedicated monitoring, custom frameworks, API access)
- **Target Month 12:** 50+ monitoring subscribers, $100K MRR ($1.2M ARR)

### **Total ARR Projection (End of Year 1)**
- Phase 1 Consulting: $50-100K
- Phase 2 SaaS: $600K
- Phase 3 Monitoring: $1.2M
- **Total: ~$2M ARR**

---

## 9. Success Metrics

### **Phase 1 (Week 1-2)**
- ✅ 50+ GitHub stars
- ✅ 500+ website visitors
- ✅ 3-5 pilot customers signed (consulting pipeline)
- ✅ <15 seconds policy generation time
- ✅ 90%+ policy accuracy (validated by compliance experts)

### **Phase 2 (Month 2-3)**
- ✅ 20+ paying SaaS customers
- ✅ 80%+ average compliance score across customers
- ✅ $50K MRR
- ✅ <30 seconds stack assessment time (for 50 tools)
- ✅ 85%+ remediation suggestion accuracy

### **Phase 3 (Month 4-6)**
- ✅ 50+ monitoring subscribers
- ✅ <24hr alert delivery time (from change detected → user notified)
- ✅ $100K MRR
- ✅ 90%+ precision on material change filtering (AI doesn't spam false alerts)
- ✅ 10+ framework integrations (EU AI Act, NIST, ISO, GDPR, APRA, ASIC, etc.)

---

## 10. Implementation Timeline

### **Phase 1: Policy Generation** (Week 1-2)
- Same as PRD v1.0
- Days 1-7: MVP development (see IMPLEMENTATION_PLAN.md from v1.0)
- Week 2: GitHub launch, pilot customer outreach

### **Phase 2: Stack Enforcement** (Month 2-3)
- **Week 1-2:** Data model + inventory UI
  - Convex schema for tools, requirements, assessments
  - Stack inventory form (add/edit/delete tools)
  - Bulk CSV import
  
- **Week 3-4:** Enforcement engine
  - Policy requirement parsing (GPT-4.5)
  - Tool-to-policy matching (Exa.dev + scrape.do integration)
  - Assessment storage + caching
  
- **Week 5-6:** Compliance dashboard
  - Overview page (score, breakdown, critical gaps)
  - Drill-down views (per tool, per layer)
  - Export to PDF/CSV/JSON
  
- **Week 7-8:** Testing + SaaS launch
  - Integration tests (end-to-end assessment flows)
  - Billing integration (Stripe)
  - Soft launch to pilot customers

### **Phase 3: Continuous Monitoring** (Month 4-6)
- **Week 1-2:** Framework monitoring
  - Exa.dev integration for regulation search
  - RSS feed parser
  - GPT-4.5 impact analysis
  
- **Week 3-4:** Vendor monitoring
  - Vendor API integrations (OpenAI, Anthropic, AWS)
  - scrape.do integration for changelog scraping
  - Material change filtering (GPT-4.5)
  
- **Week 5-6:** Alert system
  - Convex scheduled functions (daily monitoring)
  - Email integration (SendGrid)
  - Slack integration
  - Alert management UI
  
- **Week 7-8:** Monitoring dashboard
  - Recent alerts widget
  - Compliance drift chart
  - Upcoming framework changes
  - Weekly summary reports
  
- **Week 9-10:** Auto-discovery (optional, can push to Phase 4)
  - AWS/Azure/GCP integrations
  - Code repo scanning (GitHub)
  
- **Week 11-12:** Testing + premium tier launch
  - End-to-end monitoring flows
  - Premium tier billing
  - Launch to existing Phase 2 customers

---

## 11. Risks & Mitigation

### **Risk 1: AI Accuracy (All Phases)**
- **Risk:** GPT-4.5 generates incorrect policy clauses or misassesses vendor compliance
- **Impact:** Users trust bad policies, miss violations, violate regulations
- **Mitigation:**
  - Human review layer for Phase 1 (consulting validates policies)
  - Confidence scores for assessments ("90% confident this is a violation")
  - Feedback loop: Users can correct AI, improve prompts over time
  - Expert review: Hire compliance consultant to validate AI outputs

### **Risk 2: Vendor Data Availability (Phase 2-3)**
- **Risk:** Vendor compliance data is incomplete, outdated, or behind paywalls
- **Impact:** Can't assess tools accurately, monitoring misses critical updates
- **Mitigation:**
  - Manual fallback: Allow users to override AI with manual compliance data
  - Community contributions: Crowdsource vendor compliance info
  - Partnerships: Negotiate with vendors for official compliance APIs

### **Risk 3: Regulation Complexity (Phase 3)**
- **Risk:** Framework updates are ambiguous, require legal interpretation
- **Impact:** AI can't determine impact accurately, alerts are too vague
- **Mitigation:**
  - Conservative approach: When uncertain, flag for manual review
  - Expert partnerships: Work with law firms for regulation interpretations
  - Community: Build knowledge base of regulation interpretations

### **Risk 4: Monitoring Noise (Phase 3)**
- **Risk:** Too many alerts, users ignore them (alert fatigue)
- **Impact:** Users disable monitoring, miss critical updates
- **Mitigation:**
  - AI filtering (already in design): Only surface material changes
  - Configurable thresholds: Users set alert sensitivity
  - Smart batching: Group related alerts into single notification
  - Weekly summaries: Daily noise → weekly digest

### **Risk 5: Competitive Response**
- **Risk:** Big players (ServiceNow, Deloitte, PwC) build similar tools
- **Impact:** Lose market share, pricing pressure
- **Mitigation:**
  - Speed: Ship Phase 1 in 2 weeks (first-mover advantage)
  - Open-source: Build community moat (GitHub stars, contributors)
  - Differentiation: Focus on AI stack specificity (5-layer model), not generic compliance

---

## 12. Go-to-Market Strategy

### **Phase 1 Launch (Week 1-2)**
- **Channel:** Product Hunt, Hacker News, Reddit (r/MachineLearning, r/compliance)
- **Message:** "Generate audit-ready AI governance policies in 5 minutes (open-source)"
- **Goal:** 50+ GitHub stars, 500+ visitors, build pilot customer pipeline

### **Phase 2 Launch (Month 2-3)**
- **Channel:** Email pilot customers, LinkedIn (Dhrub's network), compliance forums
- **Message:** "Now enforce your policy across your AI stack"
- **Offer:** Early adopter pricing ($99/mo → $49/mo for first 3 months)
- **Goal:** Convert 5-10 pilot customers to paid SaaS

### **Phase 3 Launch (Month 4-6)**
- **Channel:** Webinar (invite Phase 2 customers), compliance conferences, enterprise outreach
- **Message:** "Stay compliant automatically as regulations and vendors evolve"
- **Offer:** Free monitoring trial (1 month) for existing Phase 2 customers
- **Goal:** 50%+ attach rate (Phase 2 customers upgrade to Phase 3)

### **Content Strategy**
- **Build in Public:** Twitter/LinkedIn posts (weekly progress updates)
- **Thought Leadership:** Blog posts on AI governance trends (EU AI Act, vendor accountability)
- **Case Studies:** How pilot customers use the platform (with permission)

---

## 13. Open Questions

1. **Auto-Discovery Scope (Phase 3):** Which cloud platforms to integrate first? (AWS, Azure, GCP)
2. **Regulation Coverage:** Which frameworks beyond EU AI Act, NIST, ISO? (FDA for healthcare, FCA for finance?)
3. **Pricing Granularity:** Should we charge by tool count, or by layer criticality? (10 Layer 5 tools = 50 Layer 1 tools?)
4. **White-Label Option:** Should enterprise customers be able to white-label the platform?
5. **API Access:** Should we offer API for programmatic access? (For customers who want to integrate with their own tools)

---

## 14. Appendix: Comparison to v1.0

### **What's New in v2.0:**
- ✨ **Phase 2: Stack Enforcement** (entire section)
- ✨ **Phase 3: Continuous Monitoring** (entire section)
- ✨ **5-Layer AI Stack Model** (detailed taxonomy)
- ✨ **Expanded Revenue Model** ($99/mo SaaS → $2K/mo enterprise)
- ✨ **3-Phase Implementation Timeline** (Week 1-2 → Month 12)
- ✨ **New Personas Pain Points** (Phase 2-3 problems)
- ✨ **Technical Architecture Updates** (Exa.dev, scrape.do, monitoring infrastructure)

### **What Stayed the Same:**
- Phase 1 feature specs (policy generation logic unchanged)
- Target users (same 3 personas)
- Tech stack foundation (Next.js, Convex, GPT-4.5)
- Go-to-market approach (open-source → SaaS)

---

**Version History:**
- **v1.0 (2026-01-28):** Policy Generator only
- **v2.0 (2026-02-01):** Full lifecycle platform (Generate + Enforce + Monitor)

**Next Steps:**
1. Review this PRD with team
2. Update ARCHITECTURE.md with Phase 2-3 specs
3. Create new IMPLEMENTATION_PLAN.md (phased timeline)
4. Validate with pilot customers (show Phase 2-3 vision, get feedback)

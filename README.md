# Mandate

> Generate AI governance policies in 30 minutes, tailored to Australian regulations.

An open-source AI-powered tool that creates enterprise-grade AI governance policies for Australian organizations in ASIC, APRA, and Privacy Act compliance.

## ✨ Features

- **Regulation-Grounded**: Policies reference specific regulatory clauses from ASIC, APRA, and Privacy Act 1988
- **Sector-Specific**: Tailored for Finance and Public Sector with unique requirements
- **Jurisdiction-Aware**: Support for Federal and all Australian state jurisdictions
- **Multiple Exports**: Download as PDF, DOCX, or Markdown
- **Free & Open-Source**: No paywalls, full source code available
- **Fast**: Generate policies in 30 minutes instead of 6 months

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/dhrub-git/mandate.git
cd mandate
npm install
npm run dev
```

Visit `http://localhost:3000` to start generating policies.

## 🏗️ Architecture

Mandate uses a modern three-layer architecture:

1. **Frontend** (Next.js 14, React, Tailwind CSS)
   - Interactive questionnaire
   - Policy preview & export
   - Beautiful, accessible UI

2. **Generation Engine** (OpenAI GPT-4, Context7)
   - AI-powered policy generation
   - Regulation-grounded prompts (Context7 RAG)
   - Validation engine for compliance

3. **Backend** (Convex)
   - Real-time data sync
   - Type-safe API
   - Serverless scaling

See [ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) for detailed technical design.

## 📋 How It Works

1. **Answer Questionnaire** (15 minutes)
   - Organization context (sector, size, jurisdiction)
   - AI use cases (chatbots, analytics, automation, etc.)
   - Governance maturity and risk appetite

2. **AI Generates Policy** (30-60 seconds)
   - GPT-4 processes your answers
   - Context7 retrieves relevant regulations
   - Validation engine ensures completeness

3. **Download & Deploy** (instant)
   - Export as PDF, DOCX, or Markdown
   - Ready for audit, board review, or deployment
   - Fully editable in Word

## 💡 Use Cases

- **Compliance Officers**: Pass audits without hiring consultants
- **CIOs**: Deploy AI responsibly with proper governance frameworks
- **AI Governance Leads**: Build governance programs 10x faster
- **Legal Teams**: Get compliant policies before board reviews
- **Startups**: Establish governance before scaling AI systems

## 📚 Documentation

- [Getting Started Guide](./docs/getting-started.md)
- [Regulations Explained](./docs/regulations.md)
- [Architecture Overview](./docs/architecture/ARCHITECTURE.md)
- [Product Requirements](./docs/architecture/PRD.md)
- [Implementation Plan](./docs/architecture/IMPLEMENTATION_PLAN.md)

## 🔧 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form state management

### Backend
- **Convex** - Backend-as-a-Service with real-time sync
- **OpenAI GPT-4** - Policy generation
- **Context7** - Regulatory knowledge base & RAG

### Infrastructure
- **Vercel** - Edge hosting and deployment
- **GitHub Actions** - CI/CD pipeline
- **Sentry** - Error tracking
- **PostHog** - Analytics

## 📊 Success Metrics (MVP)

- 500 policies generated in first month
- 50 GitHub stars
- 5 enterprise leads
- NPS >50

## 🗓️ Roadmap

### Phase 1: MVP (Week 1-2) ✅
- Landing page
- Interactive questionnaire
- Policy generation
- Export (PDF, DOCX, Markdown)

### Phase 2: Freemium SaaS (Month 2-3)
- User authentication
- Policy history & versioning
- Custom branding
- Pro plan ($49/month)

### Phase 3: Enterprise (Month 4-6)
- Collaborative editing
- Compliance mapping
- API access
- Regulatory update alerts

### Phase 4: International (Month 7-12)
- UK (FCA regulations)
- EU (GDPR, AI Act)
- Singapore (MAS guidelines)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

### Code Style

- Use TypeScript for all new code
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Format with Prettier (auto-run on commit)
- Write meaningful commit messages

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details

## 🙋 Support

- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For questions and ideas
- **Email** - contact@mandate.sh

## 👥 Team

- **Dhrub** - Founder, Core Development

## 🎯 Vision

By 2027, Mandate will be the default AI governance platform for Australian enterprises, helping 10,000+ organizations implement responsible AI.

---

**Made with ❤️ for Australian enterprises.**

[Visit Website](https://mandate.sh) • [GitHub](https://github.com/dhrub-git/mandate) • [Docs](./docs)

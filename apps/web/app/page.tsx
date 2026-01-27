'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ArrowRight, Github, Check } from 'lucide-react'

export default function Home() {
  const premiumEase = [0.22, 1, 0.36, 1]

  return (
    <main className="min-h-screen bg-cream">
      {/* Navigation - Mix Blend Difference */}
      <nav className="fixed w-full top-0 z-50 mix-blend-difference">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-xl font-serif italic text-white">
            mandate.sh
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#work"
              className="font-mono text-xs uppercase tracking-[0.3em] text-white underline-grow"
            >
              Work
            </a>
            <a
              href="#capabilities"
              className="font-mono text-xs uppercase tracking-[0.3em] text-white underline-grow"
            >
              Capabilities
            </a>
            <a
              href="https://github.com/dhrub-git/mandate"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.3em] text-white underline-grow"
            >
              GitHub
            </a>
          </div>
          <Link href="/generate">
            <Button variant="secondary" className="rounded-full font-mono text-xs uppercase tracking-[0.2em] gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full status-online" />
              System Online
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Mesh Gradient */}
        <div className="mesh-gradient" />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: premiumEase }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        >
          <Badge variant="outline" className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-primary border-primary/30 bg-white/50 backdrop-blur-sm">
            AI Governance for Australian Enterprises
          </Badge>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.85] text-charcoal mb-8">
            Generate Your <br />
            <span className="italic">Policy</span> in Minutes
          </h1>
          <p className="font-sans text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tailored to ASIC, APRA, and Privacy Act. 
            <span className="block mt-2">Free and open-source.</span>
          </p>
        </motion.div>

        {/* CTA Button - positioned above the wave */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: premiumEase }}
          className="absolute bottom-[20vh] left-1/2 -translate-x-1/2 z-20"
        >
          <Link href="/generate">
            <Button size="lg" className="rounded-full font-mono text-sm uppercase tracking-[0.2em] px-8 py-6 h-auto btn-pulse shadow-lg">
              Initialize
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Wave Container */}
        <div className="wave-container">
          <div className="wave-curve" />
        </div>
      </section>

      {/* How It Works / Work Grid */}
      <section id="work" className="py-32 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: premiumEase }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Badge variant="outline" className="mb-4 font-mono text-xs uppercase tracking-[0.3em]">
              How It Works
            </Badge>
            <h2 className="font-serif text-5xl md:text-7xl leading-tight">
              Three Steps to <span className="italic">Compliance</span>
            </h2>
          </motion.div>

          {/* Staggered Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                step: "01",
                title: "Answer Questionnaire",
                desc: "Tell us about your organization, sector, and regulations in 15 minutes",
                color: "bg-indigo-100"
              },
              {
                step: "02",
                title: "AI Generates Policy",
                desc: "GPT-4 creates a tailored policy grounded in real Australian regulations",
                color: "bg-purple-100",
                offset: true
              },
              {
                step: "03",
                title: "Download & Deploy",
                desc: "Export as PDF, DOCX, or Markdown and use immediately",
                color: "bg-indigo-50"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: i * 0.15, ease: premiumEase }}
                viewport={{ once: true }}
                className={`card-intelligent ${item.offset ? 'md:mt-16' : ''}`}
              >
                <div className={`relative aspect-[4/3] ${item.color} rounded-2xl overflow-hidden`}>
                  {/* Blurred orb */}
                  <div className="card-bg absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                  </div>
                  {/* Step number */}
                  <Badge variant="secondary" className="absolute top-6 left-6 font-mono text-xs uppercase tracking-[0.2em]">
                    [{item.step}]
                  </Badge>
                  {/* Action Pill */}
                  <div className="action-pill absolute bottom-6 right-6">
                    <Button variant="secondary" size="sm" className="rounded-full font-mono text-xs uppercase tracking-[0.15em]">
                      View
                    </Button>
                  </div>
                </div>
                {/* Metadata */}
                <div className="mt-6">
                  <h3 className="font-serif text-2xl text-charcoal mb-2">{item.title}</h3>
                  <div className="h-px bg-border w-full mb-3" />
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Accordion / Capabilities */}
      <section id="capabilities" className="py-32 px-6 bg-cream border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Left - Sticky Header */}
            <div className="md:sticky md:top-32 md:self-start">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: premiumEase }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="mb-4 font-mono text-xs uppercase tracking-[0.3em]">
                  Core Capabilities
                </Badge>
                <h2 className="font-serif text-5xl md:text-6xl leading-tight mb-8">
                  Why <span className="italic">Mandate</span>
                </h2>
                <Link href="/generate">
                  <Button variant="link" className="font-mono text-sm uppercase tracking-[0.2em] text-primary p-0 h-auto">
                    Start Generating
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right - Accordion Items */}
            <div>
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    title: "Regulation-Grounded",
                    desc: "Policies reference specific ASIC, APRA, and Privacy Act clauses with precise regulatory mapping.",
                    tags: ["ASIC", "APRA", "Privacy Act"]
                  },
                  {
                    title: "Sector-Specific",
                    desc: "Tailored frameworks for Finance and Public Sector with unique compliance requirements.",
                    tags: ["Finance", "Public Sector"]
                  },
                  {
                    title: "Jurisdiction-Aware",
                    desc: "Federal, NSW, VIC, QLD, and other Australian jurisdictions fully supported.",
                    tags: ["Federal", "State", "Territory"]
                  },
                  {
                    title: "Export-Ready",
                    desc: "Download as PDF, DOCX, or Markdown for immediate deployment in your organization.",
                    tags: ["PDF", "DOCX", "Markdown"]
                  }
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
                    <AccordionTrigger className="font-serif text-2xl md:text-3xl text-left py-6 hover:no-underline hover:text-primary transition-colors">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="font-sans text-muted-foreground leading-relaxed mb-4">
                        {item.desc}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {item.tags.map((tag, j) => (
                          <Badge key={j} variant="outline" className="font-mono text-xs uppercase tracking-[0.15em]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: premiumEase }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-serif text-5xl md:text-7xl leading-tight mb-8">
            Ready to Build Your <br />
            <span className="italic">Governance Framework</span>?
          </h2>
          <p className="font-sans text-xl text-muted-foreground mb-12 leading-relaxed">
            Stop wasting 6 months and $50k on consulting. Get your policy in 30 minutes.
          </p>
          <Link href="/generate">
            <Button size="lg" className="rounded-full font-mono text-sm uppercase tracking-[0.2em] px-10 py-6 h-auto btn-pulse">
              Start Generating Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative bg-charcoal text-white rounded-t-[3rem] overflow-hidden">
        {/* Footer Glow */}
        <div className="absolute inset-0 footer-glow pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
          {/* Large Quote */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: premiumEase }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <blockquote className="font-serif text-4xl md:text-6xl leading-tight italic text-white/90">
              "Governance is not about <br />
              slowing innovation—it's about <br />
              <span className="text-white">sustaining it.</span>"
            </blockquote>
          </motion.div>

          {/* Footer Grid */}
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
                Location
              </h4>
              <p className="font-sans text-white/80">
                Sydney, Australia<br />
                UTC+11
              </p>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
                Contact
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:hello@mandate.sh" className="font-sans text-white/80 hover:text-white underline-grow">
                    hello@mandate.sh
                  </a>
                </li>
                <li>
                  <a href="https://github.com/dhrub-git/mandate" className="font-sans text-white/80 hover:text-white underline-grow inline-flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="font-sans text-white/80 hover:text-white underline-grow">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="font-sans text-white/80 hover:text-white underline-grow">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="font-sans text-white/80 hover:text-white underline-grow">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40 text-center">
              © 2026 Mandate. Made with precision by Dhrub.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ArrowRight, Download, FileText, Copy, Check, Loader2, CheckCircle } from 'lucide-react'

interface PolicyData {
  id: string
  executiveSummary: string
  purposeAndScope: string
  governanceStructure: string
  riskFramework: string
  dataGovernance?: string
  complianceMonitoring?: string
  incidentResponse?: string
  regulatoryMapping: Array<{
    regulation: string
    clause: string
    requirement: string
  }>
  wordCount: number
  createdAt: string
}

export default function PreviewPage({ params }: { params: { id: string } }) {
  const [policy, setPolicy] = useState<PolicyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('executive')
  const [copied, setCopied] = useState(false)
  const premiumEase = [0.22, 1, 0.36, 1]

  useEffect(() => {
    async function fetchPolicy() {
      try {
        // First check localStorage (for client-side storage during dev)
        const storedPolicy = localStorage.getItem(`policy-${params.id}`)
        if (storedPolicy) {
          setPolicy(JSON.parse(storedPolicy))
          setLoading(false)
          return
        }
        
        // Then try the API
        const response = await fetch(`/api/policy/${params.id}`)
        if (!response.ok) {
          throw new Error('Policy not found')
        }
        const data = await response.json()
        setPolicy(data.policy)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load policy')
      } finally {
        setLoading(false)
      }
    }

    fetchPolicy()
  }, [params.id])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sections = [
    { id: 'executive', title: 'Executive Summary', content: policy?.executiveSummary },
    { id: 'purpose', title: '1. Purpose & Scope', content: policy?.purposeAndScope },
    { id: 'governance', title: '2. Governance Structure', content: policy?.governanceStructure },
    { id: 'risk', title: '3. Risk Framework', content: policy?.riskFramework },
    { id: 'data', title: '4. Data Governance', content: policy?.dataGovernance },
    { id: 'compliance', title: '5. Compliance Monitoring', content: policy?.complianceMonitoring },
    { id: 'incident', title: '6. Incident Response', content: policy?.incidentResponse },
  ].filter(s => s.content)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-primary" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Loading your policy...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: premiumEase }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="font-serif text-4xl text-muted-foreground">?</span>
          </div>
          <h1 className="font-serif text-3xl text-foreground mb-4">Policy Not Found</h1>
          <p className="font-sans text-muted-foreground mb-8">{error}</p>
          <Link href="/generate">
            <Button className="rounded-full font-mono text-xs uppercase tracking-[0.15em]">
              Generate New Policy
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Badge variant="outline" className="font-mono text-xs tracking-wider">
              Policy ID: {params.id.slice(0, 8)}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: premiumEase }}
          className="mb-12"
        >
          <Badge variant="outline" className="mb-4 font-mono text-xs uppercase tracking-[0.3em]">
            Your Generated Policy
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight text-foreground mb-4">
            AI <span className="italic">Governance</span> Policy
          </h1>
          <p className="font-sans text-muted-foreground">
            Generated on {policy?.createdAt ? new Date(policy.createdAt).toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }) : 'Today'}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: premiumEase }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16"
        >
          <Button className="rounded-xl font-mono text-xs uppercase tracking-[0.1em] py-6">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="secondary" className="rounded-xl font-mono text-xs uppercase tracking-[0.1em] py-6">
            <FileText className="mr-2 h-4 w-4" />
            DOCX
          </Button>
          <Button variant="outline" className="rounded-xl font-mono text-xs uppercase tracking-[0.1em] py-6">
            <FileText className="mr-2 h-4 w-4" />
            Markdown
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="rounded-xl font-mono text-xs uppercase tracking-[0.1em] py-6"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Table of Contents - Sticky Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: premiumEase }}
            className="md:col-span-1"
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground font-normal">
                  Contents
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={() => setActiveSection(section.id)}
                        className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                          activeSection === section.id
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>

                <Separator className="my-6" />

                {/* Stats */}
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Words</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {policy?.wordCount?.toLocaleString() || '—'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sections</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {sections.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Regulations</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {policy?.regulatoryMapping?.length || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: premiumEase }}
            className="md:col-span-3"
          >
            {/* Status Banner */}
            <Card className="mb-12 border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-serif text-xl text-foreground mb-1">
                      Policy generated successfully
                    </p>
                    <p className="font-sans text-muted-foreground">
                      Your {policy?.wordCount?.toLocaleString() || 0}+ word AI governance policy is ready for review and download.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policy Sections */}
            <div className="space-y-16">
              {sections.map((section, idx) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: premiumEase }}
                  viewport={{ once: true }}
                  className="scroll-mt-28"
                  onViewportEnter={() => setActiveSection(section.id)}
                >
                  <h2 className="font-serif text-3xl text-foreground mb-6">
                    {section.title}
                  </h2>
                  <div className="h-px bg-border w-16 mb-6" />
                  <div className="font-sans text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                    {section.content}
                  </div>
                </motion.section>
              ))}

              {/* Regulatory References Section */}
              {policy?.regulatoryMapping && policy.regulatoryMapping.length > 0 && (
                <motion.section
                  id="regulatory"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: premiumEase }}
                  viewport={{ once: true }}
                  className="scroll-mt-28"
                >
                  <h2 className="font-serif text-3xl text-foreground mb-6">
                    Regulatory References
                  </h2>
                  <div className="h-px bg-border w-16 mb-8" />
                  <Card>
                    <CardContent className="pt-6 overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="pb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Regulation</th>
                            <th className="pb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Clause</th>
                            <th className="pb-4 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Requirement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {policy.regulatoryMapping.map((ref, idx) => (
                            <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                              <td className="py-4 font-sans text-foreground">{ref.regulation}</td>
                              <td className="py-4 font-mono text-sm text-primary">{ref.clause}</td>
                              <td className="py-4 font-sans text-muted-foreground">{ref.requirement}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </motion.section>
              )}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-20"
            >
              <Card className="bg-charcoal text-white border-0 overflow-hidden">
                <div className="absolute inset-0 footer-glow pointer-events-none" />
                <CardContent className="relative z-10 p-12 text-center">
                  <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
                    Need to make <span className="italic">changes</span>?
                  </h3>
                  <p className="font-sans text-white/70 mb-8 max-w-md mx-auto">
                    Generate a new policy with different parameters or refine your existing answers.
                  </p>
                  <Link href="/generate">
                    <Button variant="secondary" size="lg" className="rounded-full font-mono text-xs uppercase tracking-[0.15em]">
                      Generate New Policy
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.main>
        </div>
      </div>
    </div>
  )
}

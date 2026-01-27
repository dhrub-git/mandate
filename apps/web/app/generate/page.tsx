'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useQuestionnaireStore } from './useQuestionnaireStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

export default function GeneratePage() {
  const { currentPage, answers, error, setAnswer, nextPage, prevPage, reset, setError } = useQuestionnaireStore()
  const [loading, setLoading] = useState(false)
  const premiumEase = [0.22, 1, 0.36, 1]

  const pages = [
    {
      title: "Organization Context",
      questions: [
        {
          id: "sector",
          label: "What sector are you in?",
          type: "radio",
          options: ["Finance", "Public Sector"]
        },
        {
          id: "size",
          label: "What is your organization size?",
          type: "radio",
          options: ["1-100", "100-500", "500-2000", "2000+"]
        },
        {
          id: "jurisdiction",
          label: "Which jurisdiction applies?",
          type: "select",
          options: ["Federal", "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]
        },
        {
          id: "regulated",
          label: "Are you regulated by:",
          type: "checkbox",
          options: ["ASIC", "APRA", "OAIC", "Other"]
        }
      ]
    },
    {
      title: "AI Use Cases",
      questions: [
        {
          id: "aiSystems",
          label: "What AI systems do you use or plan to use?",
          type: "checkbox",
          options: ["Chatbots", "Predictive Analytics", "Decision Automation", "Computer Vision", "NLP", "Other"]
        },
        {
          id: "dataTypes",
          label: "What data types do you process?",
          type: "checkbox",
          options: ["Personal Info", "Financial Data", "Health Records", "Biometric Data", "Public Data"]
        },
        {
          id: "highRisk",
          label: "Do you use AI for high-risk decisions?",
          type: "radio",
          options: ["Yes", "No"]
        },
        {
          id: "customerFacing",
          label: "Do you deploy AI customer-facing?",
          type: "radio",
          options: ["Yes", "No"]
        }
      ]
    },
    {
      title: "Governance Maturity",
      questions: [
        {
          id: "existing",
          label: "Do you have an existing AI governance framework?",
          type: "radio",
          options: ["Yes", "No", "Partial"]
        },
        {
          id: "riskAppetite",
          label: "What is your risk appetite?",
          type: "radio",
          options: ["Conservative", "Moderate", "Progressive"]
        },
        {
          id: "owner",
          label: "Who will own AI governance?",
          type: "radio",
          options: ["Compliance", "IT", "Risk", "Dedicated Team"]
        },
        {
          id: "timeline",
          label: "When do you need this policy by?",
          type: "radio",
          options: ["Urgent (<1 month)", "Normal (1-3 months)", "Planning (>3 months)"]
        }
      ]
    }
  ]

  const currentQuestions = pages[currentPage]?.questions || []
  const progressValue = ((currentPage + 1) / pages.length) * 100

  const handleAnswer = (questionId: string, value: any) => {
    setAnswer(questionId, value)
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      })
      
      if (!response.ok) {
        let errorMessage = 'Policy generation failed'
        try {
          const error = await response.json()
          errorMessage = error.error || errorMessage
        } catch {
          // If response.json() fails, use default message
        }
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      
      // Save policy to localStorage for preview page
      if (data.policy) {
        localStorage.setItem(`policy-${data.policyId}`, JSON.stringify(data.policy))
      }
      
      // Clear questionnaire state on successful submission
      reset()
      
      // Redirect to preview page
      window.location.href = `/preview/${data.policyId}`
    } catch (error) {
      console.error('Generation failed:', error)
      setError(error instanceof Error ? error.message : 'Policy generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-serif italic text-foreground hover:text-primary transition-colors">
            mandate.sh
          </Link>
          <Badge variant="outline" className="font-mono text-xs uppercase tracking-[0.2em] gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full status-online" />
            System Online
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: premiumEase }}
            className="mb-12"
          >
            <Badge variant="outline" className="mb-4 font-mono text-xs uppercase tracking-[0.3em]">
              Policy Generator
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight text-foreground mb-4">
              Build Your <span className="italic">Framework</span>
            </h1>
            <p className="font-sans text-muted-foreground">
              Answer {pages.length * 4} questions to generate your tailored AI governance policy
            </p>
          </motion.div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Page {currentPage + 1} of {pages.length}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {Math.round(progressValue)}%
              </span>
            </div>
            <Progress value={progressValue} className="h-1" />
          </motion.div>

          {/* Questions */}
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEase }}
            className="space-y-6 mb-12"
          >
            <div className="mb-8">
              <h2 className="font-serif text-3xl text-foreground">
                {pages[currentPage]?.title}
              </h2>
              <div className="h-px bg-border w-24 mt-4" />
            </div>

            {currentQuestions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: premiumEase }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-xl font-normal">{q.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {q.type === 'radio' && (
                      <RadioGroup
                        value={answers[q.id] || ''}
                        onValueChange={(value) => handleAnswer(q.id, value)}
                        className="space-y-3"
                      >
                        {q.options.map(opt => (
                          <div key={opt} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                            <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                            <Label htmlFor={`${q.id}-${opt}`} className="cursor-pointer flex-1 font-sans">
                              {opt}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {q.type === 'checkbox' && (
                      <div className="space-y-3">
                        {q.options.map(opt => (
                          <div key={opt} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <Checkbox
                              id={`${q.id}-${opt}`}
                              checked={(answers[q.id] || []).includes(opt)}
                              onCheckedChange={(checked) => {
                                const current = answers[q.id] || []
                                if (checked) {
                                  handleAnswer(q.id, [...current, opt])
                                } else {
                                  handleAnswer(q.id, current.filter((v: string) => v !== opt))
                                }
                              }}
                            />
                            <Label htmlFor={`${q.id}-${opt}`} className="cursor-pointer flex-1 font-sans">
                              {opt}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.type === 'select' && (
                      <Select
                        value={answers[q.id] || ''}
                        onValueChange={(value) => handleAnswer(q.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {q.options.map(opt => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="mb-8 border-destructive bg-destructive/10">
                <CardContent className="pt-6">
                  <p className="font-sans text-destructive">
                    {error}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 justify-between">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="rounded-full font-mono text-xs uppercase tracking-[0.15em]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentPage < pages.length - 1 ? (
              <Button
                onClick={nextPage}
                className="rounded-full font-mono text-xs uppercase tracking-[0.15em]"
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-full font-mono text-xs uppercase tracking-[0.15em] btn-pulse"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Policy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

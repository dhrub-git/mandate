'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function GeneratePage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

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

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      // TODO: Call /api/generate
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      })
      
      if (response.ok) {
        // Redirect to preview page
        const data = await response.json()
        window.location.href = `/preview/${data.policyId}`
      }
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-brand-navy mb-2">Generate Your Policy</h1>
          <p className="text-gray-600">Answer {pages.length * 4} questions to get started</p>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            <span className="text-sm font-semibold text-gray-600">
              Page {currentPage + 1} of {pages.length}
            </span>
            <span className="text-sm font-semibold text-brand-green">
              {Math.round(((currentPage + 1) / pages.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
              className="h-full bg-brand-green"
            />
          </div>
        </div>

        {/* Questions */}
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-brand-navy">
            {currentQuestions[0]?.label || pages[currentPage]?.title}
          </h2>

          {currentQuestions.map((q, idx) => (
            <div key={q.id} className="p-6 bg-white rounded-xl border border-gray-200">
              <label className="block mb-4">
                <span className="text-lg font-semibold text-gray-900">{q.label}</span>
              </label>

              {q.type === 'radio' && (
                <div className="space-y-3">
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                        className="w-5 h-5 text-brand-green"
                      />
                      <span className="ml-3 text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'checkbox' && (
                <div className="space-y-3">
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition">
                      <input
                        type="checkbox"
                        value={opt}
                        checked={(answers[q.id] || []).includes(opt)}
                        onChange={(e) => {
                          const current = answers[q.id] || []
                          if (e.target.checked) {
                            handleAnswer(q.id, [...current, opt])
                          } else {
                            handleAnswer(q.id, current.filter((v: string) => v !== opt))
                          }
                        }}
                        className="w-5 h-5 text-brand-green rounded"
                      />
                      <span className="ml-3 text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'select' && (
                <select
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="">Select an option</option>
                  {q.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>

          {currentPage < pages.length - 1 ? (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-6 py-3 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-navy/90 transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-3 bg-brand-green text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Generating...' : 'Generate Policy'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

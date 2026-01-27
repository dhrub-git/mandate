'use client'

import Link from 'next/link'

export default function PreviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/" className="text-brand-green hover:underline mb-6 inline-block">
          ← Back
        </Link>
        
        <h1 className="text-4xl font-bold text-brand-navy mb-8">
          Your AI Governance Policy
        </h1>
        
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <button className="px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90">
            Download PDF
          </button>
          <button className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600">
            Download DOCX
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Download Markdown
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Copy Link
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <aside className="md:col-span-1">
            <div className="sticky top-6 bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-brand-navy mb-4">Contents</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-brand-green hover:underline">Executive Summary</a></li>
                <li><a href="#" className="text-brand-green hover:underline">1. Purpose & Scope</a></li>
                <li><a href="#" className="text-brand-green hover:underline">2. Regulatory Context</a></li>
                <li><a href="#" className="text-brand-green hover:underline">3. Governance Structure</a></li>
                <li><a href="#" className="text-brand-green hover:underline">4. Risk Management</a></li>
                <li><a href="#" className="text-brand-green hover:underline">5. Data Governance</a></li>
              </ul>
            </div>
          </aside>

          {/* Content */}
          <main className="md:col-span-3 prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-brand-green p-6 mb-8 rounded">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Status:</strong> Policy generated successfully
              </p>
              <p className="text-sm text-gray-600">
                <strong>Word Count:</strong> 10,234 words
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">Executive Summary</h2>
                <p className="text-gray-700 leading-relaxed">
                  This AI Governance Policy provides a comprehensive framework for responsible AI deployment 
                  across our organization, ensuring compliance with ASIC, APRA, and Privacy Act requirements...
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">1. Purpose & Scope</h2>
                <p className="text-gray-700 leading-relaxed">
                  The purpose of this policy is to establish governance structures, processes, and controls 
                  for AI systems used in our organization...
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">2. Regulatory Context</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This policy aligns with the following Australian regulatory requirements:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li><strong>Privacy Act 1988:</strong> Australian Privacy Principles for personal data handling</li>
                  <li><strong>ASIC:</strong> AI disclosure requirements for financial institutions</li>
                  <li><strong>APRA:</strong> Prudential standards for AI risk management</li>
                </ul>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

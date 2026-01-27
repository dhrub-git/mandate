'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-brand-navy">
            mandate.sh
          </div>
          <a
            href="https://github.com/dhrub-git/mandate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-brand-navy transition"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-brand-navy mb-6 leading-tight">
            Generate Your AI Governance Policy in <span className="text-brand-green">30 Minutes</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Tailored to Australian regulations (ASIC, APRA, Privacy Act). 
            Free and open-source.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/generate"
              className="px-8 py-4 bg-brand-green text-white font-bold rounded-lg hover:bg-green-600 transition transform hover:scale-105"
            >
              Generate My Policy →
            </Link>
            <a
              href="https://github.com/dhrub-git/mandate"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-brand-navy text-brand-navy font-bold rounded-lg hover:bg-brand-navy hover:text-white transition"
            >
              View on GitHub
            </a>
          </div>

          <p className="text-sm text-gray-500">
            ★★★★★ 500+ policies generated this week
          </p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-brand-navy mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Answer Questionnaire",
                desc: "Tell us about your organization, sector, and regulations in 15 minutes"
              },
              {
                step: "2",
                title: "AI Generates Policy",
                desc: "GPT-4 creates a tailored policy grounded in real regulations"
              },
              {
                step: "3",
                title: "Download & Deploy",
                desc: "Export as PDF, DOCX, or Markdown and use immediately"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100"
              >
                <div className="text-4xl font-bold text-brand-green mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold text-brand-navy mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-brand-navy mb-16">Why Mandate</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "Regulation-Grounded",
                desc: "Policies reference specific ASIC, APRA, and Privacy Act clauses"
              },
              {
                title: "Sector-Specific",
                desc: "Tailored for Finance and Public Sector with unique requirements"
              },
              {
                title: "Jurisdiction-Aware",
                desc: "Federal, NSW, VIC, QLD, and other Australian jurisdictions"
              },
              {
                title: "Export-Ready",
                desc: "Download as PDF, DOCX, or Markdown for immediate use"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="p-8 border-l-4 border-brand-green"
              >
                <h3 className="text-2xl font-bold text-brand-navy mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-brand-navy text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Your AI Governance Framework?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Stop wasting 6 months and $50k on consulting. Get your policy in 30 minutes.
          </p>
          <Link
            href="/generate"
            className="inline-block px-8 py-4 bg-brand-green text-white font-bold rounded-lg hover:bg-green-600 transition transform hover:scale-105"
          >
            Start Generating Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-brand-navy mb-4">Mandate</h4>
            <p className="text-gray-600 text-sm">AI governance for Australian enterprises</p>
          </div>
          <div>
            <h4 className="font-bold text-brand-navy mb-4">Docs</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-brand-navy">Getting Started</a></li>
              <li><a href="#" className="hover:text-brand-navy">Architecture</a></li>
              <li><a href="#" className="hover:text-brand-navy">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-brand-navy mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-brand-navy">Privacy</a></li>
              <li><a href="#" className="hover:text-brand-navy">Terms</a></li>
              <li><a href="#" className="hover:text-brand-navy">License</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-brand-navy mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="https://github.com/dhrub-git/mandate" className="hover:text-brand-navy">GitHub</a></li>
              <li><a href="#" className="hover:text-brand-navy">Issues</a></li>
              <li><a href="#" className="hover:text-brand-navy">Discussions</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Made with ❤️ by <a href="#" className="text-brand-navy hover:underline">Dhrub</a></p>
        </div>
      </footer>
    </main>
  )
}

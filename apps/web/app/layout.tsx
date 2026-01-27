import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mandate - AI Governance Policy Generator',
  description: 'Generate AI governance policies tailored to Australian regulations in 30 minutes. Free and open-source.',
  keywords: ['AI governance', 'policy generator', 'ASIC', 'APRA', 'Australia'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

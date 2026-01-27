/**
 * TDD Test Suite: Landing Page
 */

import { describe, test, expect } from 'vitest'
import { render, screen } from '@/tests/utils/render'
import HomePage from '../page'

describe('HomePage - Landing Page', () => {
  test('renders hero headline', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/generate your ai governance policy/i)).toBeInTheDocument()
  })

  test('renders "Generate My Policy" CTA button', () => {
    render(<HomePage />)
    
    const ctaButton = screen.getByRole('link', { name: /generate my policy/i })
    expect(ctaButton).toBeInTheDocument()
  })

  test('links to /generate on CTA click', () => {
    render(<HomePage />)
    
    const ctaButton = screen.getByRole('link', { name: /generate my policy/i })
    expect(ctaButton).toHaveAttribute('href', '/generate')
  })

  test('renders 3 "How It Works" steps', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/answer questionnaire/i)).toBeInTheDocument()
    expect(screen.getByText(/ai generates policy/i)).toBeInTheDocument()
    expect(screen.getByText(/download & deploy/i)).toBeInTheDocument()
  })

  test('renders 4 feature cards', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/regulation-grounded/i)).toBeInTheDocument()
    expect(screen.getByText(/sector-specific/i)).toBeInTheDocument()
    expect(screen.getByText(/jurisdiction-aware/i)).toBeInTheDocument()
    expect(screen.getByText(/export-ready/i)).toBeInTheDocument()
  })

  test('includes GitHub link in nav', () => {
    render(<HomePage />)
    
    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toHaveAttribute('href', expect.stringContaining('github.com'))
  })

  test('renders value proposition subheadline', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/tailored to australian regulations/i)).toBeInTheDocument()
  })

  test('renders CTA in footer section', () => {
    render(<HomePage />)
    
    // Should have multiple CTAs including one in footer
    const ctaButtons = screen.getAllByRole('link', { name: /generate my policy|start generating/i })
    expect(ctaButtons.length).toBeGreaterThan(1)
  })
})

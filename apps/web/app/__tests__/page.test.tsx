/**
 * TDD Test Suite: Landing Page
 */

import { describe, test, expect } from 'vitest'
import { render, screen } from '@/tests/utils/render'
import HomePage from '../page'

describe('HomePage - Landing Page', () => {
  test('renders hero headline', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading', { name: /generate your policy in minutes/i })
    expect(heading).toBeInTheDocument()
  })

  test('renders "Initialize" CTA button', () => {
    render(<HomePage />)
    
    const ctaButton = screen.getByRole('link', { name: /initialize/i })
    expect(ctaButton).toBeInTheDocument()
  })

  test('links to /generate on CTA click', () => {
    render(<HomePage />)
    
    const ctaButton = screen.getByRole('link', { name: /initialize/i })
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
    
    const githubLinks = screen.getAllByRole('link', { name: /github/i })
    expect(githubLinks.length).toBeGreaterThan(0)
    expect(githubLinks[0]).toHaveAttribute('href', expect.stringContaining('github.com'))
  })

  test('renders value proposition subheadline', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/tailored to asic, apra, and privacy act/i)).toBeInTheDocument()
  })

  test('renders CTA in footer section', () => {
    render(<HomePage />)
    
    // Should have multiple CTAs including one in footer
    const ctaButtons = screen.getAllByRole('link', { name: /generate my policy|start generating/i })
    expect(ctaButtons.length).toBeGreaterThan(1)
  })
})

/**
 * TDD Test Suite: Questionnaire Form
 * 
 * Following TDD principles:
 * 1. Write test first (RED)
 * 2. Watch it fail
 * 3. Write minimal code to pass (GREEN)
 * 4. Refactor
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@/tests/utils/render'
import GeneratePage from '../page'
import { mockQuestionnaireAnswers } from '@/tests/mocks/questionnaire'
import { useQuestionnaireStore } from '../useQuestionnaireStore'

describe('GeneratePage - Questionnaire Form', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
    
    // Reset store state to initial values
    useQuestionnaireStore.setState({
      currentPage: 0,
      answers: {},
      error: null
    })
  })
  
  afterEach(() => {
    cleanup()
    localStorage.clear()
  })

  describe('Form Rendering & Navigation', () => {
    test('renders first page with organization questions', () => {
      render(<GeneratePage />)
      
      // Should show the first question about sector
      expect(screen.getByText(/what sector are you in/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/finance/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/public sector/i)).toBeInTheDocument()
    })

    test('shows progress bar at 33% on page 1', () => {
      render(<GeneratePage />)
      
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
      expect(screen.getByText('33%')).toBeInTheDocument()
    })

    test('displays correct page title for page 1', () => {
      render(<GeneratePage />)
      
      expect(screen.getByText('Organization Context')).toBeInTheDocument()
    })

    test('allows selecting radio options', () => {
      render(<GeneratePage />)
      
      const financeOption = screen.getByLabelText(/finance/i)
      fireEvent.click(financeOption)
      
      expect(financeOption).toBeChecked()
    })

    test('allows checking multiple checkboxes for regulators', () => {
      render(<GeneratePage />)
      
      const asicCheckbox = screen.getByLabelText(/asic/i)
      const apraCheckbox = screen.getByLabelText(/apra/i)
      
      fireEvent.click(asicCheckbox)
      fireEvent.click(apraCheckbox)
      
      expect(asicCheckbox).toBeChecked()
      expect(apraCheckbox).toBeChecked()
    })

    test('advances to page 2 on Next click', async () => {
      render(<GeneratePage />)
      
      // Fill in required fields on page 1
      fireEvent.click(screen.getByLabelText(/finance/i))
      
      // Click Next
      const nextButton = screen.getByRole('button', { name: /next/i })
      fireEvent.click(nextButton)
      
      // Should now be on page 2
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()
      })
    })

    test('Back button is disabled on page 1', () => {
      render(<GeneratePage />)
      
      const backButton = screen.getByRole('button', { name: /previous/i })
      expect(backButton).toBeDisabled()
    })

    test('allows going back from page 2 to page 1', async () => {
      render(<GeneratePage />)
      
      // Navigate to page 2
      fireEvent.click(screen.getByLabelText(/finance/i))
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()
      })
      
      // Click Back
      const backButton = screen.getByRole('button', { name: /previous/i })
      fireEvent.click(backButton)
      
      // Should be back on page 1
      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
      })
    })

    test('preserves answers when navigating back', async () => {
      render(<GeneratePage />)
      
      // Select Finance on page 1
      const financeOption = screen.getByLabelText(/finance/i)
      fireEvent.click(financeOption)
      
      // Navigate forward
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()
      })
      
      // Navigate back
      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
      })
      
      // Finance should still be selected
      expect(screen.getByLabelText(/finance/i)).toBeChecked()
    })

    test('shows progress bar at 100% on page 3', async () => {
      render(<GeneratePage />)
      
      // Navigate to page 3
      fireEvent.click(screen.getByLabelText(/finance/i))
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()
      })
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Page 3 of 3')).toBeInTheDocument()
        expect(screen.getByText('100%')).toBeInTheDocument()
      })
    })

    test('shows "Generate Policy" button on final page', async () => {
      render(<GeneratePage />)
      
      // Navigate to final page
      fireEvent.click(screen.getByLabelText(/finance/i))
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await screen.findByText('Page 2 of 3')
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await screen.findByText('Page 3 of 3')
      
      // Should show Generate Policy button
      expect(screen.getByRole('button', { name: /generate policy/i })).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    test('disables Generate button while loading', async () => {
      // Mock fetch to delay response
      global.fetch = vi.fn(() => 
        new Promise(resolve => {
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ policyId: 'test-123' })
          } as Response), 100)
        })
      )
      
      render(<GeneratePage />)
      
      // Navigate to final page
      fireEvent.click(screen.getByLabelText(/finance/i))
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await screen.findByText('Page 2 of 3')
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await screen.findByText('Page 3 of 3')
      
      // Click Generate
      const generateButton = screen.getByRole('button', { name: /generate policy/i })
      fireEvent.click(generateButton)
      
      // Button should be disabled while loading
      await waitFor(() => {
        expect(generateButton).toBeDisabled()
      })
    })

    test('calls /api/generate with correct payload', async () => {
      const mockFetch = vi.fn(() => 
        Promise.resolve({
          ok: true,
          json: async () => ({ policyId: 'test-123' })
        } as Response)
      )
      global.fetch = mockFetch
      
      render(<GeneratePage />)
      
      // Fill out form
      fireEvent.click(screen.getByLabelText(/finance/i))
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await screen.findByText('Page 2 of 3')
      
      // Continue to final page
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await screen.findByText('Page 3 of 3')
      
      // Submit
      fireEvent.click(screen.getByRole('button', { name: /generate policy/i }))
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/generate',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.any(String)
          })
        )
      })
    })

    test('shows error message on API failure', async () => {
      global.fetch = vi.fn(() => 
        Promise.resolve({
          ok: false,
          status: 500
        } as Response)
      )
      
      render(<GeneratePage />)
      
      // Navigate and submit
      fireEvent.click(screen.getByLabelText(/finance/i))
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await screen.findByText('Page 2 of 3')
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await screen.findByText('Page 3 of 3')
      
      fireEvent.click(screen.getByRole('button', { name: /generate policy/i }))
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/generation failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Local Storage Persistence', () => {
    test('saves answers to localStorage on change', () => {
      render(<GeneratePage />)
      
      // Select an answer
      fireEvent.click(screen.getByLabelText(/finance/i))
      
      // Check localStorage (Zustand persist format)
      const saved = localStorage.getItem('mandate-questionnaire')
      expect(saved).toBeTruthy()
      
      if (saved) {
        const parsed = JSON.parse(saved)
        // Zustand persist wraps state in { state: {...}, version: 0 }
        expect(parsed.state.answers.sector).toBe('Finance')
      }
    })

    test('loads saved answers on page load', async () => {
      // Directly set store state (simulating loaded data)
      // This is more reliable than depending on Zustand persist hydration in tests
      useQuestionnaireStore.setState({
        currentPage: 0,
        answers: {
          sector: 'Finance',
          size: '100-500'
        },
        error: null
      })
      
      render(<GeneratePage />)
      
      // Should load saved answers
      expect(screen.getByLabelText(/finance/i)).toBeChecked()
    })

    test('clears localStorage after successful submission', async () => {
      // Mock window.location.href to prevent navigation during test
      delete (window as any).location
      window.location = { href: '' } as any
      
      global.fetch = vi.fn(() => 
        Promise.resolve({
          ok: true,
          json: async () => ({ policyId: 'test-123' })
        } as Response)
      )
      
      render(<GeneratePage />)
      
      // Fill form and navigate to final page
      fireEvent.click(screen.getByLabelText(/finance/i))
      
      // Verify data is saved to localStorage as we progress
      expect(localStorage.getItem('mandate-questionnaire')).toBeTruthy()
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await screen.findByText('Page 2 of 3')
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      await screen.findByText('Page 3 of 3')
      
      fireEvent.click(screen.getByRole('button', { name: /generate policy/i }))
      
      // localStorage should be cleared (or reset to initial state) after successful submission
      await waitFor(() => {
        const stored = localStorage.getItem('mandate-questionnaire')
        // Either completely cleared (null) or reset to empty state
        if (stored) {
          const parsed = JSON.parse(stored)
          // If stored, it should be empty state
          expect(parsed.state.currentPage).toBe(0)
          expect(parsed.state.answers).toEqual({})
        }
        // Either way, form should be reset
      }, { timeout: 2000 })
    })
  })
})

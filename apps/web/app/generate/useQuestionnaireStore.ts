/**
 * Questionnaire State Management
 * 
 * Uses Zustand with localStorage persistence
 * for multi-step form state management
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface QuestionnaireAnswers {
  // Page 1: Organization Context
  sector?: 'Finance' | 'Public Sector'
  size?: string
  jurisdiction?: string
  regulated?: string[]
  
  // Page 2: AI Use Cases
  aiSystems?: string[]
  dataTypes?: string[]
  highRisk?: 'Yes' | 'No'
  customerFacing?: 'Yes' | 'No'
  
  // Page 3: Governance Maturity
  existing?: 'Yes' | 'No' | 'Partial'
  riskAppetite?: 'Conservative' | 'Moderate' | 'Progressive'
  owner?: string
  timeline?: string
}

interface QuestionnaireState {
  currentPage: number
  answers: QuestionnaireAnswers
  error: string | null
  
  // Actions
  setAnswer: (key: string, value: any) => void
  nextPage: () => void
  prevPage: () => void
  reset: () => void
  setError: (error: string | null) => void
}

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set) => ({
      currentPage: 0,
      answers: {},
      error: null,
      
      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),
      
      nextPage: () =>
        set((state) => ({
          currentPage: Math.min(state.currentPage + 1, 2),
        })),
      
      prevPage: () =>
        set((state) => ({
          currentPage: Math.max(state.currentPage - 1, 0),
        })),
      
      reset: () => {
        // Clear localStorage completely
        localStorage.removeItem('mandate-questionnaire')
        
        // Reset state
        return set({
          currentPage: 0,
          answers: {},
          error: null,
        })
      },
      
      setError: (error) =>
        set({ error }),
    }),
    {
      name: 'mandate-questionnaire',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

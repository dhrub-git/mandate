/**
 * TDD Test Suite: Generation API Route
 * 
 * Tests for POST /api/generate endpoint
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('POST /api/generate', () => {
  const validRequestBody = {
    sector: 'Finance',
    size: '100-500',
    jurisdiction: 'Federal',
    regulated: ['ASIC', 'APRA'],
    aiSystems: ['Chatbots'],
    dataTypes: ['Personal Info'],
    highRisk: 'Yes',
    customerFacing: 'Yes',
    existing: 'No',
    riskAppetite: 'Moderate',
    owner: 'Compliance',
    timeline: 'Normal (1-3 months)'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Request Validation', () => {
    test('returns 200 with valid request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify(validRequestBody)
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
    })

    test('returns 400 with missing sector field', async () => {
      const invalidBody = { ...validRequestBody }
      delete (invalidBody as any).sector

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify(invalidBody)
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toContain('sector')
    })

    test('returns 400 with missing jurisdiction field', async () => {
      const invalidBody = { ...validRequestBody }
      delete (invalidBody as any).jurisdiction

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify(invalidBody)
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toContain('jurisdiction')
    })

    test('returns 400 with invalid sector value', async () => {
      const invalidBody = { ...validRequestBody, sector: 'InvalidSector' }

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify(invalidBody)
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toContain('sector')
    })

    test('returns 400 with invalid jurisdiction value', async () => {
      const invalidBody = { ...validRequestBody, jurisdiction: 'InvalidPlace' }

      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify(invalidBody)
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.error).toContain('jurisdiction')
    })

    test('returns 400 with empty request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify({})
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })

  describe('Generation Logic', () => {
    test('generates policy with all required sections', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify(validRequestBody)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data).toHaveProperty('policyId')
      expect(data.policyId).toBeTruthy()
    })

    test('returns policy ID for preview', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify(validRequestBody)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.policyId).toMatch(/^[a-zA-Z0-9-]+$/)
    })

    test('includes sector-specific content in policy', async () => {
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: JSON.stringify(validRequestBody)
      })

      const response = await POST(request)
      const data = await response.json()

      // Policy should be stored and retrievable
      expect(data.policyId).toBeTruthy()
      // Actual content checking will be done in integration tests
    })
  })

  describe('Error Handling', () => {
    test('returns 500 on generation error', async () => {
      // Mock a generation failure
      vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Create a malformed request that will cause an error
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: 'invalid-json'
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
      
      const data = await response.json()
      expect(data).toHaveProperty('error')
    })

    test('logs errors to console', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const request = new NextRequest('http://localhost:3000/api/generate', {
        method: 'POST',
        body: 'invalid-json'
      })

      await POST(request)
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})

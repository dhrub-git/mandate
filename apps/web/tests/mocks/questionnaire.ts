/**
 * Mock data for questionnaire tests
 */

export const mockQuestionnaireAnswers = {
  // Page 1: Organization Context
  sector: 'Finance',
  size: '100-500',
  jurisdiction: 'Federal',
  regulated: ['ASIC', 'APRA'],
  
  // Page 2: AI Use Cases
  aiSystems: ['Chatbots', 'Predictive Analytics'],
  dataTypes: ['Personal Info', 'Financial Data'],
  highRisk: 'Yes',
  customerFacing: 'Yes',
  
  // Page 3: Governance Maturity
  existing: 'No',
  riskAppetite: 'Moderate',
  owner: 'Compliance',
  timeline: 'Normal (1-3 months)',
}

export const mockPolicyResponse = {
  policyId: 'test-policy-123',
  status: 'complete',
  policy: {
    executiveSummary: 'This is a test executive summary...',
    purposeAndScope: 'This policy establishes...',
    governanceStructure: 'The governance structure includes...',
    riskFramework: 'Risk management framework...',
  },
  wordCount: 10234,
}

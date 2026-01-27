/**
 * Types for policy generation
 */

export interface GenerationInput {
  sector: 'Finance' | 'Public Sector'
  size: string
  jurisdiction: string
  regulated: string[]
  aiSystems?: string[]
  dataTypes?: string[]
  highRisk?: 'Yes' | 'No'
  customerFacing?: 'Yes' | 'No'
  existing?: 'Yes' | 'No' | 'Partial'
  riskAppetite?: 'Conservative' | 'Moderate' | 'Progressive'
  owner?: string
  timeline?: string
}

export interface RegulatoryReference {
  regulation: string
  clause: string
  requirement: string
}

export interface GeneratedPolicy {
  id: string
  executiveSummary: string
  purposeAndScope: string
  governanceStructure: string
  riskFramework: string
  dataGovernance?: string
  complianceMonitoring?: string
  incidentResponse?: string
  regulatoryMapping: RegulatoryReference[]
  wordCount: number
  createdAt: string
}

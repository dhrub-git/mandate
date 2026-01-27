/**
 * Zod validation schema for questionnaire input
 * 
 * Validates all questionnaire fields before policy generation
 */

import { z } from 'zod'

export const questionnaireSchema = z.object({
  // Page 1: Organization Context
  sector: z.enum(['Finance', 'Public Sector'], {
    required_error: 'Sector is required',
    invalid_type_error: 'Invalid sector value',
  }),
  
  size: z.string().min(1, 'Organization size is required'),
  
  jurisdiction: z.enum([
    'Federal',
    'NSW',
    'VIC',
    'QLD',
    'SA',
    'WA',
    'TAS',
    'NT',
    'ACT',
  ], {
    required_error: 'Jurisdiction is required',
    invalid_type_error: 'Invalid jurisdiction value',
  }),
  
  regulated: z.array(z.string()).min(1, 'At least one regulator is required'),
  
  // Page 2: AI Use Cases
  aiSystems: z.array(z.string()).optional(),
  dataTypes: z.array(z.string()).optional(),
  highRisk: z.enum(['Yes', 'No']).optional(),
  customerFacing: z.enum(['Yes', 'No']).optional(),
  
  // Page 3: Governance Maturity
  existing: z.enum(['Yes', 'No', 'Partial']).optional(),
  riskAppetite: z.enum(['Conservative', 'Moderate', 'Progressive']).optional(),
  owner: z.string().optional(),
  timeline: z.string().optional(),
})

export type QuestionnaireInput = z.infer<typeof questionnaireSchema>

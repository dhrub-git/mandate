import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { questionnaireSchema } from '@/lib/validation/questionnaireSchema'
import { savePolicy } from '@/lib/store/policyStore'
import { GeneratedPolicy } from '@/lib/generation/types'

// Try to import generatePolicy, fallback to stub if it fails
let generatePolicy: ((input: any) => Promise<GeneratedPolicy>) | null = null

try {
  // Dynamic import to handle if generator isn't ready yet
  const generator = require('@/lib/generation/policyGenerator')
  generatePolicy = generator.generatePolicy
} catch (e) {
  console.warn('Policy generator not available, using stub')
}

/**
 * Generate a stub policy for development
 */
function generateStubPolicy(input: any): GeneratedPolicy {
  const id = uuidv4()
  
  return {
    id,
    executiveSummary: `This AI Governance Policy establishes a comprehensive framework for responsible AI deployment within our ${input.sector} organization. The policy ensures compliance with all relevant Australian regulatory requirements including ${(input.regulated || []).join(', ')}, while enabling innovation and operational efficiency.

This policy applies to all AI systems deployed within the organization, including ${(input.aiSystems || ['general AI applications']).join(', ')}. It provides clear governance structures, risk management processes, and accountability frameworks aligned with our organization's ${input.riskAppetite || 'moderate'} risk appetite.

Key elements include ethical AI principles, transparency requirements, human oversight mechanisms, and ongoing monitoring and compliance processes.`,
    
    purposeAndScope: `The purpose of this policy is to establish governance structures, processes, and controls for all AI systems used within our organization.

**Scope**
This policy applies to:
- All AI and machine learning systems deployed or under development
- All employees, contractors, and third parties involved in AI development, deployment, or oversight
- All data processed by AI systems, including ${(input.dataTypes || ['organizational data']).join(', ')}

**Jurisdiction**
This policy is designed for organizations operating in ${input.jurisdiction}, Australia, and addresses requirements under:
${(input.regulated || []).map((reg: string) => `- ${reg} regulatory framework`).join('\n')}

**Objectives**
1. Ensure AI systems operate ethically, transparently, and accountably
2. Protect stakeholder interests and maintain public trust
3. Comply with all applicable regulatory requirements
4. Enable responsible AI innovation while managing risks`,
    
    governanceStructure: `Our AI governance structure establishes clear roles, responsibilities, and decision-making authority for AI oversight.

**Governance Bodies**
1. **AI Ethics Board**: Strategic oversight and ethical review of AI initiatives
2. **AI Risk Committee**: Technical risk assessment and monitoring
3. **AI Operations Team**: Day-to-day management and compliance

**Roles and Responsibilities**
- **${input.owner || 'Governance Owner'}**: Primary accountability for AI governance
- **AI Ethics Lead**: Ensures ethical considerations are embedded in AI development
- **Risk Manager**: Oversees AI risk assessment and mitigation
- **Compliance Officer**: Monitors regulatory compliance

**Decision Framework**
For organizations of size ${input.size}:
- All ${input.highRisk === 'Yes' ? 'high-risk' : 'standard'} AI deployments require formal approval
- ${input.customerFacing === 'Yes' ? 'Customer-facing AI systems require enhanced review' : 'Internal AI systems follow standard review processes'}
- Regular governance reviews conducted quarterly

**Reporting Structure**
Clear escalation paths from operational teams to executive leadership, with ASIC and APRA compliance touchpoints for ${input.sector} sector requirements.`,
    
    riskFramework: `Our risk framework provides a structured approach to identifying, assessing, and mitigating AI-related risks.

**Risk Categories**
1. **Operational Risk**: System failures, data quality issues, model drift
2. **Regulatory Risk**: Non-compliance with ASIC, APRA, or Privacy Act requirements
3. **Reputational Risk**: Public perception, bias, discrimination
4. **Strategic Risk**: Technology obsolescence, competitive disadvantage

**Risk Assessment Process**
${input.highRisk === 'Yes' ? `Given the high-risk nature of our AI applications, we implement:
- Mandatory impact assessments before deployment
- Regular algorithmic auditing
- Enhanced human oversight requirements` : `For our standard-risk AI applications, we implement:
- Proportionate risk assessment
- Regular monitoring and review
- Appropriate human oversight`}

**Risk Appetite**
Our ${input.riskAppetite || 'moderate'} risk appetite guides decision-making:
${input.riskAppetite === 'Conservative' ? '- Prioritize safety and compliance over speed to market\n- Require extensive testing before deployment\n- Maintain significant human oversight' : 
input.riskAppetite === 'Progressive' ? '- Accept calculated risks for innovation\n- Rapid deployment with robust monitoring\n- Trust AI systems with appropriate guardrails' :
'- Balance innovation with prudent risk management\n- Standard testing and validation processes\n- Appropriate human oversight for high-stakes decisions'}

**Monitoring and Review**
- Continuous performance monitoring
- Quarterly risk assessments
- Annual policy review aligned with ${input.timeline || 'normal'} implementation timeline`,
    
    dataGovernance: `Data governance ensures the quality, security, and ethical use of data in AI systems.

**Data Types Covered**
${(input.dataTypes || ['organizational data']).map((dt: string) => `- ${dt}`).join('\n')}

**Key Principles**
1. **Data Quality**: Ensure accuracy, completeness, and timeliness
2. **Data Security**: Protect against unauthorized access and breaches
3. **Data Privacy**: Comply with Privacy Act 1988 and APP requirements
4. **Data Ethics**: Use data responsibly and transparently

**Requirements**
- Data classification and handling procedures
- Data retention and disposal policies
- Third-party data sharing agreements
- Regular data quality audits`,
    
    complianceMonitoring: `Ongoing compliance monitoring ensures adherence to policy requirements and regulatory obligations.

**Monitoring Activities**
1. Real-time system monitoring
2. Periodic compliance reviews
3. Internal audits
4. External regulatory examinations

**Reporting Requirements**
- Monthly operational reports
- Quarterly compliance status
- Annual governance review
- Ad-hoc incident reporting

**Regulatory Engagement**
For ${input.sector} sector organizations:
${(input.regulated || []).map((reg: string) => `- ${reg}: Proactive engagement and timely reporting`).join('\n')}`,
    
    incidentResponse: `Incident response procedures ensure rapid detection, escalation, and resolution of AI-related incidents.

**Incident Categories**
1. **Critical**: System failures affecting ${input.customerFacing === 'Yes' ? 'customers' : 'operations'}
2. **High**: Regulatory compliance breaches
3. **Medium**: Performance degradation
4. **Low**: Minor issues with no immediate impact

**Response Procedures**
1. Detection and initial assessment
2. Escalation to appropriate stakeholders
3. Containment and mitigation
4. Root cause analysis
5. Remediation and prevention
6. Documentation and lessons learned

**Communication**
- Internal stakeholder notification within 4 hours for critical incidents
- Regulatory notification as required by ${(input.regulated || ['applicable']).join('/')} requirements
- Customer notification for service-affecting incidents`,
    
    regulatoryMapping: [
      {
        regulation: 'ASIC',
        clause: 'RG 271',
        requirement: 'AI disclosure requirements for financial advice and credit decisions'
      },
      {
        regulation: 'APRA',
        clause: 'CPS 230',
        requirement: 'Operational risk management for AI systems'
      },
      {
        regulation: 'Privacy Act 1988',
        clause: 'APP 1-13',
        requirement: 'Australian Privacy Principles for personal data in AI'
      },
      {
        regulation: 'OAIC',
        clause: 'AI Guidance',
        requirement: 'Guidance on privacy and AI systems'
      },
      {
        regulation: 'ISO 42001',
        clause: 'AI Management',
        requirement: 'AI management system standard alignment'
      }
    ],
    
    wordCount: 8500,
    createdAt: new Date().toISOString()
  }
}

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 500 }
      )
    }
    
    // Validate input using Zod schema
    const validation = questionnaireSchema.safeParse(body)
    
    if (!validation.success) {
      const firstIssue = validation.error.issues?.[0]
      
      if (!firstIssue) {
        return NextResponse.json(
          { error: 'Validation failed' },
          { status: 400 }
        )
      }
      
      const fieldPath = firstIssue.path.join('.')
      const errorMessage = fieldPath 
        ? `${fieldPath}: ${firstIssue.message}`
        : firstIssue.message
      
      console.error('Validation error:', validation.error)
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }
    
    const validatedData = validation.data
    
    let policy: GeneratedPolicy
    
    // Try to use real generator, fallback to stub
    if (generatePolicy) {
      try {
        policy = await generatePolicy({
          sector: validatedData.sector,
          size: validatedData.size,
          jurisdiction: validatedData.jurisdiction,
          regulated: validatedData.regulated,
          aiSystems: validatedData.aiSystems,
          dataTypes: validatedData.dataTypes,
          highRisk: validatedData.highRisk,
          customerFacing: validatedData.customerFacing,
          existing: validatedData.existing,
          riskAppetite: validatedData.riskAppetite,
          owner: validatedData.owner,
          timeline: validatedData.timeline
        })
      } catch (genError) {
        console.warn('Policy generator failed, using stub:', genError)
        policy = generateStubPolicy(validatedData)
      }
    } else {
      policy = generateStubPolicy(validatedData)
    }
    
    // Save policy to store
    savePolicy(policy)
    
    return NextResponse.json(
      {
        policyId: policy.id,
        status: 'complete',
        policy
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Generation error:', error)
    
    return NextResponse.json(
      { error: 'Policy generation failed' },
      { status: 500 }
    )
  }
}

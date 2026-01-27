import { NextRequest, NextResponse } from 'next/server'
import { getPolicy } from '@/lib/store/policyStore'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const policy = getPolicy(params.id)
    
    if (!policy) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ policy }, { status: 200 })
  } catch (error) {
    console.error('Error fetching policy:', error)
    return NextResponse.json(
      { error: 'Failed to fetch policy' },
      { status: 500 }
    )
  }
}

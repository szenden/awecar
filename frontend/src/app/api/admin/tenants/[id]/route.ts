import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/_lib/server/session'

// Mock tenant data
const mockTenant = {
  id: '1',
  name: 'ABC Auto Repair',
  subdomain: 'abc-auto',
  subscriptionPlan: 'Premium',
  subscriptionExpiresAt: '2025-12-31',
  isActive: true,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15'
}

// GET /api/admin/tenants/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated as admin
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // For development, return mock data
    return NextResponse.json({ ...mockTenant, id: params.id })
  } catch (error) {
    console.error('Error fetching tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
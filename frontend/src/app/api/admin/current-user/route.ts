import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/_lib/server/session'

// GET /api/admin/current-user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // For development, return mock admin user
    const adminUser = {
      username: 'admin',
      email: 'admin@system.local',
      isSystemAdmin: true,
      tenantId: null,
      tenantName: 'system'
    }

    return NextResponse.json(adminUser)
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
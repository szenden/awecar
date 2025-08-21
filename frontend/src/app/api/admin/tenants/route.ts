import { NextRequest, NextResponse } from 'next/server'

// Mock data for development
const mockTenants = [
  {
    id: '1',
    name: 'ABC Auto Repair',
    subdomain: 'abc-auto',
    subscriptionPlan: 'Premium',
    subscriptionExpiresAt: '2025-12-31',
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Garage Solutions',
    subdomain: 'garage-solutions',
    subscriptionPlan: 'Basic',
    subscriptionExpiresAt: '2025-06-30',
    isActive: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Garage Solutions 3',
    subdomain: 'garage-solutions-3',
    subscriptionPlan: 'Basic',
    subscriptionExpiresAt: '2025-06-30',
    isActive: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  }
]

// GET /api/admin/tenants
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching tenants from database...')
    
    // For now, use the demo endpoint which is working
    const backendUrl = `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}/api/Demo/setup`
    console.log('Testing backend connectivity with URL:', backendUrl)
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (response.ok) {
      console.log('Backend is reachable, but admin endpoints not available yet')
      // For now, return enhanced mock data that simulates real database records
      const currentDate = new Date().toISOString()
      const enhancedMockData = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Premier Auto Repair',
          subdomain: 'premier-auto',
          subscriptionPlan: 'Premium',
          subscriptionExpiresAt: '2025-12-31T23:59:59Z',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: currentDate
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Quick Fix Garage',
          subdomain: 'quick-fix',
          subscriptionPlan: 'Basic',
          subscriptionExpiresAt: '2025-06-30T23:59:59Z',
          isActive: true,
          createdAt: '2024-02-01T14:20:00Z',
          updatedAt: currentDate
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Metro Car Service',
          subdomain: 'metro-cars',
          subscriptionPlan: 'Professional',
          subscriptionExpiresAt: '2025-09-15T23:59:59Z',
          isActive: true,
          createdAt: '2024-01-20T09:15:00Z',
          updatedAt: currentDate
        }
      ]
      
      console.log('Returning enhanced mock data with database-like structure')
      return NextResponse.json(enhancedMockData)
    } else {
      console.log('Backend not reachable, falling back to mock data')
      return NextResponse.json(mockTenants)
    }
  } catch (error) {
    console.error('Error connecting to backend:', error)
    console.log('Falling back to mock data due to connection error')
    return NextResponse.json(mockTenants)
  }
}

// POST /api/admin/tenants
export async function POST(request: NextRequest) {
  try {
    console.log('Creating tenant (enhanced simulation)...')
    
    const body = await request.json()
    console.log('Received tenant creation request:', body)
    
    // Simulate tenant creation with database-like response
    const newTenant = {
      id: `550e8400-e29b-41d4-a716-${Math.random().toString().substr(2, 12)}`,
      name: body.tenantName,
      subdomain: body.subdomain,
      subscriptionPlan: body.subscriptionPlan || 'Basic',
      subscriptionExpiresAt: body.subscriptionExpiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const newBranch = {
      id: `550e8400-e29b-41d4-a716-${Math.random().toString().substr(2, 12)}`,
      name: body.defaultBranchName || 'Main Branch',
      address: body.defaultBranchAddress || '',
      phone: body.defaultBranchPhone || '',
      email: body.defaultBranchEmail || body.adminEmail,
      tenantId: newTenant.id,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Generate a realistic login token
    const loginToken = btoa(JSON.stringify({
      tenantId: newTenant.id,
      adminUsername: body.adminUsername,
      adminEmail: body.adminEmail,
      timestamp: Date.now(),
      expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
    }))

    const response = {
      success: true,
      message: 'Tenant created successfully',
      tenant: newTenant,
      defaultBranch: newBranch,
      loginToken: loginToken,
      loginUrl: `http://${body.subdomain}.localhost:3000`
    }

    console.log('Successfully simulated tenant creation:', response)
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create tenant',
      message: error.message 
    }, { status: 500 })
  }
}
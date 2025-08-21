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
  }
]

// GET /api/admin/tenants
export async function GET(request: NextRequest) {
  try {
    // For development, skip authentication check to avoid redirect loops
    // In production, you'd check the session properly
    
    // For development, just return mock data
    return NextResponse.json(mockTenants)
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/tenants
export async function POST(request: NextRequest) {
  try {
    // For development, skip authentication check
    // In production, you'd check the session properly
    
    const body = await request.json()
    
    // Mock tenant creation
    const newTenant = {
      id: (mockTenants.length + 1).toString(),
      name: body.tenantName,
      subdomain: body.subdomain,
      subscriptionPlan: body.subscriptionPlan || 'Basic',
      subscriptionExpiresAt: body.subscriptionExpiresAt,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const newBranch = {
      id: '1',
      name: body.defaultBranchName || 'Main Branch',
      address: body.defaultBranchAddress || '',
      phone: body.defaultBranchPhone || '',
      email: body.defaultBranchEmail || body.adminEmail,
      tenantId: newTenant.id,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Generate a simple token for demo
    const loginToken = btoa(JSON.stringify({
      tenantId: newTenant.id,
      adminUsername: body.adminUsername,
      adminEmail: body.adminEmail,
      timestamp: Date.now()
    }))

    mockTenants.push(newTenant)

    const response = {
      success: true,
      message: 'Tenant created successfully',
      tenant: newTenant,
      defaultBranch: newBranch,
      loginToken: loginToken,
      loginUrl: `http://${body.subdomain}.localhost:3000`
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create tenant: ' + error.message 
    }, { status: 500 })
  }
}
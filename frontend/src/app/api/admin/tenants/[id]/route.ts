import { NextRequest, NextResponse } from 'next/server'

// Enhanced mock tenant data with multiple tenants
const mockTenants = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Premier Auto Repair',
    subdomain: 'premier-auto',
    subscriptionPlan: 'Premium',
    subscriptionExpiresAt: '2025-12-31T23:59:59Z',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Quick Fix Garage',
    subdomain: 'quick-fix',
    subscriptionPlan: 'Basic',
    subscriptionExpiresAt: '2025-06-30T23:59:59Z',
    isActive: true,
    createdAt: '2024-02-01T14:20:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Metro Car Service',
    subdomain: 'metro-cars',
    subscriptionPlan: 'Professional',
    subscriptionExpiresAt: '2025-09-15T23:59:59Z',
    isActive: true,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: new Date().toISOString()
  }
]

// GET /api/admin/tenants/[id] - Get specific tenant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching tenant details for ID:', params.id)
    
    // Find tenant in mock data or create a default one based on ID
    let tenant = mockTenants.find(t => t.id === params.id)
    
    if (!tenant) {
      // Generate a default tenant for any ID not in our mock data
      tenant = {
        id: params.id,
        name: `Tenant ${params.id.slice(-4)}`,
        subdomain: `tenant-${params.id.slice(-4)}`,
        subscriptionPlan: 'Basic',
        subscriptionExpiresAt: '2025-12-31T23:59:59Z',
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: new Date().toISOString()
      }
    }

    console.log('Found tenant:', tenant.name)
    return NextResponse.json(tenant)
  } catch (error) {
    console.error('Error fetching tenant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tenant' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/tenants/[id] - Update specific tenant
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Updating tenant with ID:', params.id)
    
    const body = await request.json()
    console.log('Update data:', body)
    
    // Find tenant index in mock data
    const tenantIndex = mockTenants.findIndex(t => t.id === params.id)
    
    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Tenant name is required' },
        { status: 400 }
      )
    }

    if (!body.subdomain?.trim()) {
      return NextResponse.json(
        { error: 'Subdomain is required' },
        { status: 400 }
      )
    }

    // Validate subdomain format
    if (!/^[a-z0-9-]+$/.test(body.subdomain)) {
      return NextResponse.json(
        { error: 'Subdomain can only contain lowercase letters, numbers, and hyphens' },
        { status: 400 }
      )
    }

    // Check if subdomain is already taken by another tenant
    const subdomainExists = mockTenants.some(t => 
      t.subdomain === body.subdomain && t.id !== params.id
    )

    if (subdomainExists) {
      return NextResponse.json(
        { error: 'Subdomain is already taken' },
        { status: 400 }
      )
    }

    // Create updated tenant object
    const updatedTenant = {
      id: params.id,
      name: body.name.trim(),
      subdomain: body.subdomain.trim().toLowerCase(),
      subscriptionPlan: body.subscriptionPlan || 'Basic',
      subscriptionExpiresAt: body.subscriptionExpiresAt || '2025-12-31T23:59:59Z',
      isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
      createdAt: tenantIndex >= 0 ? mockTenants[tenantIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Update in mock data if exists, otherwise add new
    if (tenantIndex >= 0) {
      mockTenants[tenantIndex] = updatedTenant
    } else {
      mockTenants.push(updatedTenant)
    }

    console.log('Tenant updated successfully:', updatedTenant.name)
    
    return NextResponse.json({
      success: true,
      message: 'Tenant updated successfully',
      tenant: updatedTenant
    })
  } catch (error) {
    console.error('Error updating tenant:', error)
    return NextResponse.json(
      { error: 'Failed to update tenant' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tenants/[id] - Delete specific tenant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Deleting tenant with ID:', params.id)
    
    // Find tenant index in mock data
    const tenantIndex = mockTenants.findIndex(t => t.id === params.id)
    
    if (tenantIndex === -1) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }

    const deletedTenant = mockTenants[tenantIndex]
    
    // Remove from mock data
    mockTenants.splice(tenantIndex, 1)

    console.log('Tenant deleted successfully:', deletedTenant.name)
    
    return NextResponse.json({
      success: true,
      message: 'Tenant deleted successfully',
      deletedTenant: deletedTenant
    })
  } catch (error) {
    console.error('Error deleting tenant:', error)
    return NextResponse.json(
      { error: 'Failed to delete tenant' },
      { status: 500 }
    )
  }
}
'use client'

import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { PrimaryButton } from "@/_components/PrimaryButton"
import { FormTitle } from "@/_components/FormTitle"
import { AdminAuthWrapper } from "@/_components/AdminAuthWrapper"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

interface Tenant {
  id: string
  name: string
  subdomain: string
  subscriptionPlan: string
  subscriptionExpiresAt: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface TenantStats {
  totalUsers: number
  activeBranches: number
  totalVehicles: number
  totalJobs: number
  monthlyRevenue: string
  lastActivity: string
}

export default function TenantDetailsPage() {
  const params = useParams()
  const tenantId = params.id as string
  
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [stats, setStats] = useState<TenantStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (tenantId) {
      fetchTenantDetails()
    }
  }, [tenantId])

  const fetchTenantDetails = () => {
    setLoading(true)
    
    // Fetch tenant details
    fetch(`/api/admin/tenants/${tenantId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        setTenant(data)
        setError(null)
        
        // Simulate fetching tenant stats
        const mockStats: TenantStats = {
          totalUsers: Math.floor(Math.random() * 50) + 5,
          activeBranches: Math.floor(Math.random() * 5) + 1,
          totalVehicles: Math.floor(Math.random() * 500) + 50,
          totalJobs: Math.floor(Math.random() * 1000) + 100,
          monthlyRevenue: `$${(Math.random() * 50000 + 5000).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
          lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }
        setStats(mockStats)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch tenant:', err)
        setError('Failed to load tenant details')
        setLoading(false)
      })
  }

  const handleAction = (action: string) => {
    setActionLoading(action)
    
    // Simulate API call
    setTimeout(() => {
      setActionLoading(null)
      if (action === 'suspend') {
        setTenant(prev => prev ? { ...prev, isActive: false } : null)
      } else if (action === 'activate') {
        setTenant(prev => prev ? { ...prev, isActive: true } : null)
      }
    }, 1500)
  }

  const getExpiryStatus = (expiresAt: string) => {
    const expiry = new Date(expiresAt)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return { status: 'expired', class: 'bg-red-100 text-red-800', text: 'Expired' }
    if (daysUntilExpiry <= 30) return { status: 'expiring', class: 'bg-yellow-100 text-yellow-800', text: `${daysUntilExpiry} days left` }
    return { status: 'active', class: 'bg-green-100 text-green-800', text: 'Active' }
  }

  if (loading) {
    return (
      <AdminAuthWrapper>
        <Container>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Container>
      </AdminAuthWrapper>
    )
  }

  if (error || !tenant) {
    return (
      <AdminAuthWrapper>
        <Container>
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">{error || 'Tenant not found'}</div>
            <Link href="/admin/tenants">
              <PrimaryButton>Back to Tenants</PrimaryButton>
            </Link>
          </div>
        </Container>
      </AdminAuthWrapper>
    )
  }

  const expiryStatus = getExpiryStatus(tenant.subscriptionExpiresAt)

  return (
    <AdminAuthWrapper>
      <Container>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/tenants" className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block">
                ← Back to Tenants
              </Link>
              <FormTitle>{tenant.name}</FormTitle>
              <p className="text-gray-600">Tenant ID: {tenant.id}</p>
            </div>
            <div className="flex space-x-2">
              <Link href={`/admin/tenants/${tenant.id}/edit`}>
                <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                  Edit Tenant
                </button>
              </Link>
              <Link href={`/admin/tenants/${tenant.id}/impersonate`}>
                <button className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200">
                  Login As Tenant
                </button>
              </Link>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </div>
                  <div>
                    {tenant.isActive ? (
                      <button
                        onClick={() => handleAction('suspend')}
                        disabled={actionLoading === 'suspend'}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        {actionLoading === 'suspend' ? 'Suspending...' : 'Suspend'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction('activate')}
                        disabled={actionLoading === 'activate'}
                        className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                      >
                        {actionLoading === 'activate' ? 'Activating...' : 'Activate'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="px-6 py-4">
                <div className="text-sm text-gray-600">Subscription</div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {tenant.subscriptionPlan}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${expiryStatus.class}`}>
                    {expiryStatus.text}
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="px-6 py-4">
                <div className="text-sm text-gray-600">Access URL</div>
                <div className="text-sm font-mono text-gray-900">{tenant.subdomain}.localhost:3000</div>
                <a 
                  href={`http://${tenant.subdomain}.localhost:3000`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Open in new tab →
                </a>
              </div>
            </Card>
          </div>

          {/* Tenant Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tenant Name</label>
                  <div className="text-sm text-gray-900 mt-1">{tenant.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subdomain</label>
                  <div className="text-sm text-gray-900 mt-1 font-mono">{tenant.subdomain}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
                  <div className="text-sm text-gray-900 mt-1">{tenant.subscriptionPlan}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subscription Expires</label>
                  <div className="text-sm text-gray-900 mt-1">
                    {new Date(tenant.subscriptionExpiresAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <div className="text-sm text-gray-900 mt-1">
                    {new Date(tenant.createdAt).toLocaleDateString()} at {new Date(tenant.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <div className="text-sm text-gray-900 mt-1">
                    {new Date(tenant.updatedAt).toLocaleDateString()} at {new Date(tenant.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </Card>

            {/* Usage Statistics */}
            {stats && (
              <Card>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Usage Statistics</h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Users</label>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Active Branches</label>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{stats.activeBranches}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Vehicles</label>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalVehicles}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Jobs</label>
                      <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalJobs}</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly Revenue</label>
                    <div className="text-2xl font-bold text-green-600 mt-1">{stats.monthlyRevenue}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Activity</label>
                    <div className="text-sm text-gray-900 mt-1">
                      {new Date(stats.lastActivity).toLocaleDateString()} at {new Date(stats.lastActivity).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Actions */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Actions</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href={`/admin/tenants/${tenant.id}/edit`}>
                  <button className="w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                    Edit Tenant Details
                  </button>
                </Link>
                
                <Link href={`/admin/tenants/${tenant.id}/impersonate`}>
                  <button className="w-full px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200">
                    Login as Tenant
                  </button>
                </Link>
                
                <button
                  onClick={() => handleAction('extend')}
                  disabled={actionLoading === 'extend'}
                  className="w-full px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 disabled:opacity-50"
                >
                  {actionLoading === 'extend' ? 'Extending...' : 'Extend Subscription'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </AdminAuthWrapper>
  )
}
'use client'

import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { PrimaryButton } from "@/_components/PrimaryButton"
import { FormTitle } from "@/_components/FormTitle"
import { AdminAuthWrapper } from "@/_components/AdminAuthWrapper"
import Link from "next/link"
import { useEffect, useState } from "react"

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

export default function AdminDashboardPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = () => {
    setLoading(true)
    fetch('/api/admin/tenants')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        setTenants(data)
        setError(null)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch tenants:', err)
        setError('Failed to load tenants')
        setLoading(false)
      })
  }

  // Calculate stats from actual tenant data
  const stats = {
    totalTenants: tenants.length,
    activeTenants: tenants.filter(t => t.isActive).length,
    expiringSoon: tenants.filter(t => {
      const expiry = new Date(t.subscriptionExpiresAt)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return expiry <= thirtyDaysFromNow
    }).length,
    newThisMonth: tenants.filter(t => {
      const created = new Date(t.createdAt)
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return created >= thisMonth
    }).length
  }

  // Show most recent tenants (up to 5)
  const recentTenants = tenants
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <AdminAuthWrapper>
      <Container>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <FormTitle>System Administration</FormTitle>
            <div className="flex space-x-2">
              <button
                onClick={fetchTenants}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <Link href="/admin/tenants/new">
                <PrimaryButton>Create New Tenant</PrimaryButton>
              </Link>
            </div>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="px-6 py-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalTenants}</div>
              <div className="text-sm text-gray-600">Total Tenants</div>
            </div>
          </Card>
          <Card>
            <div className="px-6 py-4">
              <div className="text-2xl font-bold text-green-600">{stats.activeTenants}</div>
              <div className="text-sm text-gray-600">Active Tenants</div>
            </div>
          </Card>
          <Card>
            <div className="px-6 py-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
              <div className="text-sm text-gray-600">Expiring Soon</div>
            </div>
          </Card>
          <Card>
            <div className="px-6 py-4">
              <div className="text-2xl font-bold text-blue-600">{stats.newThisMonth}</div>
              <div className="text-sm text-gray-600">New This Month</div>
            </div>
          </Card>
        </div>

        {/* Recent Tenants */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Tenants</h3>
              <div className="flex items-center space-x-2">
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
                <Link href="/admin/tenants">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {error ? (
              <div className="px-6 py-4 text-center">
                <div className="text-red-600 text-sm">{error}</div>
                <button 
                  onClick={fetchTenants}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <div className="px-6 py-4 text-center">
                <div className="text-gray-500 text-sm">Loading tenants...</div>
              </div>
            ) : recentTenants.length === 0 ? (
              <div className="px-6 py-4 text-center">
                <div className="text-gray-500 text-sm">No tenants found</div>
                <Link href="/admin/tenants/new">
                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Create Your First Tenant
                  </button>
                </Link>
              </div>
            ) : (
              recentTenants.map((tenant) => (
                <div key={tenant.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <h4 className="font-medium text-gray-900">{tenant.name}</h4>
                        <span className="text-sm text-gray-500">({tenant.subdomain})</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tenant.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tenant.subscriptionPlan}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Created: {new Date(tenant.createdAt).toLocaleDateString()} • Expires: {new Date(tenant.subscriptionExpiresAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/tenants/${tenant.id}/impersonate`}>
                        <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                          Login As
                        </button>
                      </Link>
                      <Link href={`/admin/tenants/${tenant.id}`}>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Manage
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="px-6 py-4 text-center">
              <h3 className="font-medium text-gray-900 mb-2">Tenant Management</h3>
              <p className="text-sm text-gray-600 mb-4">Create, manage, and monitor tenant accounts</p>
              <Link href="/admin/tenants">
                <PrimaryButton>Manage Tenants</PrimaryButton>
              </Link>
            </div>
          </Card>
          
          <Card>
            <div className="px-6 py-4 text-center">
              <h3 className="font-medium text-gray-900 mb-2">System Settings</h3>
              <p className="text-sm text-gray-600 mb-4">Configure system-wide settings and preferences</p>
              <Link href="/admin/settings">
                <PrimaryButton>System Settings</PrimaryButton>
              </Link>
            </div>
          </Card>
          
          <Card>
            <div className="px-6 py-4 text-center">
              <h3 className="font-medium text-gray-900 mb-2">Reports</h3>
              <p className="text-sm text-gray-600 mb-4">View usage reports and system analytics</p>
              <Link href="/admin/reports">
                <PrimaryButton>View Reports</PrimaryButton>
              </Link>
            </div>
          </Card>
        </div>
      </div>
      </Container>
    </AdminAuthWrapper>
  )
}
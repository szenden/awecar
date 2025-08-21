import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { PrimaryButton } from "@/_components/PrimaryButton"
import { FormTitle } from "@/_components/FormTitle"
import Link from "next/link"

export default async function AdminDashboardPage() {
  // This would typically fetch tenant stats from the API
  const stats = {
    totalTenants: 5,
    activeTenants: 4,
    expiringSoon: 1,
    newThisMonth: 2
  }

  const recentTenants = [
    {
      id: "1",
      name: "Auto Repair Shop A",
      subdomain: "repair-shop-a",
      subscriptionPlan: "Premium",
      isActive: true,
      createdAt: "2024-01-15",
      expiresAt: "2025-01-15"
    },
    {
      id: "2", 
      name: "Garage Solutions B",
      subdomain: "garage-b",
      subscriptionPlan: "Basic",
      isActive: true,
      createdAt: "2024-01-10",
      expiresAt: "2025-01-10"
    }
  ]

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <FormTitle>System Administration</FormTitle>
          <Link href="/admin/tenants/new">
            <PrimaryButton>Create New Tenant</PrimaryButton>
          </Link>
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
              <Link href="/admin/tenants">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </button>
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTenants.map((tenant) => (
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
                      Created: {tenant.createdAt} • Expires: {tenant.expiresAt}
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
            ))}
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
  )
}
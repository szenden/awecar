import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { PrimaryButton } from "@/_components/PrimaryButton"
import { SecondaryButton } from "@/_components/SecondaryButton"
import { FormTitle } from "@/_components/FormTitle"
import Link from "next/link"

export default async function TenantsPage() {
  // This would typically fetch tenant data from the API
  const tenant = {
    id: "1",
    name: "Default Tenant",
    subdomain: "default",
    subscriptionPlan: "Premium",
    subscriptionExpiresAt: "2099-12-31",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <FormTitle>Tenant Management</FormTitle>
        </div>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Current Tenant</h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <div className="mt-1 text-sm text-gray-900">{tenant.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subdomain</label>
                <div className="mt-1 text-sm text-gray-900">{tenant.subdomain}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
                <div className="mt-1 text-sm text-gray-900">{tenant.subscriptionPlan}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subscription Expires</label>
                <div className="mt-1 text-sm text-gray-900">{tenant.subscriptionExpiresAt}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tenant.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <Link href="/home/tenants/edit">
                <PrimaryButton>Edit Tenant</PrimaryButton>
              </Link>
              <Link href="/home/branches">
                <SecondaryButton>Manage Branches</SecondaryButton>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  )
}
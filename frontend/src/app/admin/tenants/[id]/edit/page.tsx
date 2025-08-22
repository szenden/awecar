'use client'

import { Container } from "@/_components/layout/Container"
import { Card } from "@/_components/Card"
import { PrimaryButton } from "@/_components/PrimaryButton"
import { FormTitle } from "@/_components/FormTitle"
import { FormInput } from "@/_components/FormInput"
import { FormLabel } from "@/_components/FormLabel"
import { FormSwitch } from "@/_components/FormSwitch"
import { AdminAuthWrapper } from "@/_components/AdminAuthWrapper"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

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

interface EditFormData {
  name: string
  subdomain: string
  subscriptionPlan: string
  subscriptionExpiresAt: string
  isActive: boolean
}

export default function EditTenantPage() {
  const params = useParams()
  const router = useRouter()
  const tenantId = params.id as string
  
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [formData, setFormData] = useState<EditFormData>({
    name: '',
    subdomain: '',
    subscriptionPlan: 'Basic',
    subscriptionExpiresAt: '',
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (tenantId) {
      fetchTenantDetails()
    }
  }, [tenantId])

  const fetchTenantDetails = () => {
    setLoading(true)
    
    fetch(`/api/admin/tenants/${tenantId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        setTenant(data)
        setFormData({
          name: data.name,
          subdomain: data.subdomain,
          subscriptionPlan: data.subscriptionPlan,
          subscriptionExpiresAt: data.subscriptionExpiresAt.split('T')[0], // Format for date input
          isActive: data.isActive
        })
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch tenant:', err)
        setError('Failed to load tenant details')
        setLoading(false)
      })
  }

  const handleInputChange = (field: keyof EditFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear messages when user starts editing
    if (successMessage) setSuccessMessage(null)
    if (error) setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    // Validate form
    if (!formData.name.trim()) {
      setError('Tenant name is required')
      setSaving(false)
      return
    }

    if (!formData.subdomain.trim()) {
      setError('Subdomain is required')
      setSaving(false)
      return
    }

    if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      setError('Subdomain can only contain lowercase letters, numbers, and hyphens')
      setSaving(false)
      return
    }

    // Make API call to update tenant
    const updateData = {
      name: formData.name,
      subdomain: formData.subdomain,
      subscriptionPlan: formData.subscriptionPlan,
      subscriptionExpiresAt: formData.subscriptionExpiresAt + 'T23:59:59Z',
      isActive: formData.isActive
    }

    fetch(`/api/admin/tenants/${tenantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.error || 'Failed to update tenant')
          })
        }
        return response.json()
      })
      .then(data => {
        setTenant(data.tenant)
        setSuccessMessage('Tenant updated successfully!')
        setSaving(false)

        // Redirect after a delay
        setTimeout(() => {
          router.push(`/admin/tenants/${tenantId}`)
        }, 1500)
      })
      .catch(err => {
        console.error('Failed to update tenant:', err)
        setError(err.message || 'Failed to update tenant. Please try again.')
        setSaving(false)
      })
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

  if (!tenant) {
    return (
      <AdminAuthWrapper>
        <Container>
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">Tenant not found</div>
            <Link href="/admin/tenants">
              <PrimaryButton>Back to Tenants</PrimaryButton>
            </Link>
          </div>
        </Container>
      </AdminAuthWrapper>
    )
  }

  return (
    <AdminAuthWrapper>
      <Container>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <Link href={`/admin/tenants/${tenantId}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block">
              ← Back to Tenant Details
            </Link>
            <FormTitle>Edit Tenant: {tenant.name}</FormTitle>
            <p className="text-gray-600">Tenant ID: {tenant.id}</p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{successMessage}</div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Edit Form */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Tenant Information</h3>
              <p className="text-sm text-gray-600 mt-1">Update the basic information for this tenant</p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel htmlFor="name">Tenant Name</FormLabel>
                  <FormInput
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter tenant name"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">The display name for this tenant</p>
                </div>

                <div>
                  <FormLabel htmlFor="subdomain">Subdomain</FormLabel>
                  <FormInput
                    id="subdomain"
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase())}
                    placeholder="Enter subdomain"
                    pattern="^[a-z0-9-]+$"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lowercase letters, numbers, and hyphens only. Will be: {formData.subdomain}.localhost:3000
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel htmlFor="subscriptionPlan">Subscription Plan</FormLabel>
                  <select
                    id="subscriptionPlan"
                    value={formData.subscriptionPlan}
                    onChange={(e) => handleInputChange('subscriptionPlan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Professional">Professional</option>
                    <option value="Premium">Premium</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">The subscription tier for this tenant</p>
                </div>

                <div>
                  <FormLabel htmlFor="subscriptionExpiresAt">Subscription Expires</FormLabel>
                  <FormInput
                    id="subscriptionExpiresAt"
                    type="date"
                    value={formData.subscriptionExpiresAt}
                    onChange={(e) => handleInputChange('subscriptionExpiresAt', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">When the subscription expires</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <FormLabel htmlFor="isActive">Tenant Status</FormLabel>
                    <p className="text-sm text-gray-600">Control whether this tenant can access their account</p>
                  </div>
                  <FormSwitch
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(checked) => handleInputChange('isActive', checked)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.isActive ? 'Tenant is active and can access their account' : 'Tenant is suspended and cannot access their account'}
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <Link href={`/admin/tenants/${tenantId}`}>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </Link>

                <PrimaryButton
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </PrimaryButton>
              </div>
            </form>
          </Card>

          {/* Danger Zone */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
              <p className="text-sm text-gray-600 mt-1">Irreversible and destructive actions</p>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Suspend Tenant</h4>
                  <p className="text-sm text-gray-600">Temporarily disable this tenant's access</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('isActive', false)}
                  disabled={!formData.isActive}
                  className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!formData.isActive ? 'Already Suspended' : 'Suspend Tenant'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Delete Tenant</h4>
                  <p className="text-sm text-gray-600">Permanently delete this tenant and all their data</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Delete functionality would be implemented here')}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete Tenant
                </button>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </AdminAuthWrapper>
  )
}
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FormInput } from "@/_components/FormInput"
import { FormLabel } from "@/_components/FormLabel"
import { PrimaryButton } from "@/_components/PrimaryButton"
import { SecondaryButton } from "@/_components/SecondaryButton"

interface CreateTenantData {
  // Tenant Details
  tenantName: string
  subdomain: string
  subscriptionPlan: string
  subscriptionExpiresAt: string
  
  // Admin User Details
  adminUsername: string
  adminEmail: string
  adminPassword: string
  adminFirstName: string
  adminLastName: string
  
  // Default Branch Details
  defaultBranchName: string
  defaultBranchAddress: string
  defaultBranchPhone: string
  defaultBranchEmail: string
}

export function CreateTenantForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateTenantData>({
    tenantName: '',
    subdomain: '',
    subscriptionPlan: 'Basic',
    subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    adminUsername: '',
    adminEmail: '',
    adminPassword: '',
    adminFirstName: '',
    adminLastName: '',
    defaultBranchName: 'Main Branch',
    defaultBranchAddress: '',
    defaultBranchPhone: '',
    defaultBranchEmail: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [creationResult, setCreationResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setCreationResult(null)

    try {
      // Auto-generate username if not provided
      if (!formData.adminUsername) {
        formData.adminUsername = formData.adminEmail.split('@')[0]
      }
      
      // Use admin email as default branch email if not provided
      if (!formData.defaultBranchEmail) {
        formData.defaultBranchEmail = formData.adminEmail
      }

      const response = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setCreationResult(result)
      } else {
        throw new Error(result.message || 'Failed to create tenant')
      }
    } catch (error) {
      console.error('Error creating tenant:', error)
      alert('Error creating tenant: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CreateTenantData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-generate subdomain from tenant name
    if (field === 'tenantName' && !formData.subdomain) {
      const subdomain = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 30)
      
      setFormData(prev => ({
        ...prev,
        subdomain: subdomain
      }))
    }
  }

  if (creationResult) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Tenant Created Successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>The tenant "{creationResult.tenant?.name}" has been created successfully.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenant Access URL</label>
            <div className="mt-1">
              <a 
                href={creationResult.loginUrl} 
                target="_blank" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {creationResult.loginUrl}
              </a>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Login Token</label>
            <div className="mt-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
              {creationResult.loginToken}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use this token to log in as the tenant administrator
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => window.open(creationResult.loginUrl, '_blank')}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Open Tenant Environment
            </button>
            <SecondaryButton onClick={() => router.push('/admin')}>
              Back to Admin Dashboard
            </SecondaryButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tenant Details Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tenant Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel htmlFor="tenantName" required>Tenant Name</FormLabel>
            <FormInput
              id="tenantName"
              type="text"
              value={formData.tenantName}
              onChange={(e) => handleInputChange('tenantName', e.target.value)}
              placeholder="Enter tenant name"
              required
            />
          </div>

          <div>
            <FormLabel htmlFor="subdomain" required>Subdomain</FormLabel>
            <FormInput
              id="subdomain"
              type="text"
              value={formData.subdomain}
              onChange={(e) => handleInputChange('subdomain', e.target.value)}
              placeholder="tenant-subdomain"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Will be accessible at: {formData.subdomain}.localhost:3000
            </p>
          </div>

          <div>
            <FormLabel htmlFor="subscriptionPlan">Subscription Plan</FormLabel>
            <select
              id="subscriptionPlan"
              value={formData.subscriptionPlan}
              onChange={(e) => handleInputChange('subscriptionPlan', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </select>
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
          </div>
        </div>
      </div>

      {/* Admin User Details Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Administrator Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel htmlFor="adminFirstName" required>First Name</FormLabel>
            <FormInput
              id="adminFirstName"
              type="text"
              value={formData.adminFirstName}
              onChange={(e) => handleInputChange('adminFirstName', e.target.value)}
              placeholder="Enter first name"
              required
            />
          </div>

          <div>
            <FormLabel htmlFor="adminLastName">Last Name</FormLabel>
            <FormInput
              id="adminLastName"
              type="text"
              value={formData.adminLastName}
              onChange={(e) => handleInputChange('adminLastName', e.target.value)}
              placeholder="Enter last name"
            />
          </div>

          <div>
            <FormLabel htmlFor="adminEmail" required>Email</FormLabel>
            <FormInput
              id="adminEmail"
              type="email"
              value={formData.adminEmail}
              onChange={(e) => handleInputChange('adminEmail', e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <FormLabel htmlFor="adminUsername">Username</FormLabel>
            <FormInput
              id="adminUsername"
              type="text"
              value={formData.adminUsername}
              onChange={(e) => handleInputChange('adminUsername', e.target.value)}
              placeholder="Will be auto-generated from email if empty"
            />
          </div>

          <div className="md:col-span-2">
            <FormLabel htmlFor="adminPassword" required>Password</FormLabel>
            <FormInput
              id="adminPassword"
              type="password"
              value={formData.adminPassword}
              onChange={(e) => handleInputChange('adminPassword', e.target.value)}
              placeholder="Enter admin password (min 8 characters)"
              required
            />
          </div>
        </div>
      </div>

      {/* Default Branch Details Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Default Branch</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel htmlFor="defaultBranchName">Branch Name</FormLabel>
            <FormInput
              id="defaultBranchName"
              type="text"
              value={formData.defaultBranchName}
              onChange={(e) => handleInputChange('defaultBranchName', e.target.value)}
              placeholder="Main Branch"
            />
          </div>

          <div>
            <FormLabel htmlFor="defaultBranchPhone">Phone</FormLabel>
            <FormInput
              id="defaultBranchPhone"
              type="tel"
              value={formData.defaultBranchPhone}
              onChange={(e) => handleInputChange('defaultBranchPhone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="md:col-span-2">
            <FormLabel htmlFor="defaultBranchAddress">Address</FormLabel>
            <FormInput
              id="defaultBranchAddress"
              type="text"
              value={formData.defaultBranchAddress}
              onChange={(e) => handleInputChange('defaultBranchAddress', e.target.value)}
              placeholder="Enter branch address"
            />
          </div>

          <div>
            <FormLabel htmlFor="defaultBranchEmail">Email</FormLabel>
            <FormInput
              id="defaultBranchEmail"
              type="email"
              value={formData.defaultBranchEmail}
              onChange={(e) => handleInputChange('defaultBranchEmail', e.target.value)}
              placeholder="Will use admin email if empty"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Tenant...' : 'Create Tenant'}
        </PrimaryButton>
        <SecondaryButton
          type="button"
          onClick={() => router.push('/admin')}
        >
          Cancel
        </SecondaryButton>
      </div>
    </form>
  )
}
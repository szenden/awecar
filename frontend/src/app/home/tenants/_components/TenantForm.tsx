'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FormInput } from "@/_components/FormInput"
import { FormLabel } from "@/_components/FormLabel"
import { FormSwitch } from "@/_components/FormSwitch"
import { PrimaryButton } from "@/_components/PrimaryButton"
import { SecondaryButton } from "@/_components/SecondaryButton"

interface TenantData {
  id?: string
  name: string
  subdomain: string
  subscriptionPlan: string
  subscriptionExpiresAt: string
  isActive: boolean
}

interface TenantFormProps {
  initialData?: TenantData
}

export function TenantForm({ initialData }: TenantFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<TenantData>({
    name: initialData?.name || '',
    subdomain: initialData?.subdomain || '',
    subscriptionPlan: initialData?.subscriptionPlan || 'Basic',
    subscriptionExpiresAt: initialData?.subscriptionExpiresAt || new Date().toISOString().split('T')[0],
    isActive: initialData?.isActive ?? true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = initialData?.id 
        ? `/api/tenants/${initialData.id}`
        : '/api/tenants'
      
      const method = initialData?.id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/home/tenants')
        router.refresh()
      } else {
        throw new Error('Failed to save tenant')
      }
    } catch (error) {
      console.error('Error saving tenant:', error)
      alert('Error saving tenant. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof TenantData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormLabel htmlFor="name" required>Tenant Name</FormLabel>
          <FormInput
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
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
            placeholder="Enter subdomain"
            required
          />
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

      <div>
        <FormSwitch
          checked={formData.isActive}
          onChange={(checked) => handleInputChange('isActive', checked)}
          label="Active"
          description="Whether this tenant is active and can access the system"
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Tenant' : 'Create Tenant')}
        </PrimaryButton>
        <SecondaryButton
          type="button"
          onClick={() => router.push('/home/tenants')}
        >
          Cancel
        </SecondaryButton>
      </div>
    </form>
  )
}
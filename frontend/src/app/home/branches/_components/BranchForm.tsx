'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FormInput } from "@/_components/FormInput"
import { FormLabel } from "@/_components/FormLabel"
import { FormSwitch } from "@/_components/FormSwitch"
import { PrimaryButton } from "@/_components/PrimaryButton"
import { SecondaryButton } from "@/_components/SecondaryButton"

interface BranchData {
  id?: string
  name: string
  address: string
  phone: string
  email: string
  isActive: boolean
}

interface BranchFormProps {
  initialData?: BranchData
}

export function BranchForm({ initialData }: BranchFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<BranchData>({
    name: initialData?.name || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    isActive: initialData?.isActive ?? true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = initialData?.id 
        ? `/api/branches/${initialData.id}`
        : '/api/branches'
      
      const method = initialData?.id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/home/branches')
        router.refresh()
      } else {
        throw new Error('Failed to save branch')
      }
    } catch (error) {
      console.error('Error saving branch:', error)
      alert('Error saving branch. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof BranchData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FormLabel htmlFor="name" required>Branch Name</FormLabel>
          <FormInput
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter branch name"
            required
          />
        </div>

        <div className="md:col-span-2">
          <FormLabel htmlFor="address">Address</FormLabel>
          <FormInput
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter branch address"
          />
        </div>

        <div>
          <FormLabel htmlFor="phone">Phone</FormLabel>
          <FormInput
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormInput
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div>
        <FormSwitch
          checked={formData.isActive}
          onChange={(checked) => handleInputChange('isActive', checked)}
          label="Active"
          description="Whether this branch is active and can be used"
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Branch' : 'Create Branch')}
        </PrimaryButton>
        <SecondaryButton
          type="button"
          onClick={() => router.push('/home/branches')}
        >
          Cancel
        </SecondaryButton>
      </div>
    </form>
  )
}
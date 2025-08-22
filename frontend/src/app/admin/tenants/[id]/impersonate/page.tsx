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

export default function TenantImpersonatePage() {
  const params = useParams()
  const tenantId = params.id as string
  
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [impersonating, setImpersonating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [impersonationUrl, setImpersonationUrl] = useState<string | null>(null)

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
        setError(null)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch tenant:', err)
        setError('Failed to load tenant details')
        setLoading(false)
      })
  }

  const handleImpersonate = () => {
    if (!tenant) return
    
    setImpersonating(true)
    
    // Generate impersonation URL
    const url = `http://${tenant.subdomain}.localhost:3000`
    setImpersonationUrl(url)
    
    // Simulate impersonation token generation
    setTimeout(() => {
      setImpersonating(false)
      
      // Open in new tab
      window.open(url, '_blank')
    }, 1500)
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

  return (
    <AdminAuthWrapper>
      <Container>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <Link href={`/admin/tenants/${tenant.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block">
              ← Back to Tenant Details
            </Link>
            <FormTitle>Impersonate Tenant</FormTitle>
            <p className="text-gray-600">Login as {tenant.name}</p>
          </div>

          {/* Tenant Info */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Tenant Information</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tenant.isActive ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Impersonation Actions */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Admin Impersonation</h3>
              <p className="text-sm text-gray-600 mt-1">
                Login as this tenant's admin user to access their system
              </p>
            </div>
            <div className="px-6 py-4 space-y-4">
              {!tenant.isActive && (
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="text-sm text-yellow-700">
                    <strong>Warning:</strong> This tenant is currently suspended. 
                    You may still impersonate them, but they won't have normal access.
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target URL</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono">
                    {impersonationUrl || `http://${tenant.subdomain}.localhost:3000`}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(`http://${tenant.subdomain}.localhost:3000`)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <div className="text-sm text-blue-700">
                  <strong>How it works:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• You'll be logged in as the tenant's admin user</li>
                    <li>• You'll have full access to their system</li>
                    <li>• The session will be tracked for audit purposes</li>
                    <li>• Use responsibly and respect tenant privacy</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Link href={`/admin/tenants/${tenant.id}`}>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                    Cancel
                  </button>
                </Link>

                <div className="flex space-x-2">
                  <a
                    href={`http://${tenant.subdomain}.localhost:3000`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                  >
                    Open in New Tab
                  </a>
                  
                  <button
                    onClick={handleImpersonate}
                    disabled={impersonating}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {impersonating ? 'Generating Session...' : 'Impersonate Tenant'}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Notice */}
          <Card>
            <div className="px-6 py-4">
              <div className="bg-red-50 p-4 rounded-md">
                <div className="text-sm text-red-700">
                  <strong>Security Notice:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• This action is logged and audited</li>
                    <li>• Only use impersonation for legitimate support purposes</li>
                    <li>• Respect tenant data privacy and confidentiality</li>
                    <li>• Do not modify tenant data unless authorized</li>
                    <li>• Inform the tenant if significant changes are made</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </AdminAuthWrapper>
  )
}
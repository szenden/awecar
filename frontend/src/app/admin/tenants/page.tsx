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

export default function TenantManagementPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

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

  const filteredAndSortedTenants = tenants
    .filter(tenant => {
      const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && tenant.isActive) ||
                          (filterStatus === 'inactive' && !tenant.isActive)
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Tenant]
      let bValue: any = b[sortBy as keyof Tenant]
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'subscriptionExpiresAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getExpiryStatus = (expiresAt: string) => {
    const expiry = new Date(expiresAt)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return { status: 'expired', class: 'bg-red-100 text-red-800', text: 'Expired' }
    if (daysUntilExpiry <= 30) return { status: 'expiring', class: 'bg-yellow-100 text-yellow-800', text: `${daysUntilExpiry}d left` }
    return { status: 'active', class: 'bg-green-100 text-green-800', text: 'Active' }
  }

  return (
    <AdminAuthWrapper>
      <Container>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <FormTitle>Tenant Management</FormTitle>
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

          {/* Filters and Search */}
          <Card>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Search by name or subdomain..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Tenants</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="name">Name</option>
                    <option value="subscriptionExpiresAt">Expiry Date</option>
                    <option value="subscriptionPlan">Plan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Tenants Table */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                All Tenants ({filteredAndSortedTenants.length})
              </h3>
            </div>
            
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <div className="text-gray-500 text-sm mt-2">Loading tenants...</div>
              </div>
            ) : filteredAndSortedTenants.length === 0 ? (
              <div className="px-6 py-4 text-center">
                <div className="text-gray-500 text-sm">
                  {searchTerm || filterStatus !== 'all' ? 'No tenants match your filters' : 'No tenants found'}
                </div>
                {!searchTerm && filterStatus === 'all' && (
                  <Link href="/admin/tenants/new">
                    <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Create Your First Tenant
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('name')}
                      >
                        Tenant Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subdomain
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('subscriptionPlan')}
                      >
                        Plan {sortBy === 'subscriptionPlan' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('subscriptionExpiresAt')}
                      >
                        Expires {sortBy === 'subscriptionExpiresAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('createdAt')}
                      >
                        Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedTenants.map((tenant) => {
                      const expiryStatus = getExpiryStatus(tenant.subscriptionExpiresAt)
                      return (
                        <tr key={tenant.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                                <div className="text-sm text-gray-500">ID: {tenant.id.slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono">{tenant.subdomain}</div>
                            <div className="text-sm text-gray-500">{tenant.subdomain}.localhost:3000</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {tenant.subscriptionPlan}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {tenant.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expiryStatus.class}`}>
                                {expiryStatus.text}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(tenant.subscriptionExpiresAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(tenant.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link href={`/admin/tenants/${tenant.id}`}>
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  View
                                </button>
                              </Link>
                              <Link href={`/admin/tenants/${tenant.id}/edit`}>
                                <button className="text-blue-600 hover:text-blue-900">
                                  Edit
                                </button>
                              </Link>
                              <Link href={`/admin/tenants/${tenant.id}/impersonate`}>
                                <button className="text-purple-600 hover:text-purple-900">
                                  Login As
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </Container>
    </AdminAuthWrapper>
  )
}
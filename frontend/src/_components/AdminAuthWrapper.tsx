'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Small delay to ensure cookies are set after redirect
    const timer = setTimeout(() => {
      checkAuthentication()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const checkAuthentication = async () => {
    try {
      console.log('Checking admin authentication...')
      console.log('All cookies:', document.cookie)

      // Check for JWT cookie first (since session cookie is httpOnly)
      const jwtCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt='))

      console.log('JWT cookie exists:', !!jwtCookie)

      if (jwtCookie) {
        try {
          const jwtValue = jwtCookie.split('=')[1]
          const payload = JSON.parse(atob(jwtValue))
          console.log('JWT payload:', payload)
          
          // Check if user is system admin
          if (payload.isSystemAdmin || payload.role === 'system_admin') {
            console.log('Admin authentication successful')
            setIsAuthenticated(true)
            setIsLoading(false)
            return
          } else {
            console.log('User is not system admin')
            setIsAuthenticated(false)
            setIsLoading(false)
            router.push('/admin/login')
            return
          }
        } catch (jwtError) {
          console.error('JWT decode error:', jwtError)
        }
      }

      // Check for session timestamp as a fallback indicator
      const timestampCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('session_timestamp='))

      console.log('Session timestamp exists:', !!timestampCookie)

      if (!jwtCookie && !timestampCookie) {
        console.log('No authentication cookies found, redirecting to login')
        setIsAuthenticated(false)
        setIsLoading(false)
        router.push('/admin/login')
        return
      }

      // For development fallback with session timestamp
      if (timestampCookie) {
        console.log('Using session timestamp fallback authentication')
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }

      // If we get here, something went wrong
      console.log('Authentication check inconclusive, redirecting to login')
      setIsAuthenticated(false)
      setIsLoading(false)
      router.push('/admin/login')
    } catch (error) {
      console.error('Authentication check failed:', error)
      setIsAuthenticated(false)
      setIsLoading(false)
      router.push('/admin/login')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">System Administration</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
              <button
                onClick={() => {
                  // Clear cookies
                  document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                  document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                  document.cookie = 'session_timestamp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                  router.push('/admin/login')
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">
        {children}
      </main>
    </>
  )
}
'use client'

import { useEffect, useState } from 'react'

export default function TestAuthPage() {
  const [cookies, setCookies] = useState<string>('')
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    // Get all cookies
    const allCookies = document.cookie
    setCookies(allCookies)

    // Try to decode JWT if it exists
    const jwtCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt='))

    if (jwtCookie) {
      try {
        const jwtValue = jwtCookie.split('=')[1]
        const payload = JSON.parse(atob(jwtValue))
        setSessionData(payload)
      } catch (error) {
        console.error('JWT decode error:', error)
      }
    }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Raw Cookies:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {cookies || 'No cookies found'}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Decoded Session Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {sessionData ? JSON.stringify(sessionData, null, 2) : 'No session data'}
          </pre>
        </div>
      </div>
    </div>
  )
}
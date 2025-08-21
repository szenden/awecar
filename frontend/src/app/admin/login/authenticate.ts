'use server'
import { createSession } from '@/_lib/server/session'
import { redirect } from 'next/navigation';
import { httpPost } from '@/_lib/server/query-api';

export async function authenticateAdmin(prevState: { error: string }, formData: FormData)
  : Promise<{ error: string } | never> {

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // For development, allow hardcoded admin credentials
  // In production, this should use proper authentication API
  if (username === 'admin' && password === 'admin123') {
    try {
      // Create a simple admin session
      const mockJwt = btoa(JSON.stringify({
        username: 'admin',
        role: 'system_admin',
        isSystemAdmin: true,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8) // 8 hours
      }));
      
      const mockPublicJwt = btoa(JSON.stringify({
        username: 'admin',
        role: 'system_admin',
        isSystemAdmin: true
      }));
      
      console.log('Admin login successful, creating session...');
      await createSession(mockJwt, mockPublicJwt);
      console.log('Session created, redirecting to /admin');
    } catch (error) {
      console.error('Session creation failed:', error);
      return { error: "Session creation failed" };
    }
    
    // This redirect throws and prevents further execution
    redirect('/admin');
  }

  // Try to authenticate with the backend API
  try {
    const res = await httpPost({
      url: 'users/authenticate',
      body: {
        username,
        password,
        serverSecret: process.env.SERVER_SECRET
      },
      authorize: false,
    });

    if (!res.ok) {
      return { error: "Invalid admin credentials" };
    }

    const jsonResponse = await res.json();

    // Check if user is system admin
    if (jsonResponse.jwt && jsonResponse.publicJwt) {
      // Decode JWT to check if user is system admin
      try {
        const payload = JSON.parse(atob(jsonResponse.jwt.split('.')[1]));
        if (payload.isSystemAdmin || payload.role === 'system_admin' || payload.username === 'admin') {
          await createSession(jsonResponse.jwt, jsonResponse.publicJwt);
          redirect('/admin');
        } else {
          return { error: "Access denied. System administrator privileges required." };
        }
      } catch {
        return { error: "Invalid token format" };
      }
    }
  } catch (error) {
    console.error('Admin authentication error:', error);
  }

  return { error: "Invalid admin credentials" };
}
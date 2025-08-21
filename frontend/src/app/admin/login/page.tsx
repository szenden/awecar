'use client'
import Image from 'next/image';
import { authenticateAdmin } from './authenticate'
import { useActionState } from 'react'

const initialState = {
  error: '',
};

export default function AdminLoginPage() {
  const [state, action] = useActionState(authenticateAdmin, initialState);

  return (
    <>
      <div className="bg-white flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image alt="Logo" width="50" height="50" className="h-10 w-auto" src="/logo.png"></Image>
              <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">System Administrator</h2>
              <p className="mt-2 text-sm/6 text-gray-500">
                Sign in to manage tenants and system settings
              </p>
            </div>

            <div className="mt-10">
              <div>
                {state?.error && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{state.error}</div>
                  </div>
                )}
                <form action={action} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        placeholder="admin"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="admin123"
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign in as Admin
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 rounded-md">
                <h4 className="text-sm font-medium text-yellow-800">Development Mode</h4>
                <div className="mt-2 text-sm text-yellow-700">
                  <p><strong>Default Admin Credentials:</strong></p>
                  <p>Username: admin</p>
                  <p>Password: admin123</p>
                  <p className="mt-2 text-xs text-red-600">⚠️ Change these credentials in production!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image alt='' src="/m2.webp" width="1840" height="1380" className="absolute inset-0 size-full object-cover"></Image>
        </div>
      </div>
    </>
  )
}
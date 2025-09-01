'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import type { LoginRequest } from '@/types/auth';
 

const SignInForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const { login, isLoading, error: storeError, clearError, isAuthenticated } = useAuthStore()
  const router = useRouter()
   
  // Clear errors when component mounts atau input berubah
  useEffect(() => {
    if (storeError || localError) {
      clearError()
      setLocalError('')
    }
  }, [email, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError() 
    // Validasi client-side
    if (!email || !password) {
      setLocalError('Please fill in all fields')
      return
    }

    if (!email.includes('@')) {
      setLocalError('Please enter a valid email address')
      return
    }

    // Attempt login
    const result = await login({ email, password } as LoginRequest)
     
    if (result.success) {
      // Login berhasil, redirect akan ditangani oleh AuthGuard
      router.push('/')
    }else{
     
      setLocalError('Login Gagal, silahkan coba lagi')
    }
    // Error sudah ditangani di store, tidak perlu handling tambahan di sini
  }

  // Gabungkan error dari store dan local error
  const displayError = storeError || localError
  if (isAuthenticated) {
    return (
      <div>
        <p>Anda sudah login</p>
      </div>
    )
  }else{
    return (
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign In
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome back! Please sign in to your account
            </p>
          </div>
  
          {/* Error Display dengan animasi */}
          {displayError && (
            <div className="mb-4 animate-fade-in rounded-md bg-red-50 border border-red-200 p-3 dark:bg-red-900/20 dark:border-red-800">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {displayError}
                  </p>
                </div>
              </div>
            </div>
          )}
  
          {/* Demo Credentials Info */}
          <div className="mb-4 rounded-md bg-blue-50 border border-blue-200 p-3 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  <strong>Demo credentials:</strong> admin@example.com / password
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  Try different emails to see error handling:
                  <br />• blocked@example.com - Account blocked
                  <br />• notfound@example.com - Account not found
                  <br />• server@error.com - Server error
                </p>
              </div>
            </div>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${displayError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
                  }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
  
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${displayError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
                  }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
  
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
  
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
  
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button> 
  
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default SignInForm
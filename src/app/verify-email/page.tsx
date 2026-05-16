'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { auth, setToken } from '../../lib/api'

// 1. All of your original page logic lives inside this sub-component now
function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (!token || !email) {
      setStatus('error')
      setError('Invalid verification link. Missing token or email.')
      return
    }
    // Show form for user to complete signup with password and name
    setShowForm(true)
    setStatus('loading')
  }, [token, email])

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await auth.verifyEmailLink({
        token: token!,
        email: email!,
        password,
        name
      })
      setToken(result.token)
      setStatus('success')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow-sm bg-white">
        {status === 'loading' && !showForm && <p>Loading verification...</p>}
        
        {status === 'error' && (
          <div className="text-red-500 font-medium">{error}</div>
        )}

        {status === 'success' && (
          <div className="text-green-500 font-medium">Email verified successfully! Redirecting...</div>
        )}

        {showForm && status !== 'success' && (
          <form onSubmit={handleCompleteSignup} className="space-y-4">
            <h2 className="text-xl font-bold">Complete your Signup</h2>
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border p-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border p-2 mt-1"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded p-2 font-medium disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Complete Setup'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// 2. The main default export wraps your component safely in a Suspense boundary
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading page setup...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}

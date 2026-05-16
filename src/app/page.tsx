'use client'

import React from 'react'
import Link from 'next/link'

export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome to Harkly
        </h1>
        <p className="text-lg text-gray-600">
          Your AI receptionist platform. The frontend has loaded successfully!
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/login" 
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
          >
            Go to Portal Login
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 border rounded-xl p-6">
        <div>
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-sm text-gray-600">
            Sign in to access your property dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded px-4 py-2"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {message && (
          <p className="text-sm text-red-600">{message}</p>
        )}
      </div>
    </main>
  )
}

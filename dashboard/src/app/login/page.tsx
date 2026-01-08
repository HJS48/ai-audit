'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your email for the login link!' })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-surface rounded-lg border border-border">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            Agency AI Audit
          </h1>
          <p className="text-text-muted">
            Sign in to view your audit dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-text-muted mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-dim focus:outline-none focus:border-info transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-success text-background font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Sending link...' : 'Send magic link'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-4 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-success-dim text-success'
                : 'bg-danger-dim text-danger'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}

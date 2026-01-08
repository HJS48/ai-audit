import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // TODO: Get user's submissions and redirect to most recent
  // For now, show a simple landing
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-text-primary mb-4">
          Agency AI Audit
        </h1>
        <p className="text-text-muted mb-8">
          Your audit dashboard will appear here
        </p>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="px-6 py-2 bg-surface border border-border rounded-lg text-text-primary hover:bg-surface-hover transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}

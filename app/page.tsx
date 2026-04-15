import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not logged in, send to login
  if (!user) {
    redirect('/login')
  }

  // If logged in, send to dashboard
  redirect('/dashboard')
}

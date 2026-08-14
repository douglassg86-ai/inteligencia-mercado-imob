import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export function useSupabaseUser() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const signIn = async () => {
      const { data: { session: existingSession } } = await supabase.auth.getSession()
      if (existingSession && !existingSession.user?.is_anonymous && existingSession.user?.email) {
        setUser(existingSession.user)
        return
      }

      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) {
        console.error('Erro no Auth (Supabase):', error)
        setUser({ uid: 'demo-user' })
      } else {
        setUser(data.user)
      }
    }

    signIn()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  return user
}

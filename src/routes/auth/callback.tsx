import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()
  const [msg, setMsg] = useState('Signing you in...')

  useEffect(() => {
    const handleAuth = async () => {
      console.log('Callback URL:', window.location.href) // <-- check this in console
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      
      if (error) {
        console.error('Auth callback error:', error)
        setMsg('Error: ' + error.message)
        setTimeout(() => navigate({ to: '/auth/login' }), 2000)
      } else {
        console.log('Session:', data.session)
        setMsg('Success! Redirecting...')
        setTimeout(() => navigate({ to: '/' }), 500)
      }
    }
    
    handleAuth()
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <p className="text-[#C9A84C]">{msg}</p>
    </div>
  )
}
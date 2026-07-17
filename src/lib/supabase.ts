import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://jcodxsxcxsvtuobgwzxi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjb2R4c3hjeHN2dHVvYmd3enhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTI5NTEsImV4cCI6MjA5OTA4ODk1MX0.EbdGQpilCZ60y047gIg31S4IkgMWaqT3ysINutYiwbs',
  {
    auth: {
      flowType: 'pkce', // <-- THIS IS THE KEY
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)
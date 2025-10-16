import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zchzagodrwjlgqvcqvqz.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjaHphZ29kcndqbGdxdmNxdnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzAyMDAsImV4cCI6MjA3NjIwNjIwMH0.L64U61A6IDhgMJ8MxGp81Yi-tKNKgsyKo8D01nHFfT4'

export const supabase = createClient(supabaseUrl, supabaseKey)

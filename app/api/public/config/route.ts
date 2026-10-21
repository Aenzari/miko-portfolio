import { NextResponse } from 'next/server'
import { getConfig } from '@/lib/server-store'
import { createServerSupabaseClient } from '@/lib/supabase'

export const revalidate = 0

export async function GET() {
  try {
    const config = getConfig()

    // Optionally check if Supabase has live values
    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.from('site_config').select('*').eq('id', 'primary').maybeSingle()
      if (!error && data) {
        return NextResponse.json({ config: { ...config, ...data } })
      }
    } catch {
      // Supabase unconfigured or offline
    }

    return NextResponse.json({ config })
  } catch {
    const config = getConfig()
    return NextResponse.json({ config })
  }
}

import { NextResponse } from 'next/server'
import { getProjects } from '@/lib/server-store'
import { createServerSupabaseClient } from '@/lib/supabase'

export const revalidate = 0

export async function GET() {
  try {
    let projects = getProjects()

    // Optionally check if Supabase has live projects
    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.from('projects').select('*').order('display_order', { ascending: true })
      if (!error && data && data.length > 0) {
        projects = data
      }
    } catch {
      // offline/local
    }

    return NextResponse.json({ projects })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch projects'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

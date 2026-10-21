import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { getStore } from '@/lib/server-store'
import { createServerSupabaseClient } from '@/lib/supabase'

export const revalidate = 0

export async function GET() {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Fetch from guaranteed local store
    const localStore = getStore()

    // 2. If Supabase is reachable and has data, optionally sync
    try {
      const supabase = createServerSupabaseClient()
      const [inquiriesRes, projectsRes, configRes] = await Promise.all([
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('display_order', { ascending: true }),
        supabase.from('site_config').select('*').eq('id', 'primary').maybeSingle()
      ])

      // Only override if Supabase actually returned non-empty data
      if (projectsRes.data && projectsRes.data.length > 0) {
        localStore.projects = projectsRes.data
      }
      if (inquiriesRes.data && inquiriesRes.data.length > 0) {
        localStore.inquiries = inquiriesRes.data
      }
      if (configRes.data) {
        localStore.config = { ...localStore.config, ...configRes.data }
      }
    } catch {
      // Supabase is unconfigured or offline, local store provides full functionality
    }

    return NextResponse.json({
      inquiries: localStore.inquiries,
      projects: localStore.projects,
      config: localStore.config
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch admin data'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

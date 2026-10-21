import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { updateConfig } from '@/lib/server-store'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const updates = await req.json()
    const updated = updateConfig(updates)

    // Best-effort Supabase sync
    try {
      const supabase = createServerSupabaseClient()
      await supabase
        .from('site_config')
        .update(updates)
        .eq('id', 'primary')
    } catch {
      // offline/local mode
    }

    return NextResponse.json({ config: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update config'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

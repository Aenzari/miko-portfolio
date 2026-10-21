import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { updateInquiry, deleteInquiry } from '@/lib/server-store'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, is_read } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing inquiry id' }, { status: 400 })

    const updated = updateInquiry(id, { is_read })

    // Best-effort Supabase sync
    try {
      const supabase = createServerSupabaseClient()
      await supabase.from('inquiries').update({ is_read }).eq('id', id)
    } catch {
      // offline/local mode
    }

    return NextResponse.json({ inquiry: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update inquiry'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing inquiry id' }, { status: 400 })

    const ok = deleteInquiry(id)

    // Best-effort Supabase sync
    try {
      const supabase = createServerSupabaseClient()
      await supabase.from('inquiries').delete().eq('id', id)
    } catch {
      // offline/local mode
    }

    return NextResponse.json({ success: ok })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete inquiry'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

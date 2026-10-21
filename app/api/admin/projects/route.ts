import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { createProject, updateProject, deleteProject, resetProjectsToDefault, getProjects } from '@/lib/server-store'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const projects = getProjects()
  return NextResponse.json({ projects })
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()

    // Handle special action: reset defaults
    if (body.action === 'reset_defaults') {
      const reset = resetProjectsToDefault()
      return NextResponse.json({ projects: reset, message: 'Projects reset to 10 flagship defaults' })
    }

    const created = createProject(body)

    // Best-effort Supabase sync
    try {
      const supabase = createServerSupabaseClient()
      await supabase.from('projects').insert([created])
    } catch {
      // offline/local mode
    }

    return NextResponse.json({ project: created })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, ...updates } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing project id' }, { status: 400 })

    const updated = updateProject(id, updates)
    if (!updated) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    // Best-effort Supabase sync
    try {
      const supabase = createServerSupabaseClient()
      await supabase.from('projects').update(updates).eq('id', id)
    } catch {
      // offline/local mode
    }

    return NextResponse.json({ project: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing project id' }, { status: 400 })

    const ok = deleteProject(id)

    // Best-effort Supabase sync
    try {
      const supabase = createServerSupabaseClient()
      await supabase.from('projects').delete().eq('id', id)
    } catch {
      // offline/local mode
    }

    return NextResponse.json({ success: ok })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { createProject, updateProject, deleteProject, resetProjectsToDefault, getProjects } from '@/lib/server-store'

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

    if (body.action === 'reset_defaults') {
      const reset = resetProjectsToDefault()
      return NextResponse.json({ projects: reset, message: 'Projects reset to 10 flagship defaults' })
    }

    const created = createProject(body)
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
    return NextResponse.json({ success: ok })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete project'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

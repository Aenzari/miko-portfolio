import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { getStore } from '@/lib/server-store'

export const revalidate = 0

export async function GET() {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const localStore = getStore()

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

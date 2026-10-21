import { NextResponse } from 'next/server'
import { getProjects } from '@/lib/server-store'

export const revalidate = 0

export async function GET() {
  try {
    const projects = getProjects()
    return NextResponse.json({ projects })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch projects'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

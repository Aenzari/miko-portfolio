import { NextResponse } from 'next/server'
import { getConfig } from '@/lib/server-store'

export const revalidate = 0

export async function GET() {
  try {
    const config = getConfig()
    return NextResponse.json({ config })
  } catch {
    return NextResponse.json({ config: null }, { status: 500 })
  }
}

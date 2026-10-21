import { NextRequest, NextResponse } from 'next/server'
import { getExpectedAdminPassword, getAdminCookieName } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const expected = getExpectedAdminPassword()

    if (!password || password !== expected) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set({
      name: getAdminCookieName(),
      value: expected,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return res
  } catch {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete(getAdminCookieName())
  return res
}

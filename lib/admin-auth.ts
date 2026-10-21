import { cookies } from 'next/headers'

const ADMIN_COOKIE_NAME = 'mq_admin_session'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'miko_admin_2026'

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (!token) return false
  return token === ADMIN_PASSWORD
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME
}

export function getExpectedAdminPassword() {
  return ADMIN_PASSWORD
}

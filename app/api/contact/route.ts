import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { addInquiry } from '@/lib/server-store'
import { Resend } from 'resend'
import { thankYouEmailTemplate, internalNotificationTemplate } from '@/lib/email-templates'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'michaelquinit@gmail.com'

// In-memory rate limiter: 5 requests per minute per IP
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 })
    return true
  }
  
  if (entry.count >= 5) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { name, email, company, message } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const sanitized = {
      name: name.trim().slice(0, 200),
      email: email.trim().toLowerCase().slice(0, 254),
      company: (company || '').trim().slice(0, 200),
      message: message.trim().slice(0, 5000),
    }

    // Always persist to local server-store for Admin inbox
    addInquiry(sanitized)

    // Insert into Supabase if connected
    try {
      const supabase = createServerSupabaseClient()
      await supabase.from('inquiries').insert({
        name: sanitized.name,
        email: sanitized.email,
        company: sanitized.company,
        message: sanitized.message,
        created_at: new Date().toISOString(),
      })
    } catch (dbErr) {
      console.warn('Supabase inquiry insert skipped/failed:', dbErr)
    }

    // Trigger emails if Resend is configured
    if (resend) {
      try {
        await Promise.allSettled([
          resend.emails.send({
            from: 'Miko Quinit <noreply@mikoquinit.com>',
            to: sanitized.email,
            subject: `Inquiry Received — Michael Angelou Quinit`,
            html: thankYouEmailTemplate(sanitized),
          }),
          resend.emails.send({
            from: 'Portfolio Notification <noreply@mikoquinit.com>',
            to: CONTACT_EMAIL,
            subject: `⚡ New portfolio inquiry from ${sanitized.name}`,
            html: internalNotificationTemplate(sanitized),
          })
        ])
      } catch (emailErr) {
        console.warn('Resend email dispatch error:', emailErr)
      }
    }

    return NextResponse.json(
      { success: true, message: 'Inquiry received successfully.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

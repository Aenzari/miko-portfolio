import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { updateConfig, getConfig } from '@/lib/server-store'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdminSession()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 })
      }

      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      if (!isPdf) {
        return NextResponse.json({ error: 'Only PDF documents (.pdf) are allowed' }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const fileName = 'Michael_Angelou_Quinit_Resume.pdf'
      const filePath = path.join(uploadDir, fileName)
      fs.writeFileSync(filePath, buffer)

      const resumeUrl = `/uploads/${fileName}?t=${Date.now()}`
      updateConfig({ resume_url: resumeUrl })

      return NextResponse.json({
        success: true,
        resume_url: resumeUrl,
        message: 'Resume PDF uploaded and published successfully!'
      })
    }

    const body = await req.json()
    if (body.action === 'reset') {
      updateConfig({ resume_url: '/resume.pdf' })
      return NextResponse.json({
        success: true,
        resume_url: '/resume.pdf',
        message: 'Resume path reset to default'
      })
    }

    if (body.resume_url) {
      updateConfig({ resume_url: body.resume_url.trim() })
      return NextResponse.json({
        success: true,
        resume_url: body.resume_url.trim(),
        message: 'Resume URL updated'
      })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to process resume file'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET() {
  const config = getConfig()
  return NextResponse.json({ resume_url: config.resume_url || '/resume.pdf' })
}

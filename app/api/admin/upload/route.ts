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

    // Handle multipart form-data (file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
      }

      // Check file type
      const mime = file.type
      if (!mime.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files (PNG, JPG, WebP, SVG) are allowed' }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const ext = path.extname(file.name) || (mime === 'image/png' ? '.png' : mime === 'image/webp' ? '.webp' : '.jpg')
      const fileName = `miko-avatar${ext}`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const filePath = path.join(uploadDir, fileName)
      fs.writeFileSync(filePath, buffer)

      const avatarUrl = `/uploads/${fileName}?t=${Date.now()}`
      updateConfig({ avatar_url: avatarUrl })

      return NextResponse.json({
        success: true,
        avatar_url: avatarUrl,
        message: 'Profile image uploaded successfully'
      })
    }

    // Handle JSON (direct URL or delete action)
    const body = await req.json()

    if (body.action === 'delete') {
      updateConfig({ avatar_url: '' })
      return NextResponse.json({
        success: true,
        avatar_url: '',
        message: 'Profile image removed'
      })
    }

    if (body.avatar_url !== undefined) {
      updateConfig({ avatar_url: body.avatar_url.trim() })
      return NextResponse.json({
        success: true,
        avatar_url: body.avatar_url.trim(),
        message: 'Profile image URL updated'
      })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to process image'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET() {
  const config = getConfig()
  return NextResponse.json({ avatar_url: config.avatar_url || '' })
}

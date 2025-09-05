import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'gallery')
    const files = await fs.readdir(dir)

    const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
    const images = files
      .filter((f) => allowed.has(path.extname(f).toLowerCase()))
      .map((filename) => ({
        src: `/gallery/${filename}`,
        title: filename.replace(path.extname(filename), '').replace(/[-_]/g, ' '),
      }))

    return NextResponse.json({ images })
  } catch (err) {
    // Folder might not exist yet
    return NextResponse.json({ images: [], error: String(err) })
  }
}

import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'services')
    const files = await fs.readdir(dir).catch(() => [])
    const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])

    // try to read optional metadata
    let meta = {}
    const metaPath = path.join(process.cwd(), 'public', 'services.meta.json')
    try {
      const raw = await fs.readFile(metaPath, 'utf-8')
      meta = JSON.parse(raw)
    } catch (_) { /* optional */ }

    const items = files
      .filter((f) => allowed.has(path.extname(f).toLowerCase()))
      .map((filename) => {
        const id = filename.replace(path.extname(filename), '')
        const fallbackTitle = id.replace(/[-_]/g, ' ')
        const m = meta[id] || {}
        return {
          id,
          src: `/services/${filename}`,
          title: m.title || fallbackTitle,
          description: m.description || '',
          features: Array.isArray(m.features) ? m.features : []
        }
      })

    return NextResponse.json({ items })
  } catch (err) {
    return NextResponse.json({ items: [], error: String(err) }, { status: 200 })
  }
}

import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `image_${timestamp}.${extension}`;
    
    // ── GITHUB UPLOAD (FOR VERCEL PRODUCTION) ──────────────────────────────────
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
      const owner = 'PatelVaishvikk';
      const repo = 'atmiyacaterers';
      const filePath = `public/uploads/${filename}`;
      const base64Content = buffer.toString('base64');
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'atmiya-caterers-app'
        },
        body: JSON.stringify({
          message: `upload: customer review image ${filename}`,
          content: base64Content,
          branch: 'main'
        })
      });
      
      const resData = await response.json();
      if (!response.ok) {
        console.error('GitHub API error:', resData);
        throw new Error(resData.message || 'GitHub upload failed');
      }
      
      const imageUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/public/uploads/${filename}`;
      return NextResponse.json({ 
        success: true, 
        imageUrl 
      });
    }
    
    // ── LOCAL UPLOAD (FALLBACK FOR LOCAL DEV) ─────────────────────────────────
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      // Directory already exists
    }
    
    const publicPath = path.join(uploadsDir, filename);
    await writeFile(publicPath, buffer);
    
    const imageUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      imageUrl 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image', details: String(error?.message || error) }, { status: 500 });
  }
}
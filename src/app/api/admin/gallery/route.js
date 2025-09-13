

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const galleryItems = await db.collection('gallery').find().toArray();
    
    return NextResponse.json(galleryItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const galleryData = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('gallery').insertOne({
      ...galleryData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Gallery item added successfully',
      id: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add gallery item' }, { status: 500 });
  }
}
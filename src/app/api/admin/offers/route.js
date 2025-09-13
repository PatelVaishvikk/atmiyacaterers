

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const offers = await db.collection('offers').find().toArray();
    
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const offerData = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('offers').insertOne({
      ...offerData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Offer added successfully',
      id: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add offer' }, { status: 500 });
  }
}

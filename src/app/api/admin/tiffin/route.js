
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const tiffinPlans = await db.collection('tiffinPlans').find().toArray();
    
    return NextResponse.json(tiffinPlans);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tiffin plans' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const tiffinData = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('tiffinPlans').insertOne({
      ...tiffinData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tiffin plan added successfully',
      id: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add tiffin plan' }, { status: 500 });
  }
}
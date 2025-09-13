
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const registrations = await db.collection('registrations').find().toArray();
    
    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const registrationData = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('registrations').insertOne({
      ...registrationData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration added successfully',
      id: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add registration' }, { status: 500 });
  }
}
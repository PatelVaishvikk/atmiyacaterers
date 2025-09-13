import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Test the connection
    const result = await db.command({ ping: 1 });
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful',
      ping: result 
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to MongoDB',
      details: error.message 
    }, { status: 500 });
  }
}
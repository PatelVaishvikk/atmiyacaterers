import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    
    const client = await clientPromise;
    console.log('Client connected successfully');
    
    const db = client.db();
    console.log('Database accessed successfully');
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.length);
    
    // Test ping
    const pingResult = await db.admin().ping();
    console.log('Ping result:', pingResult);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      details: {
        collections: collections.length,
        ping: pingResult,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to MongoDB',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

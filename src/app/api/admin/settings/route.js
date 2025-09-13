
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const settings = await db.collection('settings').findOne();
    
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const settingsData = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    // Upsert settings (update if exists, insert if not)
    const result = await db.collection('settings').updateOne(
      {},
      { $set: { ...settingsData, updatedAt: new Date() } },
      { upsert: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
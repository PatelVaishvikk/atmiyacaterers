

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menuItems = await db.collection('menuItems').find().toArray();
    
    return NextResponse.json(menuItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const menuData = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('menuItems').insertOne({
      ...menuData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Menu item added successfully',
      id: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add menu item' }, { status: 500 });
  }
}
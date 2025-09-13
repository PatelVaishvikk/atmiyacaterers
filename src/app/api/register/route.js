
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { name, email, phone, event, guests } = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    // Generate unique code
    const code = generateUniqueCode(name);
    
    // Check if event exists and get discount info
    const eventData = await db.collection('events').findOne({ name: event });
    const discount = eventData?.discount || 0;
    
    // Save registration
    await db.collection('registrations').insertOne({
      name,
      email,
      phone,
      event,
      guests: parseInt(guests),
      registrationDate: new Date(),
      code,
      discount,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // In a real app, you would send a confirmation email here
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful', 
      code,
      discount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process registration' }, { status: 500 });
  }
}

function generateUniqueCode(name) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${initials}${randomNum}`;
}

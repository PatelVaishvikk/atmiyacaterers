// src/app/api/bookings/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs';

function makeShortToken() {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  const num = Math.floor(Math.random() * 1000); // 0..999
  const padded = num.toString().padStart(3, '0');
  return `${letter}${padded}`; // e.g. A123
}

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'atmiya_caterers');

    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const day = url.searchParams.get('day');
    const limit = Number(url.searchParams.get('limit') || 100);
    const qText = (url.searchParams.get('q') || '').trim();

    const query = {};
    if (status) query.status = status;
    if (day === 'today') {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      query.bookingDate = { $gte: start, $lt: end };
    }

    if (qText) {
      const rx = new RegExp(qText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { name: rx },
        { email: rx },
        { phone: rx },
        { tokenNumber: rx },
      ];
    }

    const items = await db
      .collection('bookings')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, items }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'atmiya_caterers');

    if (!body?.name || !body?.email || !body?.phone) {
      return NextResponse.json({ success: false, error: 'Name, email, and phone are required.' }, { status: 400 });
    }

    const dishes = Array.isArray(body.dishes) ? body.dishes.filter(d => d && d.name && d.qty > 0) : [];
    if (dishes.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one dish is required.' }, { status: 400 });
    }

    // generate short token with collision check
    let tokenNumber = '';
    for (let i = 0; i < 8; i++) {
      const t = makeShortToken();
      const exists = await db.collection('bookings').findOne({ tokenNumber: t });
      if (!exists) { tokenNumber = t; break; }
    }
    if (!tokenNumber) {
      return NextResponse.json({ success: false, error: 'Failed to generate unique token.' }, { status: 500 });
    }

    const bookingDoc = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      bookingDate: body.bookingDate ? new Date(body.bookingDate) : new Date(),
      numberOfPeople: Number(body.numberOfPeople || 1),
      specialRequests: body.specialRequests || '',
      eventType: body.eventType || 'garba',
      dishes,
      tokenNumber,
      status: 'booked',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('bookings').insertOne(bookingDoc);

    return NextResponse.json({
      success: true,
      booking: { id: result.insertedId, ...bookingDoc },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking', details: String(error?.message || error) },
      { status: 500 }
    );
  }
}

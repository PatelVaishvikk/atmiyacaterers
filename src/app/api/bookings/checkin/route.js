// src/app/api/bookings/checkin/route.js
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.tokenNumber) {
      return NextResponse.json({ success: false, error: 'tokenNumber is required' }, { status: 400 });
    }
    const token = String(body.tokenNumber).trim().toUpperCase(); // A123

    const db = await getDb();
    const existing = await db.collection('bookings').findOne({ tokenNumber: token });

    if (!existing) {
      return NextResponse.json({ success: false, error: `No booking found for token ${token}` }, { status: 404 });
    }

    if (existing.status === 'checked-in') {
      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
        booking: existing,
        message: `Token ${token} already checked in`,
      }, { status: 200 });
    }

    const upd = await db.collection('bookings').updateOne(
      { tokenNumber: token },
      {
        $set: {
          status: 'checked-in',
          checkedInAt: new Date(),
          checkedInBy: body.checkedInBy || 'Admin',
          updatedAt: new Date(),
        },
      }
    );

    if (upd.modifiedCount !== 1) {
      console.log('[checkin POST] update failed', { token, matched: upd.matchedCount, modified: upd.modifiedCount });
      return NextResponse.json({ success: false, error: 'Failed to update booking' }, { status: 500 });
    }

    const updated = await db.collection('bookings').findOne({ tokenNumber: token });
    return NextResponse.json({ success: true, alreadyCheckedIn: false, booking: updated, message: `Checked in ${token}` });
  } catch (e) {
    console.log('[checkin POST] error', e);
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection('bookings')
      .find({ status: 'checked-in' })
      .sort({ checkedInAt: -1 })
      .limit(50)
      .toArray();
    return NextResponse.json({ success: true, items });
  } catch (e) {
    console.log('[checkin GET] error', e);
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}

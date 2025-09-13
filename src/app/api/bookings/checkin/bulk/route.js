// src/app/api/bookings/checkin/bulk/route.js
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const runtime = 'nodejs';

function normalizeToken(input) {
  const raw = String(input || '').toUpperCase();
  if (/^[A-Z]\d{3}$/.test(raw)) return raw;
  if (/^\d{3}$/.test(raw)) return `G${raw}`;
  const letter = raw.match(/[A-Z]/)?.[0] || 'G';
  const digits = (raw.match(/\d/g) || []).join('').slice(0, 3).padStart(3, '0');
  return `${letter}${digits}`;
}

/**
 * POST /api/bookings/checkin/bulk
 * body: { tokens: string[], checkedInBy?: string }
 * Returns: { success, updated: [], already: [], notFound: [], items: [] }
 */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const tokensRaw = Array.isArray(body.tokens) ? body.tokens : [];
    if (tokensRaw.length === 0) {
      return NextResponse.json(
        { success: false, error: 'tokens array is required' },
        { status: 400 }
      );
    }

    const tokens = [...new Set(tokensRaw.map(normalizeToken))]; // unique & normalized
    const db = await getDb();
    const coll = db.collection('bookings');

    // look up everything first
    const found = await coll
      .find({ tokenNumber: { $in: tokens } })
      .project({ tokenNumber: 1, status: 1 })
      .toArray();

    const foundMap = new Map(found.map(d => [d.tokenNumber, d]));
    const notFound = tokens.filter(t => !foundMap.has(t));

    const toUpdate = found
      .filter(d => d.status !== 'checked-in')
      .map(d => d.tokenNumber);

    if (toUpdate.length > 0) {
      const now = new Date();
      await coll.updateMany(
        { tokenNumber: { $in: toUpdate }, status: { $ne: 'checked-in' } },
        {
          $set: {
            status: 'checked-in',
            checkedInAt: now,
            checkedInBy: body.checkedInBy || 'Admin',
            updatedAt: now,
          },
        }
      );
    }

    // return all docs (updated or already) for the requested tokens
    const items = await coll
      .find({ tokenNumber: { $in: tokens } })
      .toArray();

    const updatedSet = new Set(toUpdate);
    const already = items
      .filter(d => d.status === 'checked-in' && !updatedSet.has(d.tokenNumber))
      .map(d => d.tokenNumber);

    return NextResponse.json({
      success: true,
      updated: toUpdate,
      already,
      notFound,
      items,
      message: `updated=${toUpdate.length}, already=${already.length}, notFound=${notFound.length}`,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}

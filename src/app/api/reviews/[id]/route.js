// src/app/api/reviews/[id]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// PATCH /api/reviews/[id] — approve or update
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'atmiya_caterers');

    const update = {};
    if (typeof body.approved === 'boolean') update.approved = body.approved;

    const result = await db.collection('reviews').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}

// DELETE /api/reviews/[id] — delete a review
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'atmiya_caterers');

    await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}

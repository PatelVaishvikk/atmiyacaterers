// src/app/api/reviews/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'atmiya_caterers');

    const url = new URL(req.url);
    const all = url.searchParams.get('all'); // admin: fetch all including unapproved

    const query = all === 'true' ? {} : { approved: true };

    // Run both queries in parallel to cut network roundtrip time in half
    const [reviews, stats] = await Promise.all([
      db.collection('reviews')
        .find(query)
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray(),
      db.collection('reviews').aggregate([
        { $match: { approved: true } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            total: { $sum: 1 },
            five:  { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
            four:  { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
            three: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
            two:   { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
            one:   { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          },
        },
      ]).toArray()
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      stats: stats[0] || { avgRating: 0, total: 0, five: 0, four: 0, three: 0, two: 0, one: 0 },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'atmiya_caterers');

    const { name, email, rating, review, eventType } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required.' }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Please select a rating between 1 and 5.' }, { status: 400 });
    }
    if (!review || review.trim().length < 10) {
      return NextResponse.json({ success: false, error: 'Please write at least 10 characters in your review.' }, { status: 400 });
    }

    const doc = {
      name: name.trim().slice(0, 60),
      email: (email || '').trim().toLowerCase(),
      rating: Number(rating),
      review: review.trim().slice(0, 800),
      eventType: eventType || '',
      approved: true, // auto-approved — admin can delete from admin panel if needed
      createdAt: new Date(),
    };

    const result = await db.collection('reviews').insertOne(doc);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted and will appear after approval.',
      id: result.insertedId,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 });
  }
}

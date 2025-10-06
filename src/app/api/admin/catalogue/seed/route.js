import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ensureDefaultCategories } from '@/lib/catalogueSeed';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const { inserted, categories } = await ensureDefaultCategories(db);

    return NextResponse.json({
      success: true,
      message: inserted
        ? `Added ${inserted} default catalogue categor${inserted === 1 ? 'y' : 'ies'}.`
        : 'Catalogue categories were already up to date.',
      inserted,
      total: categories.length,
    });
  } catch (error) {
    console.error('Failed to seed catalogue categories', error);
    return NextResponse.json({ error: 'Failed to seed catalogue categories' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ensureDefaultCategories, ensureDefaultItems } from '@/lib/catalogueSeed';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const { categoryMap } = await ensureDefaultCategories(db);
    const { inserted, total, missingCategories } = await ensureDefaultItems(db, categoryMap);

    return NextResponse.json({
      success: true,
      message: inserted
        ? `Added ${inserted} default catalogue item${inserted === 1 ? '' : 's'}.`
        : 'Catalogue items were already up to date.',
      inserted,
      total,
      missingCategories,
    });
  } catch (error) {
    console.error('Failed to seed catalogue items', error);
    return NextResponse.json({ error: 'Failed to seed catalogue items' }, { status: 500 });
  }
}

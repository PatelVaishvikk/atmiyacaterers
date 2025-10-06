import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ensureDefaultCategories, ensureDefaultItems } from '@/lib/catalogueSeed';

const CATEGORY_COLLECTION = 'catalogueCategories';
const ITEM_COLLECTION = 'catalogueItems';

const normaliseCategory = category => {
  if (!category) return category;
  const { _id, parentId, ...rest } = category;
  return {
    _id: _id?.toString?.() ?? _id,
    parentId: parentId ? parentId.toString() : null,
    ...rest,
  };
};

const normaliseItem = item => {
  if (!item) return item;
  const { _id, categoryId, ...rest } = item;
  return {
    _id: _id?.toString?.() ?? _id,
    categoryId: categoryId ? categoryId.toString() : null,
    ...rest,
  };
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const { categoryMap } = await ensureDefaultCategories(db);
    await ensureDefaultItems(db, categoryMap);

    const [categories, items] = await Promise.all([
      db
        .collection(CATEGORY_COLLECTION)
        .find({ isActive: { $ne: false } })
        .sort({ sortOrder: 1, name: 1 })
        .toArray(),
      db
        .collection(ITEM_COLLECTION)
        .find({ isActive: { $ne: false } })
        .sort({ sortOrder: 1, name: 1 })
        .toArray(),
    ]);

    const fallback = buildDefaultCatalogueSnapshot();
    const finalCategories = categories.length ? categories.map(normaliseCategory) : fallback.categories;
    const finalItems = items.length ? items.map(normaliseItem) : fallback.items;

    return NextResponse.json({ categories: finalCategories, items: finalItems });
  } catch (error) {
    console.error('Failed to load public catalogue data', error);
    const fallback = buildDefaultCatalogueSnapshot();
    return NextResponse.json(fallback, { status: 200 });
  }
}

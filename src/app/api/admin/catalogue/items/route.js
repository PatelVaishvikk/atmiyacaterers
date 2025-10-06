import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ensureDefaultCategories, ensureDefaultItems } from '@/lib/catalogueSeed';
import { ObjectId } from 'mongodb';

const COLLECTION = 'catalogueItems';
const CATEGORY_COLLECTION = 'catalogueCategories';

const toObjectId = value => {
  if (!value) return null;
  try {
    return new ObjectId(value);
  } catch (error) {
    return null;
  }
};

const slugify = (input = '') => {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
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

const sanitiseArray = value => {
  if (Array.isArray(value)) {
    return value
      .map(entry => (entry ?? '').toString().trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(entry => entry.trim())
      .filter(Boolean);
  }
  return [];
};

async function ensureUniqueSlug(db, baseSlug, excludeId) {
  const collection = db.collection(COLLECTION);
  let slug = baseSlug || `item-${Date.now()}`;
  let suffix = 1;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await collection.findOne(query, { projection: { _id: 1 } });
    if (!existing) return slug;
    slug = `${baseSlug}-${suffix++}`;
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const { categoryMap } = await ensureDefaultCategories(db);
    await ensureDefaultItems(db, categoryMap);

    const items = await db
      .collection(COLLECTION)
      .find()
      .sort({ sortOrder: 1, name: 1 })
      .toArray();

    return NextResponse.json(items.map(normaliseItem));
  } catch (error) {
    console.error('Failed to load catalogue items', error);
    return NextResponse.json({ error: 'Failed to load catalogue items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const categoryId = toObjectId(payload.categoryId);
    if (!categoryId) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const category = await db.collection(CATEGORY_COLLECTION).findOne({ _id: categoryId });
    if (!category) {
      return NextResponse.json({ error: 'Selected category does not exist' }, { status: 404 });
    }

    const tier = (payload.tier || 'standard').toLowerCase();
    const allowedTiers = ['standard', 'premium', 'signature'];
    const resolvedTier = allowedTiers.includes(tier) ? tier : 'standard';

    const now = new Date();
    const doc = {
      name: (payload.name || '').trim(),
      slug: await ensureUniqueSlug(db, slugify(payload.slug || payload.name)),
      description: (payload.description || '').trim(),
      highlights: sanitiseArray(payload.highlights),
      priceNote: (payload.priceNote || '').trim() || null,
      tier: resolvedTier,
      categoryId,
      tags: sanitiseArray(payload.tags),
      dietary: sanitiseArray(payload.dietary),
      allergens: sanitiseArray(payload.allergens),
      spiceLevel: (payload.spiceLevel || '').trim() || null,
      isActive: payload.isActive !== false,
      isRecommended: Boolean(payload.isRecommended),
      sortOrder: Number.isFinite(Number(payload.sortOrder)) ? Number(payload.sortOrder) : 0,
      heroImage: (payload.heroImage || '').trim() || null,
      mediaGallery: sanitiseArray(payload.mediaGallery),
      createdAt: now,
      updatedAt: now,
      metadata: typeof payload.metadata === 'object' && payload.metadata !== null ? payload.metadata : {},
    };

    if (!doc.name) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    const result = await db.collection(COLLECTION).insertOne(doc);

    return NextResponse.json({
      success: true,
      message: 'Catalogue item created successfully',
      item: normaliseItem({ _id: result.insertedId, ...doc }),
    });
  } catch (error) {
    console.error('Failed to create catalogue item', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

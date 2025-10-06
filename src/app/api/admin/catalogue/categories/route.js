import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ensureDefaultCategories } from '@/lib/catalogueSeed';
import { ObjectId } from 'mongodb';

const COLLECTION = 'catalogueCategories';

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

const normaliseCategory = (category) => {
  if (!category) return category;
  const { _id, parentId, ...rest } = category;
  return {
    _id: _id?.toString?.() ?? _id,
    parentId: parentId ? parentId.toString() : null,
    ...rest,
  };
};

async function ensureUniqueSlug(db, baseSlug, excludeId) {
  if (!baseSlug) {
    baseSlug = `category-${Date.now()}`;
  }
  const collection = db.collection(COLLECTION);
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await collection.findOne(query, { projection: { _id: 1 } });
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${suffix++}`;
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    await ensureDefaultCategories(db);
    const categories = await db
      .collection(COLLECTION)
      .find()
      .sort({ sortOrder: 1, name: 1 })
      .toArray();

    return NextResponse.json(categories.map(normaliseCategory));
  } catch (error) {
    console.error('Failed to list catalogue categories', error);
    return NextResponse.json({ error: 'Failed to load catalogue categories' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const now = new Date();

    const parentId = toObjectId(payload.parentId);
    const baseSlug = slugify(payload.slug || payload.name);
    const slug = await ensureUniqueSlug(db, baseSlug);

    const document = {
      name: (payload.name || '').trim(),
      slug,
      description: (payload.description || '').trim(),
      parentId,
      accentColor: (payload.accentColor || '').trim() || null,
      heroImage: (payload.heroImage || '').trim() || null,
      badgeLabel: (payload.badgeLabel || '').trim() || null,
      layoutPreset: (payload.layoutPreset || 'default').trim(),
      sortOrder: Number.isFinite(Number(payload.sortOrder)) ? Number(payload.sortOrder) : 0,
      isActive: payload.isActive !== false,
      createdAt: now,
      updatedAt: now,
      metadata: typeof payload.metadata === 'object' && payload.metadata !== null ? payload.metadata : {},
    };

    if (!document.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const result = await db.collection(COLLECTION).insertOne(document);

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: normaliseCategory({ _id: result.insertedId, ...document }),
    });
  } catch (error) {
    console.error('Failed to create catalogue category', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}


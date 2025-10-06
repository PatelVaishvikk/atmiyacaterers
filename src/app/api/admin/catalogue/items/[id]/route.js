import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const itemId = toObjectId(id);
    if (!itemId) {
      return NextResponse.json({ error: 'Invalid item id' }, { status: 400 });
    }

    const payload = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const update = {};

    if (payload.name !== undefined) {
      update.name = (payload.name || '').trim();
    }
    if (payload.description !== undefined) {
      update.description = (payload.description || '').trim();
    }
    if (payload.tier !== undefined) {
      const tier = (payload.tier || '').toLowerCase();
      const allowedTiers = ['standard', 'premium', 'signature'];
      update.tier = allowedTiers.includes(tier) ? tier : 'standard';
    }
    if (payload.categoryId !== undefined) {
      const categoryId = toObjectId(payload.categoryId);
      if (!categoryId) {
        return NextResponse.json({ error: 'Invalid category selected' }, { status: 400 });
      }
      const category = await db.collection(CATEGORY_COLLECTION).findOne({ _id: categoryId });
      if (!category) {
        return NextResponse.json({ error: 'Selected category does not exist' }, { status: 404 });
      }
      update.categoryId = categoryId;
    }
    if (payload.tags !== undefined) {
      update.tags = sanitiseArray(payload.tags);
    }
    if (payload.highlights !== undefined) {
      update.highlights = sanitiseArray(payload.highlights);
    }
    if (payload.dietary !== undefined) {
      update.dietary = sanitiseArray(payload.dietary);
    }
    if (payload.allergens !== undefined) {
      update.allergens = sanitiseArray(payload.allergens);
    }
    if (payload.mediaGallery !== undefined) {
      update.mediaGallery = sanitiseArray(payload.mediaGallery);
    }
    if (payload.spiceLevel !== undefined) {
      update.spiceLevel = (payload.spiceLevel || '').trim() || null;
    }
    if (payload.priceNote !== undefined) {
      update.priceNote = (payload.priceNote || '').trim() || null;
    }
    if (payload.isActive !== undefined) {
      update.isActive = Boolean(payload.isActive);
    }
    if (payload.isRecommended !== undefined) {
      update.isRecommended = Boolean(payload.isRecommended);
    }
    if (payload.sortOrder !== undefined) {
      update.sortOrder = Number.isFinite(Number(payload.sortOrder)) ? Number(payload.sortOrder) : 0;
    }
    if (payload.heroImage !== undefined) {
      update.heroImage = (payload.heroImage || '').trim() || null;
    }
    if (payload.metadata !== undefined) {
      update.metadata = typeof payload.metadata === 'object' && payload.metadata !== null ? payload.metadata : {};
    }
    if (payload.slug !== undefined || payload.name) {
      const baseSlug = slugify(payload.slug || update.name || payload.name);
      update.slug = await ensureUniqueSlug(db, baseSlug, itemId);
    }

    update.updatedAt = new Date();

    const result = await db.collection(COLLECTION).updateOne({ _id: itemId }, { $set: update });
    if (!result.matchedCount) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const item = await db.collection(COLLECTION).findOne({ _id: itemId });

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
      item: normaliseItem(item),
    });
  } catch (error) {
    console.error('Failed to update catalogue item', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const itemId = toObjectId(id);
    if (!itemId) {
      return NextResponse.json({ error: 'Invalid item id' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection(COLLECTION).deleteOne({ _id: itemId });
    if (!result.deletedCount) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Failed to delete catalogue item', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}

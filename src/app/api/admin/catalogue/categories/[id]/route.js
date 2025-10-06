import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
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
    const exists = await collection.findOne(query, { projection: { _id: 1 } });
    if (!exists) return slug;
    slug = `${baseSlug}-${suffix++}`;
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const categoryId = toObjectId(id);
    if (!categoryId) {
      return NextResponse.json({ error: 'Invalid category id' }, { status: 400 });
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
    if (payload.parentId !== undefined) {
      update.parentId = toObjectId(payload.parentId);
    }
    if (payload.accentColor !== undefined) {
      update.accentColor = (payload.accentColor || '').trim() || null;
    }
    if (payload.heroImage !== undefined) {
      update.heroImage = (payload.heroImage || '').trim() || null;
    }
    if (payload.badgeLabel !== undefined) {
      update.badgeLabel = (payload.badgeLabel || '').trim() || null;
    }
    if (payload.layoutPreset !== undefined) {
      update.layoutPreset = (payload.layoutPreset || 'default').trim();
    }
    if (payload.sortOrder !== undefined) {
      update.sortOrder = Number.isFinite(Number(payload.sortOrder)) ? Number(payload.sortOrder) : 0;
    }
    if (payload.isActive !== undefined) {
      update.isActive = Boolean(payload.isActive);
    }
    if (payload.metadata !== undefined) {
      update.metadata = typeof payload.metadata === 'object' && payload.metadata !== null ? payload.metadata : {};
    }
    if (payload.slug !== undefined || payload.name) {
      const baseSlug = slugify(payload.slug || update.name || payload.name);
      update.slug = await ensureUniqueSlug(db, baseSlug, categoryId);
    }

    update.updatedAt = new Date();

    const result = await db.collection(COLLECTION).updateOne({ _id: categoryId }, { $set: update });

    if (!result.matchedCount) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const category = await db.collection(COLLECTION).findOne({ _id: categoryId });

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category: normaliseCategory(category),
    });
  } catch (error) {
    console.error('Failed to update catalogue category', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const categoryId = toObjectId(id);
    if (!categoryId) {
      return NextResponse.json({ error: 'Invalid category id' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const hasChildren = await db.collection(COLLECTION).countDocuments({ parentId: categoryId });
    if (hasChildren) {
      return NextResponse.json({ error: 'Remove child categories first' }, { status: 400 });
    }

    const linkedItems = await db.collection('catalogueItems').countDocuments({ categoryId });
    if (linkedItems) {
      return NextResponse.json({ error: 'Remove items using this category first' }, { status: 400 });
    }

    const result = await db.collection(COLLECTION).deleteOne({ _id: categoryId });
    if (!result.deletedCount) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Failed to delete catalogue category', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

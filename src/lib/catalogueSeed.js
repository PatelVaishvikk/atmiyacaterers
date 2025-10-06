import { catalogueCategoryDefaults, catalogueMainCourseChildren, catalogueItemDefaults } from '@/data/catalogueDefaults';

const CATEGORY_COLLECTION = 'catalogueCategories';
const ITEM_COLLECTION = 'catalogueItems';

const toSlug = input =>
  (input || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const toSortOrder = value => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const normaliseCategory = (definition, overrides = {}) => {
  const timestamp = overrides.timestamp || new Date();
  return {
    name: definition.name,
    slug: definition.slug,
    description: definition.description || '',
    parentId: overrides.parentId || null,
    accentColor: overrides.accentColor || definition.accentColor || null,
    heroImage: definition.heroImage || null,
    badgeLabel: definition.badgeLabel || null,
    layoutPreset: definition.layoutPreset || 'default',
    sortOrder: toSortOrder(definition.sortOrder),
    isActive: definition.isActive !== false,
    createdAt: timestamp,
    updatedAt: timestamp,
    metadata: definition.metadata || {},
  };
};

const normaliseItem = (definition) => ({
  ...definition,
  metadata: { ...(definition.metadata || {}), seeded: true },
});

export async function ensureDefaultCategories(db) {
  const collection = db.collection(CATEGORY_COLLECTION);
  const timestamp = new Date();

  const topSlugs = catalogueCategoryDefaults.map(category => category.slug);
  const childSlugs = catalogueMainCourseChildren.map(category => category.slug);
  const allSlugs = [...topSlugs, ...childSlugs];

  const existingTopLevel = await collection
    .find({ slug: { $in: topSlugs } })
    .toArray();

  const existingTopSlugs = new Set(existingTopLevel.map(category => category.slug));
  const missingTop = catalogueCategoryDefaults.filter(category => !existingTopSlugs.has(category.slug));

  if (missingTop.length) {
    await collection.insertMany(missingTop.map(category => normaliseCategory(category, { timestamp })));
  }

  const parents = await collection
    .find({ slug: { $in: topSlugs } })
    .toArray();
  const parentMap = new Map(parents.map(category => [category.slug, category]));

  const existingSlugs = new Set(
    (
      await collection
        .find({ slug: { $in: allSlugs } })
        .toArray()
    ).map(category => category.slug),
  );

  const missingChildren = catalogueMainCourseChildren.filter(category => !existingSlugs.has(category.slug));
  if (missingChildren.length) {
    await collection.insertMany(
      missingChildren
        .map(category => {
          const parent = parentMap.get(category.parentSlug);
          if (!parent) {
            return null;
          }
          return normaliseCategory(category, {
            parentId: parent._id,
            accentColor: category.accentColor || parent.accentColor,
            timestamp,
          });
        })
        .filter(Boolean),
    );
  }

  const finalCategories = await collection
    .find({ slug: { $in: allSlugs } })
    .toArray();

  return {
    categories: finalCategories,
    categoryMap: new Map(finalCategories.map(category => [category.slug, category])),
    inserted: missingTop.length + missingChildren.length,
  };
}

export async function ensureDefaultItems(db, categoryMapInput) {
  const itemsCollection = db.collection(ITEM_COLLECTION);
  const categoryCollection = db.collection(CATEGORY_COLLECTION);

  let categoryMap = categoryMapInput;
  if (!categoryMap || !(categoryMap instanceof Map)) {
    const categorySlugs = catalogueItemDefaults.map(entry => entry.categorySlug);
    const categories = await categoryCollection
      .find({ slug: { $in: categorySlugs } })
      .toArray();
    categoryMap = new Map(categories.map(category => [category.slug, category]));
  }

  const timestamp = new Date();
  const seedDocuments = [];
  const missingCategories = new Set();
  const desiredSlugs = new Set();

  catalogueItemDefaults.forEach(entry => {
    const category = categoryMap.get(entry.categorySlug);
    if (!category) {
      missingCategories.add(entry.categorySlug);
      return;
    }

    Object.entries(entry.tiers).forEach(([tier, names]) => {
      (names || [])
        .map(name => name && name.trim())
        .filter(Boolean)
        .forEach(name => {
          const slug = `${entry.categorySlug}-${toSlug(name)}`;
          desiredSlugs.add(slug);
          seedDocuments.push({
            name,
            slug,
            tier,
            categoryId: category._id,
            description: '',
            highlights: [],
            priceNote: null,
            tags: [],
            dietary: [],
            allergens: [],
            spiceLevel: null,
            isActive: true,
            isRecommended: false,
            mediaGallery: [],
          });
        });
    });
  });

  if (!seedDocuments.length) {
    return { inserted: 0, total: 0, missingCategories: Array.from(missingCategories) };
  }

  const existingItems = await itemsCollection
    .find({ slug: { $in: Array.from(desiredSlugs) } }, { projection: { slug: 1 } })
    .toArray();
  const existingSlugs = new Set(existingItems.map(item => item.slug));

  const sortTracker = new Map();
  const documentsToInsert = [];

  seedDocuments.forEach(doc => {
    if (existingSlugs.has(doc.slug)) {
      return;
    }
    const sortOrder = sortTracker.get(doc.categoryId.toString()) || 0;
    sortTracker.set(doc.categoryId.toString(), sortOrder + 1);
    documentsToInsert.push(
      normaliseItem({
        ...doc,
        sortOrder,
        createdAt: timestamp,
        updatedAt: timestamp,
      }),
    );
  });

  if (documentsToInsert.length) {
    await itemsCollection.insertMany(documentsToInsert);
  }

  const total = await itemsCollection.countDocuments({ slug: { $in: Array.from(desiredSlugs) } });

  return {
    inserted: documentsToInsert.length,
    total,
    missingCategories: Array.from(missingCategories),
  };
}


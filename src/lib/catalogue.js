import { getDb } from './mongodb.js';
import { buildDefaultCatalogueSnapshot } from '@/data/catalogueDefaults';

const CATEGORY_COLLECTION = 'catalogueCategories';
const ITEM_COLLECTION = 'catalogueItems';

const toPlainCategory = category => {
  if (!category) return category;
  const { _id, parentId, ...rest } = category;
  return {
    _id: _id?.toString?.() ?? _id,
    parentId: parentId ? parentId.toString() : null,
    ...rest,
  };
};

const toPlainItem = item => {
  if (!item) return item;
  const { _id, categoryId, ...rest } = item;
  return {
    _id: _id?.toString?.() ?? _id,
    categoryId: categoryId ? categoryId.toString() : null,
    ...rest,
  };
};

export async function getCatalogueData(options = {}) {
  const { includeInactive = false } = options;
  try {
    const db = await getDb();
    const categoryQuery = includeInactive ? {} : { isActive: { $ne: false } };
    const itemQuery = includeInactive ? {} : { isActive: { $ne: false } };

    const [categories, items] = await Promise.all([
      db
        .collection(CATEGORY_COLLECTION)
        .find(categoryQuery)
        .sort({ sortOrder: 1, name: 1 })
        .toArray(),
      db
        .collection(ITEM_COLLECTION)
        .find(itemQuery)
        .sort({ sortOrder: 1, name: 1 })
        .toArray(),
    ]);

    const snapshot = buildDefaultCatalogueSnapshot();
    const finalCategories = categories.length ? categories.map(toPlainCategory) : snapshot.categories;
    const finalItems = items.length ? items.map(toPlainItem) : snapshot.items;

    return { categories: finalCategories, items: finalItems };
  } catch (error) {
    console.error('Falling back to default catalogue snapshot', error);
    return buildDefaultCatalogueSnapshot();
  }
}

export function buildCategoryMaps(categories = []) {
  const byId = new Map();
  const children = new Map();

  categories.forEach(category => {
    byId.set(category._id, category);
  });

  categories.forEach(category => {
    const parentId = category.parentId || null;
    if (!children.has(parentId)) {
      children.set(parentId, []);
    }
    children.get(parentId).push(category);
  });

  children.forEach(list => {
    list.sort((a, b) => {
      const sortDiff = (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0);
      if (sortDiff !== 0) return sortDiff;
      return (a.name || '').localeCompare(b.name || '');
    });
  });

  return { byId, children };
}

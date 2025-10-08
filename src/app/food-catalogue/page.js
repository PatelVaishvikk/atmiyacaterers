import FoodCatalogueClient from '@/components/catalogue/FoodCatalogueClient';
import { getCatalogueData, buildCategoryMaps } from '@/lib/catalogue';

export const metadata = {
  title: 'Food Catalogue | Atmiya Caterers',
  description: 'Discover soups, appetizers, main courses, breads, and premium dishes curated by Atmiya Caterers.',
};

const emphasisedOrder = [
  'soups',
  'appetizers',
  'appetizers (starters)',
  'chat corner',
  'breakfast',
  'brake fast',
  'sweet',
  'sweets',
  'farsan',
  'main course',
  'indian bread',
  'rice & biryani',
  'rice',
  'daal/kadhi',
  'dal/kadhi',
  'kadhi',
  'raita',
];

const getEmphasisedIndex = name => {
  if (!name) return Number.MAX_SAFE_INTEGER;
  const normalised = name.toLowerCase();
  const index = emphasisedOrder.indexOf(normalised);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

export default async function FoodCataloguePage() {
  const { categories, items } = await getCatalogueData();
  const { children } = buildCategoryMaps(categories);

  const orderedTopCategories = [...(children.get(null) || [])].sort((a, b) => {
    const customA = getEmphasisedIndex(a.name);
    const customB = getEmphasisedIndex(b.name);
    if (customA !== customB) return customA - customB;
    const sortDiff = (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0);
    if (sortDiff !== 0) return sortDiff;
    return (a.name || '').localeCompare(b.name || '');
  });

  const fullCategoryList = [...orderedTopCategories, ...categories.filter(category => category.parentId)];
  const tailwindContainer = 'mx-auto max-w-6xl px-4 sm:px-6 lg:px-8';

  return (
    <div className="bg-gradient-to-br from-white via-orange-50 to-white py-16">
      <div className={tailwindContainer}>
        <FoodCatalogueClient categories={fullCategoryList} items={items} settings={settings} />
      </div>
    </div>
  );
}


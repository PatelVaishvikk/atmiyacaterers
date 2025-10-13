export const catalogueCategoryDefaults = [
  {
    name: 'Soups',
    slug: 'soups',
    description: 'Comforting soup options available across standard and premium tiers.',
    badgeLabel: 'Warm up',
    layoutPreset: 'split',
    sortOrder: 10,
    accentColor: '#f97316',
  },
  {
    name: 'Appetizers (Starters)',
    slug: 'appetizers',
    description: 'Finger foods and first bites to excite your guests.',
    badgeLabel: 'First bite',
    layoutPreset: 'split',
    sortOrder: 20,
    accentColor: '#2563eb',
  },
  {
    name: 'Chat Corner',
    slug: 'chat-corner',
    description: 'Indian street-food inspired chat counter selections.',
    badgeLabel: 'Live counter',
    layoutPreset: 'split',
    sortOrder: 30,
    accentColor: '#db2777',
  },
  {
    name: 'Breakfast',
    slug: 'breakfast',
    description: 'Morning favourites and tiffin-style breakfast plates.',
    badgeLabel: 'Sunrise',
    layoutPreset: 'split',
    sortOrder: 40,
    accentColor: '#0ea5e9',
  },
  {
    name: 'Sweets',
    slug: 'sweets',
    description: 'Traditional Indian desserts to complete the feast.',
    badgeLabel: 'Dessert bar',
    layoutPreset: 'grid',
    sortOrder: 50,
    accentColor: '#facc15',
  },
  {
    name: 'Farsan',
    slug: 'farsan',
    description: 'Gujarati farsan must-haves for any celebration.',
    layoutPreset: 'grid',
    sortOrder: 60,
    accentColor: '#34d399',
  },
  {
    name: 'Signature Specials',
    slug: 'signature-specials',
    description: 'Chef-loved street favourites designed to wow every crowd.',
    badgeLabel: 'Signature',
    layoutPreset: 'split',
    sortOrder: 75,
    accentColor: '#f472b6',
  },
  {
    name: 'Main Course',
    slug: 'main-course',
    description: 'Curated main course spreads across regional cuisines.',
    badgeLabel: 'Chef curated',
    layoutPreset: 'grid',
    sortOrder: 70,
    accentColor: '#f97316',
  },
  {
    name: 'Indian Bread',
    slug: 'indian-bread',
    description: 'Rotis, naans, theplas, and more fresh from the tandoor.',
    layoutPreset: 'grid',
    sortOrder: 80,
    accentColor: '#eab308',
  },
  {
    name: 'Rice & Biryani',
    slug: 'rice-biryani',
    description: 'Fragrant rice dishes, pulavs, and biryanis.',
    layoutPreset: 'grid',
    sortOrder: 90,
    accentColor: '#16a34a',
  },
  {
    name: 'Daal / Kadhi',
    slug: 'daal-kadhi',
    description: 'Comforting lentils and kadhi pairings.',
    layoutPreset: 'grid',
    sortOrder: 100,
    accentColor: '#f59e0b',
  },
  {
    name: 'Raita',
    slug: 'raita',
    description: 'Cool yoghurt accompaniments for every plate.',
    layoutPreset: 'grid',
    sortOrder: 110,
    accentColor: '#38bdf8',
  },
];

export const catalogueMainCourseChildren = [
  {
    name: 'Gujarati Corner',
    slug: 'main-course-gujarati',
    description: 'Signature Gujarati main course options.',
    parentSlug: 'main-course',
    sortOrder: 10,
    badgeLabel: 'Gujarati',
  },
  {
    name: 'Punjabi Corner',
    slug: 'main-course-punjabi',
    description: 'North Indian gravies and tandoori delights.',
    parentSlug: 'main-course',
    sortOrder: 20,
    badgeLabel: 'Punjabi',
  },
  {
    name: 'Kathiyavadi Corner',
    slug: 'main-course-kathiyavadi',
    description: 'Spicy Kathiyavadi selections straight from Saurashtra.',
    parentSlug: 'main-course',
    sortOrder: 30,
    badgeLabel: 'Kathiyavadi',
  },
  {
    name: 'Chinese Corner',
    slug: 'main-course-chinese',
    description: 'Indo-Chinese favourites for fusion menus.',
    parentSlug: 'main-course',
    sortOrder: 40,
    badgeLabel: 'Chinese',
  },
];

export const catalogueItemDefaults = [
  {
    categorySlug: 'soups',
    tiers: {
      standard: ['Tomato Soup', 'Veg. Manchow Soup', 'Corn Vegetable Soup', 'Lemon Coriander Soup'],
      premium: ['Hot & Sour Soup', 'Palak Corn Soup', 'Cheese Corn Tomato Soup'],
    },
  },
  {
    categorySlug: 'appetizers',
    tiers: {
      standard: ['Spring Roll', 'Cocktail Samosa', 'Idli', 'Menduvada', 'Vadapav', 'Dabeli', 'Bread Pakoda'],
      premium: ['Paneer 65 (Dry)', 'Veg. Manchurian (Dry)', 'Veg. Paneer Chilli (Dry)', 'Harabhara Kabab', 'Veg. Hakka Noodles'],
    },
  },
  {
    categorySlug: 'chat-corner',
    tiers: {
      standard: ['Sev Usal', 'Papadi Chat', 'Bombay Bhel', 'Panipuri'],
      premium: ['Samosa Chat', 'Ragda Patis', 'Dahivada', 'Misal pav', 'Alu Tikki Chat'],
    },
  },
  {
    categorySlug: 'breakfast',
    tiers: {
      standard: ['Bataka Pauva', 'Methi Thepla', 'Masala Puri', 'Veg. Upama', 'Methi Gota', 'Tea-Coffee'],
      premium: ['Sev Khamani', 'Papadi no Lot', 'Batakavada', 'Punjabi Samosa', 'Fafda Jalebi', 'Dhokla (Idada)', 'Handavo'],
    },
  },
  {
    categorySlug: 'sweets',
    tiers: {
      standard: ['Ladu', 'Mohanthal', 'Gulab Jambu', 'Shrikhand', 'Mag ni Dal no Shiro', 'Jalebi', 'Boondi Ladu', 'Fada Lapsi', 'Rava Shiro', 'Sukhadi', 'Kansar'],
      premium: ['Gajar Halvo', 'Ras Malai', 'Mango Delight', 'Sitafal Basudi', 'Kesar Pista Basudi', 'Dudhpak', 'Fruit Salad', 'Ras Gulla', 'Vedhmi'],
    },
  },
  {
    categorySlug: 'farsan',
    tiers: {
      standard: ['Veg. Cutlet', 'Samosa', 'Kaman (Vateli Dal)', 'Patra', 'Fulvadi', 'Mix Bhajiya', 'Batakawada'],
      premium: ['Lilva Kachori', 'Khaman (Nylon)', 'Khandavi', 'Harabhara Kabab'],
    },
  },
  {
    categorySlug: 'signature-specials',
    tiers: {
      signature: ['Pav Bhaji', 'Pani Puri', 'Kathiyavadi Special', 'Idli Sambhar'],
    },
  },
  {
    categorySlug: 'main-course-gujarati',
    tiers: {
      standard: ['Tindora Bataka', 'Ringan Bataka Tomato', 'Tuver Ringan', 'Papadi Ringan', 'Flower Bataka Tomato', 'Vatana Bataka Tomato', 'Bataka Tomato', 'Fry Tindora', 'Turiya Patra', 'Suki Bhaji', 'Deshi Chana', 'Chora'],
      premium: ['Undhiyu', 'Fry Bhindi Masala', 'Bhindi Capsicum Tomato', 'Dana Muthiya', 'Rangooni Val', 'Mix Kathol', 'Pancharatna Shak'],
    },
  },
  {
    categorySlug: 'main-course-punjabi',
    tiers: {
      standard: ['Paneer Bhurji', 'Palak Paneer', 'Veg Kolhapuri', 'Aloo Mutter', 'Punjabi Chhole', 'Dum Aloo', 'Aloo Gobi Mutter', 'Rajma'],
      premium: ['Cheese Butter Masala', 'Cheese Anguri', 'Paneer Tikka Masala', 'Paneer Butter Masala', 'Paneer Makhani', 'Paneer Angara', 'Paneer Jwalamukhi', 'Paneer Lasuni', 'Shahi Paneer', 'Garlic Palak Paneer', 'Paneer Tufani', 'Kaju Karry', 'Kaju Paneer', 'Kaju Lasaniya', 'Veg Jaypuri', 'Malai Kofta', 'Hariyali Kofta', 'Diwani Handi', 'Methi Malai Mutter', 'Paneer Corn Capsicum'],
    },
  },
  {
    categorySlug: 'main-course-kathiyavadi',
    tiers: {
      standard: ['Sev Tomato', 'Lasaniya Bataka', 'Methi Papad', 'Dungali Gathiya', 'Palak Moong ni Dal', 'Moong Masala', 'Aloo Methi'],
      premium: ['Kaju Ganthiya', 'Kathiyawadi Dhokli', 'Kaju Lasaniya', 'Bharela Shaak', 'Dahi Tikhari', 'Baigan Bhartha'],
    },
  },
  {
    categorySlug: 'main-course-chinese',
    tiers: {
      standard: ['Veg. Manchurian Dry', 'Veg. Manchurian Gravy', 'Veg. Hakka Noodles', 'Veg. Fried Rice'],
      premium: ['Paneer Chilli Dry', 'Paneer Chilli Gravy', 'Veg. Schezwan Noodles', 'Schezwan Rice', 'Manchurian Rice', 'Noodles with Manchurian', 'Paneer 65'],
    },
  },
  {
    categorySlug: 'indian-bread',
    tiers: {
      standard: ['Roti', 'Puri', 'Jeera Puri', 'Methi Puri'],
      premium: ['Paratha Tava', 'Bajri Rotla'],
    },
  },
  {
    categorySlug: 'rice-biryani',
    tiers: {
      standard: ['Plain Rice', 'Jeera Rice', 'Veg. Pulao', 'Lemon Rice', 'Curd Rice', 'Peas Pulav', 'Plain Khichadi'],
      premium: ['Veg. Biryani', 'Paneer Biryani', 'Kashmiri Pulao', 'Tawa Pulav', 'Hyderabadi Biryani', 'Shahi Biryani', 'Special Rajwadi Khichadi'],
    },
  },
  {
    categorySlug: 'daal-kadhi',
    tiers: {
      standard: ['Gujarati Dal', 'Dal Fry', 'Gujarati Kadhi', 'Kathiyawadi Kadhi'],
      premium: ['Dal Tadka', 'Dal Makhani', 'Panchmel Dal'],
    },
  },
  {
    categorySlug: 'raita',
    tiers: {
      standard: ['Plain Raita', 'Boondi Raita', 'Cucumber Raita'],
      premium: ['Mix Fruit Raita', 'Green Grapes Raita'],
    },
  },
];

const toSlug = input =>
  (input || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const toSortValue = value => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

export const catalogueTierPriceBands = {
  standard: { base: 32, spread: 14 },
  premium: { base: 48, spread: 16 },
  signature: { base: 64, spread: 18 },
};

export const computeDefaultItemPrice = (name, tier = 'standard') => {
  const key = (tier || 'standard').toLowerCase();
  const band = catalogueTierPriceBands[key] || { base: 105, spread: 20 };
  const input = (name || '').toString();
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) % 9973;
  }
  const adjustment = band.spread ? hash % band.spread : 0;
  const resolved = Math.max(18, band.base + adjustment);
  return Math.round(resolved);
};

export function buildDefaultCatalogueSnapshot() {
  const categories = [];
  const categoryMap = new Map();

  catalogueCategoryDefaults.forEach((definition, index) => {
    const record = {
      _id: definition.slug,
      name: definition.name,
      slug: definition.slug,
      description: definition.description || '',
      parentId: null,
      accentColor: definition.accentColor || null,
      heroImage: definition.heroImage || null,
      badgeLabel: definition.badgeLabel || null,
      layoutPreset: definition.layoutPreset || 'default',
      sortOrder: toSortValue(definition.sortOrder) || index * 10,
      isActive: definition.isActive !== false,
      createdAt: null,
      updatedAt: null,
      metadata: { ...(definition.metadata || {}), fallback: true },
    };
    categories.push(record);
    categoryMap.set(definition.slug, record);
  });

  catalogueMainCourseChildren.forEach((definition, index) => {
    const parent = categoryMap.get(definition.parentSlug);
    if (!parent) {
      return;
    }
    const record = {
      _id: definition.slug,
      name: definition.name,
      slug: definition.slug,
      description: definition.description || '',
      parentId: parent._id,
      accentColor: definition.accentColor || parent.accentColor || null,
      heroImage: definition.heroImage || null,
      badgeLabel: definition.badgeLabel || null,
      layoutPreset: definition.layoutPreset || 'default',
      sortOrder: toSortValue(definition.sortOrder) || (parent.sortOrder || 0) + index + 1,
      isActive: definition.isActive !== false,
      createdAt: null,
      updatedAt: null,
      metadata: { ...(definition.metadata || {}), fallback: true },
    };
    categories.push(record);
    categoryMap.set(definition.slug, record);
  });

  const items = [];
  catalogueItemDefaults.forEach(entry => {
    const category = categoryMap.get(entry.categorySlug);
    if (!category) {
      return;
    }
    Object.entries(entry.tiers || {}).forEach(([tier, names = []]) => {
      names
        .map(name => name && name.trim())
        .filter(Boolean)
        .forEach((name, index) => {
          const slug = `${entry.categorySlug}-${toSlug(name)}`;
          items.push({
            _id: slug,
            basePrice: computeDefaultItemPrice(name, tier),
            name,
            slug,
            description: '',
            highlights: [],
            priceNote: null,
            tier: tier.toLowerCase(),
            categoryId: category._id,
            tags: [],
            dietary: [],
            allergens: [],
            spiceLevel: null,
            isActive: true,
            isRecommended: false,
            sortOrder: index,
            heroImage: null,
            mediaGallery: [],
            createdAt: null,
            updatedAt: null,
            metadata: { fallback: true },
          });
        });
    });
  });

  categories.sort((a, b) => {
    const diff = toSortValue(a.sortOrder) - toSortValue(b.sortOrder);
    if (diff !== 0) return diff;
    return (a.name || '').localeCompare(b.name || '');
  });

  return { categories, items };
}

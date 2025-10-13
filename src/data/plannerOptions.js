export const defaultPlannerConfig = {
  plannerEnabled: true,
  eventTypes: [
    {
      id: 'wedding',
      name: 'Wedding Celebration',
      description: 'Sangeet nights, pheras, and receptions with regal service touches.',
      pricePerGuest: 135,
      highlight: 'Royal Gujarati hospitality for multi-day festivities',
    },
    {
      id: 'corporate',
      name: 'Corporate Gala',
      description: 'High-impact launches, annual meets, and leadership retreats.',
      pricePerGuest: 95,
      highlight: 'Impeccable presentation and time-perfect service',
    },
    {
      id: 'social',
      name: 'Social Celebration',
      description: 'Birthdays, anniversaries, housewarmings, and community gatherings.',
      pricePerGuest: 85,
      highlight: 'Warmth-filled, family-style dining experiences',
    },
    {
      id: 'spiritual',
      name: 'Spiritual / Community',
      description: 'Bhajan sandhyas, satsangs, temple events, and charity feasts.',
      pricePerGuest: 75,
      highlight: 'Pure-veg offerings prepared with traditional devotion',
    },
  ],
  serviceLevels: [
    {
      id: 'classic',
      name: 'Classic Buffet',
      description: 'Sharp-uniformed service staff, buffet styling, and live counters.',
      pricePerGuest: 28,
    },
    {
      id: 'signature',
      name: 'Signature Butlered',
      description: 'Butler-passed appetizers, curated plating, concierge host.',
      pricePerGuest: 42,
    },
    {
      id: 'royale',
      name: 'Royale Experience',
      description: 'Table-side service, culinary storytelling, and premium decor accents.',
      pricePerGuest: 58,
    },
  ],
  menuCollections: [
    {
      id: 'gujarati-royal',
      name: 'Royal Gujarati Feast',
      headline: 'A nostalgic spread celebrating Kathiyawadi, Surti, and Jain favourites.',
      pricePerGuest: 58,
      courses: {
        starters: ['Handvo bites with chutney trio', 'Mini fafda cones with raw papaya relish', 'Makhanwala paneer tikka'],
        mains: ['Undhiyu with methi puri', 'Vagarelo dal-dhokli', 'Paneer lasaniya bataka'],
        breads: ['Bhakri', 'Bajara rotla', 'Butter tandoori roti'],
        sweets: ['Shrikhand trio', 'Saffron basundi', 'Mohanthal fudge'],
        beverages: ['Kesar badam thandai', 'Sicilian lime sharbat'],
      },
    },
    {
      id: 'fusion-celebration',
      name: 'Global Fusion Celebration',
      headline: 'Gujarati soul with global flair crafted for cosmopolitan palates.',
      pricePerGuest: 68,
      courses: {
        starters: ['Tandoori broccoli with peri-peri glaze', 'Chipotle dabeli sliders', 'Quinoa dhokla'],
        mains: ['Thai green veg korma', 'Lasooni palak ricotta cannelloni', 'Gujarati kadhi risotto'],
        breads: ['Garlic kulcha', 'Multigrain phulkas'],
        sweets: ['Dark chocolate srikhand tart', 'Pista tiramisu jars'],
        beverages: ['Jaggery cold brew', 'Passionfruit jaljeera'],
      },
    },
    {
      id: 'heritage-satvik',
      name: 'Heritage Sattvik Bhojan',
      headline: 'Temple-inspired satvik dining without onion or garlic.',
      pricePerGuest: 52,
      courses: {
        starters: ['Sabudana seekh with mint yogurt', 'Stuffed aloo pudina tikki'],
        mains: ['Paneer angoori sabzi', 'Lauki moong dal nu shaak', 'Avial'],
        breads: ['Phulka with ghee', 'Methi thepla'],
        sweets: ['Badam halwa', 'Fruit rabdi'],
        beverages: ['Tulsi aam panna', 'Rose petal sharbat'],
      },
    },
  ],
  experienceAddons: [
    {
      id: 'live-chaat',
      name: 'Live Chaat Studio',
      description: 'Interactive counter with Delhi, Mumbai, and Surti signatures.',
      type: 'per_person',
      price: 14,
    },
    {
      id: 'dessert-parlour',
      name: 'Dessert Parlour',
      description: 'Nitro kulfi, sizzling jalebi, and artisanal mithai bar.',
      type: 'per_person',
      price: 16,
    },
    {
      id: 'mocktail-lab',
      name: 'Mocktail Laboratory',
      description: 'Flair bartenders, molecular garnish play, unlimited beverages.',
      type: 'per_person',
      price: 18,
    },
    {
      id: 'floral-decor',
      name: 'Floral and Tablescape Styling',
      description: 'Seasonal blooms, centrepieces, and luxury table linen.',
      type: 'flat',
      price: 1200,
    },
    {
      id: 'destination-kitchen',
      name: 'Destination Pop-Up Kitchen',
      description: 'Complete travelling kitchen for outdoor or remote venues.',
      type: 'flat',
      price: 2600,
    },
  ],
  menuBuilderCategories: [
    {
      id: 'signature-curries',
      label: 'Sabji and Curries',
      description: 'Select up to three signatures for the main course.',
      maxSelections: 3,
      items: [
        { id: 'paneer-lababdar', name: 'Paneer Lababdar' },
        { id: 'bhindi-kadhi', name: 'Bhindi Kadhi' },
        { id: 'lasaniya-bataka', name: 'Lasaniya Bataka' },
        { id: 'kaju-khoya-korma', name: 'Kaju Khoya Korma' },
        { id: 'mix-veg-jaipuri', name: 'Mix Veg Jaipuri' },
      ],
    },
    {
      id: 'regional-breads',
      label: 'Indian Breads',
      description: 'Choose two breads to accompany the feast.',
      maxSelections: 2,
      items: [
        { id: 'garlic-naan', name: 'Garlic Naan' },
        { id: 'bajara-rotla', name: 'Bajara Rotla' },
        { id: 'methi-thepla', name: 'Methi Thepla' },
        { id: 'khasta-paratha', name: 'Khasta Paratha' },
      ],
    },
    {
      id: 'rice-specials',
      label: 'Rice and Khichdi',
      description: 'One aromatic rice dish to pair with the mains.',
      maxSelections: 1,
      items: [
        { id: 'saffron-veg-pulao', name: 'Saffron Veg Pulao' },
        { id: 'kathiyawadi-khichdi', name: 'Kathiyawadi Khichdi' },
        { id: 'dal-dhokli', name: 'Dal Dhokli Bowl' },
      ],
    },
    {
      id: 'sweet-endings',
      label: 'Desserts',
      description: 'Treat your guests with handcrafted desserts.',
      maxSelections: 2,
      items: [
        { id: 'shrikhand-trio', name: 'Shrikhand Trio' },
        { id: 'saffron-basundi', name: 'Saffron Basundi' },
        { id: 'matka-kulfi', name: 'Matka Kulfi Trails' },
        { id: 'moong-dal-halwa', name: 'Moong Dal Halwa' },
      ],
    },
    {
      id: 'signature-specials',
      label: 'Signature Specials',
      description: 'Chef-crafted live stations and wow factors.',
      maxSelections: 2,
      items: [
        { id: 'signature-pav-bhaji', name: 'Bombay Pav Bhaji Bar' },
        { id: 'signature-tawa-rumal', name: 'Tawa Sabzi Rumali Roll' },
        { id: 'signature-mini-chelo', name: 'Mini Chelo Kebabs' },
      ],
    },
    {
      id: 'beverage-bar',
      label: 'Beverage Bar',
      description: 'Curate refreshing sips throughout the celebration.',
      maxSelections: 2,
      items: [
        { id: 'kesar-badam-milk', name: 'Kesar Badam Milk' },
        { id: 'masala-jaljeera', name: 'Masala Jaljeera Cooler' },
        { id: 'rose-lychee-fizz', name: 'Rose and Lychee Fizz' },
        { id: 'kokum-sherbet', name: 'Kokum Sherbet' },
      ],
    },
  ],
  onboardingChecklist: [
    'Dedicated culinary consultant in touch within 12 working hours',
    'Menu tasting session scheduled at our test kitchen',
    'Venue recce and layout mapping with service captain',
    'Real-time guest tracking and service dashboard access',
  ],
};

const ensureArray = value => (Array.isArray(value) ? value : []);

const createSlug = (input, fallback) => {
  const base = (input || fallback || '').toString().toLowerCase();
  const slug = base.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return slug || (fallback || '');
};

const normaliseMenuItem = (item, fallbackLabel, index) => {
  const fallbackName = `${fallbackLabel} ${index + 1}`;

  if (typeof item === 'string') {
    return {
      id: createSlug(item, `item-${index}`),
      name: item,
      description: '',
    };
  }

  if (item && typeof item === 'object') {
    const name = item.name || item.label || fallbackName;
    return {
      id: item.id || createSlug(name, `item-${index}`),
      name,
      description: item.description || '',
    };
  }

  return {
    id: `item-${index}`,
    name: fallbackName,
    description: '',
  };
};

export const normalisePlannerConfig = (config = {}) => {
  const merged = {
    plannerEnabled: typeof config.plannerEnabled === 'boolean' ? config.plannerEnabled : defaultPlannerConfig.plannerEnabled,
    eventTypes: ensureArray(config.eventTypes).length ? config.eventTypes : defaultPlannerConfig.eventTypes,
    serviceLevels: ensureArray(config.serviceLevels).length ? config.serviceLevels : defaultPlannerConfig.serviceLevels,
    menuCollections: ensureArray(config.menuCollections).length ? config.menuCollections : defaultPlannerConfig.menuCollections,
    experienceAddons: ensureArray(config.experienceAddons).length ? config.experienceAddons : defaultPlannerConfig.experienceAddons,
    menuBuilderCategories: ensureArray(config.menuBuilderCategories).length ? config.menuBuilderCategories : defaultPlannerConfig.menuBuilderCategories,
    onboardingChecklist: ensureArray(config.onboardingChecklist).length ? config.onboardingChecklist : defaultPlannerConfig.onboardingChecklist,
  };

  merged.menuBuilderCategories = ensureArray(merged.menuBuilderCategories).map((category, catIndex) => {
    const label = category?.label || category?.name || `Category ${catIndex + 1}`;
    const maxSelections = typeof category?.maxSelections === 'number' ? category.maxSelections : undefined;
    const minSelections = typeof category?.minSelections === 'number' ? category.minSelections : 0;

    return {
      id: category?.id || createSlug(label, `category-${catIndex}`),
      label,
      description: category?.description || '',
      maxSelections,
      minSelections,
      items: ensureArray(category?.items).map((item, index) => normaliseMenuItem(item, label, index)),
    };
  });

  return merged;
};

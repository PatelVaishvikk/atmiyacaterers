// export default function FoodCatalogueClient({ categories = [], items = [], settings = {} }) {
//   const catalogueEnquiry = settings?.catalogueEnquiry || {};
//   const enquiryEnabled = Boolean(catalogueEnquiry.enabled);
//   const whatsappNumber = (catalogueEnquiry.whatsappNumber || '').trim();
//   const whatsappReady = enquiryEnabled && Boolean(sanitisePhoneNumber(whatsappNumber));

//   const topLevelCategories = useMemo(
//     () => categories.filter(category => !category.parentId),
//     [categories],
//   );

//   const categoryMap = useMemo(() => {
//     const map = new Map();
//     categories.forEach(category => {
//       if (category && category._id) {
//         map.set(category._id, category);
//       }
//     });
//     return map;
//   }, [categories]);

//   const hasCategories = topLevelCategories.length > 0;

//   const [activeCategoryId, setActiveCategoryId] = useState(() => topLevelCategories[0]?._id || null);
//   const [activeChildId, setActiveChildId] = useState(null);
//   const [activeTierFilter, setActiveTierFilter] = useState('all');

//   const [selectedItems, setSelectedItems] = useState([]);
//   const [occasion, setOccasion] = useState('');
//   const [eventDate, setEventDate] = useState('');
//   const [eventTime, setEventTime] = useState('');
//   const [location, setLocation] = useState('');
//   const [guestCount, setGuestCount] = useState('');
//   const [notes, setNotes] = useState('');
//   const [feedbackMessage, setFeedbackMessage] = useState('');

//   const childCategories = useMemo(
//     () => categories.filter(category => category.parentId === activeCategoryId),
//     [categories, activeCategoryId],
//   );

//   useEffect(() => {
//     if (childCategories.length > 0) {
//       setActiveChildId(prev => (prev && childCategories.some(cat => cat._id === prev) ? prev : childCategories[0]._id));
//     } else {
//       setActiveChildId(null);
//     }
//   }, [childCategories]);

//   useEffect(() => {
//     if (!enquiryEnabled) {
//       setSelectedItems([]);
//     }
//   }, [enquiryEnabled]);

//   useEffect(() => {
//     if (!enquiryEnabled) {
//       setSelectedItems([]);
//     }
//   }, [enquiryEnabled]);

//   const activeCategory = useMemo(
//     () => categories.find(category => category._id === activeCategoryId) || null,
//     [categories, activeCategoryId],
//   );

//   const relevantCategoryIds = useMemo(() => {
//     if (childCategories.length > 0) {
//       if (activeChildId) {
//         return [activeChildId];
//       }
//       return childCategories.map(category => category._id);
//     }
//     return activeCategoryId ? [activeCategoryId] : [];
//   }, [childCategories, activeChildId, activeCategoryId]);

//   const filteredItems = useMemo(() => {
//     if (relevantCategoryIds.length === 0) return [];
//     return items
//       .filter(item => item && relevantCategoryIds.includes(item.categoryId))
//       .map(item => ({ ...item, tier: normaliseTier(item.tier) }))
//       .sort((a, b) => {
//         const sortDiff = (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0);
//         if (sortDiff !== 0) return sortDiff;
//         return sortByName(a, b);
//       });
//   }, [items, relevantCategoryIds]);

//   const groupedByTier = useMemo(() => {
//     return tierOrder
//       .map(key => ({
//         key,
//         meta: tierMeta[key],
//         items: filteredItems.filter(item => normaliseTier(item.tier) === key),
//       }))
//       .filter(group => group.items.length > 0);
//   }, [filteredItems]);

//   const displayTierGroups = useMemo(() => {
//     if (activeTierFilter === 'all') {
//       return groupedByTier;
//     }
//     return groupedByTier.filter(group => group.key === activeTierFilter);
//   }, [groupedByTier, activeTierFilter]);

//   const availableTierFilters = useMemo(
//     () => tierFilters.filter(option => option.key === 'all' || groupedByTier.some(group => group.key === option.key)),
//     [groupedByTier],
//   );

//   const toggleItemSelection = useCallback(item => {
//     setSelectedItems(prev => {
//       const exists = prev.some(selected => selected._id === item._id);
//       if (exists) {
//         return prev.filter(selected => selected._id !== item._id);
//       }
//       const payload = {
//         _id: item._id,
//         name: item.name,
//         tier: normaliseTier(item.tier),
//         categoryId: item.categoryId,
//       };
//       return [...prev, payload];
//     });
//   }, []);

//   const removeSelectedItem = useCallback(itemId => {
//     setSelectedItems(prev => prev.filter(item => item._id !== itemId));
//   }, []);

//   const clearSelection = useCallback(() => {
//     setSelectedItems([]);
//     setFeedbackMessage('');
//   }, []);

//   const buildWhatsappMessage = useCallback(() => {
//     const lines = [
//       'Hello Atmiya Caterers,',
//       '',
//       'I would like to discuss catering for an upcoming event.',
//       `Occasion: ${occasion || 'Not specified'}`,
//       `Event date: ${eventDate || 'Not specified'}`,
//       `Event time: ${eventTime || 'Not specified'}`,
//       `Expected guests: ${guestCount || 'Not specified'}`,
//       `Location: ${location || 'Not specified'}`,
//       '',
//       'Selected dishes:',
//     ];

//     selectedItems.forEach((item, index) => {
//       const tierLabel = tierMeta[item.tier]?.label || item.tier;
//       const categoryName = categoryMap.get(item.categoryId)?.name || 'Category';
//       lines.push(`${index + 1}. ${item.name} (${tierLabel}) - ${categoryName}`);
//     });

//     if (notes) {
//       lines.push('', `Notes: ${notes}`);
//     }

//     lines.push('', 'Sent from the Atmiya Caterers food catalogue.');

//     return lines.join('\n');
//   }, [categoryMap, eventDate, eventTime, guestCount, location, notes, occasion, selectedItems]);

//   const handleSendEnquiry = useCallback(() => {
//     if (!enquiryEnabled) {
//       return;
//     }
//     if (!selectedItems.length) {
//       setFeedbackMessage('Add at least one dish to your selection.');
//       return;
//     }
//     if (!whatsappReady) {
//       setFeedbackMessage('This enquiry feature is not fully configured yet. Please contact us directly.');
//       return;
//     }

//     const phone = sanitisePhoneNumber(whatsappNumber);
//     if (!phone) {
//       setFeedbackMessage('Unable to send message because the WhatsApp number looks invalid.');
//       return;
//     }

//     const message = buildWhatsappMessage();
//     const encoded = encodeURIComponent(message);
//     const url = `https://wa.me/${phone}?text=${encoded}`;

//     if (typeof window !== 'undefined') {
//       window.open(url, '_blank');
//       setFeedbackMessage('Opening WhatsApp in a new tab...');
//     }
//   }, [buildWhatsappMessage, enquiryEnabled, selectedItems.length, whatsappNumber, whatsappReady]);

//   const formattedWhatsapp = whatsappNumber
//     ? (whatsappNumber.startsWith('+') ? whatsappNumber : `+${whatsappNumber}`)
//     : '';
//   const selectionAllowed = enquiryEnabled;

//   const accentColor = getAccentColor(activeCategory?.accentColor);
//   const heroImage = activeCategory?.heroImage || null;
//   const childAccent = getAccentColor(childCategories.find(cat => cat._id === activeChildId)?.accentColor);

//   const handleCategoryClick = useCallback(categoryId => {
//     setActiveCategoryId(categoryId);
//     setActiveTierFilter('all');
//   }, []);

//   const handleChildClick = useCallback(categoryId => {
//     setActiveChildId(categoryId);
//     setActiveTierFilter('all');
//   }, []);

//   const tierColumns = displayTierGroups.length || 1;
//   const gridClass = tierColumns === 1 ? 'md:grid-cols-1' : tierColumns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

//   const tierFilterMeta = filterMeta[activeTierFilter] || filterMeta.all;


//   return (
//     <div className="space-y-12">
//       <section className="rounded-3xl bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 px-6 py-8 sm:py-10 shadow-lg">
//         <div className="mx-auto max-w-4xl text-center space-y-4">
//           <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Food Catalogue</p>
//           <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">Crafted Menus for Every Occasion</h1>
//           <p className="text-base text-gray-700 sm:text-lg">
//             Explore curated dishes across every course. Use the quick filters to compare Standard and Premium tiers or dive into regional main-course collections.
//           </p>
//           <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
//             <Link
//               href={CATALOGUE_DOWNLOAD_PATH}
//               prefetch={false}
//               className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-orange-600"
//             >
//               <span className="fas fa-file-download" aria-hidden="true"></span>
//               <span>Download PDF Catalogue</span>
//             </Link>
//             {/* <span className="text-xs text-gray-500">(Add your latest catalogue PDF at public/food-catalogue.pdf)</span> */}
//           </div>
//         </div>
//       </section>

//       {hasCategories ? (
//         <>
//           <section className="space-y-6">
//             <header className="space-y-4">
//               <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <h2 className="text-2xl font-semibold text-gray-900">Choose a category</h2>
//                   <p className="text-sm text-gray-500">Switch between top-level experiences such as Soups, Appetizers or the Main Course corners.</p>
//                 </div>
//                 <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-orange-600 shadow">
//                   {topLevelCategories.length} collections
//                 </span>
//               </div>
//               <div className="flex flex-wrap gap-3">
//                 {topLevelCategories.map(category => {
//                   const isActive = category._id === activeCategoryId;
//                   return (
//                     <button
//                       key={category._id}
//                       type="button"
//                       onClick={() => handleCategoryClick(category._id)}
//                       className={`rounded-full border px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                         isActive
//                           ? 'border-orange-500 bg-orange-500 text-white focus:ring-orange-500'
//                           : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-500 focus:ring-orange-300'
//                       }`}
//                     >
//                       {category.name}
//                     </button>
//                   );
//                 })}
//               </div>
//             </header>

//             {childCategories.length > 0 && (
//               <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//                 <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Sub category</h3>
//                     <p className="text-xs text-gray-500">Choose a specific regional corner inside the main course.</p>
//                   </div>
//                   <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600">
//                     {childCategories.length} options
//                   </span>
//                 </div>
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   {childCategories.map(subCategory => {
//                     const isActive = subCategory._id === activeChildId;
//                     return (
//                       <button
//                         key={subCategory._id}
//                         type="button"
//                         onClick={() => handleChildClick(subCategory._id)}
//                         className={`rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                           isActive
//                             ? 'border-orange-500 bg-orange-500 text-white focus:ring-orange-500'
//                             : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-500 focus:ring-orange-300'
//                         }`}
//                       >
//                         {subCategory.name}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </section>

//           <section className="space-y-8">
//             <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
//               {heroImage && (
//                 <div
//                   className="h-48 w-full bg-cover bg-center"
//                   style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${heroImage})` }}
//                 />
//               )}
//               <div className="space-y-6 px-6 py-8 sm:px-10">
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <p className="text-sm uppercase tracking-wide text-orange-500">
//                       {activeCategory?.badgeLabel || 'Our selection'}
//                     </p>
//                     <h2 className="text-3xl font-bold text-gray-900">{activeCategory?.name || 'Select a category'}</h2>
//                     {activeCategory?.description && (
//                       <p className="mt-2 text-gray-600">{activeCategory.description}</p>
//                     )}
//                   </div>
//                   <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold shadow ${tierFilterMeta.badgeClass}`}>
//                     {childCategories.length > 0
//                       ? childCategories.find(cat => cat._id === activeChildId)?.name || 'Select an option'
//                       : tierFilterMeta.label}
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   {availableTierFilters.map(filter => {
//                     const isActive = filter.key === activeTierFilter;
//                     return (
//                       <button
//                         key={filter.key}
//                         type="button"
//                         onClick={() => setActiveTierFilter(filter.key)}
//                         className={`rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                           isActive
//                             ? 'border-orange-500 bg-orange-500 text-white focus:ring-orange-500'
//                             : 'border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-500 focus:ring-orange-300'
//                         }`}
//                       >
//                         {filter.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <p className="text-xs text-gray-500">{tierFilterMeta.description}</p>

//                 {displayTierGroups.length === 0 ? (
//                   <p className="text-center text-gray-500">
//                     No dishes available for the selected tier just yet. Please check back soon.
//                   </p>
//                 ) : (
//                   <div className={`grid gap-6 sm:grid-cols-1 ${gridClass}`}>
//                     {displayTierGroups.map(group => {
//                       const meta = tierMeta[group.key] || tierMeta.standard;
//                       return (
//                         <div
//                           key={group.key}
//                           className={`rounded-2xl border bg-gradient-to-br ${meta.cardClass} p-6 shadow-sm transition hover:shadow-lg`}
//                         >
//                           <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
//                             <div>
//                               <p className={`text-xs font-semibold uppercase tracking-wide ${meta.badgeClass}`}>
//                                 {meta.label}
//                               </p>
//                               <h3 className="mt-1 text-lg font-semibold text-gray-900">
//                                 {group.items.length} curated {group.items.length === 1 ? 'dish' : 'dishes'}
//                               </h3>
//                               <p className="mt-2 text-sm text-gray-600">{meta.description}</p>
//                             </div>
//                             <span className={`mt-2 inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${meta.badgeClass}`}>
//                               Tier
//                             </span>
//                           </div>
//                           <ul className="mt-5 space-y-3">
//                             {group.items.map(item => (
//                               <li key={item._id} className="rounded-xl border border-white/70 bg-white/80 p-3 shadow-sm backdrop-blur">
//                                 <div className="flex items-start gap-3">
//                                   <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${meta.dotClass}`} />
//                                   <div className="space-y-1">
//                                     <p className="text-base font-medium text-gray-900">{item.name}</p>
//                                     {item.description && (
//                                       <p className="text-sm text-gray-500">{item.description}</p>
//                                     )}
//                                     {item.isRecommended && (
//                                       <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${meta.badgeClass}`}>
//                                         Chef&apos;s pick
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </section>
//         </>
//       ) : (
//         <section className="rounded-3xl border border-dashed border-orange-200 bg-white/60 p-10 text-center shadow-sm">
//           <h2 className="text-2xl font-semibold text-gray-900">Food catalogue coming soon</h2>
//           <p className="mt-3 text-gray-600">Once categories and dishes are published from the admin dashboard, they will appear here for your clients.</p>
//         </section>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useMemo, useEffect, useCallback, use } from 'react';

// Utility functions
const sanitisePhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

const normaliseTier = (tier) => {
  if (!tier) return 'standard';
  const normalized = tier.toLowerCase().trim();
  return ['standard', 'premium', 'luxury'].includes(normalized) ? normalized : 'standard';
};

const sortByName = (a, b) => {
  const nameA = (a.name || '').toLowerCase();
  const nameB = (b.name || '').toLowerCase();
  return nameA.localeCompare(nameB);
};

const getAccentColor = (color) => {
  return color || 'orange';
};

// Constants
const CATALOGUE_DOWNLOAD_PATH = '/food-catalogue.pdf';

const tierOrder = ['standard', 'premium', 'luxury'];

const tierMeta = {
  standard: {
    label: 'Standard',
    description: 'Classic dishes prepared with quality ingredients',
    badgeClass: 'bg-blue-100 text-blue-700',
    cardClass: 'from-blue-50 to-blue-100/50 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  premium: {
    label: 'Premium',
    description: 'Elevated recipes with premium ingredients',
    badgeClass: 'bg-purple-100 text-purple-700',
    cardClass: 'from-purple-50 to-purple-100/50 border-purple-200',
    dotClass: 'bg-purple-500',
  },
  luxury: {
    label: 'Luxury',
    description: 'Exceptional dishes with finest ingredients',
    badgeClass: 'bg-amber-100 text-amber-700',
    cardClass: 'from-amber-50 to-amber-100/50 border-amber-200',
    dotClass: 'bg-amber-500',
  },
};

const tierFilters = [
  { key: 'all', label: 'All Tiers' },
  { key: 'standard', label: 'Standard' },
  { key: 'premium', label: 'Premium' },
  { key: 'luxury', label: 'Luxury' },
];

const filterMeta = {
  all: {
    label: 'All Tiers',
    description: 'Showing dishes across all quality tiers',
    badgeClass: 'bg-gray-100 text-gray-700',
  },
  standard: {
    label: 'Standard Tier',
    description: 'Showing standard tier dishes',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  premium: {
    label: 'Premium Tier',
    description: 'Showing premium tier dishes',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  luxury: {
    label: 'Luxury Tier',
    description: 'Showing luxury tier dishes',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
};

// Simple Link component (replace with Next.js Link if available)
const Link = ({ href, children, className, prefetch }) => (
  <a href={href} className={className} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export default function FoodCatalogueClient({ categories = [], items = [], settings = {} }) {
  const catalogueEnquiry = settings?.catalogueEnquiry || {};
  const enquiryEnabled = Boolean(catalogueEnquiry.enabled);
  const whatsappNumber = (catalogueEnquiry.whatsappNumber || '').trim();
  const whatsappReady = enquiryEnabled && Boolean(sanitisePhoneNumber(whatsappNumber));

  const topLevelCategories = useMemo(
    () => categories.filter(category => !category.parentId),
    [categories],
  );

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach(category => {
      if (category && category._id) {
        map.set(category._id, category);
      }
    });
    return map;
  }, [categories]);

  const hasCategories = topLevelCategories.length > 0;

  const [activeCategoryId, setActiveCategoryId] = useState(() => topLevelCategories[0]?._id || null);
  const [activeChildId, setActiveChildId] = useState(null);
  const [activeTierFilter, setActiveTierFilter] = useState('all');

  const [selectedItems, setSelectedItems] = useState([]);
  const [occasion, setOccasion] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [notes, setNotes] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const childCategories = useMemo(
    () => categories.filter(category => category.parentId === activeCategoryId),
    [categories, activeCategoryId],
  );

  useEffect(() => {
    if (childCategories.length > 0) {
      setActiveChildId(prev => (prev && childCategories.some(cat => cat._id === prev) ? prev : childCategories[0]._id));
    } else {
      setActiveChildId(null);
    }
  }, [childCategories]);

  useEffect(() => {
    if (!enquiryEnabled) {
      setSelectedItems([]);
    }
  }, [enquiryEnabled]);

  const activeCategory = useMemo(
    () => categories.find(category => category._id === activeCategoryId) || null,
    [categories, activeCategoryId],
  );

  const relevantCategoryIds = useMemo(() => {
    if (childCategories.length > 0) {
      if (activeChildId) {
        return [activeChildId];
      }
      return childCategories.map(category => category._id);
    }
    return activeCategoryId ? [activeCategoryId] : [];
  }, [childCategories, activeChildId, activeCategoryId]);

  const filteredItems = useMemo(() => {
    if (relevantCategoryIds.length === 0) return [];
    return items
      .filter(item => item && relevantCategoryIds.includes(item.categoryId))
      .map(item => ({ ...item, tier: normaliseTier(item.tier) }))
      .sort((a, b) => {
        const sortDiff = (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0);
        if (sortDiff !== 0) return sortDiff;
        return sortByName(a, b);
      });
  }, [items, relevantCategoryIds]);

  const groupedByTier = useMemo(() => {
    return tierOrder
      .map(key => ({
        key,
        meta: tierMeta[key],
        items: filteredItems.filter(item => normaliseTier(item.tier) === key),
      }))
      .filter(group => group.items.length > 0);
  }, [filteredItems]);

  const displayTierGroups = useMemo(() => {
    if (activeTierFilter === 'all') {
      return groupedByTier;
    }
    return groupedByTier.filter(group => group.key === activeTierFilter);
  }, [groupedByTier, activeTierFilter]);

  const availableTierFilters = useMemo(
    () => tierFilters.filter(option => option.key === 'all' || groupedByTier.some(group => group.key === option.key)),
    [groupedByTier],
  );

  const toggleItemSelection = useCallback(item => {
    setSelectedItems(prev => {
      const exists = prev.some(selected => selected._id === item._id);
      if (exists) {
        return prev.filter(selected => selected._id !== item._id);
      }
      const payload = {
        _id: item._id,
        name: item.name,
        tier: normaliseTier(item.tier),
        categoryId: item.categoryId,
      };
      return [...prev, payload];
    });
  }, []);

  const removeSelectedItem = useCallback(itemId => {
    setSelectedItems(prev => prev.filter(item => item._id !== itemId));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setFeedbackMessage('');
  }, []);

  const buildWhatsappMessage = useCallback(() => {
    const lines = [
      'Hello Atmiya Caterers,',
      '',
      'I would like to discuss catering for an upcoming event.',
      `Occasion: ${occasion || 'Not specified'}`,
      `Event date: ${eventDate || 'Not specified'}`,
      `Event time: ${eventTime || 'Not specified'}`,
      `Expected guests: ${guestCount || 'Not specified'}`,
      `Location: ${location || 'Not specified'}`,
      '',
      'Selected dishes:',
    ];

    selectedItems.forEach((item, index) => {
      const tierLabel = tierMeta[item.tier]?.label || item.tier;
      const categoryName = categoryMap.get(item.categoryId)?.name || 'Category';
      lines.push(`${index + 1}. ${item.name} (${tierLabel}) - ${categoryName}`);
    });

    if (notes) {
      lines.push('', `Notes: ${notes}`);
    }

    lines.push('', 'Sent from the Atmiya Caterers food catalogue.');

    return lines.join('\n');
  }, [categoryMap, eventDate, eventTime, guestCount, location, notes, occasion, selectedItems]);

  const handleSendEnquiry = useCallback(() => {
    if (!enquiryEnabled) {
      return;
    }
    if (!selectedItems.length) {
      setFeedbackMessage('Add at least one dish to your selection.');
      return;
    }
    if (!whatsappReady) {
      setFeedbackMessage('This enquiry feature is not fully configured yet. Please contact us directly.');
      return;
    }

    const phone = sanitisePhoneNumber(whatsappNumber);
    if (!phone) {
      setFeedbackMessage('Unable to send message because the WhatsApp number looks invalid.');
      return;
    }

    const message = buildWhatsappMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;

    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
      setFeedbackMessage('Opening WhatsApp in a new tab...');
    }
  }, [buildWhatsappMessage, enquiryEnabled, selectedItems.length, whatsappNumber, whatsappReady]);

  const handleCategoryClick = useCallback(categoryId => {
    setActiveCategoryId(categoryId);
    setActiveTierFilter('all');
  }, []);

  const handleChildClick = useCallback(categoryId => {
    setActiveChildId(categoryId);
    setActiveTierFilter('all');
  }, []);

  const tierColumns = displayTierGroups.length || 1;
  const gridClass = tierColumns === 1 ? 'md:grid-cols-1' : tierColumns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  const tierFilterMeta = filterMeta[activeTierFilter] || filterMeta.all;
  const heroImage = activeCategory?.heroImage || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-12">
        <section className="rounded-3xl bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 px-6 py-8 sm:py-10 shadow-lg">
          <div className="mx-auto max-w-4xl text-center space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-500">Food Catalogue</p>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">Crafted Menus for Every Occasion</h1>
            <p className="text-base text-gray-700 sm:text-lg">
              Explore curated dishes across every course. Use the quick filters to compare Standard and Premium tiers or dive into regional main-course collections.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href={CATALOGUE_DOWNLOAD_PATH}
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-orange-600"
              >
                <span>📥</span>
                <span>Download PDF Catalogue</span>
              </Link>
            </div>
          </div>
        </section>

        {hasCategories ? (
          <>
            <section className="space-y-6">
              <header className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Choose a category</h2>
                    <p className="text-sm text-gray-500">Switch between top-level experiences such as Soups, Appetizers or the Main Course corners.</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-orange-600 shadow">
                    {topLevelCategories.length} collections
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {topLevelCategories.map(category => {
                    const isActive = category._id === activeCategoryId;
                    return (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() => handleCategoryClick(category._id)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          isActive
                            ? 'border-orange-500 bg-orange-500 text-white focus:ring-orange-500'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-500 focus:ring-orange-300'
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </header>

              {childCategories.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Sub category</h3>
                      <p className="text-xs text-gray-500">Choose a specific regional corner inside the main course.</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600">
                      {childCategories.length} options
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {childCategories.map(subCategory => {
                      const isActive = subCategory._id === activeChildId;
                      return (
                        <button
                          key={subCategory._id}
                          type="button"
                          onClick={() => handleChildClick(subCategory._id)}
                          className={`rounded-full border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            isActive
                              ? 'border-orange-500 bg-orange-500 text-white focus:ring-orange-500'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-500 focus:ring-orange-300'
                          }`}
                        >
                          {subCategory.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-8">
              <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
                {heroImage && (
                  <div
                    className="h-48 w-full bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${heroImage})` }}
                  />
                )}
                <div className="space-y-6 px-6 py-8 sm:px-10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-orange-500">
                        {activeCategory?.badgeLabel || 'Our selection'}
                      </p>
                      <h2 className="text-3xl font-bold text-gray-900">{activeCategory?.name || 'Select a category'}</h2>
                      {activeCategory?.description && (
                        <p className="mt-2 text-gray-600">{activeCategory.description}</p>
                      )}
                    </div>
                    <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold shadow ${tierFilterMeta.badgeClass}`}>
                      {childCategories.length > 0
                        ? childCategories.find(cat => cat._id === activeChildId)?.name || 'Select an option'
                        : tierFilterMeta.label}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableTierFilters.map(filter => {
                      const isActive = filter.key === activeTierFilter;
                      return (
                        <button
                          key={filter.key}
                          type="button"
                          onClick={() => setActiveTierFilter(filter.key)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            isActive
                              ? 'border-orange-500 bg-orange-500 text-white focus:ring-orange-500'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-500 focus:ring-orange-300'
                          }`}
                        >
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500">{tierFilterMeta.description}</p>

                  {displayTierGroups.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No dishes available for the selected tier just yet. Please check back soon.
                    </p>
                  ) : (
                    <div className={`grid gap-6 sm:grid-cols-1 ${gridClass}`}>
                      {displayTierGroups.map(group => {
                        const meta = tierMeta[group.key] || tierMeta.standard;
                        return (
                          <div
                            key={group.key}
                            className={`rounded-2xl border bg-gradient-to-br ${meta.cardClass} p-6 shadow-sm transition hover:shadow-lg`}
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className={`text-xs font-semibold uppercase tracking-wide ${meta.badgeClass}`}>
                                  {meta.label}
                                </p>
                                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                                  {group.items.length} curated {group.items.length === 1 ? 'dish' : 'dishes'}
                                </h3>
                                <p className="mt-2 text-sm text-gray-600">{meta.description}</p>
                              </div>
                              <span className={`mt-2 inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${meta.badgeClass}`}>
                                Tier
                              </span>
                            </div>
                            <ul className="mt-5 space-y-3">
                              {group.items.map(item => (
                                <li key={item._id} className="rounded-xl border border-white/70 bg-white/80 p-3 shadow-sm backdrop-blur">
                                  <div className="flex items-start gap-3">
                                    <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${meta.dotClass}`} />
                                    <div className="space-y-1">
                                      <p className="text-base font-medium text-gray-900">{item.name}</p>
                                      {item.description && (
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                      )}
                                      {item.isRecommended && (
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${meta.badgeClass}`}>
                                          Chefs pick
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-3xl border border-dashed border-orange-200 bg-white/60 p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Food catalogue coming soon</h2>
            <p className="mt-3 text-gray-600">Once categories and dishes are published from the admin dashboard, they will appear here for your clients.</p>
          </section>
        )}
      </div>
    </div>
  );
}
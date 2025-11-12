'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { defaultPlannerConfig, normalisePlannerConfig } from '@/data/plannerOptions';
import { buildDefaultCatalogueSnapshot } from '@/data/catalogueDefaults';

const currencyFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
});

const formatCurrency = value => {
  const numeric = Number(value);
  return currencyFormatter.format(Number.isFinite(numeric) ? Math.max(0, Math.round(numeric)) : 0);
};

const ensureArray = value => (Array.isArray(value) ? value : []);

const fallbackPlanner = normalisePlannerConfig(defaultPlannerConfig);
const fallbackEnabled = fallbackPlanner.plannerEnabled ?? true;
const defaultCatalogue = buildDefaultCatalogueSnapshot();

const emphasisedOrder = ['soups', 'appetizers', 'chat corner', 'breakfast', 'main course', 'sweets', 'indian bread', 'rice'];

const getEmphasisedIndex = name => {
  if (!name) return Number.MAX_SAFE_INTEGER;
  const value = name.toString().toLowerCase();
  const index = emphasisedOrder.indexOf(value);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const sortCategories = (a, b) => {
  const diff = (Number(a?.sortOrder) || 0) - (Number(b?.sortOrder) || 0);
  if (diff !== 0) return diff;
  return (a?.name || '').localeCompare(b?.name || '');
};

const sortItems = (a, b) => {
  const diff = (Number(a?.sortOrder) || 0) - (Number(b?.sortOrder) || 0);
  if (diff !== 0) return diff;
  return (a?.name || '').localeCompare(b?.name || '');
};

const tierOrder = ['standard', 'premium', 'signature'];

const normaliseTier = tier => {
  const value = typeof tier === 'string' ? tier.toLowerCase() : '';
  return tierOrder.includes(value) ? value : 'standard';
};

const tierMeta = {
  standard: { label: 'Standard', badge: 'bg-blue-100 text-blue-700' },
  premium: { label: 'Premium', badge: 'bg-purple-100 text-purple-700' },
  signature: { label: 'Signature', badge: 'bg-amber-100 text-amber-700' },
};

const tierFilters = [
  { key: 'all', label: 'All tiers' },
  { key: 'standard', label: 'Standard' },
  { key: 'premium', label: 'Premium' },
  { key: 'signature', label: 'Signature' },
];

const resolveItemPrice = item => {
  const candidates = [
    item?.basePrice,
    item?.price,
    item?.estimatedPrice,
    item?.pricePerGuest,
    item?.minPrice,
    item?.pricing?.perGuest,
    item?.pricing?.base,
  ];
  for (const candidate of candidates) {
    const numeric = Number(candidate);
    if (Number.isFinite(numeric) && numeric > 0) {
      return numeric;
    }
  }
  return 0;
};

const matchesSearch = (item, term, categoryMap) => {
  if (!term) return true;
  const lower = term.toLowerCase();
  const fields = [
    item?.name,
    item?.description,
    ...(ensureArray(item?.tags)),
    ...(ensureArray(item?.dietary)),
    categoryMap.get(item?.categoryId)?.name,
  ];
  return fields.some(field => field && field.toString().toLowerCase().includes(lower));
};

const sanitiseNumber = value => (value || '').toString().replace(/[^0-9]/g, '');

const CATALOGUE_DOWNLOAD_PATH = '/food-catalogue.pdf';
const WHATSAPP_NUMBER = sanitiseNumber(process.env.NEXT_PUBLIC_CATERER_WHATSAPP);

export default function PlannerClient() {
  const [hasMounted, setHasMounted] = useState(false);
  const [planner, setPlanner] = useState(fallbackPlanner);
  const [plannerEnabled, setPlannerEnabled] = useState(fallbackEnabled);
  const [plannerMessage, setPlannerMessage] = useState('');
  const [loadingPlanner, setLoadingPlanner] = useState(true);

  const [categories, setCategories] = useState(defaultCatalogue.categories);
  const [items, setItems] = useState(defaultCatalogue.items);
  const [catalogueMessage, setCatalogueMessage] = useState('');
  const [loadingCatalogue, setLoadingCatalogue] = useState(true);

  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeChildId, setActiveChildId] = useState(null);
  const [tierFilter, setTierFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedMap, setSelectedMap] = useState({});

  const [eventTypeId, setEventTypeId] = useState(fallbackPlanner.eventTypes?.[0]?.id || '');
  const [guestInput, setGuestInput] = useState('150');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingPlanner(true);
        setPlannerMessage('');
        const response = await fetch('/api/planner', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Planner fetch failed');
        }
        const payload = await response.json();
        if (!active) return;
        const normalised = normalisePlannerConfig(payload?.config || payload);
        const enabled =
          typeof payload?.enabled === 'boolean'
            ? payload.enabled
            : typeof normalised.plannerEnabled === 'boolean'
            ? normalised.plannerEnabled
            : fallbackEnabled;
        setPlanner(normalised);
        setPlannerEnabled(enabled);
        setEventTypeId(current =>
          normalised.eventTypes?.some(option => option.id === current)
            ? current
            : normalised.eventTypes?.[0]?.id || '',
        );
        if (!enabled) {
          setPlannerMessage('Planner enquiries are currently offline. You can still build a menu.');
        }
      } catch (error) {
        if (!active) return;
        console.error('planner config load failed', error);
        setPlanner(fallbackPlanner);
        setPlannerEnabled(fallbackEnabled);
        setPlannerMessage('Showing default planner options.');
      } finally {
        if (active) {
          setLoadingPlanner(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingCatalogue(true);
        setCatalogueMessage('');
        const response = await fetch('/api/catalogue', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Catalogue fetch failed');
        }
        const payload = await response.json();
        if (!active) return;
        const incomingCategories = ensureArray(payload?.categories);
        const incomingItems = ensureArray(payload?.items);
        setCategories(incomingCategories.length ? incomingCategories : defaultCatalogue.categories);
        setItems(incomingItems.length ? incomingItems : defaultCatalogue.items);
      } catch (error) {
        if (!active) return;
        console.error('catalogue load failed', error);
        setCategories(defaultCatalogue.categories);
        setItems(defaultCatalogue.items);
        setCatalogueMessage('Showing default dishes while we fetch the live catalogue.');
      } finally {
        if (active) {
          setLoadingCatalogue(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach(category => {
      if (category && category._id) {
        map.set(category._id, category);
      }
    });
    return map;
  }, [categories]);

  const topCategories = useMemo(() => {
    const top = categories.filter(category => !category.parentId);
    return [...top].sort((a, b) => {
      const emphasisedDiff = getEmphasisedIndex(a?.name) - getEmphasisedIndex(b?.name);
      if (emphasisedDiff !== 0) return emphasisedDiff;
      return sortCategories(a, b);
    });
  }, [categories]);

  useEffect(() => {
    if (!categories.length) return;
    setActiveCategoryId(current => {
      if (current && categories.some(category => category._id === current)) {
        return current;
      }
      return null;
    });
  }, [categories]);

  const childCategories = useMemo(() => {
    if (!activeCategoryId) return [];
    const list = categories.filter(category => category.parentId === activeCategoryId);
    return list.sort(sortCategories);
  }, [categories, activeCategoryId]);

  useEffect(() => {
    if (!childCategories.length) {
      setActiveChildId(null);
      return;
    }
    setActiveChildId(current => {
      if (current && childCategories.some(category => category._id === current)) {
        return current;
      }
      return childCategories[0]._id;
    });
  }, [childCategories]);

  const restrictByCategory = search.trim().length === 0 && activeCategoryId !== null;
  const searchTerm = search.trim().toLowerCase();

  const relevantCategoryIds = useMemo(() => {
    if (!restrictByCategory) return [];
    if (childCategories.length > 0) {
      if (activeChildId) {
        return [activeChildId];
      }
      return childCategories.map(category => category._id);
    }
    return activeCategoryId ? [activeCategoryId] : [];
  }, [restrictByCategory, childCategories, activeChildId, activeCategoryId]);

  const filteredItems = useMemo(() => {
    let result = items;
    
    if (restrictByCategory && relevantCategoryIds.length) {
      result = result.filter(item => relevantCategoryIds.includes(item.categoryId));
    }
    if (searchTerm) {
      result = result.filter(item => matchesSearch(item, searchTerm, categoryMap));
    }
    if (tierFilter !== 'all') {
      result = result.filter(item => normaliseTier(item.tier) === tierFilter);
    }
    return [...result].sort(sortItems);
  }, [items, restrictByCategory, relevantCategoryIds, searchTerm, categoryMap, tierFilter]);

  const itemMap = useMemo(() => {
    const map = new Map();
    items.forEach(item => {
      if (item && item._id) {
        map.set(item._id, item);
      }
    });
    return map;
  }, [items]);

  const addItem = useCallback(itemId => {
    setSelectedMap(previous => {
      if (previous[itemId]) {
        return previous;
      }
      return { ...previous, [itemId]: true };
    });
  }, []);

  const removeItem = useCallback(itemId => {
    setSelectedMap(previous => {
      if (!previous[itemId]) {
        return previous;
      }
      const { [itemId]: _removed, ...rest } = previous;
      return rest;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMap({});
  }, []);

  const selectionList = useMemo(() => {
    return Object.entries(selectedMap)
      .map(([itemId, isSelected]) => {
        const item = itemMap.get(itemId);
        if (!item || !isSelected) return null;
        return {
          item,
          price: resolveItemPrice(item),
          tier: normaliseTier(item.tier),
        };
      })
      .filter(Boolean);
  }, [selectedMap, itemMap]);

  const payloadSelections = useMemo(() => {
    const groups = new Map();
    selectionList.forEach(entry => {
      const categoryId = entry.item.categoryId || 'uncategorised';
      if (!groups.has(categoryId)) {
        groups.set(categoryId, {
          categoryId,
          categoryLabel: categoryMap.get(categoryId)?.name || 'Menu',
          dishes: [],
        });
      }
      groups.get(categoryId).dishes.push({
        id: entry.item._id,
        name: entry.item.name,
        tier: entry.tier,
        price: entry.price,
      });
    });
    return Array.from(groups.values());
  }, [selectionList, categoryMap]);

  const guestCount = Math.max(parseInt(guestInput, 10) || 0, 0);
  const eventType = useMemo(
    () => planner.eventTypes?.find(option => option.id === eventTypeId) || null,
    [planner.eventTypes, eventTypeId],
  );

  const perGuestBase = eventType?.pricePerGuest || 0;
  const baseTotal = perGuestBase * guestCount;
  const dishesTotal = selectionList.reduce((sum, entry) => sum + entry.price * guestCount, 0);
  const estimatedTotal = baseTotal + dishesTotal;
  const perGuestEstimate = guestCount > 0 ? estimatedTotal / guestCount : perGuestBase;
  const totalSelected = selectionList.length;

  const buildWhatsappMessage = useCallback(() => {
    const lines = [
      'Hello Atmiya Caterers,',
      '',
      `Event: ${eventType?.name || 'Custom event'}`,
      `Guests: ${guestCount || 'Not provided'}`,
      `Preferred date: ${eventDate || 'Not provided'}`,
      `Location: ${eventLocation || 'Not provided'}`,
      '',
      selectionList.length ? 'Selected dishes:' : 'No dishes selected yet.',
    ];

    selectionList.forEach((entry, index) => {
      const categoryName = categoryMap.get(entry.item.categoryId)?.name || 'Menu';
      const tierLabel = tierMeta[entry.tier]?.label || 'Standard';
      lines.push(`${index + 1}. ${entry.item.name} · ${tierLabel} · ${categoryName}`);
    });

    if (notes) {
      lines.push('', `Notes: ${notes}`);
    }

    lines.push('', `Per guest estimate: ${formatCurrency(perGuestEstimate)}`);
    lines.push(`Total estimate: ${formatCurrency(estimatedTotal)}`);
    lines.push('', 'Sent via the Atmiya Caterers menu planner.');

    return lines.join('\n');
  }, [
    categoryMap,
    eventDate,
    eventLocation,
    eventType?.name,
    estimatedTotal,
    guestCount,
    notes,
    perGuestEstimate,
    selectionList,
  ]);

  const handleSubmit = useCallback(async () => {
    setSubmitFeedback(null);
    setSubmitting(true);
    try {
      const message = buildWhatsappMessage();
      const phone = WHATSAPP_NUMBER;
      
      // Open WhatsApp directly without API call
      if (phone && typeof window !== 'undefined') {
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        setSubmitFeedback({ tone: 'success', message: 'Opening WhatsApp with your planner summary.' });
      } else {
        setSubmitFeedback({ tone: 'error', message: 'WhatsApp number not configured. Please contact us directly.' });
      }
    } catch (error) {
      console.error('planner submit failed', error);
      setSubmitFeedback({
        tone: 'error',
        message: 'Unable to open WhatsApp. Please contact us directly.',
      });
    } finally {
      setSubmitting(false);
    }
  }, [buildWhatsappMessage]);

  const plannerDisabled = !plannerEnabled;

  const sortedSelection = useMemo(() => {
    return [...selectionList].sort((a, b) => {
      const nameA = categoryMap.get(a.item.categoryId)?.name || '';
      const nameB = categoryMap.get(b.item.categoryId)?.name || '';
      if (nameA !== nameB) return nameA.localeCompare(nameB);
      return (a.item.name || '').localeCompare(b.item.name || '');
    });
  }, [selectionList, categoryMap]);

  if (!hasMounted) {
    return (
      <div className="bg-gradient-to-br from-white via-orange-50 to-white py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-orange-200/60 bg-white/80 p-8 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-500">Menu planner</p>
            <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">Loading planner...</h1>
            <p className="mt-4 max-w-3xl text-base text-gray-600">
              Please hold on while we prepare the live menu planner experience for you.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-orange-50 to-white py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-orange-200/60 bg-white/80 p-8 shadow-sm backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-orange-500">Menu planner</p>
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">Plan your menu with the Atmiya catalogue</h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600">
            Pick an event style, share guest details, search the full catalogue of dishes, and build a cart that suits your celebration. Prices are indicative in Canadian dollars.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={CATALOGUE_DOWNLOAD_PATH}
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-400 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
            >
              Download PDF catalogue
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Talk to our team
            </Link>
          </div>
          {plannerMessage && <p className="mt-4 text-sm text-orange-600">{plannerMessage}</p>}
          {catalogueMessage && <p className="mt-2 text-sm text-orange-600">{catalogueMessage}</p>}
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Event overview</h2>
                  <p className="text-sm text-gray-500">Select the occasion and share headline details for pricing context.</p>
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  {loadingPlanner ? 'Loading planner...' : `${planner.eventTypes?.length || 0} experiences`}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {ensureArray(planner.eventTypes).map(option => {
                  const active = option.id === eventTypeId;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setEventTypeId(option.id)}
                      className={`rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 ${
                        active ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-gray-900">{option.name}</span>
                        <span className="text-xs font-semibold text-orange-600">
                          {formatCurrency(option.pricePerGuest)}/guest
                        </span>
                      </div>
                      {option.description && <p className="mt-2 text-xs text-gray-600">{option.description}</p>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold text-gray-700">Guests</span>
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={guestInput}
                    onChange={event => setGuestInput(event.target.value)}
                    placeholder="Number of people"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-semibold text-gray-700">Preferred date</span>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={event => setEventDate(event.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </label>
              </div>

              <label className="mt-4 flex flex-col gap-1 text-sm">
                <span className="font-semibold text-gray-700">Venue or address</span>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={event => setEventLocation(event.target.value)}
                  placeholder="Venue name, city, or address"
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </label>

              <label className="mt-4 flex flex-col gap-1 text-sm">
                <span className="font-semibold text-gray-700">Notes</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={event => setNotes(event.target.value)}
                  placeholder="Allergies, cuisine focus, live counters, service style..."
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </label>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Browse dishes</h2>
                  <p className="text-sm text-gray-500">Use categories, tiers, and search to add dishes to your plan.</p>
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  {loadingCatalogue ? 'Loading dishes...' : `${filteredItems.length} dishes`}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { _id: null, name: 'All dishes' },
                  ...topCategories,
                ].map(category => {
                  const id = category?._id ?? null;
                  const active = id === activeCategoryId;
                  return (
                    <button
                      key={id || 'all'}
                      type="button"
                      onClick={() => {
                        setActiveCategoryId(id);
                        setActiveChildId(null);
                        setTierFilter('all');
                      }}
                      className={`rounded-full px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 ${
                        active
                          ? 'border border-orange-500 bg-orange-500 text-white'
                          : 'border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500'
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                  <input
                    type="search"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Search dishes or dietary tags..."
                    className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {tierFilters.map(filter => {
                    const active = filter.key === tierFilter;
                    return (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => setTierFilter(filter.key)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 ${
                          active
                            ? 'border border-orange-500 bg-orange-500 text-white'
                            : 'border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500'
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {childCategories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {childCategories.map(subCategory => {
                    const active = subCategory._id === activeChildId;
                    return (
                      <button
                        key={subCategory._id}
                        type="button"
                        onClick={() => {
                          setActiveChildId(subCategory._id);
                          setTierFilter('all');
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 ${
                          active
                            ? 'border border-orange-500 bg-orange-500 text-white'
                            : 'border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500'
                        }`}
                      >
                        {subCategory.name}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 space-y-3">
                {filteredItems.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-center text-sm text-gray-500">
                    {loadingCatalogue
                      ? 'Fetching dishes from the catalogue...'
                      : 'No dishes match your filters yet. Try clearing the search or switching tiers.'}
                  </p>
                ) : (
                  filteredItems.map(item => {
                    const isSelected = selectedMap[item._id];
                    const tierKey = normaliseTier(item.tier);
                    const price = resolveItemPrice(item);
                    return (
                      <div
                        key={item._id}
                        className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{item.name}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tierMeta[tierKey]?.badge || 'bg-gray-100 text-gray-600'}`}>
                              {tierMeta[tierKey]?.label || 'Standard'}
                            </span>
                          </div>
                          {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                            <span>{categoryMap.get(item.categoryId)?.name || 'Menu'}</span>
                            {price > 0 && <span>{formatCurrency(price)}/guest</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <button
                              type="button"
                              onClick={() => removeItem(item._id)}
                              className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addItem(item._id)}
                              className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
                            >
                              Add to planner
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
                <span className="text-xs font-semibold text-gray-500">{totalSelected} dishes</span>
              </div>

              <dl className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <dt>Event</dt>
                  <dd className="font-semibold text-gray-900">{eventType?.name || 'Custom event'}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Guests</dt>
                  <dd className="font-semibold text-gray-900">{guestCount || 'Not set'}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Per guest estimate</dt>
                  <dd className="font-semibold text-gray-900">{formatCurrency(perGuestEstimate)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Base package</dt>
                  <dd className="font-semibold text-gray-900">{formatCurrency(baseTotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Selected dishes</dt>
                  <dd className="font-semibold text-gray-900">{formatCurrency(dishesTotal)}</dd>
                </div>
                <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                  <dt>Total estimate</dt>
                  <dd>{formatCurrency(estimatedTotal)}</dd>
                </div>
              </dl>

              {sortedSelection.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {sortedSelection.map(entry => (
                    <li
                      key={entry.item._id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm text-gray-600"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{entry.item.name}</p>
                        <p className="text-xs text-gray-500">
                          {categoryMap.get(entry.item.categoryId)?.name || 'Menu'} · {tierMeta[entry.tier]?.label || 'Standard'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.price > 0 && guestCount > 0 && (
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(entry.price * guestCount)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem(entry.item._id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                  Add dishes from the catalogue to build your plan.
                </p>
              )}

              {sortedSelection.length > 0 && (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="mt-4 w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-red-300 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
                >
                  Clear all dishes
                </button>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || plannerDisabled}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                {submitting ? 'Submitting...' : 'Submit planner enquiry'}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                We will review your selections and reach out with a customised proposal. You can also share this summary with us over WhatsApp or email.
              </p>
              {submitFeedback && (
                <p
                  className={`mt-2 text-sm ${
                    submitFeedback.tone === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {submitFeedback.message}
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-dashed border-gray-200 bg-white/60 p-6 text-sm text-gray-600">
              <h3 className="text-base font-semibold text-gray-900">Planning tips</h3>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>Filter by tier to craft premium or luxury-only courses.</li>
                <li>Use search for dietary keywords such as Jain, vegan, or spicy.</li>
                <li>All dishes are calculated per guest automatically.</li>
                <li>Share this planner snapshot with our consultants for quick pricing.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}


// origianl File
// 'use client';

// import { useCallback, useEffect, useMemo, useState } from 'react';
// import Link from 'next/link';
// import { defaultPlannerConfig, normalisePlannerConfig } from '@/data/plannerOptions';
// import { buildDefaultCatalogueSnapshot } from '@/data/catalogueDefaults';

// const currencyFormatter = new Intl.NumberFormat('en-CA', {
//   style: 'currency',
//   currency: 'CAD',
//   maximumFractionDigits: 0,
// });

// const formatCurrency = value => {
//   const numeric = Number(value);
//   return currencyFormatter.format(Number.isFinite(numeric) ? Math.max(0, Math.round(numeric)) : 0);
// };

// const ensureArray = value => (Array.isArray(value) ? value : []);

// const fallbackPlanner = normalisePlannerConfig(defaultPlannerConfig);
// const fallbackEnabled = fallbackPlanner.plannerEnabled ?? true;
// const defaultCatalogue = buildDefaultCatalogueSnapshot();

// const emphasisedOrder = ['soups', 'appetizers', 'chat corner', 'breakfast', 'main course', 'sweets', 'indian bread', 'rice'];

// const getEmphasisedIndex = name => {
//   if (!name) return Number.MAX_SAFE_INTEGER;
//   const value = name.toString().toLowerCase();
//   const index = emphasisedOrder.indexOf(value);
//   return index === -1 ? Number.MAX_SAFE_INTEGER : index;
// };

// const sortCategories = (a, b) => {
//   const diff = (Number(a?.sortOrder) || 0) - (Number(b?.sortOrder) || 0);
//   if (diff !== 0) return diff;
//   return (a?.name || '').localeCompare(b?.name || '');
// };

// const sortItems = (a, b) => {
//   const diff = (Number(a?.sortOrder) || 0) - (Number(b?.sortOrder) || 0);
//   if (diff !== 0) return diff;
//   return (a?.name || '').localeCompare(b?.name || '');
// };

// const tierOrder = ['standard', 'premium', 'luxury'];

// const normaliseTier = tier => {
//   const value = typeof tier === 'string' ? tier.toLowerCase() : '';
//   return tierOrder.includes(value) ? value : 'standard';
// };

// const tierMeta = {
//   standard: { label: 'Standard', badge: 'bg-blue-100 text-blue-700' },
//   premium: { label: 'Premium', badge: 'bg-purple-100 text-purple-700' },
//   luxury: { label: 'Luxury', badge: 'bg-amber-100 text-amber-700' },
// };

// const tierFilters = [
//   { key: 'all', label: 'All tiers' },
//   { key: 'standard', label: 'Standard' },
//   { key: 'premium', label: 'Premium' },
//   { key: 'luxury', label: 'Luxury' },
// ];

// const resolveItemPrice = item => {
//   const candidates = [
//     item?.basePrice,
//     item?.price,
//     item?.estimatedPrice,
//     item?.pricePerGuest,
//     item?.minPrice,
//     item?.pricing?.perGuest,
//     item?.pricing?.base,
//   ];
//   for (const candidate of candidates) {
//     const numeric = Number(candidate);
//     if (Number.isFinite(numeric) && numeric > 0) {
//       return numeric;
//     }
//   }
//   return 0;
// };

// const matchesSearch = (item, term, categoryMap) => {
//   if (!term) return true;
//   const lower = term.toLowerCase();
//   const fields = [
//     item?.name,
//     item?.description,
//     ...(ensureArray(item?.tags)),
//     ...(ensureArray(item?.dietary)),
//     categoryMap.get(item?.categoryId)?.name,
//   ];
//   return fields.some(field => field && field.toString().toLowerCase().includes(lower));
// };

// const sanitiseNumber = value => (value || '').toString().replace(/[^0-9]/g, '');

// const CATALOGUE_DOWNLOAD_PATH = '/food-catalogue.pdf';
// const WHATSAPP_NUMBER = sanitiseNumber(process.env.NEXT_PUBLIC_CATERER_WHATSAPP);

// export default function PlannerPage() {
//   const [planner, setPlanner] = useState(fallbackPlanner);
//   const [plannerEnabled, setPlannerEnabled] = useState(fallbackEnabled);
//   const [plannerMessage, setPlannerMessage] = useState('');
//   const [loadingPlanner, setLoadingPlanner] = useState(true);

//   const [categories, setCategories] = useState(defaultCatalogue.categories);
//   const [items, setItems] = useState(defaultCatalogue.items);
//   const [catalogueMessage, setCatalogueMessage] = useState('');
//   const [loadingCatalogue, setLoadingCatalogue] = useState(true);

//   const [activeCategoryId, setActiveCategoryId] = useState(null);
//   const [activeChildId, setActiveChildId] = useState(null);
//   const [tierFilter, setTierFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [selectedMap, setSelectedMap] = useState({});

//   const [eventTypeId, setEventTypeId] = useState(fallbackPlanner.eventTypes?.[0]?.id || '');
//   const [guestInput, setGuestInput] = useState('150');
//   const [eventDate, setEventDate] = useState('');
//   const [eventLocation, setEventLocation] = useState('');
//   const [notes, setNotes] = useState('');

//     const [submitting, setSubmitting] = useState(false);
//   const [submitFeedback, setSubmitFeedback] = useState(null);

//   useEffect(() => {
//     let active = true;
//     (async () => {
//       try {
//         setLoadingPlanner(true);
//         setPlannerMessage('');
//         const response = await fetch('/api/planner', { cache: 'no-store' });
//         if (!response.ok) {
//           throw new Error('Planner fetch failed');
//         }
//         const payload = await response.json();
//         if (!active) return;
//         const normalised = normalisePlannerConfig(payload?.config || payload);
//         const enabled =
//           typeof payload?.enabled === 'boolean'
//             ? payload.enabled
//             : typeof normalised.plannerEnabled === 'boolean'
//             ? normalised.plannerEnabled
//             : fallbackEnabled;
//         setPlanner(normalised);
//         setPlannerEnabled(enabled);
//         setEventTypeId(current =>
//           normalised.eventTypes?.some(option => option.id === current)
//             ? current
//             : normalised.eventTypes?.[0]?.id || '',
//         );
//         if (!enabled) {
//           setPlannerMessage('Planner enquiries are currently offline. You can still build a menu.');
//         }
//       } catch (error) {
//         if (!active) return;
//         console.error('planner config load failed', error);
//         setPlanner(fallbackPlanner);
//         setPlannerEnabled(fallbackEnabled);
//         setPlannerMessage('Showing default planner options.');
//       } finally {
//         if (active) {
//           setLoadingPlanner(false);
//         }
//       }
//     })();
//     return () => {
//       active = false;
//     };
//   }, []);

//   useEffect(() => {
//     let active = true;
//     (async () => {
//       try {
//         setLoadingCatalogue(true);
//         setCatalogueMessage('');
//         const response = await fetch('/api/catalogue', { cache: 'no-store' });
//         if (!response.ok) {
//           throw new Error('Catalogue fetch failed');
//         }
//         const payload = await response.json();
//         if (!active) return;
//         const incomingCategories = ensureArray(payload?.categories);
//         const incomingItems = ensureArray(payload?.items);
//         setCategories(incomingCategories.length ? incomingCategories : defaultCatalogue.categories);
//         setItems(incomingItems.length ? incomingItems : defaultCatalogue.items);
//       } catch (error) {
//         if (!active) return;
//         console.error('catalogue load failed', error);
//         setCategories(defaultCatalogue.categories);
//         setItems(defaultCatalogue.items);
//         setCatalogueMessage('Showing default dishes while we fetch the live catalogue.');
//       } finally {
//         if (active) {
//           setLoadingCatalogue(false);
//         }
//       }
//     })();
//     return () => {
//       active = false;
//     };
//   }, []);

//   const categoryMap = useMemo(() => {
//     const map = new Map();
//     categories.forEach(category => {
//       if (category && category._id) {
//         map.set(category._id, category);
//       }
//     });
//     return map;
//   }, [categories]);

//   const topCategories = useMemo(() => {
//     const top = categories.filter(category => !category.parentId);
//     return [...top].sort((a, b) => {
//       const emphasisedDiff = getEmphasisedIndex(a?.name) - getEmphasisedIndex(b?.name);
//       if (emphasisedDiff !== 0) return emphasisedDiff;
//       return sortCategories(a, b);
//     });
//   }, [categories]);

//   useEffect(() => {
//     if (!categories.length) return;
//     setActiveCategoryId(current => {
//       if (current && categories.some(category => category._id === current)) {
//         return current;
//       }
//       const first = categories.find(category => !category.parentId);
//       return first?._id || null;
//     });
//   }, [categories]);

//   const childCategories = useMemo(() => {
//     if (!activeCategoryId) return [];
//     const list = categories.filter(category => category.parentId === activeCategoryId);
//     return list.sort(sortCategories);
//   }, [categories, activeCategoryId]);

//   useEffect(() => {
//     if (!childCategories.length) {
//       setActiveChildId(null);
//       return;
//     }
//     setActiveChildId(current => {
//       if (current && childCategories.some(category => category._id === current)) {
//         return current;
//       }
//       return childCategories[0]._id;
//     });
//   }, [childCategories]);

//   const restrictByCategory = search.trim().length === 0;
//   const searchTerm = search.trim().toLowerCase();

//   const relevantCategoryIds = useMemo(() => {
//     if (!restrictByCategory) return [];
//     if (childCategories.length > 0) {
//       if (activeChildId) {
//         return [activeChildId];
//       }
//       return childCategories.map(category => category._id);
//     }
//     return activeCategoryId ? [activeCategoryId] : [];
//   }, [restrictByCategory, childCategories, activeChildId, activeCategoryId]);

//   const filteredItems = useMemo(() => {
//     let result = items;
//     if (restrictByCategory && relevantCategoryIds.length) {
//       result = result.filter(item => relevantCategoryIds.includes(item.categoryId));
//     }
//     if (searchTerm) {
//       result = result.filter(item => matchesSearch(item, searchTerm, categoryMap));
//     }
//     if (tierFilter !== 'all') {
//       result = result.filter(item => normaliseTier(item.tier) === tierFilter);
//     }
//     return [...result].sort(sortItems);
//   }, [items, restrictByCategory, relevantCategoryIds, searchTerm, categoryMap, tierFilter]);

//   const itemMap = useMemo(() => {
//     const map = new Map();
//     items.forEach(item => {
//       if (item && item._id) {
//         map.set(item._id, item);
//       }
//     });
//     return map;
//   }, [items]);

//   const selectionList = useMemo(() => {
//     return Object.entries(selectedMap)
//       .map(([itemId, quantity]) => {
//         const item = itemMap.get(itemId);
//         if (!item || quantity <= 0) return null;
//         return {
//           item,
//           quantity,
//           price: resolveItemPrice(item),
//           tier: normaliseTier(item.tier),
//         };
//       })
//       .filter(Boolean);
//   }, [selectedMap, itemMap]);

//   const payloadSelections = useMemo(() => {
//     const groups = new Map();
//     selectionList.forEach(entry => {
//       const categoryId = entry.item.categoryId || 'uncategorised';
//       if (!groups.has(categoryId)) {
//         groups.set(categoryId, {
//           categoryId,
//           categoryLabel: categoryMap.get(categoryId)?.name || 'Menu',
//           dishes: [],
//         });
//       }
//       groups.get(categoryId).dishes.push({
//         id: entry.item._id,
//         name: entry.item.name,
//         tier: entry.tier,
//         price: entry.price,
//         quantity: entry.quantity,
//       });
//     });
//     return Array.from(groups.values());
//   }, [selectionList, categoryMap]);

//   const guestCount = Math.max(parseInt(guestInput, 10) || 0, 0);
//   const eventType = useMemo(
//     () => planner.eventTypes?.find(option => option.id === eventTypeId) || null,
//     [planner.eventTypes, eventTypeId],
//   );

//   const perGuestBase = eventType?.pricePerGuest || 0;
//   const baseTotal = perGuestBase * guestCount;
//   const dishesTotal = selectionList.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);
//   const estimatedTotal = baseTotal + dishesTotal;
//   const perGuestEstimate = guestCount > 0 ? estimatedTotal / guestCount : perGuestBase;
//   const totalSelected = selectionList.reduce((sum, entry) => sum + entry.quantity, 0);

//   const updateSelection = useCallback((itemId, delta) => {
//     if (!delta) return;
//   const addItem = useCallback(itemId => {
//     setSelectedMap(previous => {
//       if (previous[itemId]) {
//         return previous;
//       }
//       return { ...previous, [itemId]: true };
//     });
//   }, []);

//   const removeItem = useCallback(itemId => {
//     setSelectedMap(previous => {
//       if (!previous[itemId]) {
//         return previous;
//       }
//       const { [itemId]: _removed, ...rest } = previous;
//       return rest;
//     });
//   }, []);

//   const clearSelection = useCallback(() => {
//     setSelectedMap({});
//   }, []);

//   const buildWhatsappMessage = useCallback(() => {
//     const lines = [
//       'Hello Atmiya Caterers,',
//       '',
//       `Event: ${eventType?.name || 'Custom event'}`,
//       `Event type id: ${eventType?.id || eventTypeId || 'custom'}`,
//       `Guests: ${guestCount || 'Not provided'}`,
//       `Preferred date: ${eventDate || 'Not provided'}`,
//       `Location: ${eventLocation || 'Not provided'}`,
//       '',
//       selectionList.length ? 'Selected dishes:' : 'No dishes selected yet.',
//     ];

//     selectionList.forEach((entry, index) => {
//       const categoryName = categoryMap.get(entry.item.categoryId)?.name || 'Menu';
//       const tierLabel = tierMeta[entry.tier]?.label || 'Standard';
//       lines.push(`${index + 1}. ${entry.item.name} · ${tierLabel} · ${categoryName}`);
//     });

//     if (notes) {
//       lines.push('', `Notes: ${notes}`);
//     }

//     lines.push('', `Per guest estimate: ${formatCurrency(perGuestEstimate)}`);
//     lines.push(`Total estimate: ${formatCurrency(estimatedTotal)}`);
//     lines.push('', 'Sent via the Atmiya Caterers menu planner.');

//     return lines.join('\n');
//   }, [
//     categoryMap,
//     eventDate,
//     eventLocation,
//     eventType?.id,
//     eventType?.name,
//     eventTypeId,
//     estimatedTotal,
//     guestCount,
//     notes,
//     perGuestEstimate,
//     selectionList,
//   ]);

//   const handleSubmit = useCallback(async () => {
//     setSubmitFeedback(null);
//     setSubmitting(true);
//     try {
//         const payload = {
//           event: {
//             id: eventType?.id || eventTypeId || 'custom',
//             name: eventType?.name || 'Custom event',
//           },
//           guestCount,
//           eventDate,
//           eventLocation,
//           notes,
//           tierFilter,
//           perGuestEstimate,
//           estimatedTotal,
//           menuSelections: payloadSelections,
//         };
//         const response = await fetch('/api/planner/submit', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });
//         if (!response.ok) {
//           throw new Error('Unable to submit planner enquiry right now.');
//         }
//         const result = await response.json();
//         if (!result?.success) {
//           throw new Error(result?.error || 'Unable to submit planner enquiry right now.');
//         }
//         const message = buildWhatsappMessage();
//         const phone = WHATSAPP_NUMBER;
//         if (phone && typeof window !== 'undefined') {
//           const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
//           window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
//         }
//         setSubmitFeedback({ tone: 'success', message: 'Thanks! Opening WhatsApp with your planner summary.' });
//       } catch (error) {
//         console.error('planner submit failed', error);
//         setSubmitFeedback({
//           tone: 'error',
//           message: error?.message || 'Unable to submit planner enquiry right now.',
//         });
//       } finally {
//         setSubmitting(false);
//       }
//   }, [
//     eventType,
//     eventTypeId,
//     guestCount,
//     eventDate,
//     eventLocation,
//     notes,
//     tierFilter,
//     perGuestEstimate,
//     estimatedTotal,
//     payloadSelections,
//     buildWhatsappMessage,
//   ]);

//   const plannerDisabled = !plannerEnabled;

//   const sortedSelection = useMemo(() => {
//     return [...selectionList].sort((a, b) => {
//       const nameA = categoryMap.get(a.item.categoryId)?.name || '';
//       const nameB = categoryMap.get(b.item.categoryId)?.name || '';
//       if (nameA !== nameB) return nameA.localeCompare(nameB);
//       return (a.item.name || '').localeCompare(b.item.name || '');
//     });
//   }, [selectionList, categoryMap]);

//   return (
//     <div className="bg-gradient-to-br from-white via-orange-50 to-white py-16">
//       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
//         <section className="rounded-3xl border border-orange-200/60 bg-white/80 p-8 shadow-sm backdrop-blur">
//           <p className="text-xs uppercase tracking-[0.3em] text-orange-500">Menu planner</p>
//           <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">Plan your menu with the Atmiya catalogue</h1>
//           <p className="mt-4 max-w-3xl text-base text-gray-600">
//             Pick an event style, share guest details, search the full catalogue of dishes, and build a cart that suits your celebration. Prices are indicative in Canadian dollars.
//           </p>
//           <div className="mt-6 flex flex-wrap gap-3">
//             <Link
//               href={CATALOGUE_DOWNLOAD_PATH}
//               prefetch={false}
//               className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-400 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
//             >
//               Download PDF catalogue
//             </Link>
//             <Link
//               href="/contact"
//               className="inline-flex items-center gap-2 rounded-full border border-transparent bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//             >
//               Talk to our team
//             </Link>
//           </div>
//           {plannerMessage && <p className="mt-4 text-sm text-orange-600">{plannerMessage}</p>}
//           {catalogueMessage && <p className="mt-2 text-sm text-orange-600">{catalogueMessage}</p>}
//         </section>
//         <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
//           <div className="space-y-8">
//             <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm">
//               <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Event overview</h2>
//                   <p className="text-sm text-gray-500">Select the occasion and share headline details for pricing context.</p>
//                 </div>
//                 <span className="text-xs font-semibold text-gray-500">
//                   {loadingPlanner ? 'Loading planner...' : `${planner.eventTypes?.length || 0} experiences`}
//                 </span>
//               </div>

//               <div className="mt-4 grid gap-3 sm:grid-cols-2">
//                 {ensureArray(planner.eventTypes).map(option => {
//                   const active = option.id === eventTypeId;
//                   return (
//                     <button
//                       key={option.id}
//                       type="button"
//                       onClick={() => setEventTypeId(option.id)}
//                       className={`rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 ${
//                         active ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-400'
//                       }`}
//                     >
//                       <div className="flex items-center justify-between gap-2">
//                         <span className="font-semibold text-gray-900">{option.name}</span>
//                         <span className="text-xs font-semibold text-orange-600">
//                           {formatCurrency(option.pricePerGuest)}/guest
//                         </span>
//                       </div>
//                       {option.description && <p className="mt-2 text-xs text-gray-600">{option.description}</p>}
//                     </button>
//                   );
//                 })}
//               </div>

//               <div className="mt-4 grid gap-4 sm:grid-cols-2">
//                 <label className="flex flex-col gap-1 text-sm">
//                   <span className="font-semibold text-gray-700">Guests</span>
//                   <input
//                     type="number"
//                     min={0}
//                     inputMode="numeric"
//                     value={guestInput}
//                     onChange={event => setGuestInput(event.target.value)}
//                     placeholder="Number of people"
//                     className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
//                   />
//                 </label>
//                 <label className="flex flex-col gap-1 text-sm">
//                   <span className="font-semibold text-gray-700">Preferred date</span>
//                   <input
//                     type="date"
//                     value={eventDate}
//                     onChange={event => setEventDate(event.target.value)}
//                     className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
//                   />
//                 </label>
//               </div>

//               <label className="mt-4 flex flex-col gap-1 text-sm">
//                 <span className="font-semibold text-gray-700">Venue or address</span>
//                 <input
//                   type="text"
//                   value={eventLocation}
//                   onChange={event => setEventLocation(event.target.value)}
//                   placeholder="Venue name, city, or address"
//                   className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
//                 />
//               </label>

//               <label className="mt-4 flex flex-col gap-1 text-sm">
//                 <span className="font-semibold text-gray-700">Notes</span>
//                 <textarea
//                   rows={3}
//                   value={notes}
//                   onChange={event => setNotes(event.target.value)}
//                   placeholder="Allergies, cuisine focus, live counters, service style..."
//                   className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
//                 />
//               </label>
//             </section>
//             <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm">
//               <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Browse dishes</h2>
//                   <p className="text-sm text-gray-500">Use categories, tiers, and search to add dishes to your plan.</p>
//                 </div>
//                 <span className="text-xs font-semibold text-gray-500">
//                   {loadingCatalogue ? 'Loading dishes...' : `${filteredItems.length} dishes`}
//                 </span>
//               </div>

//               <div className="mt-4 flex flex-wrap gap-2">
//                 {[
//                   { _id: null, name: 'All dishes' },
//                   ...topCategories,
//                 ].map(category => {
//                   const id = category?._id ?? null;
//                   const active = id === activeCategoryId;
//                   return (
//                     <button
//                       key={id || 'all'}
//                       type="button"
//                       onClick={() => {
//                         setActiveCategoryId(id);
//                         setActiveChildId(null);
//                         setTierFilter('all');
//                       }}
//                       className={`rounded-full px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 ${
//                         active
//                           ? 'border border-orange-500 bg-orange-500 text-white'
//                           : 'border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500'
//                       }`}
//                     >
//                       {category.name}
//                     </button>
//                   );
//                 })}
//               </div>

//               <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="relative w-full sm:max-w-sm">
//                   <input
//                     type="search"
//                     value={search}
//                     onChange={event => setSearch(event.target.value)}
//                     placeholder="Search dishes or dietary tags..."
//                     className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
//                   />
//                   {search && (
//                     <button
//                       type="button"
//                       onClick={() => setSearch('')}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-200"
//                     >
//                       Clear
//                     </button>
//                   )}
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {tierFilters.map(filter => {
//                     const active = filter.key === tierFilter;
//                     return (
//                       <button
//                         key={filter.key}
//                         type="button"
//                         onClick={() => setTierFilter(filter.key)}
//                         className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 ${
//                           active
//                             ? 'border border-orange-500 bg-orange-500 text-white'
//                             : 'border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500'
//                         }`}
//                       >
//                         {filter.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {childCategories.length > 0 && (
//                 <div className="mt-3 flex flex-wrap gap-2">
//                   {childCategories.map(subCategory => {
//                     const active = subCategory._id === activeChildId;
//                     return (
//                       <button
//                         key={subCategory._id}
//                         type="button"
//                         onClick={() => {
//                           setActiveChildId(subCategory._id);
//                           setTierFilter('all');
//                         }}
//                         className={`rounded-full px-3 py-1 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 ${
//                           active
//                             ? 'border border-orange-500 bg-orange-500 text-white'
//                             : 'border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500'
//                         }`}
//                       >
//                         {subCategory.name}
//                       </button>
//                     );
//                   })}
//                 </div>
//               )}

//               <div className="mt-4 space-y-3">
//                 {filteredItems.length === 0 ? (
//                   <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-center text-sm text-gray-500">
//                     {loadingCatalogue
//                       ? 'Fetching dishes from the catalogue...'
//                       : 'No dishes match your filters yet. Try clearing the search or switching tiers.'}
//                   </p>
//                 ) : (
//                   filteredItems.map(item => {
//                     const quantity = selectedMap[item._id] || 0;
//                     const tierKey = normaliseTier(item.tier);
//                     const price = resolveItemPrice(item);
//                     return (
//                       <div
//                         key={item._id}
//                         className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-start sm:justify-between"
//                       >
//                         <div>
//                           <div className="flex items-center gap-2">
//                             <span className="font-semibold text-gray-900">{item.name}</span>
//                             <span className={`text-xs font-semibold ${tierMeta[tierKey]?.badge || 'bg-gray-100 text-gray-600'}`}>
//                               {tierMeta[tierKey]?.label || 'Standard'}
//                             </span>
//                           </div>
//                           {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
//                           <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
//                             <span>{categoryMap.get(item.categoryId)?.name || 'Menu'}</span>
//                             {price > 0 && <span>{formatCurrency(price)}</span>}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           {selectedMap[item._id] ? (
//                             <button
//                               type="button"
//                               onClick={() => removeItem(item._id)}
//                               className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
//                             >
//                               Remove
//                             </button>
//                           ) : (
//                             <button
//                               type="button"
//                               onClick={() => addItem(item._id)}
//                               className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
//                             >
//                               Add to planner
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </section>
//           </div>
//           <aside className="space-y-6">
//             <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
//                 <span className="text-xs font-semibold text-gray-500">{totalSelected} dishes</span>
//               </div>

//               <dl className="mt-4 space-y-2 text-sm text-gray-600">
//                 <div className="flex items-center justify-between">
//                   <dt>Event</dt>
//                   <dd className="font-semibold text-gray-900">{eventType?.name || 'Custom event'}</dd>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <dt>Guests</dt>
//                   <dd className="font-semibold text-gray-900">{guestCount || 'Not set'}</dd>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <dt>Per guest estimate</dt>
//                   <dd className="font-semibold text-gray-900">{formatCurrency(perGuestEstimate)}</dd>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <dt>Base package</dt>
//                   <dd className="font-semibold text-gray-900">{formatCurrency(baseTotal)}</dd>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <dt>Selected dishes</dt>
//                   <dd className="font-semibold text-gray-900">{formatCurrency(dishesTotal)}</dd>
//                 </div>
//                 <div className="flex items-center justify-between text-base font-semibold text-gray-900">
//                   <dt>Total estimate</dt>
//                   <dd>{formatCurrency(estimatedTotal)}</dd>
//                 </div>
//               </dl>

//               {sortedSelection.length > 0 ? (
//                 <ul className="mt-4 space-y-3">
//                   {sortedSelection.map(entry => (
//                     <li
//                       key={entry.item._id}
//                       className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm text-gray-600"
//                     >
//                       <div>
//                         <p className="font-semibold text-gray-900">{entry.item.name}</p>
//                         <p className="text-xs text-gray-500">
//                           {categoryMap.get(entry.item.categoryId)?.name || 'Menu'} · {tierMeta[entry.tier]?.label || 'Standard'}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {entry.price > 0 && (
//                           <span className="text-sm font-semibold text-gray-900">
//                             {formatCurrency(entry.price * guestCount)}
//                           </span>
//                         )}
//                         <button
//                           type="button"
//                           onClick={() => removeItem(entry.item._id)}
//                           className="text-xs font-semibold text-red-500 hover:text-red-600"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="mt-4 rounded-xl border border-dashed border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
//                   Add dishes from the catalogue to build your plan.
//                 </p>
//               )}

//               {sortedSelection.length > 0 && (
//                 <button
//                   type="button"
//                   onClick={clearSelection}
//                   className="mt-4 w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-red-300 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2"
//                 >
//                   Clear all dishes
//                 </button>
//               )}

//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={submitting || plannerDisabled}
//                 className="mt-4 flex w-full items-center justify-center rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
//               >
//                 {submitting ? 'Submitting...' : 'Submit planner enquiry'}
//               </button>
//               <p className="mt-2 text-xs text-gray-500">
//                 We will review your selections and reach out with a customised proposal. You can also share this summary with us over WhatsApp or email.
//               </p>
//               {submitFeedback && (
//                 <p
//                   className={`mt-2 text-sm ${
//                     submitFeedback.tone === 'success' ? 'text-green-600' : 'text-red-600'
//                   }`}
//                 >
//                   {submitFeedback.message}
//                 </p>
//               )}
//             </section>

//             <section className="rounded-3xl border border-dashed border-gray-200 bg-white/60 p-6 text-sm text-gray-600">
//               <h3 className="text-base font-semibold text-gray-900">Planning tips</h3>
//               <ul className="mt-3 space-y-2 list-disc pl-5">
//                 <li>Filter by tier to craft premium or luxury-only courses.</li>
//                 <li>Use search for dietary keywords such as Jain, vegan, or spicy.</li>
//                 <li>Increase quantities on crowd favourites inside the summary.</li>
//                 <li>Share this planner snapshot with our consultants for quick pricing.</li>
//               </ul>
//             </section>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// }

// drag and DROp

// 'use client';

// import { useState, useEffect, useCallback, useMemo } from 'react';

// // Helper functions
// const ensureArray = (value) => {
//   if (!value) return [];
//   return Array.isArray(value) ? value : [value];
// };

// const normalisePlannerConfig = (config) => {
//   return config || {};
// };

// const buildDefaultCatalogueSnapshot = () => {
//   return {
//     categories: [],
//     items: [],
//   };
// };

// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0,
//   }).format(amount || 0);
// };

// const defaultPlannerConfig = {};
// const fallbackPlanner = normalisePlannerConfig(defaultPlannerConfig);
// const fallbackEnabled = fallbackPlanner.plannerEnabled ?? true;
// const defaultCatalogue = buildDefaultCatalogueSnapshot();

// const emphasisedOrder = ['soups', 'appetizers', 'chat corner', 'breakfast', 'main course', 'sweets', 'indian bread', 'rice'];

// const getEmphasisedIndex = name => {
//   if (!name) return Number.MAX_SAFE_INTEGER;
//   const lower = name.toLowerCase();
//   const index = emphasisedOrder.findIndex(term => lower.includes(term));
//   return index === -1 ? Number.MAX_SAFE_INTEGER : index;
// };

// const tierMeta = {
//   standard: { label: 'Standard', badge: 'bg-gray-100 text-gray-700' },
//   premium: { label: 'Premium', badge: 'bg-blue-100 text-blue-700' },
//   luxury: { label: 'Luxury', badge: 'bg-amber-100 text-amber-700' },
// };

// const tierFilters = [
//   { key: 'all', label: 'All tiers' },
//   { key: 'standard', label: 'Standard' },
//   { key: 'premium', label: 'Premium' },
//   { key: 'luxury', label: 'Luxury' },
// ];

// const resolveItemPrice = item => {
//   const candidates = [
//     item?.pricing?.luxury,
//     item?.pricing?.premium,
//     item?.pricing?.standard,
//     item?.price,
//   ];
//   for (const val of candidates) {
//     const num = parseFloat(val);
//     if (!isNaN(num) && num > 0) return num;
//   }
//   return 0;
// };

// const matchesSearch = (item, term, categoryMap) => {
//   if (!term) return true;
//   const lower = term.toLowerCase();
//   const fields = [
//     item?.name,
//     item?.description,
//     ...(ensureArray(item?.tags)),
//     ...(ensureArray(item?.dietary)),
//     categoryMap.get(item?.categoryId)?.name,
//   ];
//   return fields.some(field => field && field.toString().toLowerCase().includes(lower));
// };

// const sanitiseNumber = value => (value || '').toString().replace(/[^0-9]/g, '');
// const CATALOGUE_DOWNLOAD_PATH = '/food-catalogue.pdf';
// const WHATSAPP_NUMBER = sanitiseNumber(process.env.NEXT_PUBLIC_CATERER_WHATSAPP);

// // Local storage keys
// const STORAGE_KEYS = {
//   FAVORITES: 'atmiya_favorites',
//   LAST_ORDER: 'atmiya_last_order',
//   ORDER_HISTORY: 'atmiya_order_history',
// };

// export default function PlannerPage() {
//   const [planner, setPlanner] = useState(fallbackPlanner);
//   const [catalogue, setCatalogue] = useState(defaultCatalogue);
//   const [catalogueMessage, setCatalogueMessage] = useState('');
//   const [loadingCatalogue, setLoadingCatalogue] = useState(true);
//   const [activeCategoryId, setActiveCategoryId] = useState(null);
//   const [activeChildId, setActiveChildId] = useState(null);
//   const [tierFilter, setTierFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [selectedMap, setSelectedMap] = useState({});
//   const [selectedOrder, setSelectedOrder] = useState([]);
//   const [eventTypeId, setEventTypeId] = useState('');
//   const [guestInput, setGuestInput] = useState('150');
//   const [eventDate, setEventDate] = useState('');
//   const [eventLocation, setEventLocation] = useState('');
//   const [notes, setNotes] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [submitFeedback, setSubmitFeedback] = useState(null);
  
//   // Interactive features state
//   const [favorites, setFavorites] = useState([]);
//   const [showFavorites, setShowFavorites] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   const [draggedItem, setDraggedItem] = useState(null);
//   const [orderHistory, setOrderHistory] = useState([]);
//   const [showOrderHistory, setShowOrderHistory] = useState(false);

//   // Load favorites and order history from localStorage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
//         if (savedFavorites) {
//           setFavorites(JSON.parse(savedFavorites));
//         }
//         const savedHistory = localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY);
//         if (savedHistory) {
//           setOrderHistory(JSON.parse(savedHistory));
//         }
//       } catch (error) {
//         console.error('Failed to load saved data:', error);
//       }
//     }
//   }, []);

//   // Save favorites to localStorage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
//       } catch (error) {
//         console.error('Failed to save favorites:', error);
//       }
//     }
//   }, [favorites]);

//   // Initialize history with current state
//   useEffect(() => {
//     if (history.length === 0) {
//       setHistory([{ selectedMap, selectedOrder }]);
//       setHistoryIndex(0);
//     }
//   }, []);

//   useEffect(() => {
//     const loadConfig = async () => {
//       try {
//         const response = await fetch('/api/planner/config');
//         if (!response.ok) throw new Error('Failed to fetch planner config');
//         const data = await response.json();
//         if (data?.planner) {
//           const normalized = normalisePlannerConfig(data.planner);
//           setPlanner(normalized);
//           if (!eventTypeId && normalized.eventTypes?.[0]?.id) {
//             setEventTypeId(normalized.eventTypes[0].id);
//           }
//         }
//       } catch (error) {
//         console.error('Failed to load planner config:', error);
//       }
//     };
//     loadConfig();
//   }, []);

//   useEffect(() => {
//     const loadCatalogue = async () => {
//       setLoadingCatalogue(true);
//       setCatalogueMessage('');
//       try {
//         const response = await fetch('/api/catalogue/snapshot');
//         if (!response.ok) throw new Error('Failed to fetch catalogue');
//         const data = await response.json();
//         if (data?.catalogue) {
//           setCatalogue(data.catalogue);
//         }
//       } catch (error) {
//         console.error('Failed to load catalogue:', error);
//         setCatalogueMessage('Unable to load menu. Please refresh the page.');
//       } finally {
//         setLoadingCatalogue(false);
//       }
//     };
//     loadCatalogue();
//   }, []);

//   // ====== COMPUTED VALUES FIRST ======
//   const plannerEnabled = planner?.plannerEnabled ?? fallbackEnabled;
//   const eventType = useMemo(() => 
//     planner?.eventTypes?.find(et => et.id === eventTypeId), 
//     [planner, eventTypeId]
//   );
//   const guestCount = parseInt(guestInput) || 0;

//   // Build category map
//   const categoryMap = useMemo(() => {
//     const map = new Map();
//     (catalogue?.categories || []).forEach(cat => map.set(cat._id, cat));
//     return map;
//   }, [catalogue]);

//   // Get top-level categories
//   const topCategories = useMemo(() => {
//     return (catalogue?.categories || [])
//       .filter(cat => !cat.parentId)
//       .sort((a, b) => {
//         const indexA = getEmphasisedIndex(a.name);
//         const indexB = getEmphasisedIndex(b.name);
//         if (indexA !== indexB) return indexA - indexB;
//         return (a.name || '').localeCompare(b.name || '');
//       });
//   }, [catalogue]);

//   // Get child categories
//   const childCategories = useMemo(() => {
//     if (!activeCategoryId) return [];
//     return (catalogue?.categories || [])
//       .filter(cat => cat.parentId === activeCategoryId)
//       .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
//   }, [catalogue, activeCategoryId]);

//   // Filter items
//   const filteredItems = useMemo(() => {
//     let items = catalogue?.items || [];

//     if (activeCategoryId) {
//       if (activeChildId) {
//         items = items.filter(item => item.categoryId === activeChildId);
//       } else {
//         const categoryIds = [activeCategoryId, ...childCategories.map(c => c._id)];
//         items = items.filter(item => categoryIds.includes(item.categoryId));
//       }
//     }

//     if (tierFilter !== 'all') {
//       items = items.filter(item => {
//         const pricing = item?.pricing;
//         if (tierFilter === 'standard') return pricing?.standard > 0;
//         if (tierFilter === 'premium') return pricing?.premium > 0;
//         if (tierFilter === 'luxury') return pricing?.luxury > 0;
//         return true;
//       });
//     }

//     items = items.filter(item => matchesSearch(item, search, categoryMap));
//     return items;
//   }, [catalogue, activeCategoryId, activeChildId, childCategories, tierFilter, search, categoryMap]);

//   // Build sorted selection
//   const sortedSelection = useMemo(() => {
//     return selectedOrder
//       .map(itemId => {
//         const item = catalogue.items.find(i => i._id === itemId);
//         if (!item) return null;
//         const tier = tierFilter !== 'all' ? tierFilter : 'standard';
//         const price = resolveItemPrice(item);
//         return { item, tier, price };
//       })
//       .filter(Boolean);
//   }, [selectedOrder, catalogue, tierFilter]);

//   // Build selection list
//   const selectionList = useMemo(() => {
//     return sortedSelection.map(entry => ({
//       ...entry,
//       quantity: 1,
//     }));
//   }, [sortedSelection]);

//   // Calculate estimates
//   const perGuestEstimate = useMemo(() => {
//     return sortedSelection.reduce((sum, entry) => sum + (entry.price || 0), 0);
//   }, [sortedSelection]);

//   const estimatedTotal = useMemo(() => {
//     return perGuestEstimate * guestCount;
//   }, [perGuestEstimate, guestCount]);

//   // Build payload selections
//   const payloadSelections = useMemo(() => {
//     return sortedSelection.map(entry => ({
//       itemId: entry.item._id,
//       itemName: entry.item.name,
//       tier: entry.tier,
//       price: entry.price,
//       quantity: 1,
//     }));
//   }, [sortedSelection]);

//   const totalSelected = sortedSelection.length;
//   const canUndo = historyIndex > 0;
//   const canRedo = historyIndex < history.length - 1;
//   const plannerDisabled = !plannerEnabled;

//   // ====== CALLBACKS AFTER COMPUTED VALUES ======
//   const saveToHistory = useCallback((newSelectedMap, newSelectedOrder) => {
//     setHistory(prev => {
//       const newHistory = prev.slice(0, historyIndex + 1);
//       newHistory.push({ selectedMap: newSelectedMap, selectedOrder: newSelectedOrder });
//       if (newHistory.length > 50) newHistory.shift();
//       return newHistory;
//     });
//     setHistoryIndex(prev => Math.min(prev + 1, 49));
//   }, [historyIndex]);

//   const addItem = useCallback(itemId => {
//     const newMap = { ...selectedMap, [itemId]: true };
//     const newOrder = [...selectedOrder, itemId];
//     setSelectedMap(newMap);
//     setSelectedOrder(newOrder);
//     saveToHistory(newMap, newOrder);
//   }, [selectedMap, selectedOrder, saveToHistory]);

//   const removeItem = useCallback(itemId => {
//     const { [itemId]: _removed, ...rest } = selectedMap;
//     const newOrder = selectedOrder.filter(id => id !== itemId);
//     setSelectedMap(rest);
//     setSelectedOrder(newOrder);
//     saveToHistory(rest, newOrder);
//   }, [selectedMap, selectedOrder, saveToHistory]);

//   const clearSelection = useCallback(() => {
//     const newMap = {};
//     const newOrder = [];
//     setSelectedMap(newMap);
//     setSelectedOrder(newOrder);
//     saveToHistory(newMap, newOrder);
//   }, [saveToHistory]);

//   const undo = useCallback(() => {
//     if (historyIndex > 0) {
//       const prevState = history[historyIndex - 1];
//       setSelectedMap(prevState.selectedMap);
//       setSelectedOrder(prevState.selectedOrder);
//       setHistoryIndex(historyIndex - 1);
//     }
//   }, [history, historyIndex]);

//   const redo = useCallback(() => {
//     if (historyIndex < history.length - 1) {
//       const nextState = history[historyIndex + 1];
//       setSelectedMap(nextState.selectedMap);
//       setSelectedOrder(nextState.selectedOrder);
//       setHistoryIndex(historyIndex + 1);
//     }
//   }, [history, historyIndex]);

//   const toggleFavorite = useCallback((itemId) => {
//     setFavorites(prev => {
//       if (prev.includes(itemId)) {
//         return prev.filter(id => id !== itemId);
//       }
//       return [...prev, itemId];
//     });
//   }, []);

//   const isFavorite = useCallback((itemId) => {
//     return favorites.includes(itemId);
//   }, [favorites]);

//   const handleDragStart = useCallback((e, itemId, index) => {
//     setDraggedItem({ itemId, index });
//     e.dataTransfer.effectAllowed = 'move';
//   }, []);

//   const handleDragOver = useCallback((e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//   }, []);

//   const handleDrop = useCallback((e, targetIndex) => {
//     e.preventDefault();
//     if (!draggedItem) return;

//     const newOrder = [...selectedOrder];
//     const draggedId = newOrder[draggedItem.index];
//     newOrder.splice(draggedItem.index, 1);
//     newOrder.splice(targetIndex, 0, draggedId);
    
//     setSelectedOrder(newOrder);
//     saveToHistory(selectedMap, newOrder);
//     setDraggedItem(null);
//   }, [draggedItem, selectedOrder, selectedMap, saveToHistory]);

//   const saveCurrentOrder = useCallback(() => {
//     if (Object.keys(selectedMap).length === 0) return;

//     const orderData = {
//       id: Date.now(),
//       date: new Date().toISOString(),
//       eventType: eventType?.name || 'Custom event',
//       guestCount,
//       selectedMap,
//       selectedOrder,
//       estimatedTotal,
//     };

//     const newHistory = [orderData, ...orderHistory].slice(0, 10);
//     setOrderHistory(newHistory);
    
//     if (typeof window !== 'undefined') {
//       try {
//         localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(newHistory));
//         localStorage.setItem(STORAGE_KEYS.LAST_ORDER, JSON.stringify(orderData));
//       } catch (error) {
//         console.error('Failed to save order:', error);
//       }
//     }
//   }, [selectedMap, selectedOrder, eventType, guestCount, estimatedTotal, orderHistory]);

//   const duplicateOrder = useCallback((order) => {
//     setSelectedMap(order.selectedMap);
//     setSelectedOrder(order.selectedOrder);
//     saveToHistory(order.selectedMap, order.selectedOrder);
//     setShowOrderHistory(false);
//   }, [saveToHistory]);

//   const buildWhatsappMessage = useCallback(() => {
//     const lines = [
//       'Hello Atmiya Caterers,',
//       '',
//       `Event: ${eventType?.name || 'Custom event'}`,
//       `Event type id: ${eventType?.id || eventTypeId || 'custom'}`,
//       `Guests: ${guestCount || 'Not provided'}`,
//       `Preferred date: ${eventDate || 'Not provided'}`,
//       `Location: ${eventLocation || 'Not provided'}`,
//       '',
//       selectionList.length ? 'Selected dishes:' : 'No dishes selected yet.',
//     ];
//     selectionList.forEach((entry, index) => {
//       const categoryName = categoryMap.get(entry.item.categoryId)?.name || 'Menu';
//       const tierLabel = tierMeta[entry.tier]?.label || 'Standard';
//       lines.push(`${index + 1}. ${entry.item.name} · ${tierLabel} · ${categoryName}`);
//     });
//     if (notes) {
//       lines.push('', `Notes: ${notes}`);
//     }
//     lines.push('', `Per guest estimate: ${formatCurrency(perGuestEstimate)}`);
//     lines.push(`Total estimate: ${formatCurrency(estimatedTotal)}`);
//     lines.push('', 'Sent via the Atmiya Caterers menu planner.');
//     return lines.join('\n');
//   }, [categoryMap, eventDate, eventLocation, eventType, eventTypeId, estimatedTotal, guestCount, notes, perGuestEstimate, selectionList]);

//   const handleSubmit = useCallback(async () => {
//     setSubmitFeedback(null);
//     setSubmitting(true);
//     try {
//       const payload = {
//         event: {
//           id: eventType?.id || eventTypeId || 'custom',
//           name: eventType?.name || 'Custom event',
//         },
//         guestCount,
//         eventDate,
//         eventLocation,
//         notes,
//         tierFilter,
//         perGuestEstimate,
//         estimatedTotal,
//         menuSelections: payloadSelections,
//       };
//       const response = await fetch('/api/planner/submit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       if (!response.ok) {
//         throw new Error('Unable to submit planner enquiry right now.');
//       }
//       const result = await response.json();
//       if (!result?.success) {
//         throw new Error(result?.error || 'Unable to submit planner enquiry right now.');
//       }
      
//       saveCurrentOrder();
      
//       const message = buildWhatsappMessage();
//       const phone = WHATSAPP_NUMBER;
//       if (phone && typeof window !== 'undefined') {
//         const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
//         window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
//       }
      
//       setSubmitFeedback({ tone: 'success', message: 'Thanks! Opening WhatsApp with your planner summary.' });
//     } catch (error) {
//       console.error('planner submit failed', error);
//       setSubmitFeedback({
//         tone: 'error',
//         message: error?.message || 'Unable to submit planner enquiry right now.',
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   }, [eventType, eventTypeId, guestCount, eventDate, eventLocation, notes, tierFilter, perGuestEstimate, estimatedTotal, payloadSelections, buildWhatsappMessage, saveCurrentOrder]);

//   return (
//     <div className="bg-gradient-to-br from-white via-orange-50 to-white py-16">
//       <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
//         <section className="rounded-3xl border border-orange-200/60 bg-white/80 p-8 shadow-sm backdrop-blur">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-gray-900">Menu Planner</h1>
//             <p className="mt-2 text-gray-600">Plan your perfect event menu</p>
//           </div>

//           <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-orange-100 bg-orange-50/50 p-3">
//             <div className="flex flex-wrap items-center gap-2">
//               <button type="button" onClick={undo} disabled={!canUndo} className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
//                 </svg>
//                 Undo
//               </button>
//               <button type="button" onClick={redo} disabled={!canRedo} className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
//                 </svg>
//                 Redo
//               </button>
//               <button type="button" onClick={() => setShowFavorites(!showFavorites)} className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition ${showFavorites ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
//                 <svg className="h-4 w-4" fill={showFavorites ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//                 </svg>
//                 Favorites {favorites.length > 0 && `(${favorites.length})`}
//               </button>
//               <button type="button" onClick={() => setShowOrderHistory(!showOrderHistory)} className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
//                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 Order History {orderHistory.length > 0 && `(${orderHistory.length})`}
//               </button>
//             </div>
//             <span className="text-xs text-gray-600">💡 Drag & drop dishes to reorder in summary</span>
//           </div>

//           {showOrderHistory && orderHistory.length > 0 && (
//             <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
//               <h3 className="font-semibold text-gray-900 mb-3">Previous Orders</h3>
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {orderHistory.map(order => (
//                   <div key={order.id} className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 p-3">
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900">{order.eventType}</p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(order.date).toLocaleDateString()} · {Object.keys(order.selectedMap).length} dishes · {formatCurrency(order.estimatedTotal)}
//                       </p>
//                     </div>
//                     <button type="button" onClick={() => duplicateOrder(order)} className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-orange-600">
//                       Use this order
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="mt-8 grid gap-4 sm:grid-cols-2">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Event Type</label>
//               <select value={eventTypeId} onChange={(e) => setEventTypeId(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500">
//                 {(planner?.eventTypes || []).map(et => (
//                   <option key={et.id} value={et.id}>{et.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
//               <input type="text" value={guestInput} onChange={(e) => setGuestInput(e.target.value)} placeholder="150" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
//               <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Event Location</label>
//               <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Enter location" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500" />
//             </div>
//             <div className="sm:col-span-2">
//               <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
//               <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any special requirements?" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500" />
//             </div>
//           </div>

//           <div className="mt-8">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-gray-900">{showFavorites ? 'Your Favorites' : 'Browse dishes'}</h2>
//               <span className="text-sm text-gray-500">{showFavorites ? favorites.length : filteredItems.length} dishes</span>
//             </div>
//             <div className="mt-4 flex flex-wrap gap-2">
//               {!showFavorites && [{ _id: null, name: 'All dishes' }, ...topCategories].map(category => {
//                 const id = category?._id ?? null;
//                 const active = id === activeCategoryId;
//                 return (
//                   <button key={id || 'all'} type="button" onClick={() => { setActiveCategoryId(id); setActiveChildId(null); setTierFilter('all'); }} className={`rounded-full px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 ${active ? 'border border-orange-500 bg-orange-500 text-white' : 'border border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500'}`}>
//                     {category.name}
//                   </button>
//                 );
//               })}
//             </div>

//             <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {(showFavorites ? catalogue.items.filter(item => favorites.includes(item._id)) : filteredItems).map(item => {
//                 const price = resolveItemPrice(item);
//                 const isItemFavorite = isFavorite(item._id);
//                 return (
//                   <div key={item._id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm relative">
//                     <button type="button" onClick={() => toggleFavorite(item._id)} className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-100 transition" title={isItemFavorite ? "Remove from favorites" : "Add to favorites"}>
//                       <svg className={`h-5 w-5 ${isItemFavorite ? 'text-orange-500 fill-current' : 'text-gray-400'}`} fill={isItemFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//                       </svg>
//                     </button>
//                     <h3 className="font-semibold text-gray-900 pr-8">{item.name}</h3>
//                     <p className="mt-1 text-sm text-gray-600">{item.description}</p>
//                     <div className="mt-3 flex items-center justify-between">
//                       <div>{price > 0 && <span className="font-semibold text-gray-900">{formatCurrency(price)}</span>}</div>
//                       <div className="flex items-center gap-2">
//                         {selectedMap[item._id] ? (
//                           <button type="button" onClick={() => removeItem(item._id)} className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-2">
//                             Remove
//                           </button>
//                         ) : (
//                           <button type="button" onClick={() => addItem(item._id)} className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2">
//                             Add to planner
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         <section className="mt-6 rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
//             <div className="flex items-center gap-3">
//               <span className="text-xs font-semibold text-gray-500">{sortedSelection.length} dishes</span>
//               {sortedSelection.length > 0 && (
//                 <button type="button" onClick={clearSelection} className="text-xs font-semibold text-red-500 hover:text-red-600">Clear all</button>
//               )}
//             </div>
//           </div>
          
//           {sortedSelection.length > 0 && <p className="mt-2 text-xs text-gray-500">💡 Drag and drop to reorder dishes</p>}

//           <dl className="mt-4 space-y-2 text-sm text-gray-600">
//             <div className="flex justify-between">
//               <dt>Event:</dt>
//               <dd className="font-medium text-gray-900">{eventType?.name || 'Custom event'}</dd>
//             </div>
//             <div className="flex justify-between">
//               <dt>Guests:</dt>
//               <dd className="font-medium text-gray-900">{guestCount || 'Not set'}</dd>
//             </div>
//             {eventDate && (
//               <div className="flex justify-between">
//                 <dt>Date:</dt>
//                 <dd className="font-medium text-gray-900">{new Date(eventDate).toLocaleDateString()}</dd>
//               </div>
//             )}
//             {eventLocation && (
//               <div className="flex justify-between">
//                 <dt>Location:</dt>
//                 <dd className="font-medium text-gray-900">{eventLocation}</dd>
//               </div>
//             )}
//           </dl>
          
//           <ul className="mt-4 space-y-2">
//             {sortedSelection.map((entry, index) => (
//               <li key={entry.item._id} draggable onDragStart={(e) => handleDragStart(e, entry.item._id, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)} className="flex items-start justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 cursor-move hover:border-orange-200 hover:bg-orange-50/50 transition">
//                 <div className="flex items-start gap-2 flex-1">
//                   <svg className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
//                   </svg>
//                   <div>
//                     <p className="font-medium text-gray-900">{entry.item.name}</p>
//                     <p className="text-xs text-gray-500">{categoryMap.get(entry.item.categoryId)?.name || 'Menu'} · {tierMeta[entry.tier]?.label || 'Standard'}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {entry.price > 0 && <span className="text-sm font-semibold text-gray-900">{formatCurrency(entry.price * guestCount)}</span>}
//                   <button type="button" onClick={() => removeItem(entry.item._id)} className="text-xs font-semibold text-red-500 hover:text-red-600">Remove</button>
//                 </div>
//               </li>
//             ))}
//           </ul>

//           {sortedSelection.length > 0 && (
//             <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Per guest estimate:</span>
//                 <span className="font-semibold text-gray-900">{formatCurrency(perGuestEstimate)}</span>
//               </div>
//               <div className="flex justify-between text-lg">
//                 <span className="font-semibold text-gray-900">Total estimate:</span>
//                 <span className="font-bold text-orange-600">{formatCurrency(estimatedTotal)}</span>
//               </div>
//             </div>
//           )}

//           <button type="button" onClick={handleSubmit} disabled={submitting || plannerDisabled || sortedSelection.length === 0} className="mt-6 w-full rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
//             {submitting ? 'Submitting...' : 'Submit planner enquiry'}
//           </button>

//           {submitFeedback && (
//             <div className={`mt-4 rounded-lg p-3 text-sm ${submitFeedback.tone === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
//               {submitFeedback.message}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

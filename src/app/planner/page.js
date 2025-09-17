'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { defaultPlannerConfig, normalisePlannerConfig } from '@/data/plannerOptions'

const currency = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
})

const formatCurrency = value => currency.format(Math.max(0, Math.round(value || 0)))

const ensureArray = value => (Array.isArray(value) ? value : [])

const buildInitialSelections = categories => {
  const base = {}
  ensureArray(categories).forEach(category => {
    base[category.id] = []
  })
  return base
}

const clampSelections = (selections, categories) => {
  const next = {}
  ensureArray(categories).forEach(category => {
    const current = ensureArray(selections[category.id])
    const max = typeof category.maxSelections === 'number' && category.maxSelections > 0 ? category.maxSelections : undefined
    next[category.id] = max ? current.slice(0, max) : current
  })
  return next
}

const plannerSteps = [
  { id: 'step-experience', label: 'Experience design', description: 'Event style, service tier, upgrades' },
  { id: 'step-guests', label: 'Guest insights', description: 'Headcount and logistics' },
  { id: 'step-menu', label: 'Menu curation', description: 'Signature menus and dish selections' },
]
const defaultPlannerStepId = plannerSteps[0]?.id ?? 'step-experience'

export default function PlannerPage() {
  const [config, setConfig] = useState(defaultPlannerConfig)
  const [plannerEnabled, setPlannerEnabled] = useState(defaultPlannerConfig.plannerEnabled ?? true)
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [selectedEventType, setSelectedEventType] = useState(defaultPlannerConfig.eventTypes[0]?.id ?? '')
  const [selectedServiceLevel, setSelectedServiceLevel] = useState(defaultPlannerConfig.serviceLevels[1]?.id ?? defaultPlannerConfig.serviceLevels[0]?.id ?? '')
  const [selectedMenu, setSelectedMenu] = useState(defaultPlannerConfig.menuCollections[0]?.id ?? '')
  const [selectedAddons, setSelectedAddons] = useState([])
  const [guestCount, setGuestCount] = useState(150)
  const [eventDate, setEventDate] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [menuSelections, setMenuSelections] = useState(() => buildInitialSelections(defaultPlannerConfig.menuBuilderCategories))
  const sectionRefs = useRef({})
  const [activeStep, setActiveStep] = useState(defaultPlannerStepId)
  const [showMobileSummary, setShowMobileSummary] = useState(false)

  const scrollToSection = id => {
    const node = sectionRefs.current?.[id]
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const registerSectionRef = id => node => {
    if (!sectionRefs.current) {
      sectionRefs.current = {}
    }
    if (node) {
      sectionRefs.current[id] = node
    } else {
      delete sectionRefs.current[id]
    }
  }


  useEffect(() => {
    let isMounted = true

    const loadConfig = async () => {
      try {
        setLoadingConfig(true)
        setLoadError(null)
        const response = await fetch('/api/planner', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Failed to load planner settings')
        }
        const payload = await response.json()
        if (!isMounted) return
        const normalised = normalisePlannerConfig(payload?.config || payload?.plannerConfig || payload)
        setConfig(normalised)
        setPlannerEnabled(
          typeof payload?.enabled === 'boolean'
            ? payload.enabled
            : typeof payload?.plannerEnabled === 'boolean'
            ? payload.plannerEnabled
            : normalised.plannerEnabled ?? true
        )
        setMenuSelections(current => clampSelections(current, normalised.menuBuilderCategories))
      } catch (error) {
        if (!isMounted) return
        console.error('Failed to load planner config', error)
        setConfig(normalisePlannerConfig(defaultPlannerConfig))
        setPlannerEnabled(defaultPlannerConfig.plannerEnabled ?? true)
        setLoadError('We could not load the latest planner details. Showing default options.')
        setMenuSelections(buildInitialSelections(defaultPlannerConfig.menuBuilderCategories))
      } finally {
        if (isMounted) {
          setLoadingConfig(false)
        }
      }
    }

    loadConfig()

    return () => {
      isMounted = false
    }
  }, [])
  useEffect(() => {
    if (!plannerEnabled || loadingConfig) {
      setActiveStep(prev => (prev === defaultPlannerStepId ? prev : defaultPlannerStepId))
      return
    }
    if (typeof window === 'undefined') {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const next = visible[0]?.target?.getAttribute('data-step-id') || visible[0]?.target?.id
        if (next) {
          setActiveStep(prev => (prev === next ? prev : next))
        }
      },
      { threshold: 0.35, rootMargin: '-20% 0px -45% 0px' }
    )

    const nodes = plannerSteps
      .map(step => {
        const node = sectionRefs.current?.[step.id]
        if (node) {
          node.setAttribute('data-step-id', step.id)
          observer.observe(node)
        }
        return node
      })
      .filter(Boolean)

    return () => {
      nodes.forEach(node => observer.unobserve(node))
      observer.disconnect()
    }
  }, [plannerEnabled, loadingConfig])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!plannerEnabled) {
      setShowMobileSummary(false)
      return
    }

    const handleScroll = () => {
      setShowMobileSummary(window.scrollY > 360)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [plannerEnabled])

  useEffect(() => {
    setSelectedEventType(prev => {
      const available = ensureArray(config.eventTypes)
      return available.some(item => item.id === prev) ? prev : available[0]?.id ?? ''
    })
  }, [config.eventTypes])

  useEffect(() => {
    setSelectedServiceLevel(prev => {
      const available = ensureArray(config.serviceLevels)
      if (available.some(item => item.id === prev)) return prev
      const preferred = available.find(item => item.id === defaultPlannerConfig.serviceLevels[1]?.id)
      return preferred?.id ?? available[0]?.id ?? ''
    })
  }, [config.serviceLevels])

  useEffect(() => {
    setSelectedMenu(prev => {
      const available = ensureArray(config.menuCollections)
      return available.some(item => item.id === prev) ? prev : available[0]?.id ?? ''
    })
  }, [config.menuCollections])

  useEffect(() => {
    setMenuSelections(current => clampSelections(current, config.menuBuilderCategories))
  }, [config.menuBuilderCategories])

  const toggleAddon = id => {
    setSelectedAddons(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
  }

  const toggleMenuItem = (categoryId, value) => {
    const category = ensureArray(config.menuBuilderCategories).find(item => item.id === categoryId)
    if (!category) return
    const max = typeof category.maxSelections === 'number' && category.maxSelections > 0 ? category.maxSelections : undefined

    setMenuSelections(prev => {
      const current = ensureArray(prev[categoryId])
      const isSelected = current.includes(value)
      if (isSelected) {
        return { ...prev, [categoryId]: current.filter(item => item !== value) }
      }
      if (max && current.length >= max) {
        return prev
      }
      return { ...prev, [categoryId]: [...current, value] }
    })
  }

  const eventTypes = ensureArray(config.eventTypes)
  const serviceLevels = ensureArray(config.serviceLevels)
  const menuCollections = ensureArray(config.menuCollections)
  const experienceAddons = ensureArray(config.experienceAddons)
  const menuBuilderCategories = ensureArray(config.menuBuilderCategories)
  const onboardingChecklist = ensureArray(config.onboardingChecklist)

  const event = useMemo(
    () => eventTypes.find(item => item.id === selectedEventType) ?? eventTypes[0] ?? defaultPlannerConfig.eventTypes[0],
    [eventTypes, selectedEventType]
  )

  const serviceLevel = useMemo(
    () => serviceLevels.find(item => item.id === selectedServiceLevel) ?? serviceLevels[0] ?? defaultPlannerConfig.serviceLevels[0],
    [serviceLevels, selectedServiceLevel]
  )

  const menu = useMemo(
    () => menuCollections.find(item => item.id === selectedMenu) ?? menuCollections[0] ?? defaultPlannerConfig.menuCollections[0],
    [menuCollections, selectedMenu]
  )

  const addonTotals = useMemo(() => {
    return selectedAddons.reduce(
      (acc, id) => {
        const addon = experienceAddons.find(item => item.id === id)
        if (!addon) return acc
        if (addon.type === 'per_person') {
          acc.perPerson += Number(addon.price || 0)
        } else {
          acc.flat += Number(addon.price || 0)
        }
        return acc
      },
      { perPerson: 0, flat: 0 }
    )
  }, [selectedAddons, experienceAddons])

  const perGuestTotal = (Number(event?.pricePerGuest) || 0) + (Number(serviceLevel?.pricePerGuest) || 0) + (Number(menu?.pricePerGuest) || 0) + addonTotals.perPerson
  const baseTotal = perGuestTotal * guestCount + addonTotals.flat
  const rangeMin = Math.round(baseTotal * 0.93)
  const rangeMax = Math.round(baseTotal * 1.08)
  const bookingRetainer = Math.round(baseTotal * 0.25)

  const menuItemLookup = useMemo(() => {
    const lookup = {}
    menuBuilderCategories.forEach(category => {
      ensureArray(category.items).forEach(item => {
        lookup[item.id] = item
      })
    })
    return lookup
  }, [menuBuilderCategories])

  const selectedMenuSummaries = useMemo(() => {
    return menuBuilderCategories
      .map(category => {
        const selected = ensureArray(menuSelections[category.id]).map(value => menuItemLookup[value]?.name || value)
        if (!selected.length) return null
        return `${category.label}: ${selected.join(', ')}`
      })
      .filter(Boolean)
  }, [menuBuilderCategories, menuSelections, menuItemLookup])

  const summaryLines = [
    `${event.name} | ${serviceLevel.name} | ${menu.name}`,
    `${guestCount} guests | ${formatCurrency(perGuestTotal)} per guest`,
  ]

  const enquiryMessage = encodeURIComponent(
    `I would like to plan a ${event.name.toLowerCase()} for ${guestCount} guests on ${
      eventDate || 'our upcoming date'
    }.` +
      `\n\nPreferred service: ${serviceLevel.name}\nMenu inspiration: ${
        menu.name
      }\nSelected dishes: ${selectedMenuSummaries.join(' | ') || 'To be decided'}\nEstimated investment: ${formatCurrency(rangeMin)} - ${formatCurrency(
        rangeMax
      )}.\nEvent location: ${eventLocation || 'TBD'}.\nNotes: ${notes || 'N/A'}.`
  )
const contactHref = `/contact?context=${enquiryMessage}`

  if (loadingConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light text-secondary">
        <p className="text-lg font-semibold">Loading planner experience...</p>
      </div>
    )
  }

  if (!plannerEnabled) {
    return (
      <div className="bg-light text-gray-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-dark text-white">
          <div className="container mx-auto max-w-5xl px-6 py-32 text-center">
            <h1 className="font-serif text-4xl font-semibold sm:text-5xl">Our menu planner is currently offline</h1>
            <p className="mt-6 text-lg text-white/80">
              We are refreshing our digital tasting studio. Share your celebration details and our team will craft a custom proposal for you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-primary/90"
              >
                Request A Quote
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-3 text-base font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
              >
                View Signature Menus
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="bg-light text-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-dark text-white">
        <div className="absolute inset-0">
          <div className="absolute -top-32 right-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
          <div className="absolute top-1/3 -left-24 h-60 w-60 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
        </div>
        <div className="container relative mx-auto px-6 py-24 lg:px-10">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            Intelligent Menu Planner
          </span>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Design your Gujarati feast and receive a tailored quote instantly.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80 md:text-xl">
            Mix and match celebration styles, signature menus, dish-by-dish selections, and experiential upgrades. Watch the investment update live as you craft the perfect occasion.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-3xl font-serif font-semibold text-white">ભાવે તો સહુ ને કેહજો ,ના ભાવે તો અમને કેહજો</p>
              {/* <p className="text-sm uppercase tracking-wide text-white/80">ભાવે તો સહુ ને કેહજો , ના ભાવે તો અમને કેહજો </p> */}
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-3xl font-serif font-semibold text-white">100%</p>
              <p className="text-sm uppercase tracking-wide text-white/80">Pure veg | Jain friendly kitchens</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-3xl font-serif font-semibold text-white">24 hrs</p>
              <p className="text-sm uppercase tracking-wide text-white/80">Proposal turnaround promise</p>
            </div>
          </div>
          {loadError && (
            <div className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
              {loadError}
            </div>
          )}
        </div>
      </section>

      <main className="relative -mt-16 pb-24">
        <div className="container mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto mb-10 max-w-5xl">
            <nav className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-xl shadow-secondary/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary/60">Plan outline</p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold text-secondary">Follow the three-step studio</h2>
                </div>
                <div className="hidden items-center gap-3 sm:flex">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">Live pricing</span>
                  <span className="rounded-full bg-secondary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary/70">Avg guest {formatCurrency(perGuestTotal)}</span>
                </div>
              </div>
              <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                {plannerSteps.map((step, index) => {
                  const isActive = step.id === activeStep
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => scrollToSection(step.id)}
                      className={`group relative flex min-w-[180px] flex-1 items-start gap-3 rounded-2xl border p-4 text-left transition ${
                        isActive
                          ? 'border-primary bg-primary/5 text-secondary shadow-lg shadow-primary/20'
                          : 'border-transparent bg-secondary/5 text-secondary/70 hover:border-primary/40 hover:bg-primary/5'
                      }`}
                    >
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-base font-semibold text-primary shadow">
                        {index + 1}
                      </span>
                      <span className="flex-1">
                        <span className="block font-semibold text-secondary">{step.label}</span>
                        <span className="mt-1 block text-sm text-secondary/70">{step.description}</span>
                      </span>
                      <span
                        className={`absolute inset-x-0 bottom-0 h-1 rounded-b-2xl transition ${isActive ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/60'}`}
                        aria-hidden="true"
                      />
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-10">
            <section
              id="step-experience"
              ref={registerSectionRef('step-experience')}
              className="rounded-3xl bg-white p-8 shadow-xl shadow-secondary/10"
            >
              <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-secondary">1 - Celebration style</h2>
                  <p className="text-sm text-gray-500">Pick the vibe that matches your event vision.</p>
                </div>
                {event.highlight && <p className="text-sm font-medium text-primary/90">{event.highlight}</p>}
              </header>
              <div className="grid gap-4 md:grid-cols-2">
                {eventTypes.map(item => {
                  const isActive = item.id === selectedEventType
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedEventType(item.id)}
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        isActive
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-serif text-lg font-semibold text-secondary">{item.name}</h3>
                        <span className="text-sm font-semibold text-primary">{formatCurrency(item.pricePerGuest)} / guest</span>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">{item.description}</p>
                    </button>
                  )
                })}
              </div>
            </section>

            <section
              id="step-guests"
              ref={registerSectionRef('step-guests')}
              className="rounded-3xl bg-white p-8 shadow-xl shadow-secondary/10"
            >
              <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-secondary">2 - Guest insights</h2>
                  <p className="text-sm text-gray-500">Tell us how many people you are welcoming and key logistics.</p>
                </div>
              </header>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="guestCount" className="flex justify-between text-sm font-semibold text-secondary">
                    Guest count
                    <span className="text-primary">{guestCount} guests</span>
                  </label>
                  <input
                    id="guestCount"
                    type="range"
                    min="50"
                    max="1200"
                    step="10"
                    value={guestCount}
                    onChange={event => setGuestCount(Number(event.target.value))}
                    className="mt-3 w-full accent-primary"
                  />
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>50</span>
                    <span>600</span>
                    <span>1200</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="eventDate" className="mb-1 block text-sm font-semibold text-secondary">
                      Event date
                    </label>
                    <input
                      id="eventDate"
                      type="date"
                      value={eventDate}
                      onChange={event => setEventDate(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="eventLocation" className="mb-1 block text-sm font-semibold text-secondary">
                      Venue / locality
                    </label>
                    <input
                      id="eventLocation"
                      type="text"
                      placeholder="e.g. Ahmedabad, SG Highway"
                      value={eventLocation}
                      onChange={event => setEventLocation(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="notes" className="mb-1 block text-sm font-semibold text-secondary">
                  Special notes (dietary, rituals, timelines)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Tell us about live counters you love, rituals to honour, or a story behind your celebration."
                  value={notes}
                  onChange={event => setNotes(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </section>
            <section
              id="step-menu"
              ref={registerSectionRef('step-menu')}
              className="rounded-3xl bg-white p-8 shadow-xl shadow-secondary/10"
            >
              <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-secondary">3 - Curate your menu</h2>
                  <p className="text-sm text-gray-500">Select a showcase spread, then personalise every course.</p>
                </div>
              </header>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {menuCollections.map(collection => {
                    const isActive = collection.id === selectedMenu
                    return (
                      <button
                        key={collection.id}
                        type="button"
                        onClick={() => setSelectedMenu(collection.id)}
                        className={`rounded-2xl border p-5 text-left transition-all ${
                          isActive
                            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                            : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-serif text-lg font-semibold text-secondary">{collection.name}</h3>
                          <span className="text-sm font-semibold text-primary">{formatCurrency(collection.pricePerGuest)} / guest</span>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">{collection.headline}</p>
                      </button>
                    )
                  })}
                </div>
                <div className="rounded-2xl bg-gray-50 p-6">
                  <h4 className="font-serif text-lg font-semibold text-secondary">Dish spotlight</h4>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    {Object.entries(menu.courses || {}).map(([course, items]) => (
                      <div key={course}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{course}</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          {ensureArray(items).map(item => (
                            <li key={item}>- {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                {menuBuilderCategories.length > 0 && (
                  <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6">
                    <div>
                      <h4 className="font-serif text-lg font-semibold text-secondary">Handpick each course</h4>
                      <p className="mt-2 text-sm text-gray-600">
                        Choose your favourite sabji, breads, desserts, and more. We will use these selections to customise your tasting and proposal.
                      </p>
                    </div>
                    <div className="space-y-8">
                      {menuBuilderCategories.map(category => {
                        const selectedIds = ensureArray(menuSelections[category.id])
                        const max = typeof category.maxSelections === 'number' && category.maxSelections > 0 ? category.maxSelections : undefined
                        const reachedLimit = max ? selectedIds.length >= max : false

                        return (
                          <div key={category.id} className="space-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-base font-semibold text-secondary">{category.label}</p>
                                {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                              </div>
                              {max && (
                                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                  {selectedIds.length} / {max} selected
                                </p>
                              )}
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                              {ensureArray(category.items).map(item => {
                                const isSelected = selectedIds.includes(item.id)
                                const disabled = !isSelected && reachedLimit
                                return (
                                  <label
                                    key={item.id}
                                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                                      isSelected
                                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                                        : disabled
                                        ? 'border-gray-200 opacity-50'
                                        : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      disabled={disabled}
                                      onChange={() => toggleMenuItem(category.id, item.id)}
                                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div>
                                      <p className="font-semibold text-secondary">{item.name}</p>
                                      {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                                    </div>
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-8 shadow-xl shadow-secondary/10">
              <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-secondary">4 - Service and experiences</h2>
                  <p className="text-sm text-gray-500">Elevate the celebration with immersive touches.</p>
                </div>
              </header>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">Service style</p>
                  <div className="space-y-3">
                    {serviceLevels.map(level => {
                      const isActive = level.id === selectedServiceLevel
                      return (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => setSelectedServiceLevel(level.id)}
                          className={`w-full rounded-2xl border p-4 text-left transition-all ${
                            isActive
                              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                              : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-serif text-lg font-semibold text-secondary">{level.name}</h3>
                            <span className="text-sm font-semibold text-primary">{formatCurrency(level.pricePerGuest)} / guest</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">{level.description}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">Experiential upgrades</p>
                  <div className="space-y-3">
                    {experienceAddons.map(addon => {
                      const isChecked = selectedAddons.includes(addon.id)
                      return (
                        <label
                          key={addon.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                            isChecked
                              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                              : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(addon.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif text-base font-semibold text-secondary">{addon.name}</h3>
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                {addon.type === 'per_person' ? `${formatCurrency(addon.price)} / guest` : formatCurrency(addon.price)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{addon.description}</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
          <aside className="space-y-6">
            <div className="rounded-3xl bg-secondary p-8 text-white shadow-xl shadow-secondary/20">
              <h3 className="font-serif text-2xl font-semibold">Investment outlook</h3>
              <p className="mt-3 text-sm text-white/80">Live calculations update as you personalise the experience.</p>
              <div className="mt-8 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/70">Estimated range</p>
                  <p className="font-serif text-3xl font-semibold text-white">
                    {formatCurrency(rangeMin)}
                    <span className="text-base font-sans font-medium text-white/70"> - </span>
                    {formatCurrency(rangeMax)}
                  </p>
                  <p className="mt-1 text-xs text-white/60">Includes contingency for seasonal produce and venue logistics.</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Per guest experience</span>
                    <span className="font-semibold text-accent">{formatCurrency(perGuestTotal)}</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-xs text-white/70">
                    <li>- {event.name}: {formatCurrency(event.pricePerGuest)}</li>
                    <li>- {serviceLevel.name}: {formatCurrency(serviceLevel.pricePerGuest)}</li>
                    <li>- {menu.name}: {formatCurrency(menu.pricePerGuest)}</li>
                    {addonTotals.perPerson > 0 && <li>- Upgrades: {formatCurrency(addonTotals.perPerson)}</li>}
                    {addonTotals.flat > 0 && <li>- Flat services: {formatCurrency(addonTotals.flat)}</li>}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">
                  <p className="font-semibold text-white">Booking retainer</p>
                  <p className="text-lg font-semibold text-accent">{formatCurrency(bookingRetainer)}</p>
                  <p className="mt-1 text-xs">Payable to secure our culinary team and production slots.</p>
                </div>
              </div>
              <div className="mt-8 space-y-3 text-sm text-white/70">
                {summaryLines.map(line => (
                  <p key={line}>{line}</p>
                ))}
                {selectedMenuSummaries.length > 0 && (
                  <div className="rounded-2xl bg-white/10 p-3 text-white/80">
                    <p className="text-xs uppercase tracking-wide text-white/70">Custom picks</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {selectedMenuSummaries.map(line => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {eventDate && <p>Preferred date: {eventDate}</p>}
                {eventLocation && <p>Venue: {eventLocation}</p>}
              </div>
              <Link
                href={contactHref}
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Request detailed proposal
              </Link>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-secondary/10">
              <h4 className="font-serif text-lg font-semibold text-secondary">What happens next?</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                {onboardingChecklist.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
      </main>
      {plannerEnabled && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-6 py-4 shadow-xl backdrop-blur transition-transform lg:hidden ${showMobileSummary ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-secondary/60">Estimated</p>
              <p className="font-serif text-2xl font-semibold text-secondary">
                {formatCurrency(rangeMin)}
                <span className="text-sm font-sans font-medium text-secondary/60"> - {formatCurrency(rangeMax)}</span>
              </p>
            </div>
            <Link
              href={contactHref}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary/20"
            >
              Request proposal
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

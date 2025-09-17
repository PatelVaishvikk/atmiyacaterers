import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { defaultPlannerConfig, normalisePlannerConfig } from '@/data/plannerOptions'

const COLLECTION = 'settings'

const sanitizePlannerPayload = payload => {
  if (!payload || typeof payload !== 'object') {
    return {
      eventTypes: defaultPlannerConfig.eventTypes,
      serviceLevels: defaultPlannerConfig.serviceLevels,
      menuCollections: defaultPlannerConfig.menuCollections,
      experienceAddons: defaultPlannerConfig.experienceAddons,
      menuBuilderCategories: defaultPlannerConfig.menuBuilderCategories,
      onboardingChecklist: defaultPlannerConfig.onboardingChecklist,
    }
  }

  const normalised = normalisePlannerConfig(payload)
  const { plannerEnabled: _ignored, ...config } = normalised
  return {
    eventTypes: config.eventTypes,
    serviceLevels: config.serviceLevels,
    menuCollections: config.menuCollections,
    experienceAddons: config.experienceAddons,
    menuBuilderCategories: config.menuBuilderCategories,
    onboardingChecklist: config.onboardingChecklist,
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const settings = (await db.collection(COLLECTION).findOne({})) || {}

    const storedConfig = settings.plannerConfig || settings.planner || {}
    const normalised = normalisePlannerConfig(storedConfig)
    const { plannerEnabled: configFlag, ...config } = normalised

    const enabled =
      typeof settings.plannerEnabled === 'boolean'
        ? settings.plannerEnabled
        : typeof configFlag === 'boolean'
        ? configFlag
        : defaultPlannerConfig.plannerEnabled ?? true

    return NextResponse.json({
      success: true,
      plannerEnabled: enabled,
      plannerConfig: Object.keys(storedConfig || {}).length ? storedConfig : config,
      normalisedConfig: config,
    })
  } catch (error) {
    console.error('Admin planner GET error', error)
    const { plannerEnabled: fallbackFlag, ...config } = normalisePlannerConfig(defaultPlannerConfig)
    const enabled = typeof fallbackFlag === 'boolean' ? fallbackFlag : true
    return NextResponse.json({
      success: false,
      plannerEnabled: enabled,
      plannerConfig: config,
      normalisedConfig: config,
      error: 'Failed to load planner configuration',
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const plannerEnabled = body && typeof body.plannerEnabled === 'boolean' ? body.plannerEnabled : undefined
    const plannerConfigInput = sanitizePlannerPayload(body?.plannerConfig)

    const client = await clientPromise
    const db = client.db()

    const updateDoc = {
      plannerConfig: plannerConfigInput,
      updatedAt: new Date(),
    }

    if (typeof plannerEnabled === 'boolean') {
      updateDoc.plannerEnabled = plannerEnabled
    }

    await db.collection(COLLECTION).updateOne({}, { $set: updateDoc }, { upsert: true })

    return NextResponse.json({
      success: true,
      plannerEnabled: typeof plannerEnabled === 'boolean' ? plannerEnabled : undefined,
      plannerConfig: plannerConfigInput,
    })
  } catch (error) {
    console.error('Admin planner POST error', error)
    return NextResponse.json({ success: false, error: 'Failed to save planner configuration' }, { status: 500 })
  }
}

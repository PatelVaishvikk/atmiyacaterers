import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { defaultPlannerConfig, normalisePlannerConfig } from '@/data/plannerOptions'

const COLLECTION = 'settings'

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

    return NextResponse.json({ enabled, config })
  } catch (error) {
    console.error('Planner GET error', error)
    const { plannerEnabled: fallbackFlag, ...config } = normalisePlannerConfig(defaultPlannerConfig)
    const enabled = typeof fallbackFlag === 'boolean' ? fallbackFlag : true
    return NextResponse.json({ enabled, config, fallback: true })
  }
}

'use client'

import { useEffect, useState } from 'react'
import { defaultPlannerConfig, normalisePlannerConfig } from '@/data/plannerOptions'

export function usePlannerAvailability() {
  const [enabled, setEnabled] = useState(defaultPlannerConfig.plannerEnabled ?? true)
  const [config, setConfig] = useState(defaultPlannerConfig)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/planner', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Planner request failed')
        }
        const data = await response.json()
        if (!isMounted) return
        const normalised = normalisePlannerConfig(data?.config || data?.plannerConfig || {})
        setConfig(normalised)
        setEnabled(
          typeof data?.enabled === 'boolean'
            ? data.enabled
            : normalised.plannerEnabled ?? defaultPlannerConfig.plannerEnabled ?? true
        )
      } catch (err) {
        if (!isMounted) return
        console.error('Failed to fetch planner availability', err)
        setConfig(normalisePlannerConfig(defaultPlannerConfig))
        setEnabled(defaultPlannerConfig.plannerEnabled ?? true)
        setError('Failed to load planner availability')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  return { enabled, config, loading, error }
}

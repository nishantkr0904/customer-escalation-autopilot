import { NextResponse } from 'next/server'
import { aggregateHealthChecks } from '@/lib/utils/health-monitor'

export async function GET() {
  try {
    const healthChecks = await aggregateHealthChecks()
    const overallStatus = healthChecks.every((h) => h.status === 'healthy')
      ? 'operational'
      : healthChecks.some((h) => h.status === 'down')
      ? 'degraded'
      : 'degraded'

    return NextResponse.json({
      status: overallStatus,
      checkedAt: new Date().toISOString(),
      servicesCount: healthChecks.length,
      services: healthChecks,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      {
        error: {
          code: 'HEALTH_CHECK_FAILED',
          message: 'Failed to aggregate service health checks.',
          details: errorMsg,
        },
      },
      { status: 500 }
    )
  }
}

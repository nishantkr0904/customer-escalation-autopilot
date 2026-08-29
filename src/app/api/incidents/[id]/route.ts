import { NextRequest, NextResponse } from 'next/server'
import { orchestratorService } from '@/lib/services/orchestrator'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const incident = orchestratorService.getIncidentById(id)

    if (!incident) {
      return NextResponse.json(
        {
          error: {
            code: 'INCIDENT_NOT_FOUND',
            message: `Incident with ID '${id}' was not found.`,
          },
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      incident,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      {
        error: {
          code: 'FETCH_INCIDENT_FAILED',
          message: 'Failed to fetch incident details.',
          details: errorMsg,
        },
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { orchestratorService } from '@/lib/services/orchestrator'
import { CreateIncidentInput } from '@/lib/types'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const severity = searchParams.get('severity') || undefined
    const status = searchParams.get('status') || undefined

    const incidents = orchestratorService.getIncidents({ severity, status })

    return NextResponse.json({
      success: true,
      count: incidents.length,
      incidents,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      {
        error: {
          code: 'FETCH_INCIDENTS_FAILED',
          message: 'Failed to fetch incidents list.',
          details: errorMsg,
        },
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateIncidentInput

    if (!body || !body.customerEmail || !body.description) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Incident creation requires customerEmail and description.',
          },
        },
        { status: 400 }
      )
    }

    const input: CreateIncidentInput = {
      customerEmail: body.customerEmail,
      description: body.description,
      source: body.source || 'manual',
    }

    const incident = await orchestratorService.processIncident(input)

    return NextResponse.json(
      {
        success: true,
        message: 'Incident created and processed successfully.',
        incident,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      {
        error: {
          code: 'CREATE_INCIDENT_FAILED',
          message: 'Failed to create and process incident.',
          details: errorMsg,
        },
      },
      { status: 500 }
    )
  }
}

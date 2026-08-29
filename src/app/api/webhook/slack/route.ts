import { NextRequest, NextResponse } from 'next/server'
import { orchestratorService } from '@/lib/services/orchestrator'
import { SlackEvent } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SlackEvent

    if (!body || !body.customerEmail || !body.text) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SLACK_EVENT',
            message: 'Slack event payload must include customerEmail and text.',
          },
        },
        { status: 400 }
      )
    }

    // Process incident synchronously or return accepted
    const incident = await orchestratorService.processIncident(body)

    return NextResponse.json(
      {
        status: 'processing',
        message: 'Slack incident webhook accepted and processed.',
        incidentId: incident.id,
        incident,
      },
      { status: 202 }
    )
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      {
        error: {
          code: 'WEBHOOK_PROCESSING_FAILED',
          message: 'Failed to process Slack webhook event.',
          details: errorMsg,
        },
      },
      { status: 500 }
    )
  }
}

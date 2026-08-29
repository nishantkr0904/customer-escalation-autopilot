import { NextRequest, NextResponse } from 'next/server'
import { orchestratorService } from '@/lib/services/orchestrator'
import { escalationService } from '@/lib/services/escalation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const incidentId = body?.incidentId

    if (!incidentId) {
      return NextResponse.json(
        {
          error: {
            code: 'MISSING_INCIDENT_ID',
            message: 'Request body must contain incidentId.',
          },
        },
        { status: 400 }
      )
    }

    const incident = orchestratorService.getIncidentById(incidentId)
    if (!incident) {
      return NextResponse.json(
        {
          error: {
            code: 'INCIDENT_NOT_FOUND',
            message: `Incident with ID '${incidentId}' was not found.`,
          },
        },
        { status: 404 }
      )
    }

    // Trigger escalation sequence
    const escalationResult = await escalationService.executeEscalation(incident)
    incident.escalation = escalationResult
    incident.executiveSummary = escalationResult.executiveSummary
    incident.status = 'escalated'
    incident.updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      message: `Incident '${incidentId}' escalated successfully.`,
      escalationResult,
      incident,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      {
        error: {
          code: 'ESCALATION_FAILED',
          message: 'Failed to execute manual escalation.',
          details: errorMsg,
        },
      },
      { status: 500 }
    )
  }
}

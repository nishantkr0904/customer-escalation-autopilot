# TASK_BREAKDOWN.md

## Customer Escalation Autopilot — Detailed Task Breakdown

An ordered task list covering every step from an empty repository to a finished MVP.

---

## Phase 1: Foundation

---

### Step 1 — Initialize Next.js Project ✅

**Deliverables:**
- Next.js 14 project with TypeScript and Tailwind CSS
- Configured `tailwind.config.ts`, `tsconfig.json`, `next.config.js`
- `.env.example` with placeholder variables
- `.gitignore` updated

**Estimated Time:** 15 minutes

**Dependencies:** None

**Validation:**
- `npm run dev` starts without errors
- Default Next.js page renders at `http://localhost:3000`
- TypeScript compilation passes

---

### Step 2 — Configure Tailwind Design Tokens ✅

**Deliverables:**
- Custom color palette (dark theme, severity colors, status colors)
- Typography scale using Inter font
- Spacing, border-radius, and shadow tokens
- CSS custom properties for dynamic theming
- Updated `src/app/globals.css` with Tailwind directives and custom styles

**Estimated Time:** 20 minutes

**Dependencies:** Step 1

**Validation:**
- Tailwind classes apply custom colors correctly
- Dark theme is the default
- Inter font loads from Google Fonts

---

### Step 3 — Build Application Shell ✅

**Deliverables:**
- `src/components/layout/app-shell.tsx` — main wrapper
- `src/components/layout/sidebar.tsx` — navigation sidebar
- `src/components/layout/header.tsx` — page header with breadcrumbs
- `src/app/layout.tsx` — root layout integrating the shell

**Estimated Time:** 45 minutes

**Dependencies:** Step 2

**Validation:**
- Sidebar renders with navigation items: Dashboard, Incidents, Workflow, Health
- Active route is highlighted in sidebar
- Header shows current page title and breadcrumbs
- Layout is responsive (sidebar collapses below 1024px)

---

### Step 4 — Build UI Primitives ✅

**Deliverables:**
- `src/components/ui/badge.tsx` — severity and status variants
- `src/components/ui/card.tsx` — glass-morphism content card
- `src/components/ui/button.tsx` — primary, secondary, ghost, danger
- `src/components/ui/skeleton.tsx` — shimmer loading placeholders
- `src/components/ui/status-indicator.tsx` — colored dot with label
- `src/components/ui/progress-bar.tsx` — stepped progress indicator

**Estimated Time:** 45 minutes

**Dependencies:** Step 2

**Validation:**
- Badge renders correctly for all 4 severity levels + statuses
- Card has glass-morphism effect on dark background
- Button variants are visually distinct with hover/active states
- Skeleton has shimmer animation
- StatusIndicator shows correct colors for healthy/degraded/down

---

## Phase 2: Data Layer

---

### Step 5 — Define TypeScript Interfaces ✅

**Deliverables:**
- `src/lib/types/index.ts` — all TypeScript interfaces

**Types to define:**
- `Customer`
- `Incident`
- `TimelineEvent`
- `SlackEvent`
- `HubSpotResponse`
- `StripeResponse`, `StripeBilling`
- `GitHubIssue`
- `LinearTicket`
- `NotionEntry`
- `ExecutiveSummary`
- `AIDecision`
- `EscalationResult`, `EscalationAction`
- `WorkflowState`, `WorkflowStep`
- `HealthCheckResponse`
- Enum/union types for severity, status, tier, etc.

**Estimated Time:** 30 minutes

**Dependencies:** Step 1

**Validation:**
- `npx tsc --noEmit` passes
- All types match DATA_MODEL.md schemas exactly

---

### Step 6 — Create Mock Data Files ✅

**Deliverables:**
- `src/lib/mock-data/customers.json` — 5 customers
- `src/lib/mock-data/incidents.json` — 5 incidents
- `src/lib/mock-data/stripe-accounts.json` — 5 billing records
- `src/lib/mock-data/github-issues.json` — 10 issues
- `src/lib/mock-data/ai-responses.json` — 5 AI analyses

**Estimated Time:** 45 minutes

**Dependencies:** Step 5

**Validation:**
- JSON files are valid and parseable
- Data is internally consistent (emails match across files)
- Covers all tiers: enterprise, smb, startup, free
- Covers all severity levels: low, medium, high, critical
- Covers all incident statuses: received → resolved

---

### Step 7 — Create Utility Functions ✅

**Deliverables:**
- `src/lib/utils/constants.ts` — severity levels, status values, color maps
- `src/lib/utils/formatters.ts` — date, currency, text formatting

**Estimated Time:** 20 minutes

**Dependencies:** Step 5

**Validation:**
- `formatDate("2026-08-29T10:15:00Z")` returns human-readable format
- `formatCurrency(285000)` returns `$285,000`
- `formatSeverity("critical")` returns `CRITICAL`
- Handles null/undefined gracefully

---

## Phase 3: Integration Layer

---

### Step 8 — Define Adapter Interfaces ✅

**Deliverables:**
- `src/lib/integrations/types.ts` — interface definitions for all 7 adapters

**Estimated Time:** 15 minutes

**Dependencies:** Step 5

**Validation:**
- Each adapter has typed methods matching ARCHITECTURE.md section 9
- Each adapter has a `healthCheck()` method returning `HealthCheckResponse`
- TypeScript compiles

---

### Step 9 — Implement HubSpot Mock Adapter ✅

**Deliverables:**
- `src/lib/integrations/hubspot.ts`

**Methods:**
- `getCustomerByEmail(email: string): Promise<HubSpotResponse>`
- `getCustomerById(id: string): Promise<HubSpotResponse>`
- `healthCheck(): Promise<HealthCheckResponse>`

**Estimated Time:** 15 minutes

**Dependencies:** Steps 6, 8

**Validation:**
- `getCustomerByEmail("ops@acmecorp.com")` returns Acme Corp
- Unknown email returns `{ success: false, customer: null }`
- Simulates 100–300ms latency
- `healthCheck()` returns healthy status

---

### Step 10 — Implement Stripe Mock Adapter ✅

**Deliverables:**
- `src/lib/integrations/stripe.ts`

**Methods:**
- `getBillingStatus(customerId: string): Promise<StripeResponse>`
- `healthCheck(): Promise<HealthCheckResponse>`

**Estimated Time:** 10 minutes

**Dependencies:** Steps 6, 8

**Validation:**
- Returns billing data for known customer IDs
- Unknown IDs return `{ success: false, billing: null }`

---

### Step 11 — Implement GitHub Mock Adapter ✅

**Deliverables:**
- `src/lib/integrations/github.ts`

**Methods:**
- `getRelatedIssues(query: string): Promise<GitHubIssue[]>`
- `healthCheck(): Promise<HealthCheckResponse>`

**Estimated Time:** 15 minutes

**Dependencies:** Steps 6, 8

**Validation:**
- Searches issue titles/bodies for keyword matches
- Returns issues sorted by relevance score
- Empty query returns empty array

---

### Step 12 — Implement Linear Mock Adapter ✅

**Deliverables:**
- `src/lib/integrations/linear.ts`

**Methods:**
- `createTicket(input: LinearTicketInput): Promise<LinearTicket>`
- `healthCheck(): Promise<HealthCheckResponse>`

**Estimated Time:** 10 minutes

**Dependencies:** Steps 5, 8

**Validation:**
- Returns a valid LinearTicket with generated ID and identifier
- Priority maps from severity level

---

### Step 13 — Implement Slack Mock Adapter ✅

**Deliverables:**
- `src/lib/integrations/slack.ts`

**Methods:**
- `sendNotification(channel: string, message: object): Promise<void>`
- `healthCheck(): Promise<HealthCheckResponse>`

**Estimated Time:** 10 minutes

**Dependencies:** Steps 5, 8

**Validation:**
- Logs notification details to console
- Does not throw errors

---

### Step 14 — Implement Notion Mock Adapter ✅

**Deliverables:**
- `src/lib/integrations/notion.ts`

**Methods:**
- `createIncidentEntry(entry: NotionEntryInput): Promise<NotionEntry>`
- `healthCheck(): Promise<HealthCheckResponse>`

**Estimated Time:** 10 minutes

**Dependencies:** Steps 5, 8

**Validation:**
- Returns a valid NotionEntry with generated ID and URL

---

### Step 15 — Implement Email Mock Adapter ✅

**Deliverables:**
- `src/lib/integrations/email.ts`

**Methods:**
- `sendSummary(to: string[], summary: ExecutiveSummary): Promise<void>`
- `healthCheck(): Promise<HealthCheckResponse>`

**Estimated Time:** 10 minutes

**Dependencies:** Steps 5, 8

**Validation:**
- Logs email details to console
- Does not throw errors

---

## Phase 4: Service Layer

---

### Step 16 — Build AI Pipeline Service ✅

**Deliverables:**
- `src/lib/services/ai-pipeline.ts`

**Functions:**
- `analyzeIncident(context): Promise<AIDecision>`
- `generateExecutiveSummary(incident): Promise<ExecutiveSummary>`
- `buildPrompt(context): string` (internal)

**Estimated Time:** 45 minutes

**Dependencies:** Steps 5, 6

**Validation:**
- Mock mode: matches incident keywords to pre-computed responses
- Returns valid `AIDecision` object
- Generates valid `ExecutiveSummary`
- Handles unknown incidents with a sensible default response

---

### Step 17 — Build Triage Service ✅

**Deliverables:**
- `src/lib/services/triage.ts`

**Functions:**
- `classifySeverity(aiDecision, customer): SeverityResult`
- `shouldEscalate(severity, customer): boolean`
- `getEscalationRules(): EscalationRule[]`

**Escalation Rules:**
- Enterprise customers: escalate at Medium and above
- SMB customers: escalate at High and above
- Startup customers: escalate at Critical only
- Free customers: escalate at Critical only
- Always escalate if AI confidence > 0.9 and severity >= High

**Estimated Time:** 30 minutes

**Dependencies:** Step 5

**Validation:**
- Enterprise + Medium → escalate ✓
- Enterprise + Low → no escalate ✓
- Free + Critical → escalate ✓
- Free + Medium → no escalate ✓
- High confidence override works ✓

---

### Step 18 — Build Escalation Service ✅

**Deliverables:**
- `src/lib/services/escalation.ts`

**Functions:**
- `executeEscalation(incident): Promise<EscalationResult>`

**Actions executed (in order):**
1. Create Linear ticket
2. Notify Slack channel
3. Generate executive summary
4. Update Notion incident log
5. Send email summary

**Estimated Time:** 30 minutes

**Dependencies:** Steps 9–16

**Validation:**
- All 5 actions execute and report individual status
- Partial failure (one action fails) still completes remaining actions
- Returns `EscalationResult` with action-by-action results

---

### Step 19 — Build Orchestrator Service ✅

**Deliverables:**
- `src/lib/services/orchestrator.ts`

**Functions:**
- `processIncident(input): Promise<Incident>`
- `getIncidents(): Incident[]`
- `getIncidentById(id): Incident | null`

**Pipeline:**
1. Create incident record with status `received`
2. Enrich: HubSpot → Stripe → GitHub (status `enriching`)
3. AI analysis (status `analyzing`)
4. Triage severity (status `triaged`)
5. If escalation needed → execute escalation (status `escalated`)
6. Final status → `resolved`

**Estimated Time:** 45 minutes

**Dependencies:** Steps 16, 17, 18

**Validation:**
- Full pipeline executes end-to-end
- WorkflowState tracks each step with timestamps
- Timeline events generated for each step
- Graceful degradation when enrichment partially fails
- In-memory incident store works for the demo

---

## Phase 5: API Routes

---

### Step 20 — Implement Slack Webhook Route ✅

**Deliverables:**
- `src/app/api/webhook/slack/route.ts`

**Estimated Time:** 15 minutes

**Dependencies:** Step 19

**Validation:**
- `POST /api/webhook/slack` with SlackEvent body returns 202
- Response includes `incidentId`

---

### Step 21 — Implement Incidents API Routes ✅

**Deliverables:**
- `src/app/api/incidents/route.ts` — GET list + POST create
- `src/app/api/incidents/[id]/route.ts` — GET single

**Estimated Time:** 20 minutes

**Dependencies:** Step 19

**Validation:**
- `GET /api/incidents` returns array of incidents
- `GET /api/incidents?severity=critical` filters correctly
- `POST /api/incidents` creates and processes incident
- `GET /api/incidents/[id]` returns single incident

---

### Step 22 — Implement Escalate Route ✅

**Deliverables:**
- `src/app/api/escalate/route.ts`

**Estimated Time:** 10 minutes

**Dependencies:** Step 19

**Validation:**
- `POST /api/escalate` with `{ incidentId }` triggers escalation
- Returns `EscalationResult`

---

### Step 23 — Implement Health Route ✅

**Deliverables:**
- `src/app/api/health/route.ts`
- `src/lib/utils/health-monitor.ts`

**Estimated Time:** 20 minutes

**Dependencies:** Steps 9–15

**Validation:**
- `GET /api/health` returns array of 8 `HealthCheckResponse` objects
- Each service status is accurately reported
- Response time is measured for each service

---

## Phase 6: Frontend Pages

---

### Step 24 — Build Dashboard Stats Grid ✅

**Deliverables:**
- `src/components/dashboard/stats-grid.tsx`

**Estimated Time:** 25 minutes

**Dependencies:** Steps 4, 21

**Validation:**
- Shows 4 metric cards with animated counters
- Data fetched from `/api/incidents`

---

### Step 25 — Build Recent Incidents Table ✅

**Deliverables:**
- `src/components/dashboard/recent-incidents.tsx`

**Estimated Time:** 25 minutes

**Dependencies:** Steps 4, 21

**Validation:**
- Shows 5 most recent incidents
- Clickable rows navigate to `/incidents/[id]`

---

### Step 26 — Build Severity Chart ✅

**Deliverables:**
- `src/components/dashboard/severity-chart.tsx`

**Estimated Time:** 20 minutes

**Dependencies:** Step 4

**Validation:**
- Shows distribution across 4 severity levels
- CSS-only bars (no charting library)

---

### Step 27 — Build Quick Actions ✅

**Deliverables:**
- `src/components/dashboard/quick-actions.tsx`

**Estimated Time:** 10 minutes

**Dependencies:** Step 4

**Validation:**
- "New Incident" and "Check Health" buttons work

---

### Step 28 — Assemble Dashboard Page ✅

**Deliverables:**
- `src/app/page.tsx` — full dashboard

**Estimated Time:** 20 minutes

**Dependencies:** Steps 24–27

**Validation:**
- Dashboard renders all 4 widgets
- Loading states display correctly
- Data refreshes on page load

---

### Step 29 — Build Incident Card Component

**Deliverables:**
- `src/components/incidents/incident-card.tsx`

**Estimated Time:** 15 minutes

**Dependencies:** Step 4

**Validation:**
- Shows title, customer, severity badge, status, time
- Clickable → navigates to detail

---

### Step 30 — Build Incident List Page

**Deliverables:**
- `src/app/incidents/page.tsx`

**Estimated Time:** 30 minutes

**Dependencies:** Steps 21, 29

**Validation:**
- Grid of incident cards
- Severity filter dropdown works
- Status tab filter works

---

### Step 31 — Build Customer Context Component

**Deliverables:**
- `src/components/incidents/customer-context.tsx`

**Estimated Time:** 20 minutes

**Dependencies:** Step 4

**Validation:**
- Shows customer name, tier, contract value, health score, churn risk
- Visual tier badge and health score indicator

---

### Step 32 — Build AI Reasoning Component

**Deliverables:**
- `src/components/incidents/ai-reasoning.tsx`

**Estimated Time:** 25 minutes

**Dependencies:** Step 4

**Validation:**
- Shows severity badge, confidence bar, reasoning text
- Recommended actions as a checklist
- Business impact and technical assessment sections

---

### Step 33 — Build Escalation Actions Component

**Deliverables:**
- `src/components/incidents/escalation-actions.tsx`

**Estimated Time:** 15 minutes

**Dependencies:** Step 4

**Validation:**
- Shows 5 actions with status icons (✓ / ✗ / ○)
- Shows duration for each action

---

### Step 34 — Build Executive Summary Component

**Deliverables:**
- `src/components/incidents/exec-summary.tsx`

**Estimated Time:** 15 minutes

**Dependencies:** Step 4

**Validation:**
- Formatted summary with sections: headline, impact, actions, next steps

---

### Step 35 — Build Incident Timeline Component

**Deliverables:**
- `src/components/incidents/incident-timeline.tsx`

**Estimated Time:** 25 minutes

**Dependencies:** Step 4

**Validation:**
- Vertical timeline with timestamp, icon, title, description
- Events sorted chronologically
- Status dots color-coded (green/red/yellow)

---

### Step 36 — Assemble Incident Detail Page

**Deliverables:**
- `src/app/incidents/[id]/page.tsx`
- `src/components/incidents/incident-detail.tsx`

**Estimated Time:** 30 minutes

**Dependencies:** Steps 21, 31–35

**Validation:**
- Fetches incident from `/api/incidents/[id]`
- Renders all 5 detail sections
- Loading skeletons for each section
- 404 state for unknown IDs

---

### Step 37 — Build Workflow Pipeline View

**Deliverables:**
- `src/app/workflow/page.tsx`
- `src/components/workflow/pipeline-view.tsx`
- `src/components/workflow/workflow-step.tsx`
- `src/components/workflow/step-detail.tsx`

**Estimated Time:** 90 minutes

**Dependencies:** Steps 4, 21

**Validation:**
- 10 steps rendered in order with connectors
- Steps animate through status transitions
- Click expands step detail
- Polling updates during active pipelines

---

### Step 38 — Build Health Dashboard Page

**Deliverables:**
- `src/app/health/page.tsx`

**Estimated Time:** 45 minutes

**Dependencies:** Steps 4, 23

**Validation:**
- 8 service cards with status indicators
- Overall system status banner
- Auto-refresh every 30 seconds

---

### Step 39 — Build New Incident Form

**Deliverables:**
- `src/components/incidents/new-incident-form.tsx`

**Estimated Time:** 45 minutes

**Dependencies:** Steps 4, 21

**Validation:**
- Form fields: email (autocomplete), description, source
- Demo scenario dropdown pre-fills form
- Submit creates incident and navigates to workflow

---

## Phase 7: Polish & Demo Prep

---

### Step 40 — Add Micro-Animations

**Deliverables:**
- Card hover effects (scale + shadow)
- Badge pulse animations (Critical)
- Page fade-in transitions
- Counter animations on stats
- Step expand/collapse animations

**Estimated Time:** 30 minutes

**Dependencies:** All previous steps

**Validation:**
- Visual inspection — animations feel smooth and premium

---

### Step 41 — Add Empty & Error States

**Deliverables:**
- Empty state for incident list (no incidents yet)
- Error state for API failures
- Not-found state for unknown incident IDs

**Estimated Time:** 20 minutes

**Dependencies:** All previous steps

**Validation:**
- Empty state renders when no incidents exist
- Error state shows with retry button on API failure

---

### Step 42 — SEO & Metadata

**Deliverables:**
- Root layout metadata (title, description, OpenGraph)
- Per-page titles
- Semantic HTML review

**Estimated Time:** 15 minutes

**Dependencies:** All previous steps

**Validation:**
- `<title>` is set on all pages
- `<meta description>` is present

---

### Step 43 — Final Build Verification

**Deliverables:**
- Zero TypeScript errors
- Successful production build
- Root `README.md`

**Estimated Time:** 15 minutes

**Dependencies:** All previous steps

**Validation:**
- `npx tsc --noEmit` passes ✓
- `npm run build` succeeds ✓
- Root `README.md` exists ✓

---

### Step 44 — End-to-End Demo Test

**Deliverables:**
- Complete demo walkthrough documented
- All pages accessible and functional
- All API endpoints responding correctly

**Demo Script:**
1. Open Dashboard → see stats and recent incidents
2. Click "New Incident" → select demo scenario → submit
3. Navigate to Workflow → watch pipeline animate
4. Click through to Incident Detail → review all sections
5. Navigate to Health → see all services
6. Return to Dashboard → verify new incident appears

**Estimated Time:** 30 minutes

**Dependencies:** All previous steps

**Validation:**
- All 5 demo script steps execute successfully ✓
- No console errors ✓
- No visual glitches ✓

---

## Summary

| Phase | Steps | Estimated Time |
|---|---|---|
| 1. Foundation | Steps 1–4 | 2.0h |
| 2. Data Layer | Steps 5–7 | 1.5h |
| 3. Integration Layer | Steps 8–15 | 1.5h |
| 4. Service Layer | Steps 16–19 | 2.5h |
| 5. API Routes | Steps 20–23 | 1.0h |
| 6. Frontend Pages | Steps 24–39 | 7.5h |
| 7. Polish & Demo Prep | Steps 40–44 | 2.0h |
| **Total** | **44 Steps** | **~18 hours** |

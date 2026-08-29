# PROMPT_GUIDE.md

## Customer Escalation Autopilot — LatentCode Prompt Guide

This guide provides exact, copy-paste prompts for building the complete MVP using LatentCode. Each prompt corresponds to an implementation milestone and progressively builds the project from an empty repository to a finished application.

**Before starting:** Ensure LatentCode has read these documents for full context:
- `docs/README.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/FUNCTIONALITY_REQUIREMENTS.md`

---

## Prompt 1: Project Initialization & Design System ✅

### Purpose
Initialize the Next.js project and create a premium enterprise design system with dark theme, application shell, and reusable UI primitives.

### Prompt

```
Initialize a Next.js 14 project with TypeScript and Tailwind CSS in the current directory. Use the App Router (not Pages Router). Configure the project with these specifications:

## Design System

Create a premium dark-theme enterprise design system inspired by Linear and Vercel.

### Tailwind Configuration (tailwind.config.ts)
- Extend the default theme with custom colors:
  - Background: slate-950 (#0a0a1a) as primary, slate-900 as secondary
  - Accent: indigo-500 as primary action color
  - Severity colors: green-500 (low), amber-500 (medium), orange-500 (high), red-500 (critical)
  - Status colors: emerald-400 (healthy), yellow-400 (degraded), red-400 (down)
  - Surface: slate-800/50 for card backgrounds with glass effect
- Typography: Inter from Google Fonts as default sans
- Custom border-radius tokens: sm(6px), md(8px), lg(12px), xl(16px)
- Custom shadows optimized for dark backgrounds

### Global Styles (src/app/globals.css)
- Tailwind directives (@tailwind base, components, utilities)
- CSS custom properties for the color system
- Base styles: dark background, light text
- Scrollbar styling for the dark theme
- @keyframes for shimmer, pulse, fade-in animations

### Root Layout (src/app/layout.tsx)
- Import Inter font from next/font/google
- HTML metadata: title "Customer Escalation Autopilot", description
- Body with dark background and font applied
- Wrap children in AppShell component

### Application Shell Components

#### AppShell (src/components/layout/app-shell.tsx)
- Horizontal layout: fixed sidebar on left + scrollable content area on right
- Content area has Header at top + main content below
- Full viewport height

#### Sidebar (src/components/layout/sidebar.tsx)
- Fixed width: 260px
- Dark surface background (slate-900)
- Top: Logo/app name "Escalation Autopilot" with a lightning bolt emoji ⚡
- Navigation items with icons (use emoji for now):
  - 📊 Dashboard (/)
  - 🚨 Incidents (/incidents)
  - ⚡ Workflow (/workflow)
  - 💚 Health (/health)
- Active route highlighted with indigo background
- Bottom: "Powered by Gemini AI" text
- Subtle left border on active item

#### Header (src/components/layout/header.tsx)
- Sticky top bar
- Left: Page title (passed as prop) with breadcrumbs
- Right: Status indicator dot (green) + "All Systems Operational" text
- Bottom border for separation

### UI Primitives

#### Badge (src/components/ui/badge.tsx)
- Variants: severity (low=green, medium=amber, high=orange, critical=red)
- Variants: status (received=gray, enriching=blue, analyzing=purple, triaged=indigo, escalated=orange, resolved=green)
- Small pill shape with colored background and white text
- CRITICAL variant has subtle pulse animation

#### Card (src/components/ui/card.tsx)
- Glass-morphism effect: semi-transparent background, backdrop-blur
- Subtle border (slate-700/50)
- Rounded corners (lg)
- Hover state: slight scale(1.01) + increased shadow
- Accepts: title, description, children, className

#### Button (src/components/ui/button.tsx)
- Variants: primary (indigo), secondary (slate), ghost (transparent), danger (red)
- Sizes: sm, md, lg
- Hover/active/focus states
- Loading state with spinner
- Disabled state

#### Skeleton (src/components/ui/skeleton.tsx)
- Animated shimmer loading placeholder
- Variants: text (single line), card (rectangle), circle (avatar)
- Configurable width and height

#### StatusIndicator (src/components/ui/status-indicator.tsx)
- Colored dot: green (healthy), yellow (degraded), red (down), gray (unknown)
- Optional label text next to the dot
- Subtle glow effect on healthy status

#### ProgressBar (src/components/ui/progress-bar.tsx)
- Stepped progress bar (e.g., 5 of 10 steps)
- Filled segments in indigo, unfilled in slate-700
- Percentage label

### Dashboard Placeholder (src/app/page.tsx)
- Simple page showing "Dashboard" title
- 4 placeholder cards with skeleton loading
- Verifies the entire shell is working

### Environment (.env.example)
```
# AI Configuration (optional - mock mode used when absent)
GEMINI_API_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Ensure `npm run dev` starts without errors and the app renders a professional dark-themed enterprise UI.
```

### Expected Output
- Running Next.js app with dark enterprise theme
- Sidebar navigation with 4 routes
- All UI primitives rendered
- Professional aesthetic comparable to Linear/Vercel

### Validation Checklist
- [x] `npm run dev` starts without errors
- [x] App renders at `http://localhost:3000`
- [x] Sidebar shows all 4 navigation items
- [x] Active route is highlighted
- [x] Dark theme is applied consistently
- [x] All UI primitives render correctly
- [x] Inter font is loaded
- [x] Glass-morphism effect visible on cards
- [x] Shimmer animation on skeletons

---

*Implementation Note (Milestone 1):*
Project scaffolded using Next.js 14 App Router, TypeScript, and Tailwind CSS. Applied dark glassmorphism theme, built `AppShell`, `Sidebar`, `Header`, and all reusable UI primitives (`Badge`, `Card`, `Button`, `Skeleton`, `StatusIndicator`, `ProgressBar`). Standardized build config by omitting network-dependent remote font fetches for local system/Inter fallback compatibility during offline builds. Validated with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.

---

## Prompt 2: TypeScript Types & Mock Data ✅

### Purpose
Define the complete type system and create realistic mock data that powers the entire application.

### Prompt

```
Create the TypeScript type system and mock data layer for the Customer Escalation Autopilot.

## TypeScript Interfaces (src/lib/types/index.ts)

Define all interfaces exactly as specified in docs/DATA_MODEL.md. Include every field with proper types. Key interfaces:

1. Customer — HubSpot customer record with: id, email, name, contactName, tier (union: "enterprise"|"smb"|"startup"|"free"), contractValue, employeeCount, industry, region, accountManager, healthScore (0-100), churnRisk (union), openTickets, lastContactDate, createdAt

2. Incident — Central domain object with all nested types: id, title, description, source, status (union of 6 states), severity (union of 4 levels | null), customerEmail, customer (Customer|null), billing (StripeBilling|null), relatedIssues (GitHubIssue[]), aiDecision (AIDecision|null), escalation (EscalationResult|null), executiveSummary (ExecutiveSummary|null), workflowState (WorkflowState), slackEvent (SlackEvent|null), timeline (TimelineEvent[]), timestamps

3. TimelineEvent — id, timestamp, type, title, description, status

4. SlackEvent — eventId, type, channel, channelId, userId, userName, text, customerEmail, timestamp, threadTs

5. HubSpotResponse — success, customer, source, retrievedAt, cached, error

6. StripeResponse — success, billing (StripeBilling), source, retrievedAt, error
   StripeBilling — customerId, subscriptionStatus (union), plan, mrr, totalSpend, lastPaymentDate, lastPaymentAmount, failedPayments, paymentMethod, billingEmail, nextInvoiceDate

7. GitHubIssue — id, number, title, state, body, labels, assignee, repository, url, createdAt, updatedAt, closedAt, relevanceScore

8. LinearTicket — id, identifier, title, description, priority (1-4), status (union), assignee, teamId, labels, incidentId, url, createdAt

9. NotionEntry — id, incidentId, title, severity, customer, customerTier, status, summary, aiConfidence, linearTicket, assignee, impactScope, rootCause, resolution, createdAt, updatedAt, url

10. ExecutiveSummary — id, incidentId, title, severity, customerImpact, technicalSummary, actionsTaken, recommendedNextSteps, timeline, riskAssessment, generatedBy, generatedAt

11. AIDecision — severity, confidence, reasoning, businessImpact, technicalAssessment, recommendedActions, shouldEscalate, escalationReason, executiveSummary, relatedIssueAnalysis, estimatedResolutionTime, riskFactors, model, tokensUsed, latencyMs, analyzedAt

12. EscalationResult — incidentId, escalated, reason, actions (EscalationAction[]), linearTicket, notionEntry, executiveSummary, completedAt, partialFailure, errors
    EscalationAction — action (union of 5), status (union), message, durationMs, error

13. WorkflowState — incidentId, currentStep, steps (WorkflowStep[]), startedAt, completedAt, totalDurationMs, overallStatus
    WorkflowStep — id, name, description, status (union of 5), startedAt, completedAt, durationMs, output, error, icon

14. HealthCheckResponse — service, displayName, status (union of 4), responseTimeMs, lastChecked, lastSuccessful, uptime, consecutiveFailures, error, metadata

Also export input types:
- CreateIncidentInput — customerEmail, description, source
- LinearTicketInput — title, description, priority, labels, incidentId

## Mock Data Files

### src/lib/mock-data/customers.json (5 customers)
1. Acme Corporation — enterprise, $285K ACV, Financial Services, health 72, churn medium
2. TechFlow Solutions — enterprise, $180K ACV, Technology, health 88, churn low
3. GrowthMetrics — smb, $24K ACV, Marketing, health 65, churn high
4. DevStudio Pro — startup, $6K ACV, Software, health 82, churn low
5. OpenBuild Labs — free, $0 ACV, Education, health 45, churn high

### src/lib/mock-data/stripe-accounts.json (5 billing records)
Match customer IDs. Mix of: active, active, past_due, active (trialing), active (free).

### src/lib/mock-data/github-issues.json (10 issues)
Mix of open/closed issues across repositories. Topics: payment processing, API latency, auth failures, data sync, feature requests. Include labels, assignees, relevance scores.

### src/lib/mock-data/incidents.json (5 pre-seeded incidents)
1. Critical — Acme Corp payment processing failure (status: escalated)
2. High — TechFlow API latency spike (status: triaged)
3. Medium — GrowthMetrics data sync delay (status: analyzing)
4. Low — DevStudio feature request (status: resolved)
5. Critical — Acme Corp auth service outage (status: received)

Each incident should have complete data matching the Incident schema, including populated timeline, workflowState, aiDecision, etc. for incidents past the "received" state.

### src/lib/mock-data/ai-responses.json (5 AI analysis responses)
One pre-computed AIDecision for each severity level + one edge case. Each should have realistic reasoning, business impact, recommended actions.

## Utility Functions

### src/lib/utils/constants.ts
- SEVERITY_LEVELS: ['low', 'medium', 'high', 'critical']
- SEVERITY_COLORS: { low: 'green', medium: 'amber', high: 'orange', critical: 'red' }
- STATUS_LABELS: human-readable labels for each status
- SERVICE_NAMES: list of all 8 services
- ESCALATION_RULES: customer tier → minimum severity for escalation

### src/lib/utils/formatters.ts
- formatDate(iso: string): string — "Aug 29, 2026 10:15 AM"
- formatRelativeTime(iso: string): string — "2 hours ago"
- formatCurrency(amount: number): string — "$285,000"
- formatDuration(ms: number): string — "1.2s" or "340ms"
- formatSeverity(level: string): string — "CRITICAL"
- truncateText(text: string, max: number): string
- generateId(prefix: string): string — "inc_01J9N2K4M6P8Q0R2"

Ensure all mock data is internally consistent — customer emails in incidents match customer records, billing data matches customer IDs, etc. TypeScript should compile with zero errors.
```

### Expected Output
- Complete type system in `src/lib/types/index.ts`
- 5 realistic mock data files
- Utility functions for formatting and constants

### Validation Checklist
- [x] `npx tsc --noEmit` passes with zero errors
- [x] All types match DATA_MODEL.md
- [x] Mock data files are valid JSON
- [x] Customer emails are consistent across incidents and customers
- [x] All 4 severity levels represented in incidents
- [x] Formatting functions handle edge cases

---

*Implementation Note (Milestone 2):*
Defined complete domain type interfaces in `src/lib/types/index.ts` matching DATA_MODEL.md. Created 5 mock datasets (`customers.json`, `stripe-accounts.json`, `github-issues.json`, `ai-responses.json`, `incidents.json`) covering all customer tiers, incident statuses, and severity levels with cross-dataset email alignment (`ops@acmecorp.com`, `dev@techflow.io`, `dev@growthmetrics.io`, `hello@devstudio.pro`, `support@openbuild.org`). Created constants (`constants.ts`) and formatting utilities (`formatters.ts`). Verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.

---

## Prompt 3: Integration Adapters ✅

### Purpose
Build the adapter layer with mock implementations for all 7 external service integrations.

### Prompt

```
Build the integration adapter layer with mock implementations for all external services.

## Adapter Interface (src/lib/integrations/types.ts)

Define TypeScript interfaces for each adapter:

```typescript
interface HubSpotAdapter {
  getCustomerByEmail(email: string): Promise<HubSpotResponse>;
  getCustomerById(id: string): Promise<HubSpotResponse>;
  healthCheck(): Promise<HealthCheckResponse>;
}

interface StripeAdapter {
  getBillingStatus(customerId: string): Promise<StripeResponse>;
  healthCheck(): Promise<HealthCheckResponse>;
}

interface GitHubAdapter {
  getRelatedIssues(query: string): Promise<GitHubIssue[]>;
  healthCheck(): Promise<HealthCheckResponse>;
}

interface LinearAdapter {
  createTicket(input: LinearTicketInput): Promise<LinearTicket>;
  healthCheck(): Promise<HealthCheckResponse>;
}

interface SlackAdapter {
  sendNotification(channel: string, message: object): Promise<void>;
  healthCheck(): Promise<HealthCheckResponse>;
}

interface NotionAdapter {
  createIncidentEntry(input: Partial<NotionEntry>): Promise<NotionEntry>;
  healthCheck(): Promise<HealthCheckResponse>;
}

interface EmailAdapter {
  sendSummary(to: string[], summary: ExecutiveSummary): Promise<void>;
  healthCheck(): Promise<HealthCheckResponse>;
}
```

## Mock Implementations

For each adapter (src/lib/integrations/[service].ts):

1. Import the corresponding mock data JSON file
2. Add a configurable simulated delay (100-500ms random) using:
   ```
   const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
   const simulateLatency = () => delay(100 + Math.random() * 400);
   ```
3. Implement each method by reading from mock data
4. Implement healthCheck() returning a realistic HealthCheckResponse
5. Log actions to console with a prefix like "[HubSpot Mock]"
6. Export a singleton instance

### HubSpot (hubspot.ts)
- getCustomerByEmail: find in customers.json by email, return HubSpotResponse wrapper
- getCustomerById: find by id
- Return { success: false, customer: null } for unknown lookups

### Stripe (stripe.ts)
- getBillingStatus: find in stripe-accounts.json by customerId mapping
- Return { success: false, billing: null } for unknown IDs

### GitHub (github.ts)
- getRelatedIssues: search github-issues.json titles and bodies for keyword matches
- Calculate a simple relevance score based on keyword match count
- Sort by relevance score descending

### Linear (linear.ts)
- createTicket: generate a new LinearTicket with auto-incremented identifier (ENG-XXXX)
- Map severity to priority: critical→1, high→2, medium→3, low→4
- Store created tickets in memory for the session

### Slack (slack.ts)
- sendNotification: log the notification to console, no actual sending
- Format: "[Slack Mock] Notification sent to {channel}: {summary}"

### Notion (notion.ts)
- createIncidentEntry: generate a NotionEntry with ID and URL
- Store entries in memory for the session

### Email (email.ts)
- sendSummary: log the email to console
- Format: "[Email Mock] Summary sent to {recipients}: {subject}"

All adapters should be importable as: `import { hubspotAdapter } from '@/lib/integrations/hubspot'`

Refer to docs/DATA_MODEL.md for exact response schemas and docs/ARCHITECTURE.md section 9 for the adapter pattern design.
```

### Expected Output
- 8 files in `src/lib/integrations/`
- Each adapter implements its interface with mock data
- Simulated latency on all methods
- Console logging for all write operations

### Validation Checklist
- [x] All adapters compile without errors
- [x] `hubspotAdapter.getCustomerByEmail("ops@acmecorp.com")` returns Acme Corp
- [x] `stripeAdapter.getBillingStatus(...)` returns billing data
- [x] `githubAdapter.getRelatedIssues("payment")` returns relevant issues
- [x] `linearAdapter.createTicket(...)` returns a ticket with ENG-XXXX identifier
- [x] All adapters have working healthCheck() methods
- [x] Console shows mock logs for write operations

---

*Implementation Note (Milestone 3):*
Implemented all 7 integration adapters following the `api-integration` and `api-health-monitoring` SkillPatch patterns in `src/lib/integrations/`. Defined adapter contract interfaces in `types.ts`. Built singleton mock implementations (`hubspot.ts`, `stripe.ts`, `github.ts`, `linear.ts`, `slack.ts`, `notion.ts`, `email.ts`) that load mock JSON datasets, simulate 100–500ms API latency, log write operations, and return structured `HealthCheckResponse` objects. Verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.

---

## Prompt 4: Service Layer — AI Pipeline, Triage, Escalation & Orchestrator ✅

### Purpose
Build the core business logic: AI pipeline, triage engine, escalation dispatcher, and the main workflow orchestrator.

### Prompt

```
Build the service layer with four core services that power the incident processing pipeline.

## 1. AI Pipeline Service (src/lib/services/ai-pipeline.ts)

### analyzeIncident(context: { incident description, customer, billing, relatedIssues }): Promise<AIDecision>

**Mock mode (default — no GEMINI_API_KEY):**
- Match the incident description against pre-computed AI responses in ai-responses.json
- Use keyword matching: "payment" → critical response, "latency" → high response, "sync" → medium response, "feature" → low response
- If no match, return a medium severity default response
- Simulate 800-1500ms latency

**Live mode (when GEMINI_API_KEY is set in process.env):**
- Build a structured prompt with system instructions and all context
- Call the Gemini 3.7 Flash API via fetch to: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
- Request JSON output matching the AIDecision schema
- Parse and validate the response
- Fall back to mock mode if the API call fails

### generateExecutiveSummary(incident: Incident): Promise<ExecutiveSummary>
- In mock mode, build the summary from templates using incident data
- In live mode, call Gemini with a summary generation prompt
- Return a complete ExecutiveSummary object

### Internal: buildPrompt(context): string
- Build the full system prompt + context as described in docs/ARCHITECTURE.md section 6

## 2. Triage Service (src/lib/services/triage.ts)

### classifySeverity(aiDecision: AIDecision, customer: Customer | null): { severity, shouldEscalate, reason }

Apply these escalation rules:
- Enterprise customers: escalate at severity Medium or above
- SMB customers: escalate at severity High or above
- Startup customers: escalate at severity Critical only
- Free customers: escalate at severity Critical only
- OVERRIDE: If AI confidence > 0.9 AND severity >= High, always escalate regardless of tier
- If customer is null (not found), treat as SMB tier for escalation rules

The triage service should use the AI's severity as the primary classification but can override it based on:
- If customer is Enterprise with health score < 50 AND severity is Medium, upgrade to High
- If customer has churnRisk "high" AND severity is Medium, upgrade to High

Return the final severity, escalation boolean, and human-readable reason.

## 3. Escalation Service (src/lib/services/escalation.ts)

### executeEscalation(incident: Incident): Promise<EscalationResult>

Execute these 5 actions in sequence, tracking each one's result:

1. **Create Linear Ticket** — call linearAdapter.createTicket() with formatted title, description (markdown with all context), priority mapped from severity, labels
2. **Notify Slack** — call slackAdapter.sendNotification() to #engineering-critical channel
3. **Generate Executive Summary** — call aiPipeline.generateExecutiveSummary()
4. **Update Notion** — call notionAdapter.createIncidentEntry() with incident data
5. **Send Email** — call emailAdapter.sendSummary() to ["leadership@company.com"]

For each action:
- Record start time, end time, duration
- Catch errors and continue with remaining actions (don't fail all if one fails)
- Record individual action status (success/failed/skipped)

Return an EscalationResult with all action statuses, the created ticket, notion entry, and summary.

## 4. Orchestrator Service (src/lib/services/orchestrator.ts)

This is the main workflow engine. It maintains an in-memory store of incidents.

### processIncident(input: CreateIncidentInput | SlackEvent): Promise<Incident>

1. **Create incident** — Generate ID, set status "received", initialize empty WorkflowState with all 10 steps as "pending", create first timeline event
2. **Parse input** — Extract customerEmail and description. If SlackEvent, extract from message text
3. **Enrich — HubSpot** — Set step status to "running", call hubspotAdapter.getCustomerByEmail(), set step "completed" with output, add timeline event. On failure: set step "failed", continue
4. **Enrich — Stripe** — Same pattern with stripeAdapter.getBillingStatus(). Use customer.id from HubSpot result
5. **Enrich — GitHub** — Same pattern with githubAdapter.getRelatedIssues(). Search with incident description keywords
6. **AI Analysis** — Call aiPipeline.analyzeIncident() with all enriched context. Set severity on incident
7. **Triage** — Call triageService.classifySeverity(). Update severity if overridden. Determine shouldEscalate
8. **Escalation (conditional)** — If shouldEscalate, call escalationService.executeEscalation(). Set status "escalated". Otherwise set status "resolved"
9. **Finalize** — Set final status, calculate total duration, update workflow overallStatus

Important: Update the incident's workflowState and timeline at every step. Each step should have real timestamps and durations.

### getIncidents(filters?): Incident[]
Return all incidents from the in-memory store, optionally filtered by severity or status.

### getIncidentById(id: string): Incident | null
Return a single incident by ID.

Store incidents in a module-level Map<string, Incident>. Pre-populate with the incidents from incidents.json on first access.

Refer to docs/ARCHITECTURE.md sections 6, 11, 13 for pipeline design, state machine, and service architecture. Refer to docs/DATA_MODEL.md for all schemas.
```

### Expected Output
- 4 service files in `src/lib/services/`
- Full pipeline executes end-to-end
- WorkflowState tracks every step
- Timeline events generated

### Validation Checklist
- [x] All services compile without errors
- [x] `orchestrator.processIncident({ customerEmail: "ops@acmecorp.com", description: "Payment processing failing", source: "manual" })` produces a fully populated Incident
- [x] AI pipeline returns valid AIDecision in mock mode
- [x] Triage correctly applies escalation rules per tier
- [x] Escalation executes all 5 actions
- [x] WorkflowState has all 10 steps with timestamps
- [x] Timeline has events for every step
- [x] Graceful degradation when enrichment fails

---

*Implementation Note (Milestone 4):*
Implemented all 4 core business logic services in `src/lib/services/`: `ai-pipeline.ts` (Gemini 3.7 Flash structured JSON prompt generator + live fetch with intelligent mock fallback), `triage.ts` (customer tier escalation rules + high confidence & health risk overrides), `escalation.ts` (action dispatcher for Linear, Slack, Notion, and Email with isolated error handling), and `orchestrator.ts` (end-to-end 10-step pipeline state machine with global store dev persistence, timeline event generation, and step timing tracking). Verified with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.

---

## Prompt 5: API Routes ✅

### Purpose
Create all Next.js API routes that expose the service layer.

### Prompt

```
Create all Next.js API routes that expose the service layer to the frontend.

## API Error Response Format

All error responses must follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Routes

### POST /api/webhook/slack (src/app/api/webhook/slack/route.ts)
- Parse request body as SlackEvent
- Validate required fields: text, customerEmail
- Call orchestrator.processIncident(slackEvent)
- Return 202 with { incidentId: string, status: "processing" }
- On validation error, return 400

### GET /api/incidents (src/app/api/incidents/route.ts)
- Call orchestrator.getIncidents()
- Support query params: ?severity=critical, ?status=escalated, ?limit=20
- Filter incidents by params if provided
- Sort by createdAt descending (newest first)
- Return 200 with { incidents: Incident[], total: number }

### POST /api/incidents (src/app/api/incidents/route.ts)
- Parse request body as CreateIncidentInput: { customerEmail, description, source }
- Validate required fields
- Call orchestrator.processIncident(input)
- Return 201 with the full Incident object
- On validation error, return 400

### GET /api/incidents/[id] (src/app/api/incidents/[id]/route.ts)
- Extract ID from route params
- Call orchestrator.getIncidentById(id)
- Return 200 with the Incident
- If not found, return 404

### POST /api/escalate (src/app/api/escalate/route.ts)
- Parse request body: { incidentId: string }
- Get incident by ID
- If not found, return 404
- Call escalationService.executeEscalation(incident)
- Return 200 with EscalationResult

### GET /api/health (src/app/api/health/route.ts)
- Create health monitor utility (src/lib/utils/health-monitor.ts) that:
  - Calls healthCheck() on all 8 adapters (hubspot, stripe, github, linear, slack, notion, email, gemini)
  - Runs all checks in parallel with Promise.allSettled
  - Returns array of HealthCheckResponse objects
  - For the Gemini adapter, check if GEMINI_API_KEY is set and report mode (mock/live)
- Return 200 with { services: HealthCheckResponse[], overall: "operational" | "degraded" | "down" }
- Overall status: "operational" if all healthy, "degraded" if any degraded, "down" if any down

Wrap all route handlers in try-catch blocks. Log errors to console. Return consistent error format on unexpected errors (500).

Refer to docs/ARCHITECTURE.md section 5 for API route design and docs/DATA_MODEL.md for response schemas.
```

### Expected Output
- 6 API route files
- Health monitor utility
- All routes functional

### Validation Checklist
- [x] `curl http://localhost:3000/api/incidents` returns incident list
- [x] `curl -X POST http://localhost:3000/api/incidents -H 'Content-Type: application/json' -d '{"customerEmail":"ops@acmecorp.com","description":"Test incident","source":"manual"}'` creates an incident
- [x] `curl http://localhost:3000/api/incidents/{id}` returns single incident
- [x] `curl http://localhost:3000/api/health` returns 8 service statuses
- [x] Error responses follow consistent format
- [x] TypeScript compiles

---

*Implementation Note (Milestone 5):*
Created 5 Next.js App Router API endpoints (`src/app/api/webhook/slack/route.ts`, `src/app/api/incidents/route.ts`, `src/app/api/incidents/[id]/route.ts`, `src/app/api/escalate/route.ts`, `src/app/api/health/route.ts`) and `src/lib/utils/health-monitor.ts`. Endpoints interface with `orchestratorService`, `escalationService`, and all 8 integration adapters, following consistent error response formatting `{ error: { code, message, details } }`. Verified with `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

---

## Prompt 6: Dashboard Page

### Purpose
Build the main dashboard with stats, recent incidents, and quick actions.

### Prompt

```
Build the Dashboard page — the first thing users see when they open the application.

## Dashboard Page (src/app/page.tsx)
Fetch data from GET /api/incidents on the server side (React Server Component) or with useEffect on the client. Display the following 4 sections:

## 1. Stats Grid (src/components/dashboard/stats-grid.tsx)
Four metric cards in a 4-column grid (responsive: 2 cols on tablet, 1 on mobile):

- **Total Incidents** — count of all incidents, icon: 🚨, color: indigo
- **Critical** — count of critical severity incidents, icon: 🔴, color: red
- **Avg Response Time** — average totalDurationMs across all incidents, formatted as "X.Xs", icon: ⚡, color: amber
- **Active Escalations** — count of incidents with status "escalated", icon: 📢, color: orange

Each card should:
- Show the metric value with large bold text
- Show the label below in smaller muted text
- Have a colored icon/accent
- Use the Card component from ui/
- Animate the number from 0 to actual value on mount (simple CSS counter animation or useEffect)

## 2. Recent Incidents (src/components/dashboard/recent-incidents.tsx)
A table/list showing the 5 most recent incidents:

Columns: Title, Customer, Severity (Badge), Status (Badge), Time (relative)

- Each row is clickable → navigates to /incidents/[id] using Next.js Link
- Show severity badge with appropriate color
- Show status badge
- Time shown as relative ("2 hours ago")
- If no incidents exist, show empty state: "No incidents yet. Create one to get started."

## 3. Severity Distribution (src/components/dashboard/severity-chart.tsx)
A visual bar chart showing the count of incidents per severity level:
- Horizontal bars with severity color fills
- Label on left, count on right
- Bar width proportional to count
- CSS-only (no charting library)
- If no incidents, show "No data available"

## 4. Quick Actions (src/components/dashboard/quick-actions.tsx)
Two prominent action buttons:
- "⚡ New Incident" — opens the new incident form (for now, navigate to /incidents with a ?new=true query param, or show an inline form placeholder)
- "💚 Check Health" — navigates to /health

Layout: Place Stats Grid at top, then a 2-column grid with Recent Incidents (wider, left) and Severity Chart + Quick Actions stacked (narrower, right).

Show Skeleton loading states while data is being fetched. Use the Skeleton component from ui/.

The dashboard should look like a premium enterprise monitoring tool. Dark theme, glass cards, clean typography, proper spacing.
```

### Expected Output
- Complete dashboard page with all 4 sections
- Data fetched from API
- Loading and empty states

### Validation Checklist
- [ ] Dashboard renders with stats from pre-seeded incidents
- [ ] Stats show correct counts
- [ ] Recent incidents table has clickable rows
- [ ] Severity chart shows distribution
- [ ] Quick action buttons work
- [ ] Loading skeletons display during fetch
- [ ] Empty state displays when no incidents

---

## Prompt 7: Incident List & Detail Pages

### Purpose
Build the incident browsing and detail view pages.

### Prompt

```
Build the Incident List and Incident Detail pages.

## Incident List Page (src/app/incidents/page.tsx)

A page showing all incidents with filtering controls.

### Filters
- **Severity dropdown** at top: "All Severities", Low, Medium, High, Critical
- **Status tabs** below: All | Active (received, enriching, analyzing) | Triaged | Escalated | Resolved
- Filters work client-side by calling GET /api/incidents with query params

### Incident Cards
- Use a responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop
- Each card (src/components/incidents/incident-card.tsx) shows:
  - Severity badge (top left)
  - Status badge (top right)
  - Title (large, truncated to 2 lines)
  - Customer name (if available) with tier badge
  - Brief description (truncated to 100 chars)
  - Relative time ("2 hours ago")
  - Source indicator (Slack icon / Manual)
- Card is clickable → navigates to /incidents/[id]
- Card hover effect (scale + shadow lift)

### States
- Loading: Grid of 6 Skeleton cards
- Empty: "No incidents match your filters" with a clear-filter button
- Error: Error banner with retry button

## Incident Detail Page (src/app/incidents/[id]/page.tsx)

A comprehensive view of a single incident. Fetch from GET /api/incidents/[id].

### Layout
- Top: Back button (← Back to Incidents) + Incident title + Severity badge + Status badge
- Below: Two-column layout (main content left, sidebar right)

### Main Content (left, wider)

#### Customer Context (src/components/incidents/customer-context.tsx)
Card with key-value grid:
- Company Name (with tier badge)
- Contact Person
- Contract Value (formatted currency)
- Industry
- Region
- Employee Count
- Health Score (colored progress bar: green >70, yellow 40-70, red <40)
- Churn Risk (badge: low=green, medium=yellow, high=red)
- Open Tickets count
- Account Manager
- Last Contact (relative time)

If customer is null, show "Customer not found" message.

#### AI Reasoning (src/components/incidents/ai-reasoning.tsx)
Card with:
- Severity badge (large) + Confidence bar (0-100% with color: green >80%, yellow 50-80%, red <50%)
- "AI Analysis" section heading
- Full reasoning text (multi-line)
- Business Impact section
- Technical Assessment section
- Recommended Actions (bulleted list)
- Risk Factors (bulleted list, each with a ⚠️ icon)
- Estimated Resolution Time
- Footer: Model used, tokens, latency

If aiDecision is null, show "Analysis pending..." with a spinner.

#### Escalation Actions (src/components/incidents/escalation-actions.tsx)
Card showing the 5 escalation actions in a list:
- Each action: icon + name + status (✅ Success / ❌ Failed / ⏭️ Skipped) + duration
- If the ticket was created, show the identifier as a link
- If escalation is null, show "No escalation performed" or "Escalation pending..."

### Sidebar (right, narrower)

#### Executive Summary (src/components/incidents/exec-summary.tsx)
Card with formatted summary:
- Title/headline in bold
- Customer Impact section
- Technical Summary section
- Actions Taken (numbered list)
- Recommended Next Steps (numbered list)
- Risk Assessment
- Generated by badge (Gemini / Rule-based)

If no summary, show "Summary pending..."

#### Incident Timeline (src/components/incidents/incident-timeline.tsx)
Vertical timeline with:
- Each event: timestamp (small, muted) + colored dot + title (bold) + description
- Dot colors: green (success), red (error), yellow (warning)
- Connecting vertical line between events
- Most recent event at bottom (chronological order)

### Error States
- 404: "Incident not found" with link back to incident list
- API error: Error banner with retry button

All components should have proper loading states using Skeleton.
```

### Expected Output
- Incident list page with filtering
- Rich incident detail page with 6 component sections
- Loading, empty, and error states

### Validation Checklist
- [ ] Incident list shows pre-seeded incidents
- [ ] Severity filter works correctly
- [ ] Status tabs filter correctly
- [ ] Clicking an incident navigates to detail page
- [ ] Detail page shows all sections with data
- [ ] Customer context displays all fields
- [ ] AI reasoning shows severity, confidence, and full analysis
- [ ] Escalation actions show individual results
- [ ] Executive summary renders all sections
- [ ] Timeline shows events in chronological order
- [ ] 404 page displays for unknown incident IDs
- [ ] Loading skeletons display during fetch

---

## Prompt 8: Workflow Visualization Page

### Purpose
Build the visual pipeline view that animates incident processing in real-time.

### Prompt

```
Build the Workflow Visualization page — the most visually impressive page for the demo.

## Workflow Page (src/app/workflow/page.tsx)

### Top Bar
- Dropdown to select which incident's workflow to view (list all incidents by title)
- "Process New Incident" button that opens the New Incident form

### Pipeline Visualization (src/components/workflow/pipeline-view.tsx)

Display the 10 workflow steps as a vertical pipeline with visual connectors:

Steps in order:
1. 💬 Parse Slack Event
2. 👤 Retrieve Customer (HubSpot)
3. 💳 Retrieve Billing (Stripe)
4. 🔧 Retrieve Issues (GitHub)
5. 🤖 AI Analysis (Gemini)
6. 🎫 Create Linear Ticket
7. 📢 Notify Engineering (Slack)
8. 📋 Generate Summary
9. 📓 Update Notion
10. 📧 Send Email

### Individual Step (src/components/workflow/workflow-step.tsx)

Each step displays as a horizontal card in the pipeline:

Layout: [Icon] [Name] ─── [Status Indicator] [Duration]

Status states with visual treatments:
- **Pending**: Gray background, muted text, empty circle icon
- **Running**: Blue background with pulse/glow animation, spinning indicator, "Processing..." text
- **Completed**: Green left border, check icon (✓), green text, duration shown
- **Failed**: Red left border, X icon (✗), red text, error message
- **Skipped**: Gray italic text, skip icon (⏭️)

### Connectors
Between each step, draw a vertical connector line:
- Solid green line for completed connections
- Dotted gray line for pending connections
- Animated dashed blue line for the currently active connection

### Step Detail (src/components/workflow/step-detail.tsx)
Clicking a step expands it to show:
- Full description of what the step does
- Output text (e.g., "Acme Corporation (Enterprise, $285K ACV)")
- Start time, end time, duration
- Error message if failed
- Smooth expand/collapse animation (CSS transition on max-height)

### Live Polling
When viewing an actively processing incident (status not "resolved"):
- Poll GET /api/incidents/[id] every 2 seconds
- Update step statuses in real-time as they complete
- Stop polling when overallStatus is "completed" or "failed"

### Pipeline Summary (bottom)
After all steps complete, show a summary card:
- Overall status (Completed / Failed / Partial)
- Total duration
- Steps completed count
- Steps failed count (if any)
- Link to "View Full Incident Detail →"

### Visual Design
- The pipeline should feel like a CI/CD deployment view (GitHub Actions, Vercel)
- Dark background with step cards having slight elevation
- Color progression: gray → blue → green as steps complete
- Smooth animations throughout
- The running step should have a prominent pulsing glow effect
```

### Expected Output
- Visual pipeline with 10 steps
- Animated step progression
- Click-to-expand detail panels
- Live polling during active processing

### Validation Checklist
- [ ] Pipeline shows all 10 steps
- [ ] Pre-seeded incidents display correct step statuses
- [ ] Completed steps show green with duration
- [ ] Pending steps show gray
- [ ] Click expands/collapses step details
- [ ] Connectors show between steps
- [ ] Incident selector dropdown works
- [ ] "Process New Incident" button is present
- [ ] Pipeline summary shows at bottom
- [ ] Animations are smooth and visually appealing

---

## Prompt 9: Health Dashboard

### Purpose
Build the service health monitoring dashboard.

### Prompt

```
Build the Service Health Dashboard page.

## Health Page (src/app/health/page.tsx)

### Overall Status Banner (top)
A full-width banner showing overall system health:
- "All Systems Operational" (green) — if all services are healthy
- "Partial System Degradation" (yellow) — if any service is degraded
- "Major System Outage" (red) — if any service is down
- Icon + text + last checked time
- "Refresh Now" button (calls the health API again)

### Service Grid
A responsive grid (4 cols desktop, 2 cols tablet, 1 col mobile) of service health cards.

8 services to display:
1. HubSpot CRM (icon: 👤)
2. Stripe Billing (icon: 💳)
3. GitHub Issues (icon: 🔧)
4. Linear (icon: 🎫)
5. Slack (icon: 📢)
6. Notion (icon: 📓)
7. Email Service (icon: 📧)
8. Gemini AI (icon: 🤖)

Each service card shows:
- Service icon + display name (header)
- Large status indicator dot (green/yellow/red) with label ("Healthy"/"Degraded"/"Down")
- Response time: "145ms" (color coded: green <200ms, yellow 200-1000ms, red >1000ms)
- Uptime: "99.8%" with a thin progress bar underneath
- Last checked: relative time ("30 seconds ago")
- If degraded/down: error message in red text below
- Metadata: key stats from the metadata object (e.g., "Records: 5", "Mode: mock")

### Auto-Refresh
- Auto-refresh every 30 seconds using setInterval
- Show a countdown or subtle indicator of when the next refresh occurs
- "Auto-refresh: 25s" text in the corner

### Loading State
While fetching, show 8 skeleton cards in the grid.

Fetch data from GET /api/health. The health endpoint should already be implemented from Prompt 5.

This page demonstrates the api-health-monitoring SkillPatch pattern in the UI.
```

### Expected Output
- Health dashboard with 8 service cards
- Overall status banner
- Auto-refresh functionality

### Validation Checklist
- [ ] Health page shows all 8 services
- [ ] Status indicators show correct colors
- [ ] Response times are displayed
- [ ] Uptime percentages are shown
- [ ] Overall status banner reflects worst service status
- [ ] "Refresh Now" button triggers immediate check
- [ ] Auto-refresh works every 30 seconds
- [ ] Loading skeletons display during fetch

---

## Prompt 10: New Incident Form & Demo Flow

### Purpose
Build the incident creation form with demo presets and wire up the complete demo flow.

### Prompt

```
Build the New Incident Form and wire up the complete demo experience.

## New Incident Form (src/components/incidents/new-incident-form.tsx)

A polished form component that can be rendered as a modal or inline section.

### Demo Scenario Selector (top of form)
A prominent "Load Demo Scenario" dropdown with 3 preset scenarios:

1. "🚨 Critical: Enterprise Payment Failure"
   - customerEmail: "ops@acmecorp.com"
   - description: "Acme Corp reporting batch payment processing failures for the past 2 hours. Approximately 1,200 transactions affected. Finance team unable to close end-of-month. Customer threatening VP-level escalation."
   - source: "slack"

2. "⚠️ High: SMB API Latency"
   - customerEmail: "dev@growthmetrics.io"
   - description: "GrowthMetrics reporting API response times exceeding 5 seconds on their analytics endpoints. Dashboard loading is severely impacted. Multiple team members affected."
   - source: "slack"

3. "ℹ️ Low: Startup Feature Request"
   - customerEmail: "hello@devstudio.pro"
   - description: "DevStudio Pro requesting webhook support for their CI/CD pipeline integration. Not blocking any current workflows."
   - source: "manual"

Selecting a scenario pre-fills all form fields with an animation.

### Form Fields
- **Customer Email** — text input with autocomplete suggestions from known customer emails. Show customer name + tier badge in suggestions
- **Description** — textarea with 4-5 rows, placeholder: "Describe the incident..."
- **Source** — select dropdown: "Slack Message" / "Manual Report"

### Form Actions
- "Process Incident ⚡" primary button — submits the form
- "Clear" ghost button — resets all fields

### Submission Flow
1. Validate: customerEmail and description required
2. Show loading state on submit button (spinner + "Processing...")
3. POST to /api/incidents with { customerEmail, description, source }
4. On success: navigate to /workflow?incident=[returned-id]
5. On error: show error toast/banner

### Integration Points
Wire this form into:
1. **Dashboard** — "New Incident" quick action button opens the form (use a modal, slide-over panel, or navigate to /incidents?new=true)
2. **Workflow page** — "Process New Incident" button opens the form
3. **Incident list** — "New Incident" button in the page header

### Demo Flow Experience
After form submission, the user should be redirected to the Workflow page where they see the pipeline animate step-by-step as the incident processes. After completion, a "View Incident Detail →" link takes them to the full incident detail page.

The form should be beautiful — this is the primary interaction for the hackathon demo. Use proper field styling, focus states, validation indicators, and smooth transitions.
```

### Expected Output
- Polished incident creation form
- 3 demo scenario presets
- Wired into dashboard, workflow, and incidents pages
- Smooth submission → redirect → animation flow

### Validation Checklist
- [ ] Form renders with all fields
- [ ] Demo scenario dropdown pre-fills form fields
- [ ] Form validation works (required fields)
- [ ] Submit creates incident and redirects to workflow
- [ ] Customer email autocomplete shows known customers
- [ ] Form is accessible from Dashboard, Workflow, and Incidents pages
- [ ] Loading state displays during submission
- [ ] Error state displays on failure
- [ ] Full demo flow works: form → submit → workflow → detail

---

## Prompt 11: Polish, Animations & Final Build

### Purpose
Final polish pass — micro-animations, transitions, error boundaries, metadata, and build verification.

### Prompt

```
Final polish pass for the Customer Escalation Autopilot hackathon demo.

## 1. Micro-Animations

Add these subtle animations throughout the app:

### Card Hover Effects
- All Card components: transform scale(1.01) on hover with transition duration 200ms
- Increased box-shadow on hover (subtle glow effect matching card accent color)

### Severity Badge Animations
- CRITICAL badges: subtle CSS pulse animation (scale 1.0 → 1.05 with red glow)
- Add @keyframes pulse-critical in globals.css

### Page Transitions
- Main content area: fade-in animation on route change (opacity 0→1, translateY 8px→0, duration 300ms)
- Add @keyframes fade-in in globals.css
- Apply to all page.tsx root elements

### Dashboard Number Animation
- Stats grid numbers: count-up animation from 0 to actual value over 800ms
- Use a simple useEffect with requestAnimationFrame or setInterval

### Workflow Step Animations
- Step expand/collapse: smooth height transition (max-height with overflow hidden, duration 300ms)
- Running step: pulse-glow animation on the border/background

## 2. Empty States

### Incident List Empty
- Large icon (📋 or illustration)
- "No incidents yet"
- "Create your first incident to see the escalation pipeline in action."
- "New Incident" button

### Dashboard Empty
- Stats show 0 values
- Recent incidents section shows "No incidents recorded yet"
- Severity chart shows "No data available"

## 3. Error Boundaries

Add a client-side error boundary component (src/components/ui/error-boundary.tsx):
- Catches React rendering errors
- Shows a styled error card with the error message
- "Retry" button that resets the error boundary
- Wrap each major section in the Incident Detail page with an error boundary

## 4. SEO & Metadata

Update src/app/layout.tsx with:
- title: "Customer Escalation Autopilot | AI-Powered Incident Triage"
- description: "Automate customer escalation workflows with AI-powered severity analysis, intelligent routing, and executive summary generation."
- OpenGraph tags (title, description, type: "website")

Add per-page metadata exports:
- /incidents: "Incidents | Customer Escalation Autopilot"
- /incidents/[id]: "Incident Detail | Customer Escalation Autopilot"
- /workflow: "Workflow Pipeline | Customer Escalation Autopilot"
- /health: "Service Health | Customer Escalation Autopilot"

## 5. Root README

Copy docs/README.md to the project root as README.md so it renders on GitHub.

## 6. Build Verification

Run these commands and fix any issues:
- `npx tsc --noEmit` — zero TypeScript errors
- `npm run build` — successful production build
- `npm run lint` — no critical lint errors

## 7. End-to-End Demo Test

Test this complete flow:
1. Open Dashboard → verify stats and recent incidents render
2. Click "New Incident" → verify form opens
3. Select "Critical: Enterprise Payment Failure" demo scenario → verify fields populate
4. Submit → verify redirect to Workflow page
5. Verify pipeline steps animate through to completion
6. Click "View Incident Detail" → verify all sections populated
7. Navigate to Health → verify all 8 services shown
8. Return to Dashboard → verify new incident appears in recent list
9. Navigate to Incidents → verify the new incident appears with correct severity
10. Filter by severity "Critical" → verify it shows

Fix any issues found during this test.
```

### Expected Output
- Smooth micro-animations throughout
- Empty and error states
- SEO metadata
- Successful build
- Working demo flow

### Validation Checklist
- [ ] Card hover effects work
- [ ] CRITICAL badges pulse
- [ ] Page fade-in animation works
- [ ] Dashboard number animation works
- [ ] Workflow step expand/collapse is smooth
- [ ] Empty states display correctly
- [ ] Error boundary catches and displays errors
- [ ] All pages have proper `<title>` tags
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] Full demo flow works end-to-end without errors

---

## Prompt Sequence Summary

| # | Prompt | Focus | Est. Time |
|---|---|---|---|
| 1 | Project Initialization & Design System | Foundation, theme, UI primitives | 2.5h |
| 2 | TypeScript Types & Mock Data | Type system, realistic data | 1.5h |
| 3 | Integration Adapters | Adapter pattern, 7 mock services | 1.5h |
| 4 | Service Layer | AI pipeline, triage, escalation, orchestrator | 2.5h |
| 5 | API Routes | REST endpoints, health monitoring | 1.5h |
| 6 | Dashboard Page | Stats, recent incidents, charts | 2.0h |
| 7 | Incident Pages | List filtering, detail view, 6 components | 3.0h |
| 8 | Workflow Visualization | Animated pipeline, live polling | 2.0h |
| 9 | Health Dashboard | Service status cards, auto-refresh | 1.0h |
| 10 | New Incident Form | Form, demo presets, submission flow | 1.5h |
| 11 | Polish & Build | Animations, SEO, error handling, verification | 2.0h |

**Total: ~21 hours** (includes buffer — target 16–18 hours)

---

## Tips for LatentCode

1. **Read the docs first.** Before starting any prompt, read docs/ARCHITECTURE.md and docs/DATA_MODEL.md for full context.
2. **Build incrementally.** Each prompt produces a testable increment. Verify before moving on.
3. **Don't skip types.** The TypeScript type system is the contract. Get it right in Prompt 2.
4. **Mock data is king.** Realistic mock data makes the demo compelling. Invest in Prompt 2.
5. **Test API routes early.** Use `curl` to verify all routes work before building frontend pages.
6. **Aesthetic matters.** The dark theme and glass-morphism effects are not optional — they're core to the demo impact.
7. **Animations last.** Get everything functional first (Prompts 1–10), then polish (Prompt 11).
8. **When in doubt, check DATA_MODEL.md.** Every JSON shape is defined there.

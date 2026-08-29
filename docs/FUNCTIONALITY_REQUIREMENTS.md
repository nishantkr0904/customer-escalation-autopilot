# FUNCTIONALITY_REQUIREMENTS.md

## Customer Escalation Autopilot — Functional Requirements

Requirements are prioritized into three tiers: **Must Have** (MVP-critical), **Should Have** (expected for a polished demo), and **Nice to Have** (if time permits).

---

## Must Have

These are non-negotiable for a functional hackathon demo.

---

### MH-01: Incident Intake via Form ✅

**Description:**
A user can create a new incident by filling out a form with customer email and incident description. The form drives the demo experience.

**Acceptance Criteria:**
- Form accepts: customer email, description text, source (Slack/Manual)
- Form validates required fields before submission
- Submit triggers the full processing pipeline
- User receives confirmation with incident ID

**Success Condition:**
Submitting the form creates a fully processed incident visible in the incident list.

**Priority:** P0 — Critical

---

### MH-02: Customer Context Retrieval

**Description:**
The system retrieves customer data from HubSpot (mock) using the email address provided in the incident. The customer's tier, contract value, and health score inform the triage decision.

**Acceptance Criteria:**
- Customer lookup by email succeeds for known customers
- Returns full customer profile (name, tier, contract value, health score, churn risk)
- Unknown emails return a graceful "customer not found" response
- Response time displayed in workflow visualization

**Success Condition:**
Customer data is visible in the incident detail page under "Customer Context."

**Priority:** P0 — Critical

---

### MH-03: Billing Status Retrieval

**Description:**
The system retrieves billing data from Stripe (mock) using the customer ID. Billing health informs the AI's business impact assessment.

**Acceptance Criteria:**
- Billing lookup by customer ID returns subscription status, MRR, payment history
- Past-due or failed payment statuses are flagged
- Billing data is included in the AI context prompt

**Success Condition:**
Billing information appears in the incident detail and influences AI reasoning.

**Priority:** P0 — Critical

---

### MH-04: Related Issue Retrieval

**Description:**
The system searches GitHub (mock) for existing issues related to the incident description. Related issues indicate known problems or patterns.

**Acceptance Criteria:**
- Keyword search against GitHub issue titles and bodies
- Returns sorted by relevance score
- Issues include: title, state, labels, repository, URL

**Success Condition:**
Related GitHub issues appear in the incident detail with relevance scores.

**Priority:** P0 — Critical

---

### MH-05: AI Severity Analysis

**Description:**
The system sends aggregated incident context (customer, billing, issues, description) to Gemini 3.7 Flash (or mock) and receives a structured severity assessment.

**Acceptance Criteria:**
- AI receives full context: incident description, customer data, billing data, related issues
- Returns structured JSON: severity, confidence, reasoning, business impact, recommended actions
- Mock mode works without API key
- Live mode works when GEMINI_API_KEY is configured
- Confidence score is between 0.0 and 1.0

**Success Condition:**
AI analysis is visible in the incident detail with severity badge, confidence meter, and full reasoning text.

**Priority:** P0 — Critical

---

### MH-06: Severity Classification

**Description:**
The system classifies incident severity as Low, Medium, High, or Critical based on AI analysis and applies business rules to determine if escalation is needed.

**Acceptance Criteria:**
- Severity levels: Low, Medium, High, Critical
- Visual severity badges with distinct colors (green, yellow, orange, red)
- Severity displayed on incident cards, detail page, and workflow
- Classification considers both AI output and customer tier

**Success Condition:**
Every processed incident has a severity classification visible throughout the UI.

**Priority:** P0 — Critical

---

### MH-07: Escalation Decision Logic

**Description:**
The system determines whether an incident requires escalation based on severity and customer tier.

**Acceptance Criteria:**
- Enterprise customers: escalate at Medium+
- SMB customers: escalate at High+
- Startup/Free customers: escalate at Critical only
- AI confidence > 0.9 with severity >= High always escalates
- Decision reason is logged and visible

**Success Condition:**
Incidents are correctly escalated or not based on the rule matrix, and the decision reason is displayed in the UI.

**Priority:** P0 — Critical

---

### MH-08: Linear Ticket Creation

**Description:**
When escalation is triggered, the system automatically creates an engineering ticket in Linear (mock) with full incident context.

**Acceptance Criteria:**
- Ticket includes: title, description with context, priority (mapped from severity), labels
- Ticket priority: Critical→Urgent(1), High→High(2), Medium→Medium(3), Low→Low(4)
- Ticket is linked to the incident
- Ticket identifier (e.g., ENG-2847) is displayed in escalation results

**Success Condition:**
A Linear ticket appears in the escalation actions section with a clickable identifier.

**Priority:** P0 — Critical

---

### MH-09: Slack Channel Notification

**Description:**
When escalation is triggered, the system posts a structured notification to an engineering Slack channel (mock).

**Acceptance Criteria:**
- Notification includes: severity, customer name, incident summary, Linear ticket link
- Logged to console in mock mode
- Notification result shown in escalation actions

**Success Condition:**
Slack notification action shows "success" in escalation results.

**Priority:** P0 — Critical

---

### MH-10: Executive Summary Generation

**Description:**
The system generates a concise, stakeholder-ready incident summary using AI (or templates in mock mode).

**Acceptance Criteria:**
- Summary includes: headline, customer impact, technical summary, actions taken, recommended next steps
- Formatted for executive consumption (no technical jargon)
- Generated by AI pipeline or template engine

**Success Condition:**
Executive summary card renders on the incident detail page with all sections populated.

**Priority:** P0 — Critical

---

### MH-11: Notion Incident Log Update

**Description:**
When escalation is triggered, the system creates an entry in the Notion incident log (mock).

**Acceptance Criteria:**
- Entry includes: incident title, severity, customer, status, summary, ticket link
- Logged to in-memory store in mock mode
- Result shown in escalation actions

**Success Condition:**
Notion update action shows "success" in escalation results.

**Priority:** P0 — Critical

---

### MH-12: Email Summary

**Description:**
When escalation is triggered, the system sends the executive summary via email (mock).

**Acceptance Criteria:**
- Email sent to configured leadership distribution list
- Includes the full executive summary
- Logged to console in mock mode

**Success Condition:**
Email action shows "success" in escalation results.

**Priority:** P0 — Critical

---

### MH-13: Incident List Page ✅

**Description:**
A page displaying all incidents with severity badges, statuses, and basic filtering.

**Acceptance Criteria:**
- Grid/list of incident cards
- Each card shows: title, customer, severity badge, status, time
- Clickable → navigates to incident detail
- Filter by severity (dropdown)
- Filter by status (tabs)

**Success Condition:**
User can browse, filter, and navigate to any incident from the list page.

**Priority:** P0 — Critical

---

### MH-14: Incident Detail Page ✅

**Description:**
A comprehensive view of a single incident showing all context, AI analysis, and escalation results.

**Acceptance Criteria:**
- Sections: Customer Context, AI Reasoning, Escalation Actions, Executive Summary, Timeline
- All data fetched from API and rendered with appropriate formatting
- Loading states for each section

**Success Condition:**
Complete incident context is visible on a single page.

**Priority:** P0 — Critical

---

### MH-15: Dashboard Page ✅

**Description:**
A summary dashboard showing high-level metrics, recent incidents, and quick actions.

**Acceptance Criteria:**
- Stats grid: Total Incidents, Critical Count, Avg Response Time, Active Escalations
- Recent incidents table (last 5)
- Quick action buttons: New Incident, Check Health

**Success Condition:**
Dashboard provides a meaningful at-a-glance overview of the system.

**Priority:** P0 — Critical

---

### MH-16: Dark Theme Enterprise UI ✅

**Description:**
The entire application uses a dark theme with enterprise-quality design.

**Acceptance Criteria:**
- Consistent dark color palette across all pages
- Inter font for typography
- Glass-morphism card effects
- Professional spacing and layout
- No bright/jarring elements

**Success Condition:**
The application looks like a premium SaaS product (similar to Linear or Vercel aesthetic).

**Priority:** P0 — Critical

---

## Should Have

These make the demo significantly more impressive.

---

### SH-01: Workflow Pipeline Visualization ✅

**Description:**
A visual representation of the incident processing pipeline showing each step's status with animated transitions.

**Acceptance Criteria:**
- Shows all 10 pipeline steps in order with connectors
- Steps animate through states: pending → running → completed/failed
- Click to expand step details (description, output, timing)
- Color coding: gray (pending), blue (running), green (completed), red (failed)

**Success Condition:**
Watching the pipeline process an incident in real-time is visually compelling for a demo.

**Priority:** P1 — High

---

### SH-02: Service Health Dashboard ✅

**Description:**
A dedicated page showing health status for all integrated services.

**Acceptance Criteria:**
- Cards for all 8 services (HubSpot, Stripe, GitHub, Linear, Slack, Notion, Email, Gemini)
- Each card shows: status indicator, response time, uptime %
- Overall system status banner
- Auto-refresh every 30 seconds

**Success Condition:**
Health dashboard demonstrates operational awareness and monitoring capability.

**Priority:** P1 — High

---

### SH-03: Loading Skeleton States ✅

**Description:**
All data-fetching components display skeleton loading states while waiting for API responses.

**Acceptance Criteria:**
- Dashboard stats: skeleton metric cards
- Incident list: skeleton card placeholders
- Incident detail: section-by-section skeletons
- Health dashboard: skeleton service cards
- Shimmer animation on all skeletons

**Success Condition:**
No blank screens during data loading — skeletons provide immediate visual feedback.

**Priority:** P1 — High

---

### SH-04: Incident Timeline Display ✅

**Description:**
A chronological timeline showing every event in the incident lifecycle.

**Acceptance Criteria:**
- Vertical timeline with timestamp, icon, title, description
- Events sorted chronologically (oldest first)
- Status indicators: green (success), red (error), yellow (warning)
- Displays on the incident detail page

**Success Condition:**
Timeline clearly communicates the progression of an incident through the pipeline.

**Priority:** P1 — High

---

### SH-05: Demo Scenario Presets ✅

**Description:**
Pre-configured incident scenarios that can be loaded into the form for instant demo runs.

**Acceptance Criteria:**
- At least 3 scenarios:
  - Critical: Enterprise customer payment failure
  - Medium: SMB API latency issue
  - Low: Startup feature request
- Dropdown selector pre-fills all form fields
- Each scenario produces a different severity and escalation outcome

**Success Condition:**
Demo can be run repeatedly with different scenarios showing different outcomes.

**Priority:** P1 — High

---

### SH-06: API Error Handling ✅

**Description:**
All API routes return consistent error responses, and the frontend displays meaningful error messages.

**Acceptance Criteria:**
- Error format: `{ error: { code, message, details } }`
- Frontend shows inline error banners with retry buttons
- Partial failures in escalation are reported (not silent)
- 404 pages for unknown incident IDs

**Success Condition:**
Errors are handled gracefully without crashing or showing blank screens.

**Priority:** P1 — High

---

### SH-07: Responsive Sidebar Navigation ✅

**Description:**
The sidebar collapses to icons or a hamburger menu on smaller viewports.

**Acceptance Criteria:**
- Full sidebar on desktop (≥1280px)
- Collapsed icon-only sidebar on tablet (1024–1279px)
- Hamburger/overlay on mobile (<1024px)
- Active route highlighted

**Success Condition:**
Application is usable on laptop, tablet, and phone-sized viewports.

**Priority:** P1 — High

---

### SH-08: Confidence Score Visualization ✅

**Description:**
The AI confidence score is displayed as a visual meter or progress bar, not just a number.

**Acceptance Criteria:**
- Animated fill bar from 0% to actual value
- Color coded: green (>0.8), yellow (0.5-0.8), red (<0.5)
- Displayed alongside severity badge in AI Reasoning section

**Success Condition:**
Confidence score is immediately visually interpretable.

**Priority:** P1 — High

---

## Nice to Have

These elevate the demo if time permits.

---

### NH-01: Micro-Animations

**Description:**
Subtle animations that make the interface feel alive and responsive.

**Details:**
- Card hover: scale(1.02) + shadow increase
- Critical severity badge: subtle red pulse animation
- Stats counters: animate from 0 to value on load
- Workflow step expand/collapse: smooth height transition
- Page content: fade-in on navigation

**Success Condition:**
Interface feels polished and dynamic, not static.

**Priority:** P2 — Medium

---

### NH-02: Severity Distribution Chart

**Description:**
A visual chart on the dashboard showing the distribution of incidents across severity levels.

**Details:**
- CSS-only horizontal or donut chart (no library required)
- Color-coded bars: green (Low), yellow (Medium), orange (High), red (Critical)
- Shows count and percentage for each level

**Success Condition:**
Dashboard has a visual data element beyond numbers and tables.

**Priority:** P2 — Medium

---

### NH-03: Graceful Degradation UX

**Description:**
When a service is unavailable, the UI clearly indicates which data is missing without breaking the experience.

**Details:**
- "Unavailable" badges on missing data sections
- Partial incident details still render (show what's available)
- Health dashboard reflects degraded status
- Fallback to rule-based triage when AI is unavailable

**Success Condition:**
Application remains useful even when some integrations are down.

**Priority:** P2 — Medium

---

### NH-04: Breadcrumb Navigation ✅

**Description:**
Contextual breadcrumbs in the header showing the current location in the page hierarchy.

**Details:**
- Dashboard → (no breadcrumb, just title)
- Incidents → Incidents
- Incidents → [Customer Name] Incident Detail
- Workflow → Workflow
- Health → Service Health

**Success Condition:**
User always knows where they are in the application.

**Priority:** P2 — Medium

---

### NH-05: Real Gemini API Integration

**Description:**
When `GEMINI_API_KEY` is set in `.env.local`, the AI pipeline calls the actual Gemini 3.7 Flash API instead of using mock responses.

**Details:**
- Check for `GEMINI_API_KEY` environment variable at startup
- Build structured prompt with all context
- Parse Gemini's JSON response into AIDecision
- Fall back to mock if API call fails

**Success Condition:**
Live Gemini integration produces real AI analysis when API key is available.

**Priority:** P2 — Medium

---

### NH-06: Toast Notifications

**Description:**
Brief toast notifications for important user actions and system events.

**Details:**
- "Incident created successfully" (success toast)
- "Escalation complete" (success toast)
- "Health check refreshed" (info toast)
- "API error occurred" (error toast)
- Auto-dismiss after 5 seconds

**Success Condition:**
User receives clear feedback for all significant actions.

**Priority:** P3 — Low

---

### NH-07: Keyboard Navigation

**Description:**
Keyboard shortcuts for common actions.

**Details:**
- `N` — New incident form
- `H` — Navigate to health
- `D` — Navigate to dashboard
- `/` — Focus search/filter
- `Esc` — Close modals

**Success Condition:**
Power users can navigate without touching the mouse.

**Priority:** P3 — Low

---

### NH-08: Print-Ready Executive Summary

**Description:**
Executive summary can be exported or printed in a clean format.

**Details:**
- Print stylesheet hides navigation and chrome
- Summary renders as a clean, branded document
- Optional "Copy to Clipboard" for the summary text

**Success Condition:**
Executive summary looks professional when printed or copied.

**Priority:** P3 — Low

---

## Requirements Matrix

| ID | Requirement | Priority | Milestone | SkillPatch |
|---|---|---|---|---|
| MH-01 | Incident Intake via Form | P0 | M10 | api-integration |
| MH-02 | Customer Context Retrieval | P0 | M3 | api-integration |
| MH-03 | Billing Status Retrieval | P0 | M3 | api-integration |
| MH-04 | Related Issue Retrieval | P0 | M3 | api-integration |
| MH-05 | AI Severity Analysis | P0 | M4 | api-ai-augmented |
| MH-06 | Severity Classification | P0 | M4 | triage |
| MH-07 | Escalation Decision Logic | P0 | M4 | triage |
| MH-08 | Linear Ticket Creation | P0 | M4 | api-integration |
| MH-09 | Slack Channel Notification | P0 | M4 | api-integration |
| MH-10 | Executive Summary Generation | P0 | M4 | api-ai-augmented |
| MH-11 | Notion Incident Log Update | P0 | M4 | api-integration |
| MH-12 | Email Summary | P0 | M4 | api-integration |
| MH-13 | Incident List Page | P0 | M7 | — |
| MH-14 | Incident Detail Page | P0 | M7 | — |
| MH-15 | Dashboard Page | P0 | M6 | — |
| MH-16 | Dark Theme Enterprise UI | P0 | M1 | — |
| SH-01 | Workflow Pipeline Visualization | P1 | M8 | — |
| SH-02 | Service Health Dashboard | P1 | M9 | api-health-monitoring |
| SH-03 | Loading Skeleton States | P1 | M1, M6–M9 | — |
| SH-04 | Incident Timeline Display | P1 | M7 | — |
| SH-05 | Demo Scenario Presets | P1 | M10 | — |
| SH-06 | API Error Handling | P1 | M5 | api-health-monitoring |
| SH-07 | Responsive Sidebar Navigation | P1 | M1 | — |
| SH-08 | Confidence Score Visualization | P1 | M7 | api-ai-augmented |
| NH-01 | Micro-Animations | P2 | M11 | — |
| NH-02 | Severity Distribution Chart | P2 | M6 | — |
| NH-03 | Graceful Degradation UX | P2 | M4, M7 | api-health-monitoring |
| NH-04 | Breadcrumb Navigation | P2 | M1 | — |
| NH-05 | Real Gemini API Integration | P2 | M4 | api-ai-augmented |
| NH-06 | Toast Notifications | P3 | M11 | — |
| NH-07 | Keyboard Navigation | P3 | M11 | — |
| NH-08 | Print-Ready Executive Summary | P3 | M11 | — |

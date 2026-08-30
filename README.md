# Customer Escalation Autopilot

> **Enterprise AI Incident Triage & Decision-Automation Platform**
>
> Automates complex customer escalation workflows by transforming fragmented context across CRM, billing, and engineering tools into structured AI severity decisions, deterministic policy enforcement, and coordinated multi-channel escalation.
>
> Built for the **BuildSprint Hackathon** powered by **Gemini 3.7 Flash** and **LatentCode**.

---

## 1. Hero / Project Identity

**Customer Escalation Autopilot** is an enterprise decision-automation system that replaces the 30–45 minute manual incident triage grind with an intelligent, sub-minute automated pipeline.

When a customer reports an issue, support engineers usually waste critical minutes hunting for details across separate systems. Customer Escalation Autopilot ingests incoming incident reports, automatically pulls 360° context from **HubSpot (CRM)**, **Stripe (Billing)**, and **GitHub (Engineering)**, uses **Gemini 3.7 Flash** to perform structured severity and business impact reasoning, applies deterministic customer-tier policies, and dispatches automated multi-channel escalations across **Linear**, **Slack**, **Notion**, and **Email**.

```
[ Slack / Manual Report ] ➔ [ 360° Context Aggregation ] ➔ [ Gemini AI Severity Analysis ] ➔ [ Policy Engine ] ➔ [ Multi-Channel Escalation ]
```

---

## 2. The Problem

In high-growth B2B SaaS and enterprise software organizations, incident triage is a fragmented, manual, and error-prone process:

- **Fragmented Customer Context:** Customer ARR/ACV lives in HubSpot; subscription health and failed payments live in Stripe; ongoing bugs and regressions live in GitHub.
- **Context-Switching Overhead:** Support and on-call engineers waste 30 to 45 minutes per incident manually searching 5+ tools before they can even assess severity.
- **Inconsistent Severity & Churn Risk:** Triage decisions vary wildly based on who is on call, risking under-prioritization of high-value enterprise accounts at risk of churn.
- **Manual Escalation Friction:** Creating engineering tickets, notifying leadership, posting to Slack, and logging incident records are performed by hand under time pressure.
- **Delayed SLA Response:** Every minute spent on manual research delays time-to-resolution (MTTR) for critical customer outages.

---

## 3. The Solution

Customer Escalation Autopilot provides an end-to-end, sub-minute decision and execution pipeline:

1. **Incident Intake:** Ingests customer reports via Slack webhooks or structured web forms.
2. **360° Context Aggregation:** Automatically pulls contract tier & health score from **HubSpot**, billing health & MRR from **Stripe**, and related open issues & code regressions from **GitHub**.
3. **AI Severity Reasoning:** **Gemini 3.7 Flash** analyzes the full context payload to determine technical severity, confidence score, business impact, and recommended actions.
4. **Deterministic Policy Governance:** Evaluates the AI output against business rules (e.g., Enterprise Medium+, SMB High+, Startup Critical, or high-confidence overrides).
5. **Automated Escalation or Queueing:** Creates Linear tickets, alerts Slack, logs Notion records, and emails executive briefs for escalated incidents; holds non-escalated items in standard queues.
6. **Explainable Incident Record:** Preserves full AI reasoning, confidence scores, policy rules applied, and a chronological lifecycle timeline.

---

## 4. Why This Is More Than an AI Classifier

Most AI tools stop at simple text categorization. Customer Escalation Autopilot is built on a full **Understand ➔ Decide ➔ Govern ➔ Act ➔ Explain** decision-automation model:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                               CUSTOMER ESCALATION AUTOPILOT                             │
├──────────────┬──────────────┬───────────────────┬───────────────────┬───────────────────┤
│  UNDERSTAND  │    DECIDE    │      GOVERN       │        ACT        │      EXPLAIN      │
├──────────────┼──────────────┼───────────────────┼───────────────────┼───────────────────┤
│ Aggregate    │ Structured   │ Deterministic     │ Dispatch Linear   │ Unified 360°      │
│ HubSpot,     │ Gemini 3.7   │ customer-tier &   │ tickets, Slack,   │ incident record & │
│ Stripe, &    │ severity     │ account-risk      │ Notion logs, &    │ chronological     │
│ GitHub data  │ reasoning    │ business policy   │ executive emails  │ lifecycle timeline│
└──────────────┴──────────────┴───────────────────┴───────────────────┴───────────────────┘
```

- **UNDERSTAND:** Fetches 360° operational context across CRM, billing, and code repositories.
- **DECIDE:** Gemini 3.7 Flash analyzes technical severity, customer impact, and resolution risk.
- **GOVERN:** Applies rigid, deterministic business rules (customer tier, health score, churn risk) so LLM outputs never bypass business policy.
- **ACT:** Executes downstream workflows across engineering ticketing, team messaging, and leadership reporting.
- **EXPLAIN:** Exposes transparent AI reasoning, confidence meters, action audit logs, and step-by-step pipeline execution timing.

---

## 5. Who Uses It

| Persona | Problem Solved | Key Outcome |
|---|---|---|
| **Support Engineers** | Eliminates manual research across 5+ tools | Instant 360° context & automated ticket dispatch |
| **On-Call Engineers** | Prevents noisy alerts and under-prioritized bugs | Receives fully enriched Linear tickets with GitHub links |
| **Customer Success Managers** | Protects high-value enterprise accounts | Automatic escalation for accounts with low health or high churn risk |
| **Support Managers** | Standardizes triage decisions across shifts | Consistent rule enforcement & complete pipeline visibility |
| **Engineering Leadership** | Eliminates manual status reporting | Receives AI-generated executive briefs via email |
| **Executives & Stakeholders** | Lack of visibility during customer outages | Real-time incident logs in Notion & health dashboard monitoring |

---

## 6. Where It Is Used

Customer Escalation Autopilot fits naturally into high-stakes B2B software environments:

- **Enterprise B2B SaaS:** Where high-ACV customer outages carry severe contract SLA penalties.
- **Fintech & Payment Platforms:** Where batch payment or API checkout failures directly block revenue flow.
- **Developer Platforms & Cloud Infrastructure:** Where API Gateway latency spikes or queue backpressure degrade customer applications.
- **API-Driven Businesses:** Where webhook delivery failures or schema migrations impact downstream integrations.

---

## 7. Real-World Scenario

### Scenario: Acme Corporation Batch Payment Failure

```
[ INGESTION ] ➔ Slack message: "Acme Corp (ops@acmecorp.com) batch payments failing. ~1200 transactions affected."
      │
[ CONTEXT AGGREGATION ]
      ├── HubSpot : Acme Corp | Enterprise Tier | $285K ACV | Health Score: 72
      ├── Stripe  : Active Subscription | $23.7K MRR | 0 Failed Payments
      └── GitHub  : Issue #1847 "Batch payment processor timeout under high concurrency" (Open, P1)
      │
[ AI REASONING ]
      └── Gemini 3.7 Flash evaluates 1,200 blocked transactions + $285K ACV + Issue #1847 match
          ➔ Severity: CRITICAL | Confidence: 94% | Resolution ETA: 2-4 hours
      │
[ POLICY GOVERNANCE ]
      └── Rule Check: Enterprise Tier + CRITICAL Severity ➔ MANDATORY ESCALATION
      │
[ AUTOMATED ACTION ]
      ├── Linear  ➔ Created Ticket ENG-2847 (Priority: Urgent, Assignee: alex.kumar)
      ├── Slack   ➔ Alerted #engineering-critical channel
      ├── Notion  ➔ Created entry in Incident Log database
      └── Email   ➔ Sent Executive Brief to leadership@company.com
      │
[ UNIFIED INCIDENT RECORD ]
      └── Complete timeline, confidence meter, and 360° context preserved at /incidents/[id]
```

---

## 8. Core Product Capabilities

- **Incident Intake:** Ingests Slack webhook events (`POST /api/webhook/slack`) or manual web form submissions with pre-configured scenario presets.
- **Customer 360 Context:** Retrieves account tier, ACV, health score, account manager, and churn risk from HubSpot CRM.
- **Billing Context:** Retrieves subscription status, MRR, total spend, and payment failure history from Stripe.
- **Related Engineering Issues:** Queries GitHub issues repository using keyword relevance scoring to detect known bugs or regressions.
- **AI Severity Reasoning:** Structured JSON prompts evaluated by Gemini 3.7 Flash (with fallback keyword matching).
- **Deterministic Escalation Policy:** Tier-based rule matrix (Enterprise Medium+, SMB High+, Startup/Free Critical) plus high-confidence overrides.
- **Automated Downstream Actions:** Linear ticket creation, Slack alerts, Notion log entries, and email summaries.
- **Executive Summaries:** Stakeholder-ready brief generation detailing customer impact, technical cause, actions taken, and risk factors.
- **Incident Lifecycle Timeline:** Vertical event stream recording timestamps and status indicators for every pipeline milestone.
- **Operational Health Dashboard:** Monitors service health, response times, and uptime SLAs across all 8 integrations.

---

## 9. End-to-End Architecture

The application is built on a **clean, layered Next.js 14 App Router architecture**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                            │
│   Dashboard (/) • Incidents (/incidents) • Detail (/incidents/[id])    │
│            Workflow (/workflow) • Health Dashboard (/health)            │
├─────────────────────────────────────────────────────────────────────────┤
│                             API ROUTE LAYER                             │
│   POST /api/webhook/slack  •  GET|POST /api/incidents                   │
│   GET /api/incidents/[id]  •  POST /api/escalate  •  GET /api/health    │
├─────────────────────────────────────────────────────────────────────────┤
│                              SERVICE LAYER                              │
│   OrchestratorService  •  AIPipelineService  •  TriageService          │
│   EscalationService    •  HealthMonitor                              │
├─────────────────────────────────────────────────────────────────────────┤
│                            INTEGRATION LAYER                            │
│   HubSpot Adapter • Stripe Adapter • GitHub Adapter • Linear Adapter    │
│   Slack Adapter   • Notion Adapter • Email Adapter  • Gemini Adapter    │
├─────────────────────────────────────────────────────────────────────────┤
│                               DATA LAYER                                │
│   Mock Data JSON Store (HubSpot, Stripe, GitHub, Incidents, AI Responses)│
└─────────────────────────────────────────────────────────────────────────┘
```

Every external integration uses an **Adapter Interface**, allowing mock implementations to be swapped for real OAuth/API SDKs without altering business logic.

---

## 10. AI + Decision Architecture

To ensure safety and reliability in enterprise environments, Customer Escalation Autopilot clearly separates **probabilistic AI reasoning** from **deterministic business governance**:

```
                                    ┌─────────────────────────────────┐
                                    │    PROBABILISTIC AI REASONING   │
                                    │      (Gemini 3.7 Flash Model)   │
                                    │                                 │
                                    │ • Severity Assessment           │
                                    │ • Confidence Score (0.0 - 1.0)  │
                                    │ • Business Impact Summary       │
                                    │ • Technical Root Cause Analysis │
                                    │ • Recommended Next Actions      │
                                    └────────────────┬────────────────┘
                                                     │
                                                     ▼
                                    ┌─────────────────────────────────┐
                                    │  DETERMINISTIC GOVERNANCE ENGINE│
                                    │        (Triage Policy Rules)    │
                                    │                                 │
                                    │ • Enterprise: Escalates at M+   │
                                    │ • SMB: Escalates at H+          │
                                    │ • Startup/Free: Critical Only   │
                                    │ • Account Risk/Health Overrides │
                                    └────────────────┬────────────────┘
                                                     │
                                                     ▼
                                    ┌─────────────────────────────────┐
                                    │     ORCHESTRATION & EXECUTION   │
                                    │      (Escalation Service)       │
                                    │                                 │
                                    │ • Dispatch Linear Ticket        │
                                    │ • Alert Slack Channel           │
                                    │ • Log to Notion                 │
                                    │ • Send Executive Email          │
                                    └─────────────────────────────────┘
```

- **Gemini 3.7 Flash** provides reasoning, context synthesis, and severity recommendations.
- **The Triage Engine** enforces rigid customer tier policy contracts, preventing AI hallucination from making unauthorized business decisions.

---

## 11. Escalation Decision Model

| Customer Tier | AI Severity | Account Risk Overrides | Policy Evaluation | Escalation Decision | Final Action |
|---|---|---|---|---|---|
| **Enterprise** ($285K ACV) | `CRITICAL` | N/A | Exceeds `MEDIUM+` threshold | **ESCALATE** | Linear, Slack, Notion, Email |
| **Enterprise** ($180K ACV) | `HIGH` | N/A | Exceeds `MEDIUM+` threshold | **ESCALATE** | Linear, Slack, Notion, Email |
| **SMB** ($24K ACV) | `MEDIUM` | Health Score: 65, Churn Risk: Medium | Below `HIGH+` threshold | **DO NOT ESCALATE** | Standard Support Queue (Resolved) |
| **Startup** ($6K ACV) | `LOW` | Churn Risk: Low | Below `CRITICAL` threshold | **DO NOT ESCALATE** | Standard Support Queue (Resolved) |

---

## 12. Proof: Working Demo

The entire application is fully built, type-checked, and verified:

- **Executive Command Dashboard:** Real-time stats grid, CSS severity distribution chart, clickable recent incidents, and quick action shortcuts.
- **Incident Registry & Filterable List:** Filter by severity dropdown or lifecycle status tabs (`All`, `Active`, `Triaged`, `Escalated`, `Resolved`).
- **360° Incident Detail Page:** Unified view containing Customer Context (ACV & Health score bar), AI Reasoning (confidence meter & technical analysis), Escalation Action execution status with durations, Executive Summary, and Incident Lifecycle Timeline.
- **10-Step Workflow Visualization:** CI/CD-style visual pipeline displaying step-by-step progress, duration timings, expandable step detail outputs, and 2-second live polling during running workflows.
- **Service Health Monitoring:** Real-time SLA dashboard tracking availability, status indicators, and response time metrics across all 8 integrations.

---

## 13. Demo Scenario / 2-Minute Judge Flow

To experience the platform in 2 minutes:

1. **Launch Incident:** On the Dashboard or Workflow page, click **"⚡ Process New Incident"**.
2. **Select Scenario:** Choose **"🚨 Critical: Enterprise Payment Failure (Acme Corp)"** from the scenario dropdown. Click **"Launch Workflow Pipeline"**.
3. **Watch Live Pipeline:** Observe the 10-step pipeline animate in real-time on `/workflow` — parsing the event, fetching HubSpot CRM, pulling Stripe billing, searching GitHub issues, calling Gemini AI, creating Linear ticket `ENG-2847`, alerting Slack, updating Notion, and sending leadership email.
4. **Inspect Incident 360°:** Click **"View Full Incident Detail"** to review the customer's $285K ACV, Gemini's 94% confidence score meter, Linear ticket links, executive brief, and vertical lifecycle timeline.
5. **Check Service Health:** Navigate to `/health` to verify all 8 integration adapters reporting 100% operational status and sub-second response times.

---

## 14. Technical Stack

- **Frontend & Routing:** Next.js 14 (App Router), React 18, TypeScript (Strict Mode)
- **Styling & Design System:** Tailwind CSS, Glassmorphism, CSS Custom Keyframe Animations
- **AI Layer:** Gemini 3.7 Flash API (with structured JSON generation & fallback matching)
- **State Management & Persistence:** Global in-memory singleton store (hot-reload persistent)
- **Tooling & Validation:** ESLint, TypeScript `tsc`, Next.js Static & Dynamic Compiler

---

## 15. Engineering Highlights

- **Strict Type System:** Domain model matching `DATA_MODEL.md` schemas across all layers (`src/lib/types/index.ts`).
- **Adapter Design Pattern:** Clean isolation between service logic and integration clients in `src/lib/integrations/`.
- **Global Dev Store Singleton:** Preserves created incidents and state transitions across Next.js Fast Refresh and serverless route invocations (`src/lib/services/orchestrator.ts`).
- **Graceful Error Isolation:** Partial failure isolation in `EscalationService` ensures that if one channel (e.g. Slack) fails, remaining actions (Linear, Notion, Email) still complete.
- **Zero External Runtime Dependencies:** Operates out-of-the-box with mock datasets without requiring external API keys.

---

## 16. Current Implementation vs. Production Path

| Capability | Current Hackathon Implementation | Production Path |
|---|---|---|
| **Integrations** | Mock adapters simulating API latency (100–500ms) | Swap adapter bodies with official OAuth2 SDKs (HubSpot, Stripe, GitHub, Linear) |
| **Data Storage** | Global in-memory map pre-seeded from JSON | PostgreSQL / PlanetScale database with Prisma ORM |
| **Authentication** | Open access for demo workflows | NextAuth.js with Enterprise SSO & Role-Based Access Control (RBAC) |
| **Real-time Pipeline** | 2-second client polling over REST | WebSockets or Server-Sent Events (SSE) |
| **Background Jobs** | Async Node.js micro-task pipeline | Redis + BullMQ / QStash job queue |

---

## 17. Impact / Why It Matters

- **Reduces MTTR:** Replaces 30–45 minutes of manual research with a sub-minute decision pipeline.
- **Protects Revenue:** Prevents under-prioritization of enterprise accounts with low health scores or high churn risk.
- **Eliminates Toil:** Automates repetitive ticket creation, Slack formatting, Notion logging, and executive reporting.
- **Guarantees Explainability:** Keeps a complete, audit-ready record of AI reasoning, confidence scores, and policy decisions for every incident.

---

## 18. BuildSprint / Hackathon Context

- **Event:** BuildSprint Hackathon
- **Tooling:** Built using **LatentCode**
- **AI Model:** Powered by **Gemini 3.7 Flash**
- **SkillPatch Skills Integrated:**
  1. `api-integration` — Event-driven webhook handling & API chaining
  2. `api-ai-augmented` — Structured LLM decision prompting & JSON output parsing
  3. `api-health-monitoring` — Service SLA monitoring & health checks
  4. `triage` — Severity classification & escalation decision state machine

---

## 19. Setup / Run Locally

```bash
# Clone the repository
git clone <repo-url>
cd customer-escalation-autopilot

# Install dependencies
npm install

# Option A: Run in Mock Mode (Default - No API key required)
npm run dev

# Option B: Run with Live Gemini 3.7 Flash AI
echo "GEMINI_API_KEY=your_gemini_key_here" > .env.local
npm run dev

# Open in browser
open http://localhost:3000
```

### Verification Commands

```bash
# Type check
npx tsc --noEmit

# Lint check
npm run lint

# Production build test
npm run build
```

---

## 20. Roadmap

- **Phase 1 (Current):** Hackathon MVP with full service orchestration, AI reasoning, policy governance, and interactive dashboard UI.
- **Phase 2:** Live OAuth2 integrations with HubSpot, Stripe, GitHub, Linear, Slack, Notion, and SendGrid/Resend.
- **Phase 3:** Multi-tenant enterprise organization support, NextAuth SSO, PostgreSQL database persistence, and WebSocket live updates.
- **Phase 4:** Historical SLA analytics, custom customer-tier policy builder, and automated runbook suggestions.

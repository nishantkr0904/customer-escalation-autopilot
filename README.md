# README.md

## Customer Escalation Autopilot

> AI-powered incident triage and escalation workflow for enterprise support teams.
> Built for the BuildSprint Hackathon using LatentCode.

---

## Problem Statement

Support engineers waste significant time manually switching between **Slack, HubSpot, Stripe, GitHub, Linear, Notion, and Email** before they can determine how serious a customer incident actually is.

A single escalation decision currently requires:

- Searching HubSpot for customer tier and contract details
- Checking Stripe for billing status and payment health
- Scanning GitHub for related open issues or regressions
- Manually assessing severity based on fragmented context
- Creating tickets, notifying stakeholders, and writing summaries by hand

This fragmented process delays response times, increases customer churn risk, and burns out support engineers.

---

## Solution

**Customer Escalation Autopilot** automates the entire escalation pipeline end-to-end:

1. **Ingests** a Slack incident message
2. **Retrieves** customer context from HubSpot, billing status from Stripe, and related issues from GitHub
3. **Reasons** over the aggregated context using Gemini 3.7 Flash to determine severity and business impact
4. **Escalates** automatically — creating Linear tickets, notifying Slack channels, updating Notion logs, and emailing executive summaries
5. **Visualizes** the entire workflow in a polished, real-time dashboard

The system replaces a 30–45 minute manual triage process with an intelligent, sub-minute automated pipeline.

---

## Features

| Feature | Description |
|---|---|
| **Incident Intake** | Accepts Slack incident messages and extracts structured data |
| **Customer 360** | Aggregates customer data from HubSpot (CRM), Stripe (billing), and GitHub (engineering) |
| **AI Severity Analysis** | Gemini 3.7 Flash reasons over full context to classify severity (Low / Medium / High / Critical) |
| **Smart Escalation** | Enterprise customers and critical issues trigger automatic escalation workflows |
| **Linear Ticket Creation** | Auto-creates prioritized engineering tickets with full context |
| **Slack Notification** | Posts structured alerts to engineering channels |
| **Executive Summary** | Generates concise, stakeholder-ready incident summaries |
| **Notion Incident Log** | Maintains a structured incident history |
| **Email Notification** | Sends formatted email summaries to leadership |
| **Workflow Visualization** | Real-time step-by-step pipeline visualization with status indicators |
| **Service Health Dashboard** | Monitors integration health across all connected services |
| **Incident Timeline** | Chronological view of all processed incidents |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS |
| **AI** | Gemini 3.7 Flash |
| **Data** | Mock JSON files (designed for real API replacement) |
| **Deployment** | Vercel |
| **Development** | LatentCode |

---

## Architecture Summary

The application follows a **layered service architecture** built on Next.js App Router:

```
┌─────────────────────────────────────────────┐
│              Presentation Layer              │
│  (React Components, Pages, Tailwind CSS)     │
├─────────────────────────────────────────────┤
│              API Route Layer                 │
│  (Next.js API Routes — /api/*)               │
├─────────────────────────────────────────────┤
│              Service Layer                   │
│  (Orchestration, AI Pipeline, Triage Logic)  │
├─────────────────────────────────────────────┤
│              Integration Layer               │
│  (Mock Adapters — HubSpot, Stripe, GitHub…)  │
├─────────────────────────────────────────────┤
│              Data Layer                      │
│  (Mock JSON Files)                           │
└─────────────────────────────────────────────┘
```

Each integration is wrapped in an **adapter interface** so mock implementations can be replaced with real API clients without changing business logic.

---

## Workflow Diagram

```
Slack Incident Message
        │
        ▼
┌───────────────┐
│  Parse Event  │
└───────┬───────┘
        │
        ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   HubSpot     │     │    Stripe     │     │    GitHub      │
│  (Customer)   │     │  (Billing)    │     │   (Issues)     │
└───────┬───────┘     └───────┬───────┘     └───────┬───────┘
        │                     │                     │
        └─────────┬───────────┘─────────────────────┘
                  │
                  ▼
        ┌─────────────────┐
        │  Gemini 3.7     │
        │  Flash AI       │
        │  Reasoning      │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  Severity        │
        │  Classification  │
        │  L / M / H / C   │
        └────────┬────────┘
                 │
         ┌───────┴────────┐
         │  Enterprise OR  │
         │  Critical?      │
         └───────┬────────┘
                 │ Yes
        ┌────────┴─────────────────────────────┐
        │                                      │
        ▼                  ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Create Linear│  │ Notify Slack │  │ Generate     │
│ Ticket       │  │ Channel      │  │ Exec Summary │
└──────┬───────┘  └──────────────┘  └──────┬───────┘
       │                                   │
       └───────────────┬───────────────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
     ┌──────────────┐  ┌──────────────┐
     │ Update Notion│  │ Send Email   │
     │ Incident Log │  │ Summary      │
     └──────────────┘  └──────────────┘
```

---

## Running Locally

```bash
# Clone the repository
git clone <repo-url>
cd customer-escalation-autopilot

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

> **Note:** No external API keys are required. All integrations use mock data by default.

---

## Future Improvements

| Area | Improvement |
|---|---|
| **Real Integrations** | Replace mock adapters with live Slack, HubSpot, Stripe, GitHub, Linear, Notion, and Email APIs |
| **Authentication** | Add NextAuth.js with SSO for enterprise teams |
| **Database** | Migrate from JSON mocks to PostgreSQL or Planetscale |
| **Real-time** | WebSocket-based live incident feed |
| **Multi-tenancy** | Support multiple teams and organizations |
| **Analytics** | Historical incident analytics and SLA tracking |
| **Custom Rules** | User-defined escalation rules engine |
| **Audit Log** | Full audit trail for compliance |
| **Runbook Integration** | Auto-suggest runbooks based on incident classification |

---

## SkillPatch Usage

This project leverages four SkillPatch skills as core architectural components:

### 1. `api-integration`
- **Where:** Webhook handling (`/api/webhook/slack`), workflow orchestration (`orchestrator.ts`), API chaining across HubSpot → Stripe → GitHub
- **Why:** Provides patterns for event-driven architecture, sequential API chaining, and reliable workflow orchestration

### 2. `api-ai-augmented`
- **Where:** AI decision pipeline (`ai-pipeline.ts`), structured severity classification, Gemini function calling
- **Why:** Guides the AI-assisted decision-making pattern where Gemini reasons over aggregated API data to produce structured escalation decisions

### 3. `api-health-monitoring`
- **Where:** Health dashboard (`/health` page), health API route (`/api/health`), service availability checks (`health-monitor.ts`)
- **Why:** Implements service health monitoring with status indicators, fallback decisions when services are degraded, and operational visibility

### 4. `triage`
- **Where:** Severity classification engine (`triage.ts`), escalation routing (`escalation.ts`), incident state machine
- **Why:** Powers the core triage logic — mapping incident signals to severity levels, routing escalations based on customer tier and impact, and managing incident lifecycle states

---

## BuildSprint Judging Narrative

### What it does
Customer Escalation Autopilot eliminates the 30–45 minute manual triage process that support engineers endure for every incident. It aggregates context from 7 enterprise tools, applies AI reasoning, and executes escalation workflows automatically.

### Why it matters
- **For Support Engineers:** Eliminates context-switching fatigue and reduces MTTR
- **For Engineering Leaders:** Ensures critical incidents are never missed or under-prioritized
- **For Executives:** Receives structured, AI-generated incident summaries without manual reporting
- **For the Business:** Faster response times reduce churn risk for enterprise customers

### Technical highlights
- **AI-Native Architecture:** Gemini 3.7 Flash is not a chatbot — it's a reasoning engine embedded in the workflow pipeline
- **Production-Grade Patterns:** Adapter interfaces, service orchestration, health monitoring, and state machines — designed for real-world deployment
- **SkillPatch Integration:** Four SkillPatch skills provide battle-tested patterns for API integration, AI augmentation, health monitoring, and triage classification
- **Mock-to-Production Path:** Every integration has a clean adapter boundary that can be swapped from mock to real API without touching business logic

### Demo flow
1. Submit a Slack incident message
2. Watch the system retrieve customer context in real-time
3. See Gemini analyze severity with transparent reasoning
4. Observe automatic escalation — Linear ticket, Slack notification, Notion update, email
5. View the executive summary and incident timeline
6. Check service health across all integrations

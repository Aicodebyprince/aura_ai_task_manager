<div align="center">
  <br/>
  <img src="https://raw.githubusercontent.com/Aicodebyprince/aura_ai_task_manager/main/public/logo.png" alt="Aura AI Logo" width="120"/>
  <br/><br/>
  <img src="https://img.shields.io/badge/status-production-10B981?style=for-the-badge&logo=vercel&logoColor=white" alt="Status"/>
  <img src="https://img.shields.io/badge/next.js_15.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini"/>
  <img src="https://img.shields.io/badge/Genkit_1.14-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Genkit"/>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/license-MIT-8B5CF6?style=for-the-badge" alt="License"/>
  <br/>
  <blockquote><strong>Live Demo:</strong> Not yet deployed. Run locally with <code>npm run dev</code> — see <a href="#-getting-started">Getting Started</a>.</blockquote>
</div>

<br/>

<div align="center">
  <h1>Aura AI Task Manager</h1>
  <p align="center">
    <strong>Hybrid-intelligence task management.</strong><br/>
    Where deterministic algorithms meet generative AI to eliminate team coordination tax.
  </p>
  <br/>
  <p align="center">
    <a href="#-overview">Overview</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#-intelligence-model">Intelligence Model</a> •
    <a href="#-features">Features</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-scoring-algorithm">Scoring</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-getting-started">Setup</a> •
    <a href="#-project-structure">Structure</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>
  <br/>
  <p align="center">
    <sub>
      Built by <strong><a href="https://github.com/Aicodebyprince">WebTurnerAI</a></strong>
      — practical AI systems for real operations.
    </sub>
  </p>
  <br/>
</div>

---

<br/>

## 📋 Overview

Aura AI is a **professional-grade task management platform** purpose-built for teams that need more than just another Kanban board. It replaces the manual overhead of daily planning, task assignment, and status coordination with a **two-layer intelligence system** that combines the reliability of deterministic algorithms with the flexibility of generative AI.

The problem it solves is simple but pervasive: **teams lose 30% or more of their productive time to coordination** — standups, spreadsheet reassignments, rescheduling, figuring out who should do what. Aura AI automates the mathematics of that coordination so humans can focus on the work that actually matters.

<br/>

### Who It's For

| For | What It Solves |
|-----|----------------|
| **Product Teams** | Accelerate feature delivery with automated sprint planning and AI-assisted task distribution |
| **Agencies & Project Managers** | Manage freelancer workloads, track live project ETAs, eliminate manual follow-ups |
| **Students & Educators** | Organize group projects, schedule study sessions, track academic deadlines |

<br/>

### ⚡ Quick Start

```bash
git clone https://github.com/Aicodebyprince/aura_ai_task_manager.git
cd aura_ai_task_manager
npm install
cp .env.example .env     # Add Firebase & Gemini keys
npm run dev              # Open http://localhost:3000
```

---

<br/>

## 📸 Screenshots

<div align="center">
  <h3>Landing Page</h3>
  <img src="https://raw.githubusercontent.com/Aicodebyprince/aura_ai_task_manager/main/public/Landing%20Page.png" alt="Landing Page" width="90%" style="border-radius: 8px; border: 1px solid #e5e7eb;"/>
  <br/><br/>
  
  <h3>Dashboard View</h3>
  <img src="https://raw.githubusercontent.com/Aicodebyprince/aura_ai_task_manager/main/public/Dashbaord.png" alt="Dashboard" width="90%" style="border-radius: 8px; border: 1px solid #e5e7eb;"/>
  <br/><br/>
  
  <h3>Dashboard — Alternate View</h3>
  <img src="https://raw.githubusercontent.com/Aicodebyprince/aura_ai_task_manager/main/public/Dashbaord1.png" alt="Dashboard Alternate" width="90%" style="border-radius: 8px; border: 1px solid #e5e7eb;"/>
  <br/><br/>
  
  <h3>Analytics</h3>
  <img src="https://raw.githubusercontent.com/Aicodebyprince/aura_ai_task_manager/main/public/Analytics.png" alt="Analytics" width="90%" style="border-radius: 8px; border: 1px solid #e5e7eb;"/>
  <br/><br/>
  
  <h3>Team Groups</h3>
  <img src="https://raw.githubusercontent.com/Aicodebyprince/aura_ai_task_manager/main/public/Groups.png" alt="Groups" width="90%" style="border-radius: 8px; border: 1px solid #e5e7eb;"/>
  <br/><br/>
  
  <h3>Settings</h3>
  <img src="https://raw.githubusercontent.com/Aicodebyprince/aura_ai_task_manager/main/public/Settings.png" alt="Settings" width="90%" style="border-radius: 8px; border: 1px solid #e5e7eb;"/>
</div>

<br/>

*The dashboard features smooth Framer Motion transitions, dark/light theme support, and drag-and-drop task management via react-dnd.*

---

<br/>

## 🧠 Intelligence Model

Aura's core innovation is its **two-layer architecture** that separates deterministic computation from generative reasoning — ensuring that critical task operations are always precise while conversational interactions remain fluid and natural.

<br/>

### Layer 1 — Deterministic Engine

The deterministic engine handles every operation that requires **objective, repeatable computation**. No hallucinations. No ambiguity. Just provably correct algorithms.

| Component | Mechanism | Output |
|-----------|-----------|--------|
| **Priority Sorter** | Multi-factor priority scoring (deadline proximity, dependency count, business value) | Ranked task backlog |
| **Daily Planner** | Knapsack heuristic optimizing for value density within an 8-hour window | Time-blocked schedule |
| **Assignment Scorer** | 5-factor weighted evaluation across team members (30% availability, 20% skill match, 20% completion rate, 20% on-time rate, 10% efficiency) | Ranked assignee list with performance tags |

```
┌──────────────────────────────────────────────────────────┐
│                   DETERMINISTIC ENGINE                    │
│                                                          │
│  Task In ──► Priority Sorter ──► Knapsack Planner        │
│                │                        │                 │
│                ▼                        ▼                 │
│          Assignment Scorer ──► Ranked Output + Tags       │
│                                                          │
│  Properties: O(1) predictable, zero latency,             │
│              mathematically verifiable, no hallucinations │
└──────────────────────────────────────────────────────────┘
```

<br/>

### Layer 2 — Generative AI

The generative layer handles everything that requires **language understanding and generation**. Powered by **Google Gemini 2.5 Flash** and optionally **OpenAI GPT-4o-mini**, both orchestrated through **Firebase Genkit**.

| Capability | Description |
|------------|-------------|
| **Conversational Agent** | Multi-turn dialogue for task creation, queries, and planning |
| **Natural Language Parsing** | Extract structured tasks from unstructured input like "Create a task for design review due Friday" |
| **Narrative Planning** | Generate human-readable day plans and summaries |
| **Context Management** | Maintain conversation state across Genkit flows |

```
┌──────────────────────────────────────────────────────────┐
│                   GENERATIVE AI LAYER                     │
│                                                          │
│  User Input ──► Genkit Flow ──► Gemini 2.5 Flash / GPT-4o│
│                    │                    │                  │
│                    ▼                    ▼                  │
│             Structured Data ──► Context Store             │
│                                                          │
│  Properties: contextual, adaptive, multi-turn             │
│              conversation support                         │
└──────────────────────────────────────────────────────────┘
```

<br/>

### How They Work Together

```
User: "Plan my day around the Q2 review prep and the client demo"

                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│                    GENKIT FLOW                              │
│                                                             │
│  1. Gemini parses intent → extracts tasks & deadlines       │
│  2. Structured output → deterministic engine                │
│  3. Engine computes optimal schedule (Knapsack)             │
│  4. Gemini generates human-readable narrative day plan      │
│  5. Result: mathematically optimal schedule + natural text  │
└────────────────────────────────────────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────────────┐
          │  ☀️ Your Optimized Day                │
          │                                      │
          │  08:00 – 09:30 │ Q2 Review Prep      │
          │  09:30 – 10:00 │ Buffer              │
          │  10:00 – 11:30 │ Client Demo Prep    │
          │  11:30 – 12:00 │ Client Demo         │
          │  12:00 – 13:00 │ Lunch               │
          │  13:00 – 14:30 │ Feedback Sync       │
          │  14:30 – 16:00 │ Documentation       │
          │  16:00 – 17:00 │ Open / Deep Work    │
          └──────────────────────────────────────┘
```

> The deterministic engine ensures the schedule is **mathematically optimal**. The AI ensures it's **communicated naturally**.

---

<br/>

## ✨ Features

### 🧠 AI Daily Planner
Generates an optimized 8-hour work schedule using a **Knapsack-based heuristic** that maximizes value density. Automatically respects task dependencies, time estimates, and deadlines — rebalancing as priorities shift throughout the day.

### 🎯 Smart Task Assignment
A **5-factor weighted scoring model** evaluates every team member against each incoming task. Returns the **top 3 candidates** with human-readable justification tags (e.g., "Highly Available", "Strong Skill Match", "Consistent On-Time Delivery"). Full formula disclosed in the [Scoring Algorithm](#-scoring-algorithm) section.

### 💬 Aura Conversational Assistant
A natural language interface that understands commands like:
- *"Create a task for design review due Friday"*
- *"Who's the best person to handle the API integration?"*
- *"What does my week look like?"*
- *"Reschedule the standup to 10 AM"*

Powers: task creation, status updates, queries, schedule generation, team member lookup — all via natural conversation.

### 📊 Real-Time Bento-Grid Dashboard
A dynamic, responsive dashboard layout featuring:
- **Kanban Board** with drag-and-drop task transitions (react-dnd)
- **Task Timers** with start/stop for granular time tracking
- **Team Velocity Analytics** via Recharts
- **Progress Tracking** with completion metrics
- **Live Sync** across all sessions via Firebase Firestore `onSnapshot` subscribers

<div align="center">
  <br/>
  <img src="https://raw.githubusercontent.com/Aicodebyprince/aura_ai_task_manager/main/public/Dashbaord.png" alt="Dashboard Preview" width="85%" style="border-radius: 8px; border: 1px solid #e5e7eb;"/>
  <br/><br/>
</div>

### 👥 Team Management & Analytics
Full team and colleague management with:
- **Skill profiles** for accurate task matching
- **Workload visualization** for capacity planning
- **Performance scoring** — completion rate, on-time rate, efficiency
- **Group analytics** for team-level velocity and throughput insights

<div align="center">
  <br/>
  <img src="https://raw.githubusercontent.com/Aicodebyprince/aura_ai_task_manager/main/public/Groups.png" alt="Groups Preview" width="85%" style="border-radius: 8px; border: 1px solid #e5e7eb;"/>
  <br/><br/>
  <img src="https://raw.githubusercontent.com/Aicodebyprince/aura_ai_task_manager/main/public/Analytics.png" alt="Analytics Preview" width="85%" style="border-radius: 8px; border: 1px solid #e5e7eb;"/>
</div>

<br/>

### 📅 Calendar View
Long-range planning with deadline visualization and workload distribution across weeks and months.

### 🎨 Full Theme Support
Dark and light modes with smooth Framer Motion transitions. System preference detection with manual override toggle.

---

<br/>

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Next.js 15)                               │
│                                                                                │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │   Landing    │   │    Auth      │   │  Dashboard   │   │   Settings   │    │
│  │   Page       │   │    Page      │   │  (Main SPA)  │   │              │    │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘    │
│         │                  │                  │                  │            │
│         └──────────────────┴──────────────────┴──────────────────┘            │
│                                    │                                         │
│  ┌─────────────────────────────────┼──────────────────────────────────────┐  │
│  │         React Context Layer      │                                      │  │
│  │                                   │                                      │  │
│  │  ┌──────────┐  ┌───────────┐  ┌──┴──────┐  ┌──────────┐  ┌────────┐  │  │
│  │  │useTimer  │  │ useToast  │  │ AppCtxt │  │useMobile│  │ReactDnD │  │  │
│  │  └──────────┘  └───────────┘  └─────────┘  └──────────┘  └────────┘  │  │
│  │    (time-tracking)            (global state)            (drag/drop)  │  │
│  └─────────────────────────────────┬──────────────────────────────────────┘  │
└────────────────────────────────────┼──────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                        FIREBASE FIRESTORE (Real-Time NoSQL)                    │
│                                                                                │
│  Collections: tasks, users, teams, groups, analytics, settings                │
│  Auth: Firebase Authentication (email/password)                               │
│  Real-time: onSnapshot listeners → live multi-session sync                   │
└────────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                         GENKIT ORCHESTRATION LAYER                             │
│                                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │                       DETERMINISTIC ENGINE                               │   │
│  │                                                                         │   │
│  │  src/lib/assignment-algorithm.ts                                        │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │   │
│  │  │ Priority Sorter  │  │ Knapsack Planner │  │ Assignment Scorer    │  │   │
│  │  │ deadline + deps  │  │ value density    │  │ 5-factor weighting   │  │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                │
│  ┌────────────────────────────────────────────────────────────────────────┐   │
│  │                       GENERATIVE AI                                      │   │
│  │                                                                         │   │
│  │  src/ai/genkit.ts  ──  src/ai/flows/conversational-agent-flow.ts        │   │
│  │                                                                         │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │   │
│  │  │ Genkit Init      │  │ Conversational   │  │ AI Providers         │  │   │
│  │  │ googleAI plugin  │  │ Agent Flow       │  │ ├── Gemini 2.5 Flash │  │   │
│  │  │ default model    │  │ multi-turn       │  │ └── GPT-4o-mini      │  │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

<br/>

## 📐 Scoring Algorithm (Deep Dive)

The `assignment-algorithm.ts` implements a deterministic multi-factor scoring system that evaluates team members for optimal task assignment.

### Weight Distribution

```
┌─────────────────────────────────────────────────────────────┐
│                   SCORE WEIGHTING BREAKDOWN                  │
│                                                             │
│  Availability     ████████████████████████████████   30%    │
│  Skill Match      ██████████████████████████         20%    │
│  Completion Rate  ██████████████████████████         20%    │
│  On-Time Rate     ██████████████████████████         20%    │
│  Efficiency       ██████████████                     10%    │
└─────────────────────────────────────────────────────────────┘
```

### Formula

```
Final Score = (Availability × 0.30)
            + (Skill × 0.20)
            + (CompletionRate × 0.20)
            + (OnTimeRate × 0.20)
            + (Efficiency × 0.10)
```

### Metric Definitions

| Metric | Calculation Details | Range | Default |
|--------|-------------------|-------|---------|
| **Availability** | `100 - (workload × 5)` where workload = sum of estimated hours on incomplete tasks | 0–100 | — |
| **Skill Match** | Match task keywords against user skills; `+20` per match | 0–100 (cap) | — |
| **Completion Rate** | `(completedTasks / totalTasks) × 100` | 0–100 | 80 (new members) |
| **On-Time Rate** | `(onTimeTasks / completedTasks) × 100` | 0–100 | 80 (new members) |
| **Efficiency** | `((ratio − 0.5) / 1) × 100` where `ratio = estimatedTime / actualTime` | 0–100 (normalized) | — |

### Performance Tags

The algorithm generates human-readable tags based on score thresholds, providing immediate context for assignment decisions:

| Threshold Condition | Tag Generated |
|---------------------|---------------|
| Availability > 80 | `"Highly Available"` |
| Skill Match > 80 | `"Strong Skill Match"` |
| Completion Rate > 90 | `"High Completion Rate"` |
| On-Time Rate > 90 | `"Consistent On-Time Delivery"` |
| Efficiency > 80 | `"Highly Efficient"` |
| No high thresholds met | `"Good Overall Candidate"` (default) |

### Output: Top 3 Candidates

The algorithm returns the **top 3 ranked team members** with their scores and tags, enabling PMs to make informed assignment decisions at a glance.

---

<br/>

## 🛠️ Tech Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 15.3.8 | React framework with App Router & Turbopack |
| [React](https://react.dev/) | 18.3.1 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe development |

### AI & Machine Learning

| Technology | Version | Purpose |
|------------|---------|---------|
| [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/flash/) | — | Primary generative AI model |
| [OpenAI GPT-4o-mini](https://platform.openai.com/) | — | Secondary AI provider (via genkitx-openai) |
| [Firebase Genkit](https://firebase.google.com/docs/genkit) | 1.14.1 | AI orchestration, flow management, tool calling |
| [Genkit Google AI Plugin](https://github.com/googleapis/genkit/tree/main/genkit-tools/googleai) | 1.14.1 | Gemini integration for Genkit |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| [Firebase](https://firebase.google.com/) | 10.12.2 | Authentication & real-time database |
| [Firestore](https://firebase.google.com/docs/firestore) | — | Real-time NoSQL document database with `onSnapshot` listeners |
| [Firebase Auth](https://firebase.google.com/docs/auth) | — | User authentication (email/password) |

### UI & Styling

| Technology | Purpose |
|------------|---------|
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Radix UI](https://www.radix-ui.com/) | 16+ accessible component primitives |
| [Framer Motion](https://www.framer.com/motion/) | Animation library |
| [Recharts](https://recharts.org/) | Data visualization (team velocity, analytics) |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Embla Carousel](https://www.embla-carousel.com/) | Carousel/slider |
| [cmdk](https://cmdk.paco.me/) | Command palette / search |
| [class-variance-authority](https://cva.style/) | Component variant management |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | Tailwind class conflict resolution |
| [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) | Tailwind animation utilities |

### Form & Validation

| Technology | Purpose |
|------------|---------|
| [React Hook Form](https://react-hook-form.com/) | Performant form state management |
| [Zod](https://zod.dev/) | Runtime schema validation |
| [Hookform Resolvers](https://github.com/react-hook-form/resolvers) | Zod integration bridge |

### Drag & Drop & Date Handling

| Technology | Purpose |
|------------|---------|
| [React DnD](https://react-dnd.github.io/react-dnd/) | Drag-and-drop task Kanban management |
| [React DnD HTML5 Backend](https://react-dnd.github.io/react-dnd/docs/backends/html5) | Browser-native drag support |
| [date-fns](https://date-fns.org/) | Date utility library |
| [React Day Picker](https://react-day-picker.js.org/) | Date picker component |

### Development Tooling

| Tool | Purpose |
|------|---------|
| [Turbopack](https://turbo.build/pack) | Incremental development bundler |
| [Genkit CLI](https://firebase.google.com/docs/genkit) | Local AI flow development, testing & debugging |
| [Genkit Dev](https://firebase.google.com/docs/genkit/dev) | Dev server for Genkit flows with watch mode |
| [dotenv-cli](https://github.com/entropitor/dotenv-cli) | Environment variable loading |
| [ESLint](https://eslint.org/) | Code linting (via `next lint`) |
| [PostCSS](https://postcss.org/) | CSS processing |

---

<br/>

## 📁 Project Structure

```
aura_ai_task_manager/
│
├── src/
│   ├── ai/                                    # AI layer — Genkit configuration & flows
│   │   ├── genkit.ts                          #   Genkit init with Google AI plugin
│   │   ├── dev.ts                             #   Genkit development entry point
│   │   ├── flows/
│   │   │   └── conversational-agent-flow.ts   #   Multi-turn dialogue flow
│   │   └── schemas/
│   │       └── index.ts                       #   Zod schemas for AI I/O
│   │
│   ├── app/                                   # Next.js 15 App Router
│   │   ├── layout.tsx                         #   Root layout with metadata & providers
│   │   ├── page.tsx                           #   Landing page route
│   │   ├── dashboard/
│   │   │   └── page.tsx                       #   Authenticated dashboard
│   │   ├── globals.css                        #   Global styles & Tailwind base
│   │   └── icon.png                           #   Favicon / app icon
│   │
│   ├── components/                            # React components
│   │   ├── ui/                                #   Shared UI primitives (Radix-based, shadcn-style)
│   │   │   ├── accordion.tsx                  #   Collapsible sections
│   │   │   ├── alert-dialog.tsx               #   Confirmation modals
│   │   │   ├── avatar.tsx                     #   User avatars with fallback
│   │   │   ├── badge.tsx                      #   Status/label badges
│   │   │   ├── button.tsx                     #   Button component with variants
│   │   │   ├── calendar.tsx                   #   Calendar widget
│   │   │   ├── card.tsx                       #   Card containers
│   │   │   ├── checkbox.tsx                   #   Checkbox input
│   │   │   ├── collapsible.tsx                #   Collapsible panels
│   │   │   ├── dialog.tsx                     #   Modal dialogs
│   │   │   ├── dropdown-menu.tsx              #   Context menus
│   │   │   ├── input.tsx                      #   Text input
│   │   │   ├── label.tsx                      #   Form labels
│   │   │   ├── menubar.tsx                    #   Menu bar
│   │   │   ├── popover.tsx                    #   Popover overlays
│   │   │   ├── progress.tsx                   #   Progress bars
│   │   │   ├── radio-group.tsx                #   Radio button group
│   │   │   ├── scroll-area.tsx                #   Custom scroll containers
│   │   │   ├── select.tsx                     #   Select dropdowns
│   │   │   ├── separator.tsx                  #   Visual dividers
│   │   │   ├── slider.tsx                     #   Range slider
│   │   │   ├── switch.tsx                     #   Toggle switch
│   │   │   ├── tabs.tsx                       #   Tab navigation
│   │   │   ├── toast.tsx                      #   Toast notifications
│   │   │   ├── toaster.tsx                    #   Toast container
│   │   │   └── tooltip.tsx                    #   Tooltip hints
│   │   │
│   │   ├── landing-page.tsx                   #   Marketing landing with bento-grid showcase
│   │   ├── enhanced-dashboard.tsx             #   Core dashboard bento-grid layout
│   │   ├── analytics.tsx                      #   Recharts analytics & visualizations
│   │   ├── colleagues.tsx                     #   Colleague list & profiles
│   │   ├── groups.tsx                         #   Group/team workspace UI
│   │   ├── settings.tsx                       #   User preferences & configuration
│   │   └── calendar.tsx                       #   Calendar-based scheduling view
│   │
│   ├── context/
│   │   └── app-context.tsx                    #   Global state (tasks, users, teams, auth)
│   │
│   ├── hooks/
│   │   └── use-toast.ts                       #   Toast notification management
│   │
│   └── lib/
│       ├── assignment-algorithm.ts            #   Deterministic 5-factor scoring engine
│       ├── firebase.ts                        #   Firebase client initialization
│       └── utils.ts                           #   Shared utility functions
│
├── docs/
│   └── algorithm.md                           #   Deep-dive into scoring algorithm
│
├── public/                                    # Static assets (images, icons)
│   ├── logo.png                               #   Aura AI logo
│   ├── Dashboard.png                          #   Dashboard screenshot
│   ├── Dashboard1.png                         #   Dashboard alternate view
│   ├── Landing Page.png                       #   Landing page screenshot
│   ├── Analytics.png                          #   Analytics dashboard screenshot
│   ├── Groups.png                             #   Team groups screenshot
│   ├── Settings.png                           #   Settings page screenshot
│   └── ...                                    #   Additional images
│
├── package.json                               # Dependencies, scripts, metadata
├── tsconfig.json                              # TypeScript compiler configuration
├── tailwind.config.ts                         # Tailwind CSS configuration
├── next.config.ts                             # Next.js configuration
├── postcss.config.js                          # PostCSS configuration
├── .env.example                               # Environment variable template
├── .gitignore                                 # Git ignore rules
└── README.md                                  # This file
```

---

<br/>

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | How to Get |
|-------------|---------|-----------|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org/) |
| **npm** or **yarn** | Latest | Included with Node.js |
| **Firebase Project** | Active account | [Firebase Console](https://console.firebase.google.com/) — enable Firestore & Auth |
| **Google Gemini API Key** | Active key | [Google AI Studio](https://aistudio.google.com/) |

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database** (start in test mode)
4. Enable **Authentication** → Sign-in method → Email/Password
5. Register a **Web app** → Copy the Firebase config values

### Installation

```bash
# Clone the repository
git clone https://github.com/Aicodebyprince/aura_ai_task_manager.git
cd aura_ai_task_manager

# Install all dependencies
npm install
```

### Environment Configuration

```bash
# Create environment file from template
cp .env.example .env
```

Open `.env` and configure:

```env
# ─── Google Gemini API (Required for AI features) ─────────────
GEMINI_API_KEY=your_gemini_api_key_here

# ─── Firebase Configuration (Required for database & auth) ────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
# Terminal 1: Start Next.js dev server (with Turbopack for fast refresh)
npm run dev
# Opens at http://localhost:3000

# Terminal 2 (optional): Start Genkit for AI flow development
npm run genkit:dev
# Opens Genkit developer UI at http://localhost:4000
```

### Production Build

```bash
# TypeScript check
npm run typecheck
# Lint
npm run lint
# Production build
npm run build
# Start production server
npm run start
```

---

<br/>

## 📜 Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev --turbopack` | Development server with Turbopack HMR |
| `build` | `next build` | Production build |
| `start` | `next start` | Production server |
| `lint` | `next lint` | Run ESLint |
| `typecheck` | `tsc --noEmit` | TypeScript type checking |
| `genkit:dev` | `genkit start -- tsx src/ai/dev.ts` | Genkit flow development server |
| `genkit:watch` | `genkit start -- tsx --watch src/ai/dev.ts` | Genkit with file watching |

---

<br/>

## 🤝 Contributing

Contributions are welcome! This is an active project, and improvements, bug fixes, and feature suggestions are appreciated.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feat/your-feature

# Make changes, then run checks
npm run typecheck
npm run lint

# Commit and push
git commit -m "feat: add your feature"
git push origin feat/your-feature

# Open a Pull Request
```

**Priority areas for contribution:**
- Mobile responsive optimization
- Calendar integration (Google / Outlook)
- Slack / Discord webhook integrations
- Public REST API
- Unit and integration tests
- Accessibility improvements

---

<br/>

## ❓ Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| `FirebaseError: Firebase: Error (auth/...).` | Missing or incorrect Firebase env vars | Verify `NEXT_PUBLIC_FIREBASE_*` values in `.env` |
| `Genkit flow returns empty response` | Missing `GEMINI_API_KEY` | Ensure `GEMINI_API_KEY` is set in `.env` |
| `Module not found` | Dependencies not installed | Run `npm install` |
| `PORT 3000 in use` | Another process on port 3000 | Kill the process or set `PORT=3001 next dev` |
| `TypeScript errors after pull` | Type definitions updated | Run `npm install` to sync types |
| `Firestore permission denied` | Security rules not configured | Set rules to `allow read, write: if true;` (dev only) |

---

<br/>

## 🗺️ Roadmap

### ✅ Current
- [x] Hybrid intelligence architecture (deterministic + generative AI)
- [x] Real-time bento-grid dashboard with Kanban boards
- [x] AI Daily Planner using Knapsack heuristic
- [x] Smart Task Assignment with 5-factor scoring
- [x] Conversational AI assistant (Aura) via Genkit
- [x] Team management with skill profiles and workload tracking
- [x] Task timers and time tracking
- [x] Dark / light theme support with Framer Motion transitions
- [x] Drag-and-drop task management (react-dnd)
- [x] Firebase Authentication & real-time Firestore sync
- [x] Recharts analytics dashboard (velocity, completion, performance)
- [x] Dual AI provider support (Gemini 2.5 Flash + GPT-4o-mini)

### 🔄 In Progress
- [ ] Calendar integration (Google / Outlook)
- [ ] Recurring task templates and automation rules
- [ ] Mobile responsive optimization
- [ ] Slack / Discord integration for notifications

### 📋 Planned
- [ ] Public REST API for webhooks & third-party integration
- [ ] Visual workflow builder (custom automation rules)
- [ ] AI-powered sprint retrospectives
- [ ] Offline-first support with Firestore persistence
- [ ] Multi-workspace / organization support
- [ ] Performance benchmarking & optimization

---

<br/>

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<br/>

## 👤 About

**Prince Sherathiya** — Founder-Engineer at **WebTurnerAI**

Building practical AI systems that solve real operational problems. Focused on backend infrastructure, workflow automation, and intelligent tooling that reduces manual effort for teams.

<div align="center">
  <br/>
  <table>
    <tr>
      <td>🐙 <strong>GitHub</strong></td>
      <td><a href="https://github.com/Aicodebyprince">@Aicodebyprince</a></td>
    </tr>
    <tr>
      <td>💼 <strong>LinkedIn</strong></td>
      <td><a href="https://linkedin.com/in/princesherathiya">Prince Sherathiya</a></td>
    </tr>
    <tr>
      <td>🌐 <strong>Portfolio</strong></td>
      <td><a href="https://prince-sherathiya.vercel.app">prince-sherathiya.vercel.app</a></td>
    </tr>
    <tr>
      <td>📧 <strong>Email</strong></td>
      <td><a href="mailto:princesherathiya123@gmail.com">princesherathiya123@gmail.com</a></td>
    </tr>
    <tr>
      <td>🏢 <strong>Company</strong></td>
      <td><strong>WebTurnerAI</strong> — practical AI systems for real operations</td>
    </tr>
  </table>
  <br/>
</div>

---

<br/>

<div align="center">
  <br/>
  <sub>
    Built with precision by
    <strong>
      <a href="https://github.com/Aicodebyprince">WebTurnerAI</a>
    </strong>
    — practical AI systems for real operations. No hype. Just working software.
  </sub>
  <br/><br/>
  <img src="https://img.shields.io/badge/WebTurnerAI-practical_AI_systems_for_real_operations-6366F1?style=for-the-badge" alt="WebTurnerAI"/>
  <br/><br/>
</div>

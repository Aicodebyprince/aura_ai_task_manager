<div align="center">

#  Aura AI — Hybrid Intelligence Task Manager

### *Where Human Intuition Meets Machine Precision*

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Genkit](https://img.shields.io/badge/Genkit-1.14-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://firebase.google.com/docs/genkit)
[![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> **Aura AI** is a state-of-the-art, professional-grade task management ecosystem that eliminates the "coordination tax" of modern teamwork. It combines a deterministic scoring engine with Google Gemini's generative intelligence to automate triage, smart assignment, and daily planning — so your team can focus entirely on execution.

<br/>

---

</div>

## 📖 Table of Contents

1. [✨ Features](#-features)
2. [🧠 Hybrid Intelligence Architecture](#-hybrid-intelligence-architecture)
3. [📐 Core Algorithms](#-core-algorithms)
4. [🛠 Tech Stack](#-tech-stack)
5. [🚀 Getting Started](#-getting-started)
6. [⚙️ Environment Variables](#️-environment-variables)
7. [📂 Project Structure](#-project-structure)
8. [🤖 AI Flows (Genkit)](#-ai-flows-genkit)
9. [🔒 Authentication & Security](#-authentication--security)
10. [📊 Analytics & Performance](#-analytics--performance)
11. [🗺 Roadmap](#-roadmap)
12. [🤝 Contributing](#-contributing)
13. [📄 License](#-license)

---

## ✨ Features

### 🎯 Dashboard & Task Management
| Feature | Description |
|---|---|
| **Bento-Grid Dashboard** | A visual command center with live task KPIs, priority queues, and team velocity — all in a premium glassmorphism layout |
| **Kanban-Style Board** | Drag-and-drop tasks across `Inbox → In Progress → Review → Done` with real-time Firestore sync |
| **Task Timer** | Built-in stopwatch on every task card to track `timeSpent` vs `estimatedTime` for efficiency scoring |
| **Priority Queue** | AI-surfaced "Next Action" — automatically tells you the single most important thing to do right now |
| **Due Date Alerts** | Overdue and approaching-deadline tasks are automatically flagged in the dashboard and in the AI planner |

### 🤖 AI Assistant ("Aura")
| Feature | Description |
|---|---|
| **Plan My Day** | Generates a structured 8-hour time-boxed schedule based on your live task list using the Knapsack heuristic |
| **Natural Language Task Creation** | Say "Create a task to finish the report by Friday, high priority" — the AI calls `createTask` and it appears instantly on your board |
| **Progress Summarization** | Ask "How many tasks are in progress?" and get an accurate, context-aware answer drawn from live Firestore data |
| **Task Prioritization** | Ask "What should I focus on?" to get the AI's top picks both as a narrative _and_ as highlighted task cards |
| **Team Q&A** | "Who is on the Marketing team?" — Aura cross-references group membership and user profiles to answer precisely |

### 👥 Team & Group Intelligence
| Feature | Description |
|---|---|
| **AI Auto-Assign** | Project managers click one button; the algorithm scores all team members and surfaces the top 3 candidates with match reasons |
| **Group Workspaces** | Dedicated collaborative spaces per team, with isolated task lists and shared analytics |
| **Bulk AI Task Generation** | Generate an entire sprint's worth of tasks for a project description in seconds |
| **Real-Time Activity Feed** | Every task update, team invite, and status change is broadcast live via Firestore listeners |
| **Invitation Flow** | Secure, notification-driven member invitation system with `team_invite` activity entries |

### 📈 Analytics & Insights
| Feature | Description |
|---|---|
| **Velocity Charts** | Recharts-powered time-series visualization of team throughput and individual output |
| **Completion Rate Tracking** | Per-user ratio of assigned → completed tasks, updated in real-time |
| **Efficiency Score** | Ratio of estimated vs. actual (timed) hours spent per task |
| **On-Time Rate** | Tracks whether tasks are completed before or after their due dates |

---

## 🧠 Hybrid Intelligence Architecture

Aura AI is built on a **two-layer intelligence model** that combines the strengths of deterministic algorithms and stochastic AI:

```
┌─────────────────────────────────────────────────────┐
│                  AURA AI PLATFORM                   │
│                                                     │
│  ┌───────────────────┐    ┌───────────────────────┐ │
│  │   LAYER 1:        │    │   LAYER 2:            │ │
│  │   Deterministic   │    │   Generative AI       │ │
│  │   Engine          │    │   (Google Gemini)     │ │
│  │                   │    │                       │ │
│  │  • Assignment     │    │  • Conversational     │ │
│  │    Scoring        │◄──►│    Agent (Aura)       │ │
│  │  • Day Planning   │    │  • Task Creation      │ │
│  │    (Knapsack)     │    │  • NLP Q&A            │ │
│  │  • Priority Sort  │    │  • Day Plan Narrative │ │
│  └───────────────────┘    └───────────────────────┘ │
│                   ▲               ▲                 │
│                   └───────┬───────┘                 │
│                           │                         │
│              ┌────────────▼──────────┐              │
│              │   Firebase Firestore  │              │
│              │  (Single Source of    │              │
│              │       Truth)          │              │
│              └───────────────────────┘              │
└─────────────────────────────────────────────────────┘
```

**Layer 1 (Deterministic)** is fast, predictable, and auditable. It handles objective scoring and scheduling.

**Layer 2 (Generative)** handles language understanding, narrative generation, and flexible reasoning over context.

Together, they eliminate the two biggest failure modes of AI-only tools: **hallucination** (countered by deterministic data) and **rigidity** (countered by LLM reasoning).

---

## 📐 Core Algorithms

### Algorithm 1: AI Daily Planner (The Knapsack Approach)

**Goal:** Automatically structure a productive 8-hour workday from any task list.

**Trigger:** User says "Plan my day" to the Aura assistant.

**Steps:**
1. **Overdue Priority Check** — Any task past its `dueDate` is automatically elevated to the top of the queue, regardless of its assigned priority.
2. **Priority Sort** — Remaining tasks are sorted: `High > Medium > Low`.
3. **Time-Boxing** — The algorithm iterates through sorted tasks, allocating time blocks matching each task's `estimatedTime` until 8 hours are filled.
4. **Gap Filling** — If a large task won't fit in remaining time, the algorithm skips it and looks for smaller tasks to fill the gap. Remaining time is marked `"Open for other tasks"`.

```
Knapsack Pseudo-logic:
  capacity = 8 hours
  schedule = []
  for task in sorted(tasks, key=priority_then_overdue):
    if task.estimatedTime <= capacity:
      schedule.append(task)
      capacity -= task.estimatedTime
  return schedule
```

**Output:** A structured `dayPlan[]` array rendered in the chat as a human-readable timetable, starting at 9:00 AM.

---

### Algorithm 2: AI Task Assignment Scorer

**Goal:** Identify the top 3 best-fit team members for any incoming task.

**Trigger:** Project Manager clicks "AI Auto Assign" on a task card.

**Formula:**

$$Score = (A \times 0.30) + (S \times 0.20) + (C \times 0.20) + (T \times 0.20) + (E \times 0.10)$$

| Factor | Weight | Description |
|---|---|---|
| **A** — Availability | 30% | Remaining capacity after summing `estimatedTime` of active tasks. Full capacity = 1.0 |
| **S** — Skill Match | 20% | Keyword overlap between task `title`/`description` and user `skills[]` array |
| **C** — Completion Rate | 20% | `doneTasks / totalAssignedTasks` — historical track record |
| **T** — On-Time Rate | 20% | `onTimeTasks / completedTasks` — deadline reliability |
| **E** — Efficiency | 10% | `estimatedTime / actualTimeSpent` — how fast vs. expected |

**Output:** Top 3 candidates ranked by score, each accompanied by human-readable "Match Reasons" (e.g., `"Highly Available"`, `"Skills Match: React, Firebase"`).

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Full-stack React framework with Server Actions |
| **Language** | TypeScript 5 | Type-safe development across frontend and backend |
| **Styling** | Tailwind CSS 3 | Utility-first CSS with custom glassmorphism design system |
| **Animations** | Framer Motion 11 | Page transitions, micro-interactions, staggered list animations |
| **AI Runtime** | Firebase Genkit 1.14 | Flow orchestration, tool definitions, prompt management |
| **AI Model** | Google Gemini 2.0 Flash | Generative intelligence for the conversational agent — fast, cost-effective, with full function calling and tool use support |
| **Database** | Firebase Firestore | Real-time NoSQL database with live listeners |
| **Auth** | Firebase Authentication | Email/password auth with session management |
| **Analytics** | Firebase Analytics | User event tracking |
| **Charts** | Recharts 2 | Velocity, completion, and efficiency visualizations |
| **Drag & Drop** | React DnD 16 | Kanban board drag-and-drop interactions |
| **Forms** | React Hook Form + Zod | Performant, type-safe form validation |
| **UI Primitives** | Radix UI | Accessible, unstyled UI components (dialogs, dropdowns, etc.) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **Google AI Studio** API key ([Get one free](https://aistudio.google.com/app/apikey))
- A **Firebase** project ([Create one](https://console.firebase.google.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/Aicodebyprince/Aura-AI-Task-Manager.git
cd Aura-AI-Task-Manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root (copy the template below):

```env
# Google Gemini API (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (Required for database & auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Set Up Firebase

1. Enable **Firestore Database** in your Firebase console (start in test mode for development)
2. Enable **Authentication** → Email/Password sign-in provider
3. (Optional) Enable **Firebase Analytics**

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

### 6. (Optional) Run the Genkit Development UI

To inspect and test AI flows interactively:

```bash
npm run genkit:dev
```

Open [http://localhost:4000](http://localhost:4000) to access the Genkit Developer UI.

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key (get free at [aistudio.google.com](https://aistudio.google.com/app/apikey)) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ Yes | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ Yes | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ Yes | Firestore project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ Yes | Firebase Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ Yes | FCM Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ Yes | Firebase App ID |

> **Security note:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📂 Project Structure

```
Aura-AI-Task-Manager/
├── src/
│   ├── ai/
│   │   ├── genkit.ts                   # Genkit + Gemini 2.0 Flash initialization
│   │   ├── flows/
│   │   │   └── conversational-agent-flow.ts  # Main Aura AI chat flow
│   │   └── schemas/
│   │       └── conversational-agent-schema.ts # Zod I/O schemas for AI flows
│   ├── app/
│   │   ├── layout.tsx                  # Root layout + global providers
│   │   ├── page.tsx                    # Landing / Auth page
│   │   └── dashboard/
│   │       └── page.tsx                # Main authenticated dashboard
│   ├── components/
│   │   ├── enhanced-dashboard.tsx      # Core dashboard bento-grid layout
│   │   ├── analytics.tsx               # Performance charts (Recharts)
│   │   ├── colleagues.tsx              # Colleague management UI
│   │   ├── groups.tsx                  # Group/team workspace UI
│   │   ├── settings.tsx                # User settings panel
│   │   └── calendar.tsx                # Calendar view
│   ├── context/
│   │   └── app-context.tsx             # Global state (tasks, users, teams)
│   ├── lib/
│   │   ├── assignment-algorithm.ts     # Deterministic AI Auto-Assign scorer
│   │   ├── firebase.ts                 # Firestore & Auth client initialization
│   │   └── utils.ts                    # Shared utilities
│   └── hooks/
│       └── use-toast.ts                # Toast notification hook
├── docs/
│   └── Algorithm.md                    # Deep-dive algorithm documentation
├── public/                             # Static assets
├── .env                                # Environment variables (gitignored)
├── next.config.ts                      # Next.js configuration
├── tailwind.config.ts                  # Tailwind + custom design tokens
└── package.json
```

---

## 🤖 AI Flows (Genkit)

Aura AI uses **Firebase Genkit** to define, run, and monitor AI flows. All flows are implemented as **Next.js Server Actions** (`'use server'`).

### `conversationalAgentFlow`

**File:** `src/ai/flows/conversational-agent-flow.ts`

This is the central AI brain. It receives the user's chat message plus the full context (tasks, teams, users) from Firestore, and produces a structured response.

**Tools available to the model:**
- `createTask` — Creates a new task object which is then saved to Firestore by the client

**Output Schema (`ConversationalAgentOutput`):**
```typescript
{
  response: string;          // Narrative text response to display in chat
  createdTask?: Task;        // Populated when user asks to create a task
  prioritizedTasks?: string[]; // Task IDs when user asks for prioritization
  dayPlan?: DayPlanItem[];   // Structured schedule when user says "Plan my day"
}
```

**Model:** `googleai/gemini-2.0-flash`
- Fast response times (<2s typical)
- Strong instruction following for structured JSON output
- Full tool use (function calling) support — powers the `createTask` tool

---

## 🔒 Authentication & Security

- **Firebase Authentication** handles all user identity management (email/password)
- **Firestore Security Rules** should be configured to restrict read/write to authenticated users only
- **API Keys** are server-side only — `GEMINI_API_KEY` is never exposed to the browser
- **Server Actions** (`'use server'`) ensure AI flow invocations happen exclusively on the server

### Recommended Firestore Rules (Production)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    match /teams/{teamId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📊 Analytics & Performance

| Metric | Implementation |
|---|---|
| Task Completion Rate | `done_count / total_assigned` per user per period |
| Team Velocity | Count of tasks moved to `done` per day/week (Recharts AreaChart) |
| Efficiency Score | `estimatedTime / actualTimeSpent` (tracked by in-app timer) |
| On-Time Rate | `onTimeTasks / completedTasks` based on `dueDate` vs completion time |
| Workload Distribution | Per-member task count and estimated hours (bar chart) |

---

## 🗺 Roadmap

- [x] Bento-grid premium dashboard
- [x] AI conversational agent (Aura)
- [x] AI Daily Planner (Plan my day)
- [x] AI Auto-Assign with scoring algorithm
- [x] Real-time Firestore sync
- [x] Group workspaces & team management
- [x] Activity feed & notifications
- [x] Performance analytics (Recharts)
- [x] Task timer & efficiency tracking
- [ ] **Mobile App** (React Native / Expo)
- [ ] **Calendar Integrations** (Google Calendar, Outlook)
- [ ] **Slack / Discord Notifications**
- [ ] **Document Summarization** (upload PDF → AI summary → tasks)
- [ ] **Multi-model Support** (choose between Gemini, GPT-4, Claude)
- [ ] **Time Tracking Reports** (exportable PDF/CSV)
- [ ] **Webhook API** for third-party integrations

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open a Pull Request** with a clear description of your changes

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code refactoring
- `chore:` — Maintenance tasks

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Aicodebyprince](https://github.com/Aicodebyprince)**

*Aura AI — Stop managing tasks. Start doing them.*

⭐ If you found this project useful, give it a star!

</div>

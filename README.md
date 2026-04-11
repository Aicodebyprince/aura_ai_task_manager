# ✨ Aura AI: The Intelligent Productivity Operating System

[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![AI Powered by Gemini](https://img.shields.io/badge/AI-Gemini%20&%20Genkit-blueviolet?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Styled with Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Database Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

Aura AI is an advanced, AI-native SaaS platform designed to eliminate cognitive load in modern workplaces. By combining conversational intelligence with rigorous data-driven algorithms, Aura transforms how teams plan, execute, and optimize their workflows.

---

## 🛑 The Problem: Cognitive Overload & Guesswork
In today's fast-paced environments, professional teams face three critical bottlenecks:
1.  **Task Paralysis:** Users spend significant morning time deciding *what* to do instead of *doing* it.
2.  **Subjective Assignment:** Project Managers often assign tasks based on "who's available" rather than "who's best," leading to burnout and suboptimal quality.
3.  **Fragmented Context:** Insights, tracking, and execution live in separate silos, making "flow state" impossible to achieve.

## 💡 The Innovation: Hybrid Intelligence
Aura AI solves these problems through a **Hybrid Intelligence** approach—merging the flexibility of Generative AI with the precision of deterministic algorithms.

### 1. The 8-Hour Daily Planner (Knapsack-Inspired)
Instead of a simple list, Aura uses a time-boxing algorithm that analyzes your 8-hour workday, accounts for overdue blockers, and maps out a continuous, priority-sorted schedule. It fills gaps automatically, ensuring maximum focus on high-impact work.

### 2. Weighted Multi-Metric Auto-Assigner
Aura's proprietary matching engine scores team members across five dimensions:
- **Availability (30%)**: Real-time capacity analysis.
- **Skill Match (20%)**: Semantic analysis of user profiles vs. task requirements.
- **Completion Rate (20%)**: Historical reliability score.
- **On-Time Rate (20%)**: Punctuality index.
- **Efficiency (10%)**: Speed-to-estimation ratio.

---

## 🛠️ Technical Implementation

### Core Architecture
- **Frontend:** Next.js 15 (App Router & Turbopack) for blazing-fast performance.
- **State Management:** React Context API for unified workspace state.
- **AI Integration:** Google Genkit orchestrating Gemini Pro for conversational flows and task extraction.
- **Motion Orchestration:** Framer Motion for premium, high-frequency micro-interactions.
- **Data Layer:** Firebase Firestore for real-time collaboration and Auth for secure access.

### Algorithm Highlights
- **Conversational Task Extraction:** Uses Genkit to parse natural language inputs into structured JSON objects (tasks, deadlines, priorities).
- **Productivity Analytics:** Real-time data processing using Recharts to visualize time-spent vs. estimation accuracy.

---

## 🎨 Professional UX & Aesthetics
Aura AI features a **Premium Bento-Grid Dashboard** designed with:
- **Glassmorphism:** Layered transparency for depth and focus.
- **High-Contrast Dark/Light Modes:** Fully optimized visibility across all environments.
- **Micro-Animations:** Subtle haptic-like feedback for all interactions.
- **Data Density:** Information is presented clearly without clutter using Radix UI primitives.

---

## 📈 Scalability & Feasibility
- **Modular Micro-Actions:** Every feature (Prioritizer, Summarizer, Planner) is an isolated AI flow, making it easy to add new capabilities without regression.
- **Serverless Foundation:** Built on Next.js and Firebase, Aura scales horizontally without the need for manual server provisioning.
- **Enterprise-Ready:** The architecture supports multi-tenant teams and complex role-based access control (RBAC).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- Firebase Project
- Google Gemini API Key

### Setup Instructions
1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Aicodebyprince/Aura-AI-Task-Manager.git
    cd Aura-AI-Task-Manager
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root and add:
    ```env
    GOOGLE_GENAI_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    # (Add other Firebase config variables)
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
5.  **Build for Production:**
    ```bash
    npm run build
    ```

---

## 🧪 Technologies Used
- **Framework:** [Next.js](https://nextjs.org/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Orchestration:** [Google Genkit](https://firebase.google.com/docs/genkit)
- **Model:** [Gemini 1.5 Flash/Pro](https://deepmind.google/technologies/gemini/)
- **Real-time DB:** [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Charts:** [Recharts](https://recharts.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

---

### 📬 Contact & Support
Developed with ❤️ by the Aura AI Team. For inquiries, please open an issue in the [Source Code Repository](https://github.com/Aicodebyprince/Aura-AI-Task-Manager).

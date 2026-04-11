# Aura AI: Hybrid Intelligence Task Management

![Aura AI Banner](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2000)

Aura AI is a state-of-the-art, professional-grade task management ecosystem that bridges the gap between human intuition and machine precision. Designed for high-performance teams, Aura AI utilizes a **Hybrid Intelligence Architecture** to automate the cognitive overhead of coordination, allowing teams to focus on execution.

## 🚀 Vision
In the modern workplace, "coordination tax" often exceeds productive output. Aura AI solves this by implementing deterministic algorithms and probabilistic AI flows to handle task triage, assignment optimization, and team synchronization.

## 🛠 Tech Stack
*   **Frontend**: Next.js 14, React, TypeScript
*   **Styling**: Tailwind CSS (Glassmorphism & Premium UI Design)
*   **Backend/BaaS**: Firebase (Firestore, Authentication, Analytics)
*   **Animations**: Framer Motion (Micro-interactions & Page Transitions)
*   **AI Engine**: Custom LangChain-inspired flows for task prioritization and summarization.

## 🧠 Core Algorithms

### 1. Intelligent Assignment Algorithm
The heart of Aura AI is its deterministic assignment engine (`src/lib/assignment-algorithm.ts`). It calculates an **Assignee Score** through a multi-dimensional weighted formula:

$$Score = (A \times 0.3) + (S \times 0.2) + (C \times 0.2) + (T \times 0.2) + (E \times 0.1)$$

*   **Availability (A)**: Real-time window calculation based on existing estimated workload.
*   **Skill Match (S)**: Keyword analysis matching task requirements against member expertise.
*   **Completion Rate (C)**: Historical data on the ratio of assigned vs. completed tasks.
*   **On-Time Rate (T)**: Probabilistic measure of task delivery compared to deadlines.
*   **Efficiency Score (E)**: Ratio of estimated vs. actual time spent on prior tasks.

### 2. Task Flow Prioritizer
Uses LLM-driven analysis to surface high-impact tasks by evaluating:
*   Semantic urgency (detected through NLP).
*   Systemic dependency (bottleneck detection).
*   Strategic alignment (matching tasks to team goals).

## ✨ Key Features
*   **Bento-Grid Dashboard**: A visual command center for personal and team productivity.
*   **Group Intelligence**: Collaborative workspaces with real-time analytics and bulk AI task generation.
*   **AI Assistant**: A resident pilot ("Aura") that provides daily schedule optimization and document summarization.
*   **Live Activity Feed**: Real-time synchronization of team events, invitations, and progress.
*   **Performance Analytics**: Deep-dive charts (Recharts) visualizing team velocity and individual contributions.

## 🛡 Problem Solving
Aura AI addresses three critical pain points in team management:
1.  **Workload Imbalance**: Prevents burnout by identifying over-utilized members and suggesting available classmates/colleagues.
2.  **Context Switching**: Minimizes mental fatigue through the "Priority Queue," ensuring the next most important task is always known.
3.  **Communication Gaps**: Automated notifications and activity tracking eliminate the need for manual status updates.

## 📦 Getting Started

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Aicodebyprince/Aura-AI-Task-Manager.git
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file with your Firebase configuration.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 📄 License
This project is licensed under the MIT License.

---
Built with ❤️ by the Aura AI Team.

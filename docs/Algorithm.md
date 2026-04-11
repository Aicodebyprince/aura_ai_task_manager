# Aura AI Algorithms Documentation

This document explains the core algorithms utilized by Aura AI to automate and optimize day-to-day productivity for users and project managers.

## 1. AI Daily Planner Algorithm

### Objective
To automatically structure a user's 8-hour workday, taking into account the date, time constraints, and task priority, ensuring that the most critical items are focused on first.

### How it Works
The feature analyzes the user's current pending tasks ("inbox" and "in-progress") and applies the following heuristic:

1. **Overdue Priority Check:** Identifies any tasks that missed their `dueDate` and automatically forces them to the top of the schedule to prevent blockers.
2. **Priority Sorting:** Tasks are then sorted by their given `priority` attribute (High > Medium > Low).
3. **Time-Boxing (The Knapsack Approach):** The algorithm maps out an 8-hour workday block by block. It takes the highest priority task and allocates continuous time slots matching its `estimatedTime`.
4. **Resiliency:** If a high-priority task exceeds the remaining day's capacity, it allocates available hours and moves down the list to fill small gaps with smaller tasks. Any leftover time blocks are marked as "Open for other tasks."

**Use Case:** When arriving at the office, users no longer need to scroll and figure out what to do next. They simply use the "Plan my day" AI command to get an optimized, time-boxed schedule.

---

## 2. Project Manager Task Assignment Algorithm

### Objective
To help Project Managers automatically allocate incoming tasks to the most suitable team members based on data-driven metrics, reducing manual overhead and optimizing team output.

### How it Works
When a manager decides to assign a new task, the algorithm runs a real-time analysis against all members of the team. It scores members across five weighted metrics, generating a final match percentage, and presents the top 3 best candidates to the manager.

#### The Metrics
The final score is a weighted composite of the following factors:

1. **Availability (30% weight)**
   - **Calculation:** Checks current active tasks ("in-progress", "inbox") for the user and sums the `estimatedTime`. 
   - **Rationale:** Ensures we do not overload users who already have a full plate.

2. **Skill Match (20% weight)**
   - **Calculation:** Performs keyword matching between the new task's `title` / `description` and the structured `skills` listed on the user's profile.
   - **Rationale:** Directly matches task requirements with user capabilities.

3. **Completion Rate (20% weight)**
   - **Calculation:** Ratio of assigned tasks physically moved to "done" versus total tasks assigned historically.
   - **Rationale:** Rewards users who consistently close out their responsibilities.

4. **On-Time Projects Rate (20% weight)**
   - **Calculation:** Percentage of completed tasks where `completionStatus` equals "on-time" versus "late".
   - **Rationale:** Highlights reliable individuals for time-sensitive assignments.

5. **Efficiency (10% weight)**
   - **Calculation:** A ratio comparing total `estimatedTime` of completed tasks against the actual `timeSpent` (tracked via the built-in timer). 
   - **Rationale:** Rewards users who get work done faster than expected while maintaining quality.

### The Assignment Flow
1. **Trigger:** The PM creates a task and clicks "AI Auto Assign".
2. **Analysis:** The `getTopAssignees` function processes the team members.
3. **Recommendation:** The interface displays the 3 highest-rated individuals along with key "Match Reasons" (e.g., "Highly Available", "Skills Match: React").
4. **Action:** The PM selects the best option, seamlessly updating the task's `assignedTo` attribute.

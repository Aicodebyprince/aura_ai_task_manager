import { Task, User } from '@/lib/types';

export interface AssigneeScore {
  user: User;
  score: number;
  matchReasons: string[];
  availableInHours: number;
  metrics: {
    availabilityScore: number;
    skillMatchScore: number;
    completionRate: number;
    efficiencyScore: number;
    onTimeRate: number;
  };
}

export function getTopAssignees(
  newTask: { title: string; description: string; estimatedTime: number },
  members: User[],
  allTasks: Task[]
): AssigneeScore[] {
  const taskKeywords = [...newTask.title.toLowerCase().split(/\s+/), ...newTask.description.toLowerCase().split(/\s+/)];

  const scoredMembers = members.map(user => {
    // 1. Calculate Availability (Free time)
    // Less existing estimated time = higher availability score
    const userActiveTasks = allTasks.filter(t => t.assignedTo?.includes(user.id) && t.status !== 'done');
    const existingWorkload = userActiveTasks.reduce((acc, t) => acc + (t.estimatedTime || 1), 0);
    // Score out of 100, where 0 workload = 100
    const availabilityScore = Math.max(0, 100 - (existingWorkload * 5));

    // 2. Skill Match
    let skillMatchScore = 0;
    const matchedSkills: string[] = [];
    if (user.skills && user.skills.length > 0) {
      user.skills.forEach(skill => {
        if (taskKeywords.some(keyword => keyword.includes(skill.toLowerCase()))) {
          skillMatchScore += 20; // 20 points per matched skill
          matchedSkills.push(skill);
        }
      });
    }
    skillMatchScore = Math.min(100, skillMatchScore); // Max 100

    // 3. Historical Performance Metrics
    const userCompletedTasks = allTasks.filter(t => t.assignedTo?.includes(user.id) && t.status === 'done');
    const totalAssigned = allTasks.filter(t => t.assignedTo?.includes(user.id)).length;
    
    // Completion Rate
    const completionRate = totalAssigned > 0 ? (userCompletedTasks.length / totalAssigned) * 100 : 80; // default 80% if no history

    // On-Time Projects Rate
    const onTimeTasks = userCompletedTasks.filter(t => t.completionStatus === 'on-time').length;
    const onTimeRate = userCompletedTasks.length > 0 ? (onTimeTasks / userCompletedTasks.length) * 100 : 80;

    // Efficiency (Time spent vs Estimated time)
    // If spent < estimated, they are highly efficient.
    let totalEstimated = 0;
    let totalSpentSeconds = 0;
    userCompletedTasks.forEach(t => {
      totalEstimated += (t.estimatedTime || 1) * 3600; // in seconds
      totalSpentSeconds += (t.timeSpent || ((t.estimatedTime || 1) * 3600)); 
    });
    let efficiencyRatio = totalSpentSeconds > 0 && totalEstimated > 0 ? totalEstimated / totalSpentSeconds : 1;
    // Cap at 1.5, min 0.5. Normalize to 0-100
    efficiencyRatio = Math.max(0.5, Math.min(1.5, efficiencyRatio));
    const efficiencyScore = ((efficiencyRatio - 0.5) / 1) * 100;

    // Final Weighted Score
    // Weights: Availability(30%), Skills(20%), CompletionRate(20%), OnTimeRate(20%), Efficiency(10%)
    const finalScore = 
      (availabilityScore * 0.30) + 
      (skillMatchScore * 0.20) + 
      (completionRate * 0.20) + 
      (onTimeRate * 0.20) + 
      (efficiencyScore * 0.10);

    const matchReasons: string[] = [];
    if (availabilityScore > 80) matchReasons.push('Highly Available');
    if (skillMatchScore > 0) matchReasons.push(`Skills Match: ${matchedSkills.join(', ')}`);
    if (onTimeRate > 90) matchReasons.push('Consistent On-time Delivery');
    if (efficiencyScore > 80) matchReasons.push('High Efficiency');

    // Default reason if none match strongly
    if (matchReasons.length === 0) matchReasons.push('Good overall candidate');

    return {
      user,
      score: finalScore,
      matchReasons,
      availableInHours: existingWorkload,
      metrics: {
        availabilityScore,
        skillMatchScore,
        completionRate,
        efficiencyScore,
        onTimeRate
      }
    };
  });

  return scoredMembers.sort((a, b) => b.score - a.score).slice(0, 3);
}

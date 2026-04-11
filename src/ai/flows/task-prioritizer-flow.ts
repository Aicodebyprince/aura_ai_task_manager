
'use server';
/**
 * @fileOverview An AI agent that prioritizes tasks.
 *
 * - taskPrioritizer - A function that prioritizes tasks based on urgency and importance.
 */

import {ai} from '@/ai/genkit';
import {
    TaskPrioritizerInputSchema,
    type TaskPrioritizerInput,
    TaskPrioritizerOutputSchema,
    type TaskPrioritizerOutput,
} from '@/ai/schemas/task-prioritizer-schema';

export async function taskPrioritizer(input: TaskPrioritizerInput): Promise<TaskPrioritizerOutput> {
    return taskPrioritizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taskPrioritizerPrompt',
  input: {schema: TaskPrioritizerInputSchema},
  output: {schema: TaskPrioritizerOutputSchema},
  prompt: `You are an expert productivity assistant. Your job is to analyze a list of tasks and identify the most critical items that need attention.

Analyze the provided tasks, considering their status, priority, and due dates. Identify the top 3-5 most important tasks.

Your response must include:
1.  A brief summary explaining your overall prioritization strategy.
2.  A list of the prioritized tasks, including their ID, title, and a short, clear reasoning for why each task is a priority.

Here is the context:
## Tasks
{{#if tasks}}
  {{#each tasks}}
    - Task: {{{title}}} (ID: {{{id}}})
      - Status: {{{status}}}
      - Priority: {{{priority}}}
      {{#if dueDate}}- Due Date: {{{dueDate}}}{{/if}}
  {{/each}}
{{else}}
  - No tasks found.
{{/if}}
`,
});

const taskPrioritizerFlow = ai.defineFlow(
  {
    name: 'taskPrioritizerFlow',
    inputSchema: TaskPrioritizerInputSchema,
    outputSchema: TaskPrioritizerOutputSchema,
  },
  async (input) => {
     if (input.tasks.filter(t => t.status !== 'done').length === 0) {
        return {
            summary: "All tasks are complete! There's nothing to prioritize. Time for a break!",
            prioritizedTasks: []
        }
    }
    const {output} = await prompt(input);
    return output!;
  }
);

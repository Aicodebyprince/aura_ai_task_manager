
'use server';
/**
 * @fileOverview An AI agent that creates a study plan.
 *
 * - studyBuddy - A function that creates a study plan based on user's tasks.
 */

import {ai} from '@/ai/genkit';
import {
    StudyBuddyInputSchema,
    type StudyBuddyInput,
    StudyBuddyOutputSchema,
    type StudyBuddyOutput,
} from '@/ai/schemas/study-buddy-schema';

export async function studyBuddy(input: StudyBuddyInput): Promise<StudyBuddyOutput> {
    return studyBuddyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyBuddyPrompt',
  input: {schema: StudyBuddyInputSchema},
  output: {schema: StudyBuddyOutputSchema},
  prompt: `You are a helpful and encouraging study assistant. Your goal is to create a clear and motivating daily study plan based on a list of tasks.

Analyze the provided tasks, considering their priority and due dates.

Your response must include:
1.  A brief, encouraging summary of the plan for the day.
2.  A list of 'Focus Blocks', which are specific, timed periods dedicated to important tasks.
3.  A list of small, actionable 'Practice Exercises' or review activities that can be done between focus blocks.

Here is the context:
## Tasks
{{#if tasks}}
  {{#each tasks}}
    - Task: {{{title}}}
      - Status: {{{status}}}
      - Priority: {{{priority}}}
      {{#if dueDate}}- Due Date: {{{dueDate}}}{{/if}}
  {{/each}}
{{else}}
  - No tasks found.
{{/if}}
`,
});

const studyBuddyFlow = ai.defineFlow(
  {
    name: 'studyBuddyFlow',
    inputSchema: StudyBuddyInputSchema,
    outputSchema: StudyBuddyOutputSchema,
  },
  async (input) => {
    if (input.tasks.filter(t => t.status !== 'done').length === 0) {
        return {
            summary: "You've completed all your tasks! Great job. Take some time to relax or review past material.",
            focusBlocks: [],
            exercises: ["Review notes from last week's lectures.", "Read ahead for the next chapter in your main subject."]
        }
    }
    const {output} = await prompt(input);
    return output!;
  }
);

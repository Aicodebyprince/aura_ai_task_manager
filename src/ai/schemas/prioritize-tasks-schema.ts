/**
 * @fileOverview Schemas for the task prioritization flow.
 *
 * - PrioritizeTasksInputSchema - The Zod schema for the input of the task prioritization flow.
 * - PrioritizeTasksInput - The TypeScript type for the input of the task prioritization flow.
 * - PrioritizeTasksOutputSchema - The Zod schema for the output of the task prioritization flow.
 * - PrioritizeTasksOutput - The TypeScript type for the output of the task prioritization flow.
 */
import {z} from 'genkit';

export const PrioritizeTasksInputSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.enum(['inbox', 'in-progress', 'done']),
    priority: z.enum(['low', 'medium', 'high']),
    createdAt: z.string(),
    updatedAt: z.string(),
    dueDate: z.string().optional(),
  })
);
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

export const PrioritizeTasksOutputSchema = z.object({
  prioritizedTasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      reasoning: z
        .string()
        .describe('The reasoning for why this task was prioritized.'),
    })
  ),
  summary: z
    .string()
    .describe(
      'A brief summary of the prioritized tasks and the overall plan for the day.'
    ),
});
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

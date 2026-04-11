
import {z} from 'genkit';
import { TaskSchema } from './task-schema';

export const TaskPrioritizerInputSchema = z.object({
  tasks: z.array(TaskSchema),
});
export type TaskPrioritizerInput = z.infer<typeof TaskPrioritizerInputSchema>;

export const TaskPrioritizerOutputSchema = z.object({
    summary: z.string().describe("A brief summary of the prioritization logic."),
    prioritizedTasks: z.array(z.object({
        id: z.string().describe("The ID of the task."),
        title: z.string().describe("The title of the task."),
        reasoning: z.string().describe("The reasoning for why this task was prioritized."),
    })),
});
export type TaskPrioritizerOutput = z.infer<typeof TaskPrioritizerOutputSchema>;

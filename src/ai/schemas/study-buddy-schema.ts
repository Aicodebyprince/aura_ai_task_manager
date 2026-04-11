
import {z} from 'genkit';
import { TaskSchema } from './task-schema';

export const StudyBuddyInputSchema = z.object({
  tasks: z.array(TaskSchema),
});
export type StudyBuddyInput = z.infer<typeof StudyBuddyInputSchema>;

export const StudyBuddyOutputSchema = z.object({
    summary: z.string().describe("A brief, encouraging summary of the study plan."),
    focusBlocks: z.array(z.object({
        time: z.string().describe("e.g., '10:00 AM - 11:30 AM'"),
        task: z.string().describe("The specific task to focus on."),
    })).describe("Blocks of time dedicated to specific tasks."),
    exercises: z.array(z.string()).describe("A list of suggested practice exercises or review activities."),
});
export type StudyBuddyOutput = z.infer<typeof StudyBuddyOutputSchema>;

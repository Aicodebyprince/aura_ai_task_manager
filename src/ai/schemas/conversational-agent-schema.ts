
/**
 * @fileOverview Schemas for the conversational agent flow.
 *
 * - ConversationalAgentInputSchema - The Zod schema for the input of the conversational agent.
 * - ConversationalAgentInput - The TypeScript type for the input of the conversational agent.
 * - ConversationalAgentOutputSchema - The Zod schema for the output of the conversational agent.
 * - ConversationalAgentOutput - The TypeScript type for the output of the conversational agent.
 */

import {z} from 'genkit';

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['inbox', 'in-progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  createdAt: z.string(),
  updatedAt: z.string(),
  dueDate: z.string().optional(),
  estimatedTime: z.number().optional().describe('Estimated time to complete the task in hours.'),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  members: z.array(z.string()),
});

export const ConversationalAgentInputSchema = z.object({
  query: z.string().describe('The user query.'),
  tasks: z.array(TaskSchema),
  users: z.array(UserSchema),
  teams: z.array(TeamSchema),
});
export type ConversationalAgentInput = z.infer<
  typeof ConversationalAgentInputSchema
>;

export const ConversationalAgentOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the user query.'),
  createdTask: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      dueDate: z.string().optional(),
    })
    .optional()
    .describe('A task to be created if requested by the user.'),
  prioritizedTasks: z
    .array(z.string())
    .optional()
    .describe(
      'A list of task IDs that have been identified as priorities in the response.'
    ),
  dayPlan: z
    .object({
      summary: z
        .string()
        .describe("A brief summary of the user's daily plan."),
      timeBlocks: z.array(
        z.object({
          time: z.string().describe("e.g., '09:00 AM - 11:00 AM'"),
          activity: z
            .string()
            .describe('The activity or task scheduled for this block.'),
        })
      ),
    })
    .optional()
    .describe("A structured 8-hour work plan for the user's day."),
});
export type ConversationalAgentOutput = z.infer<
  typeof ConversationalAgentOutputSchema
>;

    
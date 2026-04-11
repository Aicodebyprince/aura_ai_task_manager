
'use server';
/**
 * @fileOverview A conversational agent that can answer questions about tasks.
 *
 * - conversationalAgent - A function that handles the conversational process.
 */

import {ai} from '@/ai/genkit';
import {
  ConversationalAgentInputSchema,
  type ConversationalAgentInput,
  ConversationalAgentOutputSchema,
  type ConversationalAgentOutput,
} from '@/ai/schemas/conversational-agent-schema';
import {z} from 'genkit';

export async function conversationalAgent(
  input: ConversationalAgentInput
): Promise<ConversationalAgentOutput> {
  const result = await conversationalAgentFlow(input);
  return result;
}

const CreatedTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().describe('YYYY-MM-DD format').optional(),
});

const createTaskTool = ai.defineTool(
  {
    name: 'createTask',
    description:
      'Use this to create a new task for the user. Infer the title, description, priority, and due date from the user query.',
    inputSchema: CreatedTaskSchema,
    outputSchema: CreatedTaskSchema,
  },
  async (task) => {
    // In a real app, this would be saved to a database.
    // The flow will return this object to the client to be added.
    return task;
  }
);

const prompt = ai.definePrompt({
  name: 'conversationalAgentPrompt',
  input: {schema: ConversationalAgentInputSchema},
  output: {schema: ConversationalAgentOutputSchema},
  tools: [createTaskTool],
  prompt: `You are a world-class productivity assistant named Aura AI. Your goal is to help the user manage their tasks, teams, and colleagues.

You will be given a user's query and a list of their tasks, users, and teams.

Analyze the user's query and the provided context to give a helpful and accurate response. Format your response with paragraphs, and for lists, start each item on a new line with a hyphen and a space (e.g., "- First item"). When you refer to a specific task, make it stand out by wrapping its title in double asterisks (e.g., **Complete Project Report**).

If the user asks you to create a task, you MUST use the 'createTask' tool. Do not simply say you have created it; you must call the tool. When the tool returns the created task, you should confirm to the user that it has been created and place the created task object in the 'createdTask' field of your output.

If the user asks for prioritization, identify the most critical tasks. Your text response should give a brief summary. You MUST also populate the 'prioritizedTasks' field in your output with the IDs of those priority tasks. The UI will then display these tasks in a special format, so do not list all their details in your text response.

If the user asks to "plan my day", "schedule my day", or a similar request, you MUST create a structured 8-hour work plan. First, prioritize any overdue tasks from the inbox. Then, fill the schedule with other high-priority tasks. CRITICAL: You must respect the 'estimatedTime' for each task. Do not schedule a task for longer than its estimated time. The plan should only consist of tasks from the list. Do not add generic activities like 'Lunch break' or 'Check emails' unless they are explicitly in the tasks list. If there are not enough tasks to fill an 8-hour day, schedule the existing tasks and then add a final block for 'Open for other tasks'. Your response must include a brief text summary and you MUST populate the 'dayPlan' field in your output with the structured plan.

If the user asks a question about their tasks, teams, or colleagues (e.g., "how many tasks are in progress?", "who is on the marketing team?"), use the provided context to answer them accurately. To determine who is on a team, you must look at the 'members' array in the team object and find the matching user from the 'Users' list.

If a user asks you to do something you cannot do, politely decline and explain your limitations.

User's query: {{{query}}}

Here is the context:
## Tasks
{{#if tasks}}
  {{#each tasks}}
  - Task: {{{title}}} (ID: {{{id}}})
    - Description: {{{description}}}
    - Status: {{{status}}}
    - Priority: {{{priority}}}
    - Updated At: {{{updatedAt}}}
    {{#if dueDate}}- Due Date: {{{dueDate}}}{{/if}}
    {{#if estimatedTime}}- Estimated Time: {{{estimatedTime}}} hours{{/if}}
  {{/each}}
{{else}}
  - No tasks found.
{{/if}}

## Teams
{{#if teams}}
  {{#each teams}}
  - Team: {{{name}}}
    - Member IDs: {{#each members}}{{this}}, {{/each}}
  {{/each}}
{{else}}
  - No teams found.
{{/if}}

## Users
{{#if users}}
  {{#each users}}
  - User: {{{name}}} ({{email}}) - ID: {{{id}}}
  {{/each}}

{{else}}
  - No users found.
{{/if}}
`,
});

const conversationalAgentFlow = ai.defineFlow(
  {
    name: 'conversationalAgentFlow',
    inputSchema: ConversationalAgentInputSchema,
    outputSchema: ConversationalAgentOutputSchema,
  },
  async ({query, tasks, users, teams}) => {
    if (
      tasks.length === 0 &&
      (query.toLowerCase().includes('task') ||
        query.toLowerCase().includes('progress') ||
        query.toLowerCase().includes('summary') ||
        query.toLowerCase().includes('status') ||
        query.toLowerCase().includes('completed') ||
        query.toLowerCase().includes('priorit')) &&
      !query.toLowerCase().includes('create')
    ) {
      return {
        response:
          "You have no tasks, so I can't report on your progress. Try creating a task first!",
      };
    }

    try {
      const {output} = await prompt({query, tasks, users, teams});

      if (output === null || output === undefined) {
        return {
          response:
            "I'm sorry, I couldn't generate a response. Please try again.",
        };
      }

      return output;
    } catch (error: any) {
      console.error('Error in conversationalAgentFlow:', error);
      return {
        response:
          `I'm sorry, I encountered an error while generating a response${error.message ? ': ' + error.message : ''}. Please try again.`,
      };
    }
  }
);

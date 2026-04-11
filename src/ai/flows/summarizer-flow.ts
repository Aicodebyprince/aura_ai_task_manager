
'use server';
/**
 * @fileOverview An AI agent that summarizes notes.
 *
 * - summarizer - A function that generates a summary from a block of text.
 */

import {ai} from '@/ai/genkit';
import {
    SummarizerInputSchema,
    type SummarizerInput,
    SummarizerOutputSchema,
    type SummarizerOutput,
} from '@/ai/schemas/summarizer-schema';

export async function summarizer(input: SummarizerInput): Promise<SummarizerOutput> {
    return summarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizerPrompt',
  input: {schema: SummarizerInputSchema},
  output: {schema: SummarizerOutputSchema},
  prompt: `You are a helpful teaching assistant. Your goal is to create a concise summary based on the provided study notes.

Summarize the following notes:
{{{notes}}}
`,
});

const summarizerFlow = ai.defineFlow(
  {
    name: 'summarizerFlow',
    inputSchema: SummarizerInputSchema,
    outputSchema: SummarizerOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

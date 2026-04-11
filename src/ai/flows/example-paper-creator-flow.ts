
'use server';
/**
 * @fileOverview An AI agent that generates example papers or outlines.
 *
 * - examplePaperCreator - A function that generates content for a given topic.
 */

import {ai} from '@/ai/genkit';
import {
    ExamplePaperCreatorInputSchema,
    type ExamplePaperCreatorInput,
    ExamplePaperCreatorOutputSchema,
    type ExamplePaperCreatorOutput,
} from '@/ai/schemas/example-paper-creator-schema';

export async function examplePaperCreator(input: ExamplePaperCreatorInput): Promise<ExamplePaperCreatorOutput> {
    return examplePaperCreatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'examplePaperCreatorPrompt',
  input: {schema: ExamplePaperCreatorInputSchema},
  output: {schema: ExamplePaperCreatorOutputSchema},
  prompt: `You are an expert academic writer. Your task is to generate a short, well-structured example essay outline on the given topic.

Topic: "{{{topic}}}"

Generate an outline that includes:
- An introduction with a thesis statement.
- Three main body paragraphs, each with a clear topic sentence.
- A conclusion that summarizes the main points.

The output should be a single string formatted with simple HTML tags (e.g., <h3> for headings, <p> for paragraphs, <ul> and <li> for lists).
`,
});

const examplePaperCreatorFlow = ai.defineFlow(
  {
    name: 'examplePaperCreatorFlow',
    inputSchema: ExamplePaperCreatorInputSchema,
    outputSchema: ExamplePaperCreatorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);


'use server';
/**
 * @fileOverview An AI agent that creates quizzes from notes.
 *
 * - quizCreator - A function that generates a quiz from a block of text.
 */

import {ai} from '@/ai/genkit';
import {
    QuizCreatorInputSchema,
    type QuizCreatorInput,
    QuizCreatorOutputSchema,
    type QuizCreatorOutput,
} from '@/ai/schemas/quiz-creator-schema';

export async function quizCreator(input: QuizCreatorInput): Promise<QuizCreatorOutput> {
    return quizCreatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizCreatorPrompt',
  input: {schema: QuizCreatorInputSchema},
  output: {schema: QuizCreatorOutputSchema},
  prompt: `You are a helpful teaching assistant. Your goal is to create a multiple-choice quiz based on the provided study notes.

Generate {{{numQuestions}}} multiple-choice questions from the following notes. Each question should have 4 options.
{{#if includeAnswers}}
You MUST provide the correct answer for each question in the 'answer' field.
{{else}}
You MUST NOT provide the correct answer for any question. The 'answer' field should be omitted.
{{/if}}

Notes:
{{{notes}}}
`,
});

const quizCreatorFlow = ai.defineFlow(
  {
    name: 'quizCreatorFlow',
    inputSchema: QuizCreatorInputSchema,
    outputSchema: QuizCreatorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

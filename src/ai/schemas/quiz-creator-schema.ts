
import {z} from 'genkit';

export const QuizCreatorInputSchema = z.object({
  notes: z.string().describe('The study material or notes to generate a quiz from.'),
  numQuestions: z.number().min(1).max(50).describe('The number of multiple-choice questions to generate.'),
  includeAnswers: z.boolean().describe('Whether or not to include the correct answer in the output.'),
});
export type QuizCreatorInput = z.infer<typeof QuizCreatorInputSchema>;

export const QuizCreatorOutputSchema = z.object({
    questions: z.array(z.object({
        question: z.string().describe("The quiz question."),
        options: z.array(z.string()).describe("A list of 4 multiple-choice options."),
        answer: z.string().optional().describe("The correct answer from the options. Only include if requested."),
    })).describe("An array of quiz questions."),
});
export type QuizCreatorOutput = z.infer<typeof QuizCreatorOutputSchema>;

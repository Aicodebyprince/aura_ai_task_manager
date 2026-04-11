
import {z} from 'genkit';

export const SummarizerInputSchema = z.object({
  notes: z.string().describe('The study material or notes to generate a summary from.'),
});
export type SummarizerInput = z.infer<typeof SummarizerInputSchema>;

export const SummarizerOutputSchema = z.object({
    summary: z.string().describe("A concise summary of the provided notes."),
});
export type SummarizerOutput = z.infer<typeof SummarizerOutputSchema>;

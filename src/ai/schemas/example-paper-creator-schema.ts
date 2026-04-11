
import {z} from 'genkit';

export const ExamplePaperCreatorInputSchema = z.object({
  topic: z.string().describe('The topic for the example paper.'),
});
export type ExamplePaperCreatorInput = z.infer<typeof ExamplePaperCreatorInputSchema>;

export const ExamplePaperCreatorOutputSchema = z.object({
    paperContent: z.string().describe("The generated content of the example paper or essay, formatted in HTML."),
});
export type ExamplePaperCreatorOutput = z.infer<typeof ExamplePaperCreatorOutputSchema>;


import {z} from 'genkit';

export const ResourceRecommenderInputSchema = z.object({
  topic: z.string().describe('The subject or topic for which resources are needed.'),
});
export type ResourceRecommenderInput = z.infer<typeof ResourceRecommenderInputSchema>;

export const ResourceRecommenderOutputSchema = z.object({
    resources: z.array(z.object({
        type: z.enum(['video', 'article', 'tutorial', 'book', 'course']).describe("The type of the resource."),
        title: z.string().describe("The title of the resource."),
        description: z.string().describe("A brief, one-sentence description of the resource and why it's useful."),
        url: z.string().url().describe("The URL to access the resource."),
    })),
});
export type ResourceRecommenderOutput = z.infer<typeof ResourceRecommenderOutputSchema>;

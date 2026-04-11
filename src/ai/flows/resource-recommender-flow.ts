
'use server';
/**
 * @fileOverview An AI agent that recommends learning resources.
 *
 * - resourceRecommender - A function that suggests learning resources for a given topic.
 */

import {ai} from '@/ai/genkit';
import {
    ResourceRecommenderInputSchema,
    type ResourceRecommenderInput,
    ResourceRecommenderOutputSchema,
    type ResourceRecommenderOutput,
} from '@/ai/schemas/resource-recommender-schema';

export async function resourceRecommender(input: ResourceRecommenderInput): Promise<ResourceRecommenderOutput> {
    return resourceRecommenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resourceRecommenderPrompt',
  input: {schema: ResourceRecommenderInputSchema},
  output: {schema: ResourceRecommenderOutputSchema},
  prompt: `You are an expert academic librarian. Your goal is to recommend high-quality, free learning resources for a given topic.

For the topic "{{{topic}}}", please find 3-5 relevant and helpful resources from the web.

For each resource, provide its type (video, article, tutorial, etc.), a clear title, a brief description, and a valid URL.
`,
});

const resourceRecommenderFlow = ai.defineFlow(
  {
    name: 'resourceRecommenderFlow',
    inputSchema: ResourceRecommenderInputSchema,
    outputSchema: ResourceRecommenderOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

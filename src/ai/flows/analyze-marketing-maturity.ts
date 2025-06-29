'use server';

/**
 * @fileOverview AI-driven tool that analyzes a prospect's inputs,
 * assesses the business's current marketing maturity level,
 * and offers tailored solutions based on algorithmic insights.
 *
 * - analyzeMarketingMaturity - A function that handles the analysis and solution generation.
 * - AnalyzeMarketingMaturityInput - The input type for the analyzeMarketingMaturity function.
 * - AnalyzeMarketingMaturityOutput - The return type for the analyzeMarketingMaturity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMarketingMaturityInputSchema = z.object({
  businessDescription: z
    .string()
    .describe('A detailed description of the business, its products, and target audience.'),
  marketingEfforts: z
    .string()
    .describe('A comprehensive overview of current marketing efforts and strategies.'),
  marketingGoals: z.string().describe('Specific, measurable marketing goals and objectives.'),
  monthlyBudget: z.string().describe("The prospective client's stated monthly advertising budget."),
});
export type AnalyzeMarketingMaturityInput = z.infer<typeof AnalyzeMarketingMaturityInputSchema>;

const AnalyzeMarketingMaturityOutputSchema = z.object({
  maturityLevel: z
    .string()
    .describe(
      'An assessment of the business marketing maturity level (e.g., Beginner, Intermediate, Advanced).'
    ),
  suggestedSolutions: z
    .string()
    .describe('Tailored solutions and recommendations to improve the marketing funnel.'),
  suggestedTactics: z
    .string()
    .describe(
      'Suggested marketing tactics and platform prioritization for funnel mastery based on algorithmic insights.'
    ),
});
export type AnalyzeMarketingMaturityOutput = z.infer<typeof AnalyzeMarketingMaturityOutputSchema>;

export async function analyzeMarketingMaturity(
  input: AnalyzeMarketingMaturityInput
): Promise<AnalyzeMarketingMaturityOutput> {
  return analyzeMarketingMaturityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketingMaturityPrompt',
  input: {schema: AnalyzeMarketingMaturityInputSchema},
  output: {schema: AnalyzeMarketingMaturityOutputSchema},
  prompt: `You are an expert marketing consultant specializing in marketing funnel optimization.

You will analyze the provided information about the business, its marketing efforts, and goals to determine its marketing maturity level and suggest tailored solutions.

Business Description: {{{businessDescription}}}
Marketing Efforts: {{{marketingEfforts}}}
Marketing Goals: {{{marketingGoals}}}
Monthly Budget: {{{monthlyBudget}}}

Based on this information, assess the marketing maturity level and provide specific, actionable solutions to improve their marketing funnel and achieve their goals. Also suggest specific marketing tactics and platform prioritization.

Ensure your response is clear, concise, and directly addresses the business needs.

Here's an outline on how to approach the prompt:
1.  Acknowledge receipt of the business description, marketing efforts and marketing goals.
2.  Based on the info provided, assess the marketing maturity level of the business (Beginner, Intermediate, Advanced).
3.  Provide tailored solutions and recommendations to improve the marketing funnel.
4.  Suggest specific marketing tactics and platform prioritization for funnel mastery based on algorithmic insights.
`,
});

const analyzeMarketingMaturityFlow = ai.defineFlow(
  {
    name: 'analyzeMarketingMaturityFlow',
    inputSchema: AnalyzeMarketingMaturityInputSchema,
    outputSchema: AnalyzeMarketingMaturityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

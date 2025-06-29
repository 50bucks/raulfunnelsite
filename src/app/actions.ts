'use server';

import { analyzeMarketingMaturity, AnalyzeMarketingMaturityInput } from '@/ai/flows/analyze-marketing-maturity';
import { FunnelFormValues, funnelFormSchema } from '@/lib/schema';

export async function submitFunnelForm(data: FunnelFormValues) {
  const parsedData = funnelFormSchema.safeParse(data);

  if (!parsedData.success) {
    console.error('Form validation failed:', parsedData.error.flatten());
    return { success: false, error: 'Invalid form data provided.' };
  }
  
  const { businessDescription, marketingEfforts, marketingGoals, challenge, monthlyBudget } = parsedData.data;

  if (monthlyBudget === '<1500') {
    console.log('Low-budget submission received, not processing as a lead:', { email: parsedData.data.email });
    return {
      success: true,
      data: {
        maturityLevel: 'Basic Analysis',
        suggestedSolutions: 'To achieve your marketing goals and see a significant return on investment, we recommend increasing your monthly ad spend to $1,500 or more. Higher budgets allow for more aggressive testing, campaign scaling, and access to advanced strategies that can significantly lower your acquisition costs.',
        suggestedTactics: 'Our AI-powered tactical recommendations are reserved for clients who meet the minimum budget requirement. This ensures we can provide actionable strategies with a high probability of success.',
      }
    };
  }

  const aiInput: AnalyzeMarketingMaturityInput = {
    businessDescription,
    marketingEfforts,
    marketingGoals: `Primary challenge is "${challenge}". Stated goals: ${marketingGoals}`,
    monthlyBudget,
  };

  try {
    const result = await analyzeMarketingMaturity(aiInput);
    
    // In a real-world application, this is where you would integrate with an email service provider
    console.log('New lead captured:', { name: parsedData.data.name, email: parsedData.data.email, company: parsedData.data.companyName });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error calling AI flow:', error);
    return { success: false, error: 'An unexpected error occurred while analyzing your data. Please try again later.' };
  }
}

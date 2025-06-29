'use server';

import { analyzeMarketingMaturity, AnalyzeMarketingMaturityInput } from '@/ai/flows/analyze-marketing-maturity';
import { FunnelFormValues, funnelFormSchema } from '@/lib/schema';

export async function submitFunnelForm(data: FunnelFormValues) {
  const parsedData = funnelFormSchema.safeParse(data);

  if (!parsedData.success) {
    console.error('Form validation failed:', parsedData.error.flatten());
    return { success: false, error: 'Invalid form data provided.' };
  }
  
  const { businessDescription, marketingEfforts, marketingGoals, challenge } = parsedData.data;

  const aiInput: AnalyzeMarketingMaturityInput = {
    businessDescription,
    marketingEfforts,
    marketingGoals: `Primary challenge is "${challenge}". Stated goals: ${marketingGoals}`,
  };

  try {
    const result = await analyzeMarketingMaturity(aiInput);
    
    // The user requested sending form data via email.
    // In a real-world application, this is where you would integrate with an email service provider (e.g., SendGrid, Resend)
    // or store the lead in a database (e.g., Firestore).
    // Example: await sendEmail({ to: 'lepokehlraul@gmail.com', subject: 'New Funnel Analysis Lead', data: parsedData.data });
    console.log('New lead captured:', { name: parsedData.data.name, email: parsedData.data.email, company: parsedData.data.companyName });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error calling AI flow:', error);
    return { success: false, error: 'An unexpected error occurred while analyzing your data. Please try again later.' };
  }
}

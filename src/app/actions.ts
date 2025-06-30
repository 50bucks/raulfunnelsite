'use server';

import {
  analyzeMarketingMaturity,
  AnalyzeMarketingMaturityInput,
  AnalyzeMarketingMaturityOutput,
} from '@/ai/flows/analyze-marketing-maturity';
import { FunnelFormValues, funnelFormSchema } from '@/lib/schema';

export type SubmissionResult = {
  success: boolean;
  contactWillBeMade: boolean;
  data?: AnalyzeMarketingMaturityOutput;
  error?: string;
};

export async function submitFunnelForm(data: FunnelFormValues): Promise<SubmissionResult> {
  const parsedData = funnelFormSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.flatten().fieldErrors;
    console.error('Form validation failed:', errorMessages);
    const firstError = Object.values(errorMessages)[0]?.[0] || 'Invalid form data provided.';
    return { success: false, contactWillBeMade: false, error: firstError };
  }

  const { businessDescription, marketingEfforts, marketingGoals, challenge, monthlyBudget } = parsedData.data;

  if (monthlyBudget === '<1500') {
    return {
      success: true,
      contactWillBeMade: false,
      data: {
        maturityLevel: 'Basic Analysis',
        suggestedSolutions: 'To unlock advanced strategies and maximize your return on investment, a larger budget is recommended. Contact Raul to get your personalized results.',
        suggestedTactics: 'Personalized tactical recommendations are available for partners ready to invest in significant growth. Contact Raul to get your personalized results.',
      },
    };
  }
  
  const { GOOGLE_API_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } = process.env;

  if (!GOOGLE_API_KEY) {
    console.error('Google API Key is not configured. AI analysis cannot proceed.');
    return { success: false, contactWillBeMade: false, error: 'The analysis service is temporarily unavailable. Please try again later.' };
  }

  const aiInput: AnalyzeMarketingMaturityInput = {
    businessDescription,
    marketingEfforts,
    marketingGoals: `Primary challenge is "${challenge}". Stated goals: ${marketingGoals}`,
    monthlyBudget,
  };

  try {
    const result = await analyzeMarketingMaturity(aiInput);

    console.log('New lead captured:', {
      name: parsedData.data.name,
      email: parsedData.data.email,
      company: parsedData.data.companyName,
    });

    const callToAction =
      '\n\nBy partnering with a media buyer specialist like Raul, you can implement these strategies effectively and achieve your expected results.';

    const finalResult = {
      ...result,
      suggestedSolutions: `${result.suggestedSolutions}${callToAction}`,
      suggestedTactics: `${result.suggestedTactics}${callToAction}`,
    };

    // Send email but don't let it block the response to the user
    (async () => {
      try {
        if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && EMAILJS_PRIVATE_KEY) {
          const emailjsData = {
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            private_key: EMAILJS_PRIVATE_KEY, // Corrected from accessToken
            template_params: {
              name: parsedData.data.name,
              email: parsedData.data.email,
              company_name: parsedData.data.companyName,
              challenge: parsedData.data.challenge,
              monthly_budget: parsedData.data.monthlyBudget,
              business_description: parsedData.data.businessDescription,
              marketing_efforts: parsedData.data.marketingEfforts,
              marketing_goals: parsedData.data.marketingGoals,
              maturity_level: finalResult.maturityLevel,
              suggested_solutions: finalResult.suggestedSolutions,
              suggested_tactics: finalResult.suggestedTactics,
            },
          };

          const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailjsData),
          });

          if (response.ok) {
            console.log('Email sent successfully via EmailJS');
          } else {
            const text = await response.text();
            console.error('Failed to send email via EmailJS. Status:', response.status, 'Body:', text);
          }
        } else {
          console.error('EmailJS environment variables are not fully configured. Email not sent.');
        }
      } catch (emailError) {
        console.error('Caught an error while trying to send email via EmailJS:', emailError);
      }
    })();

    return { success: true, contactWillBeMade: true, data: finalResult };
  } catch (error) {
    console.error('Error calling AI flow:', error);
    return {
      success: false,
      contactWillBeMade: false,
      error: 'An unexpected error occurred while analyzing your data. Please try again later.',
    };
  }
}

'use server';

import {
  analyzeMarketingMaturity,
  AnalyzeMarketingMaturityInput,
  AnalyzeMarketingMaturityOutput,
} from '@/ai/flows/analyze-marketing-maturity';
import { FunnelFormValues, funnelFormSchema } from '@/lib/schema';
import { Resend } from 'resend';

export type SubmissionResult = {
  success: boolean;
  contactWillBeMade: boolean;
  data?: AnalyzeMarketingMaturityOutput;
  error?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitFunnelForm(data: FunnelFormValues): Promise<SubmissionResult> {
  const parsedData = funnelFormSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.flatten().fieldErrors;
    console.error('Form validation failed:', errorMessages);
    const firstError = Object.values(errorMessages)[0]?.[0] || 'Invalid form data provided.';
    return { success: false, contactWillBeMade: false, error: firstError };
  }

  const {
    name,
    email,
    companyName,
    businessDescription,
    marketingEfforts,
    marketingGoals,
    challenge,
    monthlyBudget,
  } = parsedData.data;

  if (monthlyBudget === '<1500') {
    return {
      success: true,
      contactWillBeMade: false,
      data: {
        maturityLevel: 'Basic Analysis',
        suggestedSolutions:
          'To unlock advanced strategies and maximize your return on investment, a larger budget is recommended. Contact Raul to get your personalized results.',
        suggestedTactics:
          'Personalized tactical recommendations are available for partners ready to invest in significant growth. Contact Raul to get your personalized results.',
      },
    };
  }

  const { GOOGLE_API_KEY, RESEND_API_KEY, TO_EMAIL } = process.env;

  if (!GOOGLE_API_KEY) {
    console.error('Google API Key is not configured. AI analysis cannot proceed.');
    return {
      success: false,
      contactWillBeMade: false,
      error: 'The analysis service is temporarily unavailable. Please try again later.',
    };
  }

  if (!RESEND_API_KEY || !TO_EMAIL) {
    console.error('Resend API Key or To Email is not configured. Email notifications are disabled.');
    return {
      success: false,
      contactWillBeMade: false,
      error: 'The notification service is temporarily unavailable. Please try again later.',
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

    const callToAction =
      '\n\nBy partnering with a media buyer specialist like Raul, you can implement these strategies effectively and achieve your expected results.';

    const finalResult = {
      ...result,
      suggestedSolutions: `${result.suggestedSolutions}${callToAction}`,
      suggestedTactics: `${result.suggestedTactics}${callToAction}`,
    };

    (async () => {
      try {
        console.log('Attempting to send email via Resend...');
        
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #2d3e50;">New Marketing Analysis Lead!</h2>
              <p>A new potential client has completed the marketing analysis form. Here are their details:</p>
              
              <h3 style="color: #2d3e50;">Contact Info</h3>
              <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Company:</strong> ${companyName}</li>
              </ul>
              
              <h3 style="color: #2d3e50;">Client's Submission</h3>
              <ul>
                <li><strong>Biggest Challenge:</strong> ${challenge}</li>
                <li><strong>Monthly Budget:</strong> ${monthlyBudget}</li>
                <li><strong>Business Description:</strong> ${businessDescription}</li>
                <li><strong>Current Marketing Efforts:</strong> ${marketingEfforts}</li>
                <li><strong>Marketing Goals:</strong> ${marketingGoals}</li>
              </ul>
              
              <h3 style="color: #2d3e50;">AI-Generated Analysis</h3>
              <ul>
                <li><strong>Maturity Level:</strong> ${finalResult.maturityLevel}</li>
                <li><strong>Suggested Solutions:</strong><br/>${finalResult.suggestedSolutions.replace(/\n/g, '<br>')}</li>
                <li><strong>Suggested Tactics:</strong><br/>${finalResult.suggestedTactics.replace(/\n/g, '<br>')}</li>
              </ul>
              
              <p style="margin-top: 20px;">Follow up with this lead soon!</p>
          </div>
        `;

        const { data, error } = await resend.emails.send({
          from: 'Raul Funnel Site <onboarding@resend.dev>',
          to: [TO_EMAIL],
          subject: `New Lead: ${name} from ${companyName}`,
          html: emailHtml,
        });

        if (error) {
          console.error('Failed to send email via Resend:', error);
          return;
        }

        console.log('Email sent successfully via Resend. ID:', data?.id);
      } catch (emailError) {
        console.error('Caught an error while trying to send email via Resend:', emailError);
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

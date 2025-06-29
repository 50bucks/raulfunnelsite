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
        suggestedSolutions: 'To unlock advanced strategies and maximize your return on investment, a larger budget is recommended. This allows for comprehensive campaign testing and scaling. Contact Raul to get your results.',
        suggestedTactics: 'Personalized tactical recommendations are available for partners ready to invest in significant growth. Contact Raul to get your results.',
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
    
    console.log('New lead captured:', { name: parsedData.data.name, email: parsedData.data.email, company: parsedData.data.companyName });

    const callToAction = "\n\nBy partnering with a media buyer specialist like Raul, you can implement these strategies effectively and achieve your expected results.";

    const finalResult = {
      ...result,
      suggestedSolutions: `${result.suggestedSolutions}${callToAction}`,
      suggestedTactics: `${result.suggestedTactics}${callToAction}`,
    };

    // Send email using EmailJS REST API
    const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } = process.env;

    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && EMAILJS_PRIVATE_KEY) {
      const emailjsData = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
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
      
      // Fire and forget the email sending so it doesn't block the user response
      fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailjsData),
      }).then(response => {
          if (response.ok) {
              console.log('Email sent successfully via EmailJS');
          } else {
              response.text().then(text => {
                  console.error('Failed to send email via EmailJS:', text);
              });
          }
      }).catch(error => {
          console.error('Error sending email via EmailJS:', error);
      });
    } else {
        console.error('EmailJS environment variables are not fully configured. Email not sent.');
    }

    return { success: true, data: finalResult };
  } catch (error) {
    console.error('Error calling AI flow:', error);
    return { success: false, error: 'An unexpected error occurred while analyzing your data. Please try again later.' };
  }
}

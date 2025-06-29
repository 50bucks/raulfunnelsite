import { z } from 'zod';

export const funnelFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  challenge: z.enum(['lead-generation', 'brand-awareness', 'sales-conversion', 'other'], {
    required_error: 'You need to select your primary challenge.',
  }),
  businessDescription: z.string().min(20, { message: 'Please describe your business in at least 20 characters.' }),
  marketingEfforts: z.string().min(20, { message: 'Please describe your marketing efforts in at least 20 characters.' }),
  marketingGoals: z.string().min(10, { message: 'Please describe your marketing goals in at least 10 characters.' }),
});

export type FunnelFormValues = z.infer<typeof funnelFormSchema>;

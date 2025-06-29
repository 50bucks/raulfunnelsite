'use client';

import { useState, useEffect } from 'react';
import { useForm, type FieldNames } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FunnelFormValues, funnelFormSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

const challengeOptions = {
  'lead-generation': {
    label: 'Lead Generation',
    placeholder: 'e.g., Generate 50 new qualified leads per month.',
  },
  'brand-awareness': {
    label: 'Brand Awareness',
    placeholder: 'e.g., Increase web traffic by 30% next quarter.',
  },
  'sales-conversion': {
    label: 'Sales Conversion',
    placeholder: 'e.g., Improve our funnel conversion rate by 15%.',
  },
  other: {
    label: 'Other',
    placeholder: 'e.g., Launch a new product and gain market share.',
  },
};

const budgetOptions: { [key: string]: { label: string } } = {
  '<1500': { label: 'Under $1,500 / month' },
  '1500-5000': { label: '$1,500 - $5,000 / month' },
  '5000-10000': { label: '$5,000 - $10,000 / month' },
  '>10000': { label: 'Over $10,000 / month' },
};

const totalSteps = 6;

const stepFields: FieldNames<FunnelFormValues>[][] = [
  ['name', 'email', 'companyName'],
  ['challenge'],
  ['monthlyBudget'],
  ['businessDescription'],
  ['marketingEfforts'],
  ['marketingGoals'],
];

interface FunnelFormProps {
  onSubmit: (data: FunnelFormValues) => void;
  isLoading?: boolean;
}

export function FunnelForm({ onSubmit, isLoading }: FunnelFormProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FunnelFormValues>({
    resolver: zodResolver(funnelFormSchema),
    mode: 'onChange',
  });

  const { trigger, watch } = form;
  const selectedChallenge = watch('challenge');
  const goalsPlaceholder = selectedChallenge ? challengeOptions[selectedChallenge as keyof typeof challengeOptions].placeholder : challengeOptions.other.placeholder;
  
  const handleNext = async () => {
    const fields = stepFields[currentStep - 1];
    const isValid = await trigger(fields);
    if (isValid) {
      api?.scrollNext();
    }
  };

  const handlePrev = () => {
    api?.scrollPrev();
  };

  const onFormSubmit = async (data: FunnelFormValues) => {
    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentStep(api.selectedScrollSnap() + 1);
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Stop Wasting Ad Spend. Start Attracting Quality Customers.</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Discover how my Media Buyer expertise can slash your acquisition costs and multiply your high-value leads.</p>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
        </div>

        <Carousel setApi={setApi} opts={{ watchDrag: false, align: 'start' }} className="w-full">
          <CarouselContent>
            <CarouselItem>
              <div className="space-y-4 p-1">
                <FormField name="name" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField name="email" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField name="companyName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Innovate Inc." {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="space-y-4 p-1">
                <FormField name="challenge" control={form.control} render={({ field }) => ( <FormItem className="space-y-3"> <FormLabel>What's your biggest marketing challenge?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Object.entries(challengeOptions).map(([key, { label }]) => (<FormItem key={key} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-secondary/50 transition-colors"><FormControl><RadioGroupItem value={key as keyof typeof challengeOptions} /></FormControl><FormLabel className="font-normal">{label}</FormLabel></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem> )} />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="space-y-4 p-1">
                <FormField name="monthlyBudget" control={form.control} render={({ field }) => ( <FormItem className="space-y-3"> <FormLabel>What's your current monthly advertising budget?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Object.entries(budgetOptions).map(([key, { label }]) => (<FormItem key={key} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-secondary/50 transition-colors"><FormControl><RadioGroupItem value={key} /></FormControl><FormLabel className="font-normal">{label}</FormLabel></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem> )} />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1"><FormField name="businessDescription" control={form.control} render={({ field }) => (<FormItem><FormLabel>Describe your business</FormLabel><FormControl><Textarea placeholder="We are a B2B SaaS company that offers..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1"><FormField name="marketingEfforts" control={form.control} render={({ field }) => ( <FormItem><FormLabel>What are your current marketing efforts?</FormLabel><FormControl><Textarea placeholder="We currently use Google Ads and post on LinkedIn..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1"><FormField name="marketingGoals" control={form.control} render={({ field }) => (<FormItem><FormLabel>What are your marketing goals?</FormLabel><FormControl><Textarea placeholder={goalsPlaceholder} className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <div className="flex items-center justify-between pt-4">
          <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep < totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Get My Analysis
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

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
    label: 'Generación de Leads',
    placeholder: 'Ej: Generar 50 nuevos leads cualificados al mes.',
  },
  'brand-awareness': {
    label: 'Notoriedad de Marca',
    placeholder: 'Ej: Aumentar el tráfico web en un 30% el próximo trimestre.',
  },
  'sales-conversion': {
    label: 'Conversión de Ventas',
    placeholder: 'Ej: Mejorar la tasa de conversión de nuestro embudo en un 15%.',
  },
  other: {
    label: 'Otro',
    placeholder: 'Ej: Lanzar un nuevo producto y ganar cuota de mercado.',
  },
};

const totalSteps = 5;

const stepFields: FieldNames<FunnelFormValues>[][] = [
  ['name', 'email', 'companyName'],
  ['challenge'],
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
            <h1 className="text-3xl font-bold tracking-tight text-primary">Optimiza tu Inversión y Atrae Clientes de Calidad</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Descubre cómo mi experiencia como Media Buyer puede reducir tus costos de adquisición y multiplicar tus leads de alto valor.</p>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
        </div>

        <Carousel setApi={setApi} opts={{ watchDrag: false, align: 'start' }} className="w-full">
          <CarouselContent>
            <CarouselItem>
              <div className="space-y-4 p-1">
                <FormField name="name" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input placeholder="Juan Pérez" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField name="email" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="juan.perez@ejemplo.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField name="companyName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Nombre de la Empresa</FormLabel><FormControl><Input placeholder="Innovate Inc." {...field} /></FormControl><FormMessage /></FormItem> )} />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="space-y-4 p-1">
                <FormField name="challenge" control={form.control} render={({ field }) => ( <FormItem className="space-y-3"> <FormLabel>¿Cuál es tu mayor reto de marketing?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Object.entries(challengeOptions).map(([key, { label }]) => (<FormItem key={key} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-secondary/50 transition-colors"><FormControl><RadioGroupItem value={key as keyof typeof challengeOptions} /></FormControl><FormLabel className="font-normal">{label}</FormLabel></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem> )} />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1"><FormField name="businessDescription" control={form.control} render={({ field }) => (<FormItem><FormLabel>Describe tu negocio</FormLabel><FormControl><Textarea placeholder="Somos una empresa B2B SaaS que ofrece..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1"><FormField name="marketingEfforts" control={form.control} render={({ field }) => ( <FormItem><FormLabel>¿Cuáles son tus esfuerzos de marketing actuales?</FormLabel><FormControl><Textarea placeholder="Actualmente usamos Google Ads y publicamos en LinkedIn..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1"><FormField name="marketingGoals" control={form.control} render={({ field }) => (<FormItem><FormLabel>¿Cuáles son tus objetivos de marketing?</FormLabel><FormControl><Textarea placeholder={goalsPlaceholder} className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <div className="flex items-center justify-between pt-4">
          <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>
          {currentStep < totalSteps ? (
            <Button type="button" onClick={handleNext}>
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Obtener mi Análisis
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

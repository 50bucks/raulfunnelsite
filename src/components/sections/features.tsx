import { BrainCircuit, FileText, FilterX, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: <TrendingDown className="h-8 w-8 text-accent" />,
    title: 'Altos Costos de Adquisición',
    description: 'Reduzco tu Costo por Adquisición (CAC) con estrategias de pauta probadas y optimización constante para maximizar tu ROI.',
  },
  {
    icon: <FilterX className="h-8 w-8 text-accent" />,
    title: 'Leads de Baja Calidad',
    description: 'Filtramos el ruido. Nos enfocamos en atraer prospectos realmente interesados en tu producto, listos para la conversión.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-accent" />,
    title: 'Agencias sin Experiencia',
    description: 'Años de experiencia como Media Buyer enfocados 100% en performance. Tu inversión está en manos de un experto.',
  },
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: 'Poca Transparencia',
    description: 'Transparencia total en la inversión. Sabrás exactamente a dónde va cada centavo de tu presupuesto, con reportes claros y directos.',
  },
];

export default function Features() {
  return (
    <section className="py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">¿Tu Inversión en Marketing no da Resultados?</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Como Media Buyer especialista, resuelvo los problemas que frenan tu crecimiento.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="mx-auto bg-accent/10 p-4 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="pt-4 text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

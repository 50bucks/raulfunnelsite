import { BrainCircuit, FileText, FilterX, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: <TrendingDown className="h-8 w-8 text-accent" />,
    title: 'High Acquisition Costs',
    description: 'I lower your Customer Acquisition Cost (CAC) with proven ad strategies and relentless optimization to maximize your ROI.',
  },
  {
    icon: <FilterX className="h-8 w-8 text-accent" />,
    title: 'Low-Quality Leads',
    description: "We filter out the noise, focusing on attracting prospects genuinely interested in your product and ready to convert.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-accent" />,
    title: 'Inexperienced Agencies',
    description: 'Years of experience as a Media Buyer focused 100% on performance. Your investment is in expert hands.',
  },
  {
    icon: <FileText className="h-8 w-8 text-accent" />,
    title: 'Lack of Transparency',
    description: 'Full transparency on your investment. You will know exactly where every dollar of your budget goes, with clear and direct reports.',
  },
];

export default function Features() {
  return (
    <section className="py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">Is Your Marketing Investment Falling Short?</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            As a specialist Media Buyer, I solve the exact problems that are holding back your growth.
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

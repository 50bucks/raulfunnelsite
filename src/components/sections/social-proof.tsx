import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Anne Smith",
    title: "Marketing Director, Tech Solutions",
    quote: "Thanks to Raul's paid advertising services, I improved my customer acquisition method, getting high-quality clients at a low cost."
  },
  {
    name: "Charles Peterson",
    title: "CEO, InnovaTech",
    quote: "We were lost with our campaigns. Raul not only optimized our budget but also provided a level of transparency no other agency had ever given us."
  },
  {
    name: "Sophia Miller",
    title: "Founder, Creative Commerce",
    quote: "We went from sporadic leads to a constant flow of customers ready to buy. Raul's expertise is noticeable from day one."
  }
];

export default function SocialProof() {
  return (
    <section className="py-12 md:py-20 lg:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">Trusted by Growing Businesses</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Real results for clients who want to grow smarter, not harder.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <blockquote className="text-foreground/90 italic mb-4">"{testimonial.quote}"</blockquote>
                <div className="flex items-center gap-1 text-yellow-500 mt-auto">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

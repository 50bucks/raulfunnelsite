import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "John Doe",
    title: "CEO, Tech Innovators",
    avatar: "JD",
    image: "https://placehold.co/100x100.png",
    dataAiHint: "man portrait",
    quote: "Working with them was a game-changer. Our lead quality and conversion rates have skyrocketed beyond our wildest expectations. Truly elite service."
  },
  {
    name: "Jane Smith",
    title: "Marketing Director, Future Corp",
    avatar: "JS",
    image: "https://placehold.co/100x100.png",
    dataAiHint: "woman portrait",
    quote: "Their strategic insights helped us dominate our market niche. The ROI has been incredible, and their team feels like a true growth partner."
  },
  {
    name: "Samuel Lee",
    title: "Founder, Creative Solutions",
    avatar: "SL",
    image: "https://placehold.co/100x100.png",
    dataAiHint: "person smile",
    quote: "The funnel mastery they demonstrated is unparalleled. We now have a predictable stream of high-intent leads, fueling our growth."
  }
];

export default function SocialProof() {
  return (
    <section className="py-12 md:py-20 lg:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">Trusted by Industry Leaders</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We deliver white-glove service and ROI-driven results for our clients.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
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

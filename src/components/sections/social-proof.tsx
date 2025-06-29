import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ana García",
    title: "Directora de Marketing, Soluciones Digitales",
    avatar: "AG",
    image: "https://placehold.co/100x100.png",
    dataAiHint: "woman portrait professional",
    quote: "Gracias a Raúl, mejoramos nuestra adquisición de clientes a un coste bajo y de alta calidad. ¡Nuestros leads nunca habían sido tan rentables!"
  },
  {
    name: "Carlos Pérez",
    title: "CEO, InnovaTech",
    avatar: "CP",
    image: "https://placehold.co/100x100.png",
    dataAiHint: "man portrait professional",
    quote: "Estábamos perdidos con nuestras campañas. Raúl no solo optimizó el presupuesto, sino que nos brindó una transparencia que ninguna agencia nos había dado."
  },
  {
    name: "Sofía Martínez",
    title: "Fundadora, E-commerce Creativo",
    avatar: "SM",
    image: "https://placehold.co/100x100.png",
    dataAiHint: "woman portrait creative",
    quote: "Pasamos de leads esporádicos a un flujo constante de clientes listos para comprar. La experiencia de Raúl se nota desde el primer día."
  }
];

export default function SocialProof() {
  return (
    <section className="py-12 md:py-20 lg:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">Confían en Mi Experiencia</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Resultados reales para clientes que buscan crecer de forma inteligente.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
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

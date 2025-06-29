import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Features from "@/components/sections/features";
import Hero from "@/components/sections/hero";
import SocialProof from "@/components/sections/social-proof";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}

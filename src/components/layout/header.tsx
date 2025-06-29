import { Target } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-accent" />
          <span className="text-xl font-semibold text-foreground">Raul Funnel Site</span>
        </div>
      </div>
    </header>
  );
}

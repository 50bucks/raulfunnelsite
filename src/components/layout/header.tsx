import Image from 'next/image';

export default function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-3">
          <Image
            src="https://static.wixstatic.com/media/36441a_99149566a5794da987f9be2a0978ea0d~mv2.png"
            alt="Raul Rodrigues Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-semibold text-foreground">Raúl Rodrigues Media Buyer</span>
        </div>
      </div>
    </header>
  );
}

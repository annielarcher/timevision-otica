import { Eye, Instagram, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-6 md:py-8 bg-card">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left mx-auto px-4 max-w-screen-2xl">
        <div className="flex items-center space-x-2 text-primary">
          <img src="/logos/icone/1.svg" className="h-5 w-5 text-primary brightness-200" alt="Timevision logo" />
          <span className="font-headline font-bold text-sm tracking-tight text-foreground">
            Timevision Ótica
          </span>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          <p>
            &copy; {currentYear} Timevision Ótica. Todos os direitos reservados.
          </p>
          <p className="mt-1">
            Atendimento itinerante especializado em empresas e comunidades.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link href="mailto:oticastimevision@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

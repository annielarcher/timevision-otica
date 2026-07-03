'use client';

import Link from 'next/link';
import { Home, Menu, Facebook, Instagram, Mail, Youtube, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from '@/components/contact-form';

const navLinks = [
  { href: '/sobre', label: 'Sobre Nós' },
  { href: '/laboratorios', label: 'Laboratórios' },
  { href: '/rastreamento', label: 'Rastrear Pedido' },
];

export function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isContactOpen, setContactOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 md:backdrop-blur md:supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center space-x-2 text-primary">
            <img src="/logos/icone/1.svg" className="h-8 w-8 text-primary brightness-200" alt="Timevision Ótica logo" />
            <span className="font-headline font-black text-xl tracking-tight text-foreground">
              Timevision <span className="text-primary">Ótica</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href="/admin">Painel PDV</Link>
            </Button>
            <Button onClick={() => setContactOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Fale Conosco
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Button asChild variant="ghost" size="sm" className="text-xs px-2">
              <Link href="/admin">PDV</Link>
            </Button>
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-card border-l border-border/20">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Navegação principal do site.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col h-full pt-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <Link href="/" className="flex items-center space-x-2 text-primary" onClick={() => setMobileMenuOpen(false)}>
                      <img src="/logos/icone/1.svg" className="h-6 w-6 text-primary brightness-200" alt="Timevision logo" />
                      <span className="font-headline font-black text-lg text-foreground">Timevision</span>
                    </Link>
                  </div>
                  <nav className="flex flex-col space-y-4 mt-6">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === '/' ? "text-primary" : "text-foreground"
                      )}
                    >
                      Início
                    </Link>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "text-lg font-medium transition-colors hover:text-primary",
                          pathname === link.href ? "text-primary" : "text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === '/admin' ? "text-primary" : "text-foreground"
                      )}
                    >
                      Painel PDV
                    </Link>
                  </nav>
                  <div className="mt-auto pt-6">
                    <Button onClick={() => {
                      setMobileMenuOpen(false);
                      setContactOpen(true);
                    }} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Fale Conosco
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <Dialog open={isContactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-[480px] bg-card border border-border/25">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">Fale Conosco</DialogTitle>
            <DialogDescription>
              Ficou interessado em agendar uma visita ou tem alguma dúvida? Envie uma mensagem.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 pt-2">
            <ContactForm onSuccess={() => setContactOpen(false)} />
            <div className="relative">
              <Separator />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2">
                <span className="text-xs text-muted-foreground">OU</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs text-muted-foreground text-center">Fale conosco pelo e-mail ou redes sociais:</p>
              <div className="flex justify-center gap-6">
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="mailto:oticastimevision@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-6 w-6" />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

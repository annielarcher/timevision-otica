'use client'; // Error boundaries precisam ser Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Reutilizando seu botão do shadcn

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Loga o erro no console do cliente
        console.error("ERRO CRÍTICO CAPTURADO:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <h2 className="text-3xl font-bold mb-4 text-primary">Ops! Tivemos um problema técnico.</h2>
            <p className="text-muted-foreground mb-6 max-w-lg">
                Infelizmente o seu navegador não conseguiu renderizar esta tela.
            </p>

            {/* Aqui está o segredo: A mensagem técnica vai aparecer na tela! */}
            <div className="bg-red-950/30 border border-red-900 text-red-400 p-4 rounded-lg mb-8 max-w-lg text-left text-sm font-mono overflow-auto">
                <p className="font-bold mb-2">Mensagem para o Suporte:</p>
                {error.message}
            </div>

            <Button onClick={() => reset()} variant="default" size="lg">
                Tentar Novamente
            </Button>
        </div>
    );
}
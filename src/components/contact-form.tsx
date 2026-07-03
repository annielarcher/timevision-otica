'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitContactForm } from '@/app/actions/contact';
import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  message: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres.' }),
});


export function ContactForm({onSuccess}: {onSuccess?: () => void}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    startTransition(async () => {
      const result = await submitContactForm(values);
      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'Sua mensagem foi enviada. Entraremos em contato em breve.',
        });
        form.reset();
        onSuccess?.();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro!',
          description: result.message || 'Não foi possível enviar sua mensagem. Tente novamente.',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensagem</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deixe sua mensagem aqui..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Mensagem
        </Button>
      </form>
    </Form>
  );
}

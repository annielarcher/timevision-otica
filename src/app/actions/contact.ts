'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  message: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres.' }),
});

export async function submitContactForm(data: z.infer<typeof contactFormSchema>) {
  const validatedFields = contactFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Dados inválidos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  if (!process.env.RESEND_API_KEY) {
    console.error("Resend API key is not configured. Email will not be sent.");
    return {
      success: false,
      message: 'Ocorreu um erro de configuração no servidor. Por favor, contate o suporte.',
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, message } = validatedFields.data;

  try {
    const { data: resendData, error } = await resend.emails.send({
      from: 'Banda Sinfônica Nacional <onboarding@resend.dev>',
      to: ['bandasinfonicanacional@gmail.com'],
      subject: `Nova mensagem de: ${name}`,
      reply_to: email,
      text: `Você recebeu uma nova mensagem através do formulário de contato do site.\n\nNome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`,
    });
    
    if (error) {
       console.error('Resend error:', error);
       return { success: false, message: error.message || 'Ocorreu um erro ao enviar a mensagem.' };
    }

    return {
      success: true,
      message: 'Mensagem enviada com sucesso!',
    };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message || 'Ocorreu um erro ao enviar a mensagem.' };
  }
}

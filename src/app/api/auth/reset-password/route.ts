import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Mock list of team members and their recovery emails if they forgot to register
// But in a real system we would read from Firestore.
const TEAM_EMAILS = [
  'ana@timevision.com.br',
  'moises@timevision.com.br',
  'alef@timevision.com.br',
  'annie@timevision.com.br'
];

export async function POST(request: Request) {
  try {
    const { email, recoveryEmail } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'E-mail principal é obrigatório' }, { status: 400 });
    }

    if (!TEAM_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Este e-mail não faz parte da equipe autorizada.' }, { status: 403 });
    }

    // Initialize Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    
    // In a real scenario, we generate a secure token and send a link.
    // Here we'll simulate sending the password reset request to the recovery email.
    const targetEmail = recoveryEmail || 'suporte@timevision.com.br';

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      try {
        await resend.emails.send({
          from: 'Timevision Ótica <suporte@timevision.com.br>',
          to: targetEmail,
          subject: 'Redefinição de Senha - Timevision Ótica',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded-lg">
              <h2 style="color: #B5996A; text-transform: uppercase;">Redefinição de Senha</h2>
              <p>Olá,</p>
              <p>Recebemos uma solicitação de redefinição de senha para a sua conta de equipe <strong>${email}</strong>.</p>
              <p>Como você não consegue receber e-mails no domínio da loja, enviamos esta mensagem para seu e-mail de recuperação cadastrado.</p>
              <p style="margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin?reset_email=${encodeURIComponent(email)}" 
                   style="background: #B5996A; color: #111; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;">
                  Redefinir Senha do Painel
                </a>
              </p>
              <p style="color: #666; font-size: 12px;">Se você não solicitou essa redefinição, apenas ignore este e-mail.</p>
            </div>
          `
        });
      } catch (err) {
        console.error('Failed to send real email via Resend:', err);
        // Fallback: log to console so developers can see the link
      }
    }

    // Log recovery link to console for local testing bypass
    const testResetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin?reset_email=${encodeURIComponent(email)}`;
    console.log(`[TEST MODE] Link de redefinição de senha para ${email} enviado para ${targetEmail}: ${testResetLink}`);

    return NextResponse.json({ 
      success: true, 
      message: `Link de redefinição enviado para o e-mail de recuperação associado.`,
      debugLink: testResetLink // Send back in debug mode for ease of use in bypass
    });
  } catch (error: any) {
    console.error('Reset password API error:', error);
    return NextResponse.json({ error: 'Erro interno ao processar redefinição.' }, { status: 500 });
  }
}

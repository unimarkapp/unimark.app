import { Resend } from 'resend';

export const resend = new Resend(process.env.PLUNK_API_KEY!);

export function headers() {
  return { 'X-Entity-Ref-ID': new Date().getTime() + '' };
}

export async function sendVerificationEmail({
  user,
  url,
}: {
  user: { email: string };
  url: string;
}) {
  await resend.emails.send({
    from: '',
    subject: 'Verify your email address',
    to: user.email,
    text: `Click the link to verify your email: ${url}`,
    headers: headers(),
  });
}

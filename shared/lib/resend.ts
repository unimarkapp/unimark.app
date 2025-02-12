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
    from: 'Unimark app <test@unimark.app>',
    subject: 'Verify your email address',
    to: user.email,
    text: `Click the link to verify your email: ${url}`,
    headers: headers(),
  });
}

export async function sendInvitationEmail({
  email,
  inviter,
  url,
}: {
  email: string;
  inviter: { user: { name: string } };
  organization: { name: string };
  url: string;
}) {
  await resend.emails.send({
    from: 'Unimark app <test@unimark.app>',
    subject: `${inviter.user.name} invited you to join workspace`,
    to: email,
    text: `Click the link to join the workspace: ${url}`,
    headers: headers(),
  });
}

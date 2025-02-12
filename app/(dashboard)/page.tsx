import { getSession } from '@/shared/auth/sessions';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return redirect(`/${session.session.activeOrganizationId}`);
}

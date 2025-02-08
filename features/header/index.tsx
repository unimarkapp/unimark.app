import { getSession } from '@/shared/auth/sessions';
import { HeaderClient } from './header.client';

export async function Header() {
  const session = await getSession();
  return <HeaderClient user={session?.user} />;
}

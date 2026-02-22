import { auth } from '@/src/auth';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/login');
  return session;
}

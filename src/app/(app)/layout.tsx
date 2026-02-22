import { auth } from '@/src/auth';
import Sidebar from '@/src/components/Sidebar';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/auth/login');
  if (session.user.role !== "ADMIN") redirect("/unauthorized")

  return (
    <NuqsAdapter>
      <div className="flex min-h-screen bg-linear-to-br from-neutral-100 via-blue-400/40 to-blue-500/40">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
      <Toaster position="bottom-right" richColors />
    </NuqsAdapter>
  );
}

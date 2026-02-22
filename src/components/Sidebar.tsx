'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BarChart2,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/persons', label: 'Personas', icon: Users },
  {
    href: '/specialties',
    label: 'Especialidades',
    icon: Briefcase,
  },
  {
    href: '/evaluations',
    label: 'Evaluaciones',
    icon: ClipboardList,
  },
  { href: '/information', label: 'Informes', icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-neutral-300/60 backdrop-blur-xl text-black flex flex-col">
      <div className="p-6 font-bold text-lg flex items-center gap-2">
        <span className="text-blue-400">⚡</span> CareerEngine
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === href
                ? 'bg-blue-600 text-white'
                : 'text-zinc-800 hover:bg-zinc-800 hover:text-white',
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-3 space-y-1">
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, FileText, LogOut, Search, User, UserCheck } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function MemberShell({
  children,
  showSearch = true,
}: {
  children: React.ReactNode;
  showSearch?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'G';

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-8 min-w-0">
              <Link href="/home" className="flex items-center gap-2 shrink-0">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-royal to-gold-400 flex items-center justify-center">
                  <span className="text-purple-deep font-bold text-lg font-display">G</span>
                </div>
                <span className="text-xl font-bold font-display text-purple-deep hidden sm:block">
                  GZURA
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link
                  href="/my-learnings"
                  className={cn(
                    'hover:text-purple-deep transition-colors',
                    pathname.startsWith('/my-learnings')
                      ? 'text-purple-deep font-semibold'
                      : 'text-gray-600',
                  )}
                >
                  My Learnings
                </Link>
                <Link
                  href="/invoices"
                  className={cn(
                    'hover:text-purple-deep transition-colors',
                    pathname.startsWith('/invoices')
                      ? 'text-purple-deep font-semibold'
                      : 'text-gray-600',
                  )}
                >
                  Invoices
                </Link>
                <Link
                  href="/profile"
                  className={cn(
                    'hover:text-purple-deep transition-colors',
                    pathname.startsWith('/profile')
                      ? 'text-purple-deep font-semibold'
                      : 'text-gray-600',
                  )}
                >
                  Profile
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {showSearch && (
                <div className="hidden h-10 w-64 items-center overflow-hidden rounded-full border border-gray-200 bg-white transition-[border-color,box-shadow] focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100 lg:flex xl:w-80">
                  <Search className="ml-3 w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    placeholder="What do you want to learn?"
                    className="h-10 border-0 bg-transparent pl-2 pr-2 shadow-none outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        router.push('/events');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => router.push('/events')}
                    className="mr-1 w-8 h-8 rounded-full bg-purple-deep flex items-center justify-center shrink-0 hover:bg-purple-800 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
              <button
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hidden sm:flex"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 pr-2 transition-colors">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-purple-deep text-white text-sm font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-3 py-2">
                      <p className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-learnings">
                        <User className="w-4 h-4 mr-2" />
                        My Learnings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/invoices">
                        <FileText className="w-4 h-4 mr-2" />
                        My Invoices
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        router.push('/');
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, LogOut, Search, User } from 'lucide-react';
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
                      ? 'text-purple-deep'
                      : 'text-gray-600',
                  )}
                >
                  My Learnings
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {showSearch && (
                <div className="hidden lg:flex items-center w-64 xl:w-80 border border-gray-200 rounded-full overflow-hidden bg-white h-10">
                  <Search className="ml-3 w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    placeholder="What do you want to learn?"
                    className="border-0 shadow-none focus-visible:ring-0 h-10 pl-2 pr-2 bg-transparent"
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
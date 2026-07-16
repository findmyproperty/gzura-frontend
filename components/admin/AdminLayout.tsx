'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Calendar,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  ScanLine,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { api, CommunityRegistration } from '@/lib/api';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/registrations', label: 'Host Requests', icon: ClipboardList },
  { href: '/admin/users', label: 'Users', icon: Users },
];

const SIDEBAR_KEY = 'gzura_admin_sidebar_open';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<CommunityRegistration[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored !== null) {
      setSidebarOpen(stored === 'true');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    api
      .getCommunityRegistrations()
      .then((regs) => {
        const recent = [...regs]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);
        setNotifications(recent);
      })
      .catch(() => setNotifications([]));
  }, []);

  const userInitials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'A';

  const newNotificationCount = notifications.filter((reg) => {
    const created = new Date(reg.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created >= weekAgo;
  }).length;

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const NavLink = ({
    item,
    collapsed = false,
    onNavigate,
  }: {
    item: (typeof navItems)[0];
    collapsed?: boolean;
    onNavigate?: () => void;
  }) => {
    const active = isActive(item.href, item.exact);
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
        className={cn(
          'flex items-center rounded-lg text-sm font-medium transition-colors',
          collapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3',
          active
            ? 'bg-white/15 text-gold-400'
            : 'text-white/80 hover:bg-white/10 hover:text-white',
        )}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const SidebarContent = ({
    collapsed = false,
    onNavigate,
  }: {
    collapsed?: boolean;
    onNavigate?: () => void;
  }) => (
    <>
      <div
        className={cn(
          'border-b border-white/10 flex items-center shrink-0',
          collapsed ? 'p-3 justify-center' : 'p-4 gap-2',
        )}
      >
        {collapsed ? (
          <>
            <button
              type="button"
              onClick={toggleSidebar}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              className="hidden lg:flex rounded-lg hover:ring-2 hover:ring-white/20 transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-royal to-gold-400 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-deep font-bold text-xl font-display">G</span>
              </div>
            </button>
            <Link
              href="/admin"
              onClick={onNavigate}
              className="lg:hidden flex justify-center"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-royal to-gold-400 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-deep font-bold text-xl font-display">G</span>
              </div>
            </Link>
          </>
        ) : (
          <div className="flex items-center justify-between gap-2 min-w-0 w-full">
            <Link
              href="/admin"
              onClick={onNavigate}
              className="flex items-center gap-2 min-w-0"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-royal to-gold-400 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-deep font-bold text-xl font-display">G</span>
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-lg leading-tight truncate">GZURA</p>
                <p className="text-gold-400 text-xs font-medium">Admin Panel</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={toggleSidebar}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              className="hidden lg:flex p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <nav className={cn('flex-1 space-y-1', collapsed ? 'p-2' : 'p-4')}>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className={cn('border-t border-white/10 space-y-1', collapsed ? 'p-2' : 'p-4')}>
        <Link
          href="/"
          onClick={onNavigate}
          title={collapsed ? 'View Website' : undefined}
          className={cn(
            'flex items-center text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10',
            collapsed ? 'justify-center p-3' : 'gap-2 px-4 py-2',
          )}
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>View Website</span>}
        </Link>
        <button
          onClick={() => {
            onNavigate?.();
            handleLogout();
          }}
          title={collapsed ? 'Sign Out' : undefined}
          className={cn(
            'flex items-center w-full text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10',
            collapsed ? 'justify-center p-3' : 'gap-2 px-4 py-2',
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-purple-deep text-white fixed inset-y-0 left-0 z-40 overflow-hidden transition-[width] duration-300 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-[72px]',
          !mounted && 'transition-none',
        )}
      >
        <SidebarContent collapsed={!sidebarOpen} />
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-purple-deep text-white transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen min-w-0 w-full transition-[margin] duration-300 ease-in-out',
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-[72px]',
          !mounted && 'transition-none',
        )}
      >
        <header className="sticky top-0 z-30 bg-purple-deep text-white px-4 py-3 flex items-center justify-between shadow-lg lg:shadow-none lg:bg-gradient-to-r lg:from-purple-deep lg:to-purple-900 shrink-0">
          <div className="flex items-center gap-3 min-w-0 lg:flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="relative p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {newNotificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-royal px-1 text-[10px] font-bold text-purple-deep">
                      {newNotificationCount > 9 ? '9+' : newNotificationCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="border-b px-4 py-3">
                  <p className="font-semibold text-purple-deep">Notifications</p>
                  <p className="text-xs text-gray-500">Recent host registration requests</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-gray-500">
                      No notifications yet
                    </p>
                  ) : (
                    notifications.map((reg) => (
                      <Link
                        key={reg.id}
                        href="/admin/registrations"
                        className="flex flex-col gap-0.5 border-b border-gray-100 px-4 py-3 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <p className="text-sm font-medium text-purple-deep">
                          New host request
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {reg.fullName} wants to host on GZURA
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {new Date(reg.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="border-t p-2">
                    <Link
                      href="/admin/registrations"
                      className="block rounded-md px-3 py-2 text-center text-xs font-medium text-purple-deep hover:bg-purple-50 transition-colors"
                    >
                      View all host requests
                    </Link>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-lg p-1.5 text-white hover:bg-white/10 transition-colors"
                  aria-label="Profile menu"
                >
                  <Avatar className="h-9 w-9 border-2 border-gold-royal/40">
                    <AvatarFallback className="bg-gradient-to-br from-gold-royal to-gold-400 text-purple-deep text-sm font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left min-w-0">
                    <p className="text-sm font-medium leading-tight truncate max-w-[140px]">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-white/60 truncate max-w-[140px]">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown className="hidden md:block w-4 h-4 text-white/60 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-purple-deep">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    <p className="text-[11px] text-gold-royal font-medium uppercase tracking-wide">
                      {user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/registrations" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Activity
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/qr-scanner" className="cursor-pointer">
                    <ScanLine className="mr-2 h-4 w-4" />
                    QR Scanner
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Website
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 min-w-0 w-full max-w-full p-4 md:p-6 lg:p-8 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api, CommunityRegistration } from '@/lib/api';
import { AdminChromeProvider, useAdminChrome } from '@/components/admin/admin-chrome';
import { formatUserRole, isFullAdmin } from '@/lib/user-roles';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/event-approvals', label: 'Event Approvals', icon: CheckCircle2 },
  { href: '/admin/registrations', label: 'Host Requests', icon: ClipboardList },
  { href: '/admin/users', label: 'Users', icon: Users },
];

const instructorNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Events', icon: Calendar },
];

const SIDEBAR_KEY = 'gzura_admin_sidebar_open';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminChromeProvider>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminChromeProvider>
  );
}

function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { pageHeader } = useAdminChrome();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  type NotificationItem = {
    id: string;
    type: 'HOST_REQUEST' | 'EVENT_APPROVAL';
    title: string;
    subtitle: string;
    createdAt: string;
    href: string;
  };

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const isAdmin = user ? isFullAdmin(user.role) : false;
  const navItems = isAdmin ? adminNavItems : instructorNavItems;
  const panelLabel = isAdmin ? 'Admin Panel' : 'Host Panel';

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored !== null) {
      setSidebarOpen(stored === 'true');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      api.getEvents(true)
        .then((events) => {
          const rejectedEvents: NotificationItem[] = events
            .filter(e => e.status === 'REJECTED')
            .map(e => ({
              id: e.id,
              type: 'EVENT_APPROVAL',
              title: 'Event rejected',
              subtitle: `${e.title} needs revision`,
              createdAt: e.createdAt,
              href: `/admin/events/${e.id}`,
            }));
            
          const recent = rejectedEvents
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
            
          setNotifications(recent);
        })
        .catch(() => setNotifications([]));
      return;
    }
    
    Promise.all([
      api.getCommunityRegistrations(),
      api.getEvents(true),
    ])
      .then(([regs, events]) => {
        const hostRequests: NotificationItem[] = regs.map(reg => ({
          id: reg.id,
          type: 'HOST_REQUEST',
          title: 'New host request',
          subtitle: `${reg.fullName} wants to host on GZURA`,
          createdAt: reg.createdAt,
          href: '/admin/registrations',
        }));

        const pendingEvents: NotificationItem[] = events
          .filter(e => e.status === 'PENDING')
          .map(e => ({
            id: e.id,
            type: 'EVENT_APPROVAL',
            title: 'Event approval request',
            subtitle: `${e.title}`,
            createdAt: e.createdAt,
            href: `/admin/events?status=PENDING`,
          }));

        const all = [...hostRequests, ...pendingEvents]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
          
        setNotifications(all);
      })
      .catch(() => setNotifications([]));
  }, [isAdmin]);

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

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    // Avoid marking "Events" active on "Create Event" and other non-list routes
    // when a more specific nav item exists.
    if (href === '/admin/events' && pathname === '/admin/events/new') {
      return false;
    }
    return pathname.startsWith(href);
  };

  const NavLink = ({
    item,
    collapsed = false,
    onNavigate,
  }: {
    item: (typeof adminNavItems)[0];
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
          'flex items-center text-sm font-medium transition-colors',
          collapsed
            ? 'justify-center mx-auto h-11 w-11 rounded-2xl'
            : 'gap-3 px-3 py-2.5 rounded-2xl',
          active
            ? 'bg-white/15 text-gold-400'
            : 'text-white/75 hover:bg-white/10 hover:text-white',
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
          'flex items-center shrink-0',
          collapsed ? 'px-3 pt-5 pb-3 justify-center' : 'px-4 pt-5 pb-3',
        )}
      >
        <Link
          href="/admin"
          onClick={onNavigate}
          className={cn(
            'flex items-center min-w-0',
            collapsed ? 'justify-center' : 'gap-2.5',
          )}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-royal to-gold-400 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-deep font-bold text-xl font-display">G</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-bold text-lg leading-tight truncate">GZURA</p>
              <p className="text-gold-400 text-xs font-medium">{panelLabel}</p>
            </div>
          )}
        </Link>
      </div>

      <nav className={cn('flex-1 space-y-1 overflow-y-auto', collapsed ? 'px-2' : 'px-3')}>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className={cn('mt-auto shrink-0', collapsed ? 'p-2' : 'px-2 pb-3 pt-1')}>
        {collapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Expand sidebar"
                className="hidden lg:flex w-full items-center justify-center rounded-md p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors mb-1"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Expand
            </TooltipContent>
          </Tooltip>
        )}
        <div
          className={cn(
            'flex items-center',
            collapsed ? 'justify-center' : 'gap-1',
          )}
        >
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title="Profile menu"
                  aria-label="Open profile menu"
                  className={cn(
                    'flex items-center rounded-lg hover:bg-white/10 transition-colors min-w-0',
                    collapsed ? 'justify-center p-1.5' : 'flex-1 gap-2.5 px-2 py-2',
                  )}
                >
                  <Avatar className="h-9 w-9 border-2 border-gold-royal/50 shrink-0">
                    {user.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-gold-royal to-gold-400 text-purple-deep text-xs font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-sm font-medium text-white truncate leading-tight">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-white/60 truncate">
                        {formatUserRole(user.role)}
                      </p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={10}
                className="w-64 p-1.5"
              >
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gold-royal/40 shrink-0">
                      {user.avatarUrl ? (
                        <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-gold-royal to-gold-400 text-purple-deep text-sm font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-purple-deep truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {formatUserRole(user.role)}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin/profile"
                    onClick={onNavigate}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/" onClick={onNavigate} className="cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Website
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    onNavigate?.();
                    handleLogout();
                  }}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  aria-label="Collapse sidebar"
                  className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Collapse
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-[#F6F4F1] p-2 sm:p-3 lg:p-4">
        <div className="flex gap-3 lg:gap-4 h-[calc(100dvh-1rem)] sm:h-[calc(100dvh-1.5rem)] lg:h-[calc(100dvh-2rem)]">
          {/* Desktop sidebar */}
          <aside
            className={cn(
              'hidden lg:flex flex-col bg-purple-deep text-white rounded-[28px] shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
              sidebarOpen ? 'w-[260px]' : 'w-[76px]',
              !mounted && 'transition-none',
            )}
          >
            <SidebarContent collapsed={!sidebarOpen} />
          </aside>

          {/* Mobile overlay sidebar */}
          {mobileOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
          )}
          <aside
            className={cn(
              'lg:hidden fixed inset-y-3 left-3 z-50 w-64 flex flex-col bg-purple-deep text-white rounded-[28px] transition-transform duration-300 ease-in-out',
              mobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1.5rem)]',
            )}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>

          {/* Main panel */}
          <div className="flex-1 min-w-0 flex flex-col rounded-[28px] bg-[#F5F0FA] border border-purple-200/50 overflow-hidden">
            <header className="flex items-center justify-between gap-4 px-4 sm:px-6 pt-4 pb-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="p-2 rounded-xl text-gray-500 hover:text-purple-deep hover:bg-white/70 transition-colors lg:hidden shrink-0"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
                {pageHeader && (
                  <div className="flex items-center gap-3 min-w-0">
                    {pageHeader.breadcrumb ? (
                      <>
                        <p className="hidden sm:block text-sm text-gray-400 shrink-0">
                          {pageHeader.breadcrumb}
                        </p>
                        <span className="hidden sm:block h-4 w-px bg-purple-200/80 shrink-0" />
                      </>
                    ) : null}
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 truncate">
                      {pageHeader.title}
                    </h1>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="relative p-2 rounded-full text-gray-500 hover:text-purple-deep hover:bg-gray-50 transition-colors"
                      aria-label="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {newNotificationCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-royal px-1 text-[10px] font-bold text-purple-deep">
                          {newNotificationCount > 9 ? '9+' : newNotificationCount}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 p-0 rounded-2xl">
                    <div className="border-b px-4 py-3">
                      <p className="font-semibold text-purple-deep">Notifications</p>
                      <p className="text-xs text-gray-500">
                        {isAdmin ? 'Recent host and event requests' : 'Important updates about your events'}
                      </p>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-gray-500">
                          No notifications yet
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <Link
                            key={`${notif.type}-${notif.id}`}
                            href={notif.href}
                            className="flex flex-col gap-0.5 border-b border-gray-100 px-4 py-3 last:border-0 hover:bg-gray-50 transition-colors"
                          >
                            <p className="text-sm font-medium text-purple-deep">
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {notif.subtitle}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {new Date(notif.createdAt).toLocaleDateString('en-IN', {
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
                    {notifications.length > 0 && isAdmin && (
                      <div className="border-t p-2">
                        <Link
                          href="/admin/registrations"
                          className="block rounded-xl px-3 py-2 text-center text-xs font-medium text-purple-deep hover:bg-purple-50 transition-colors"
                        >
                          View all host requests
                        </Link>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </header>

            <main className="flex-1 min-w-0 min-h-0 overflow-auto px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8 flex flex-col">
              {pageHeader?.subtitle ? (
                <p className="text-sm text-gray-500 -mt-1 mb-4">{pageHeader.subtitle}</p>
              ) : null}
              {children}
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
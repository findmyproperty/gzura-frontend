'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
              createdAt: e.createdAt ?? e.updatedAt ?? e.dateStart,
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
            createdAt: e.createdAt ?? e.updatedAt ?? e.dateStart,
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
    const link = (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'group flex items-center text-[13.5px] font-medium transition-colors',
          collapsed
            ? 'mx-auto h-10 w-10 justify-center rounded-xl'
            : 'gap-3 rounded-2xl px-3 py-[9px]',
          active
            ? 'bg-purple-50 text-purple-deep'
            : 'text-[#8A8A8A] hover:bg-purple-50 hover:text-purple-deep',
        )}
      >
        <item.icon
          className={cn(
            'h-5 w-5 shrink-0',
            active ? 'text-purple-deep' : 'text-[#B0B0B0] group-hover:text-purple-deep',
          )}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );

    if (!collapsed) return link;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  };

  const SidebarContent = ({
    collapsed = false,
    onNavigate,
    showCollapse = false,
  }: {
    collapsed?: boolean;
    onNavigate?: () => void;
    showCollapse?: boolean;
  }) => (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={cn(
          'flex shrink-0 items-center',
          collapsed ? 'justify-center px-0 pb-5 pt-5' : 'justify-between gap-2 px-4 pb-4 pt-5',
        )}
      >
        <Link
          href="/admin"
          onClick={onNavigate}
          className={cn(
            'flex min-w-0 items-center',
            collapsed ? 'justify-center' : 'gap-2.5',
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-purple-deep">
            <span className="font-display text-[15px] font-bold leading-none text-white">G</span>
          </div>
          {!collapsed && (
            <p className="truncate text-[15px] font-semibold tracking-tight text-zinc-900">
              GZURA
            </p>
          )}
        </Link>
        {showCollapse && !collapsed ? (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-zinc-400 transition-colors hover:bg-[#F5F5F5] hover:text-zinc-900 lg:flex"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      <nav
        className={cn(
          'scrollbar-none flex min-h-0 flex-1 flex-col overflow-y-auto',
          collapsed ? 'items-center gap-4 px-0' : 'gap-1 px-3',
        )}
      >
        <p
          className={cn(
            'font-medium uppercase tracking-[0.16em] text-[#C4C4C4]',
            collapsed ? 'pb-0.5 text-[8px]' : 'px-3 pb-2 pt-1 text-[10px]',
          )}
        >
          Main
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div
        className={cn(
          'mt-auto shrink-0',
          collapsed ? 'flex flex-col items-center px-0 pb-4 pt-3' : 'px-3 pb-3 pt-2',
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
                  'flex min-w-0 items-center transition-colors',
                  collapsed
                    ? 'justify-center rounded-2xl p-0.5 hover:bg-[#F5F5F5]'
                    : 'w-full gap-2.5 rounded-2xl border border-[#EBEBEB] bg-white px-2.5 py-2 hover:bg-[#FAFAFA]',
                )}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-purple-deep text-[11px] font-semibold text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-[13px] font-medium leading-tight text-zinc-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="truncate text-[11px] text-[#A1A1A1]">
                        {formatUserRole(user.role)}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-zinc-300" />
                  </>
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
                    <Avatar className="h-10 w-10 shrink-0 ring-1 ring-zinc-200">
                      {user.avatarUrl ? (
                        <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
                      ) : null}
                      <AvatarFallback className="bg-purple-deep text-sm font-semibold text-white">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-900 truncate">
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
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden bg-[#F4F4F5]">
          {/* Desktop sidebar */}
          <aside
            className={cn(
              'relative my-3 ml-3 hidden shrink-0 flex-col rounded-[22px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[width] duration-300 ease-in-out lg:flex',
              sidebarOpen ? 'w-[252px]' : 'w-[76px]',
              !mounted && 'transition-none',
            )}
          >
            <SidebarContent collapsed={!sidebarOpen} showCollapse />
            {!sidebarOpen ? (
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Expand sidebar"
                className="absolute -right-3 top-6 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-[#EBEBEB] bg-white text-zinc-400 shadow-sm transition-colors hover:bg-[#F5F5F5] hover:text-zinc-900 lg:flex"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </aside>

          {/* Mobile overlay sidebar */}
          {mobileOpen && (
            <div
              className="fixed inset-0 z-50 bg-zinc-900/30 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}
          <aside
            className={cn(
              'fixed inset-y-3 left-3 z-50 flex w-64 flex-col rounded-[22px] border border-[#EFEFEF] bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden',
              mobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1.5rem)]',
            )}
          >
            <div className="absolute right-3 top-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-[#F5F5F5] hover:text-zinc-900"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>

          {/* Main panel */}
          <div
            className={cn(
              'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
              'my-3 ml-3 mr-3 rounded-[22px]',
            )}
          >
            <header className="flex items-center justify-between gap-4 px-4 sm:px-6 pt-4 pb-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="p-2 rounded-xl text-gray-500 hover:text-zinc-900 hover:bg-[#F5F5F5] transition-colors lg:hidden shrink-0"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
                {pageHeader && (
                  <div className="flex items-center gap-3 min-w-0">
                    {pageHeader.breadcrumb ? (
                      <>
                        <p className="hidden sm:block text-[14px] text-gray-400 shrink-0 font-sans">
                          {pageHeader.breadcrumb}
                        </p>
                        <span className="hidden sm:block h-4 w-px bg-zinc-200 shrink-0" />
                      </>
                    ) : null}
                    <h1 className="text-[22px] sm:text-[24px] font-bold leading-tight tracking-tight text-zinc-900 truncate font-sans">
                      {pageHeader.title}
                    </h1>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="relative p-2 rounded-full text-gray-500 hover:text-purple-deep hover:bg-purple-50 transition-colors"
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
                      <p className="font-semibold text-zinc-900">Notifications</p>
                      <p className="text-xs text-gray-500">
                        {isAdmin ? 'Recent host and event requests' : 'Important updates about your events'}
                      </p>
                    </div>
                    <div className="scrollbar-none max-h-72 overflow-y-auto">
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
                            <p className="text-sm font-medium text-zinc-900">
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
                          className="block rounded-xl px-3 py-2 text-center text-xs font-medium text-zinc-900 hover:bg-gold-50 hover:text-gold-800 transition-colors"
                        >
                          View all host requests
                        </Link>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </header>

            <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 pb-0 sm:px-6 lg:px-8">
              {pageHeader?.subtitle ? (
                <p className="shrink-0 text-sm text-gray-500 -mt-1 mb-4">{pageHeader.subtitle}</p>
              ) : null}
              <div className="scrollbar-none flex min-h-0 flex-1 flex-col overflow-auto">
                {children}
              </div>
            </main>
          </div>
      </div>
    </TooltipProvider>
  );
}
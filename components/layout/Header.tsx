'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/components/providers/AuthProvider';
import { getDashboardPath } from '@/lib/auth-utils';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Events', href: '/events' },
  { name: 'Host a Course', href: '/#register' },
  { name: 'Success Stories', href: '/success-stories' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Check if current route has a dark hero banner (like event details with gradient top)
  const isDarkHeroPage =
    (pathname.startsWith('/events/') && pathname.split('/').length === 3) ||
    pathname === '/about' ||
    pathname === '/programs' ||
    pathname === '/success-stories' ||
    pathname === '/contact' ||
    pathname === '/privacy' ||
    pathname === '/terms' ||
    pathname === '/cookies' ||
    pathname === '/faq' ||
    pathname === '/careers' ||
    pathname === '/press';

  const lightSurface = scrolled || !isDarkHeroPage || pathname === '/' || pathname.startsWith('/pass');

  useEffect(() => {
    const syncHeaderWithScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Browsers can restore the scroll position after hydration without
    // dispatching another scroll event. Sync now and on the next frame so the
    // header never leaves white text over restored white page content.
    syncHeaderWithScroll();
    const frame = window.requestAnimationFrame(syncHeaderWithScroll);
    window.addEventListener('scroll', syncHeaderWithScroll, { passive: true });
    window.addEventListener('pageshow', syncHeaderWithScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', syncHeaderWithScroll);
      window.removeEventListener('pageshow', syncHeaderWithScroll);
    };
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white shadow-sm shadow-purple-900/5',
      )}
    >
      <nav className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl font-display">G</span>
            </div>
            <span
              className={cn(
                'md:text-2xl text-xl font-bold font-display transition-colors',
                 'text-purple-deep' 
              )}
            >
              GZURA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors relative group',
                     pathname === item.href
                      ? 'text-gold-400'
                      : 'text-gray-700 hover:text-gold-400'
                )}
              >
                {item.name}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-0.5 bg-gold-400 transition-all',
                    pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <Button  asChild className="rounded-full">
                <Link href={getDashboardPath(user.role)}>Dashboard</Link>
              </Button>
            ) : (
              <Button  asChild className="rounded-full">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg text-purple-deep transition-colors hover:bg-purple-100"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(100%,20rem)] flex-col gap-0 border-purple-100 p-0 lg:hidden"
            >
              <SheetHeader className="border-b border-purple-50 px-6 py-5 text-left">
                <SheetTitle className="font-display text-xl text-purple-deep">
                  GZURA
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'rounded-lg px-3 py-2.5 text-base font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-purple-100 text-purple-deep'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="border-t border-purple-50 p-4">
                {user ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={getDashboardPath(user.role)}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

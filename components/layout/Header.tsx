'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-purple-900/5'
          : 'bg-transparent'
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl font-display">G</span>
            </div>
            <span
              className={cn(
                'text-2xl font-bold font-display transition-colors',
                scrolled ? 'text-purple-deep' : 'text-white'
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
                  scrolled
                    ? pathname === item.href
                      ? 'text-purple-deep'
                      : 'text-gray-700 hover:text-purple-deep'
                    : pathname === item.href
                      ? 'text-gold-400'
                      : 'text-white/90 hover:text-white'
                )}
              >
                {item.name}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full',
                    scrolled ? 'bg-purple-deep' : 'bg-gold-400'
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <Link
                href={getDashboardPath(user.role)}
                className={cn(
                  'text-sm font-medium transition-colors',
                  scrolled ? 'text-purple-deep hover:text-gold-royal' : 'text-white/90 hover:text-gold-400'
                )}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(
                  'text-sm font-medium transition-colors',
                  scrolled ? 'text-purple-deep hover:text-gold-royal' : 'text-white/90 hover:text-gold-400'
                )}
                >
                  Login
                </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              'lg:hidden p-2 rounded-lg transition-colors',
              scrolled
                ? 'text-purple-deep hover:bg-purple-100'
                : 'text-white hover:bg-white/10'
            )}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300',
            mobileMenuOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-4 pt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-base font-medium py-2 px-4 rounded-lg transition-colors',
                  pathname === item.href
                    ? 'bg-purple-100 text-purple-deep'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <Link href={getDashboardPath(user.role)} className="mt-2">
                <Button variant="outline" className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login" className="text-base font-medium py-2 px-4 text-gray-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

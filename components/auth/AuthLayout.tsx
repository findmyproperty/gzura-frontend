import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  variant?: 'member' | 'admin';
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  variant = 'member',
}: AuthLayoutProps) {
  return (
    <section className="min-h-screen gradient-bg flex items-center justify-center px-4 py-24">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-royal to-gold-400 flex items-center justify-center">
              <span className="text-purple-deep font-bold text-2xl font-display">G</span>
            </div>
            <span className="text-3xl font-bold font-display text-white">GZURA</span>
          </Link>
          {variant === 'admin' && (
            <span className="inline-block bg-gold-royal/20 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Admin Portal
            </span>
          )}
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-white/70">{subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-purple-950/30">
          {children}
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          <Link href="/" className="hover:text-gold-400 transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </section>
  );
}
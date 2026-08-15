import type { LucideIcon } from 'lucide-react';

type PageHeroProps = {
  badge: string;
  badgeIcon?: LucideIcon;
  title: string;
  titleAccent?: string;
  description: string;
};

export default function PageHero({
  badge,
  badgeIcon: BadgeIcon,
  title,
  titleAccent,
  description,
}: PageHeroProps) {
  return (
    <section className="gradient-bg p-5 md:p-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
      </div>
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center 2xl:max-w-5xl 4k:max-w-6xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            {BadgeIcon ? <BadgeIcon className="w-4 h-4 text-gold-400" /> : null}
            <span className="text-gold-400 text-sm font-semibold">{badge}</span>
          </div>
          <h1 className="heading-xl mb-6 text-white md:whitespace-nowrap">
            {title}
            {titleAccent ? (
              <>
                {' '}
                <span className="text-gold-400">{titleAccent}</span>
              </>
            ) : null}
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/80 4k:max-w-4xl 4k:text-xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

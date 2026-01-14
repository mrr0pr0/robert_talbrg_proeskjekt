'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  Skull, 
  Gem, 
  Sword, 
  Map, 
  ShoppingBag 
} from 'lucide-react';

export default function WikiSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/walkthrough', label: 'Walkthrough', icon: BookOpen },
    { href: '/bosses', label: 'Bosses', icon: Skull },
    { href: '/treasures', label: 'Treasures', icon: Gem },
    { href: '/weapons', label: 'Weapons', icon: Sword },
    { href: '/maps', label: 'Interactive Maps', icon: Map },
    { href: '/merchant-requests', label: 'Merchants & Requests', icon: ShoppingBag },
  ];

  const isActive = (href) => pathname?.startsWith(href);

  return (
    <aside className="hidden w-full flex-col md:flex border-r border-border/40 min-h-[calc(100vh-4rem)] glass sticky top-16">
      <div className="py-6 pr-6 pl-4 lg:py-8">
        <h3 className="text-xl font-bold text-red-500 group-hover:text-red-600 transition-colors">
          Guide Navigation
        </h3>
        <nav className="flex flex-col space-y-1 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                  active
                    ? 'bg-primary/15 text-primary border-l-4 border-primary pl-2'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent/50 hover:translate-x-1'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${
                  active ? 'text-primary' : 'group-hover:scale-110'
                }`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
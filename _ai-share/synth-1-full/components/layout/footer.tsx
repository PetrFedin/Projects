import Link from 'next/link';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import Logo from '@/components/logo';

const footerLinks = {
  'Компания': [
    { href: '/about', label: 'О нас' },
    { href: '/careers', label: 'Карьера' },
    { href: '/press', label: 'Пресса' },
  ],
  'Помощь': [
    { href: '/contact', label: 'Контакты' },
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Доставка' },
  ],
   'Сообщество': [
    { href: '/community', label: 'Образы' },
    { href: '/metaverse', label: 'Метавселенная' },
  ],
  'Правовая информация': [
    { href: '/terms', label: 'Условия использования' },
    { href: '/privacy', label: 'Политика конфиденциальности' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Logo className="h-7 w-auto mb-4" />
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Интеллект стиля. Экологично, стильно и создано для вас.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Syntha, Inc. Все права защищены.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

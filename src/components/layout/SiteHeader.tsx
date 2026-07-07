'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { trackEvent } from '@/lib/gtag';

export const SiteHeader = () => {
  const t = useTranslations('ui');
  const pathname = usePathname();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => trackEvent('logo_clicked', 'navigation', 'home', undefined, { from: pathname })}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 group-hover:border-blue-500/50 transition-colors">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-black tracking-tighter text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 uppercase italic">
            SC2 ATLAS
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <span className="hidden sm:inline-flex px-2 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            {t('fanProject')}
          </span>
        </div>
      </div>
    </header>
  );
};

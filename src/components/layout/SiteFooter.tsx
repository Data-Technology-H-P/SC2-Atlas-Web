'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { trackEvent } from '@/lib/gtag';

export const SiteFooter = () => {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="py-12 border-t border-white/5 bg-black/90">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <p className="text-xs text-gray-500">
              {t.rich('madeBy', {
                datatech: (chunks) => (
                  <a
                    href="https://datatechhp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('external_link_clicked', 'engagement', 'DataTech H&P', undefined, { label: 'DataTech H&P', location: 'footer' })}
                    className="text-blue-500 hover:text-blue-400 hover:underline transition-colors font-semibold"
                  >
                    {chunks}
                  </a>
                )
              })}
            </p>
            <p className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">
                {t.rich('copyright', { year: new Date().getFullYear() })}
              </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{t('legalNotice')}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-center items-center gap-2 text-xs text-gray-400">
          <Link href={`/${locale}/privacy`} onClick={() => trackEvent('footer_legal_link_clicked', 'engagement', 'privacy', undefined, { link: 'privacy', language: locale })}>{t('privacy')}</Link>
          <span>·</span>
          <Link href={`/${locale}/terms`} onClick={() => trackEvent('footer_legal_link_clicked', 'engagement', 'terms', undefined, { link: 'terms', language: locale })}>{t('terms')}</Link>
          <span>·</span>
          <Link href={`/${locale}/disclaimer`} onClick={() => trackEvent('footer_legal_link_clicked', 'engagement', 'disclaimer', undefined, { link: 'disclaimer', language: locale })}>{t('disclaimer')}</Link>
        </div>
      </div>
    </footer>
  );
};

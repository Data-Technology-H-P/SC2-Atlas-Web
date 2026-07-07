'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/gtag';

interface LegalPageLayoutProps {
  pageKey: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalPageLayout = ({ pageKey }: LegalPageLayoutProps) => {
  const t = useTranslations('legal');

  const sections = [1, 2, 3, 4, 5];

  return (
    <div 
      className="min-h-screen py-12 px-4 bg-slate-950"
      style={{
        backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.85), rgba(2, 6, 23, 0.95)), url('/assets/backgrounds/global_hex_bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container mx-auto max-w-3xl">
        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            onClick={() => trackEvent('legal_back_home', 'navigation', 'home', undefined, { from: pageKey })}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('backToHome')}
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
            {t(`${pageKey}.title`)}
          </h1>
          <p className="text-sm text-blue-400 mb-8">{t('lastUpdated')}</p>
          <p className="text-gray-300 mb-10 leading-relaxed border-l-2 border-blue-500/50 pl-4">
            {t(`${pageKey}.intro`)}
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm"
            >
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-blue-500 font-mono text-sm">{`0${i}.`}</span>
                {t(`${pageKey}.section${i}Title`)}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                {t(`${pageKey}.section${i}Content`)}
              </p>
            </motion.section>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 pt-6 border-t border-white/5 text-center"
        >
          <p className="text-xs text-gray-600">
            SC2 Atlas &mdash; {t(`${pageKey}.title`)}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

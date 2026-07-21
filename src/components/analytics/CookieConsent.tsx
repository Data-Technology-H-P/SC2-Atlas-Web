'use client';

import { useSettings } from '@/context/SettingsContext';
import { Link } from '@/i18n/routing';
import { GA_TRACKING_ID, trackEvent } from '@/lib/gtag';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CookieConsent() {
  const t = useTranslations('cookieBanner');
  const { analyticsEnabled, setAnalyticsEnabled } = useSettings();

  const isAnalyticsConfigured =
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true' && !!GA_TRACKING_ID;

  // Only show the banner if analytics is configured and the user has not made a choice yet
  const showBanner = isAnalyticsConfigured && analyticsEnabled === null;

  const handleAccept = () => {
    setAnalyticsEnabled(true);
    trackEvent('cookie_consent_accepted', 'privacy', 'all_cookies');
  };

  const handleDecline = () => {
    setAnalyticsEnabled(false);
    trackEvent('cookie_consent_declined', 'privacy', 'essential_only');
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-50 p-6 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-[0_10px_50px_rgba(59,130,246,0.2)] flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white uppercase tracking-wider text-xs font-mono">
                {t('title')}
              </h3>
            </div>
            <button
              onClick={handleDecline}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
              aria-label={t('decline')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            {t('text')}{' '}
            <Link
              href="/privacy"
              className="text-blue-400 hover:underline hover:text-blue-300 font-medium ml-1"
            >
              {t('learnMore')}
            </Link>
          </p>

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleDecline}
              className="flex-1 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5 bg-white/[0.02] hover:bg-white/5 text-gray-300 hover:text-white transition-all cursor-pointer text-center"
            >
              {t('decline')}
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] cursor-pointer text-center"
            >
              {t('accept')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

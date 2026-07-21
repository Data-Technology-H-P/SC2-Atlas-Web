'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { trackEvent } from '@/lib/gtag';
import { useSettings } from '@/context/SettingsContext';
import { AVAILABLE_PATCHES } from '@/data/units';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const SiteHeader = () => {
  const t = useTranslations('ui');
  const pathname = usePathname();
  const { patchVersion, setPatchVersion } = useSettings();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          onClick={() =>
            trackEvent('logo_clicked', 'navigation', 'home', undefined, { from: pathname })
          }
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
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <a
              href="https://github.com/Data-Technology-H-P/SC2-Atlas-Web"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('github_link_clicked', 'engagement', 'GitHub Repository')}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex px-2 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              {t('fanProject')}
            </span>

            {/* Patch Selector Dropdown */}
            <div className="relative inline-flex">
              <select
                value={patchVersion}
                onChange={(e) => {
                  setPatchVersion(e.target.value);
                  trackEvent('patch_version_changed', 'preferences', e.target.value);
                }}
                className="px-2 py-1 rounded border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-[10px] font-bold text-gray-300 uppercase tracking-widest focus:outline-none focus:border-blue-500/50 cursor-pointer transition-colors"
              >
                {AVAILABLE_PATCHES.map((patch) => (
                  <option
                    key={patch.id}
                    value={patch.id}
                    className="bg-slate-900 text-white font-bold text-[10px] uppercase"
                  >
                    {patch.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

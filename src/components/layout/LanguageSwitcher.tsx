'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { trackEvent } from '@/lib/gtag';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleLocaleChange = (newLocale: string) => {
    trackEvent('change_language', 'preferences', newLocale);
    // @ts-ignore
    router.replace({pathname, params}, {locale: newLocale});
  };

  return (
    <div className="flex gap-2 text-[10px] font-bold">
      {['en', 'es', 'pt'].map((l) => (
        <button
          key={l}
          onClick={() => handleLocaleChange(l)}
          className={`px-2 py-1 rounded transition-colors uppercase ${
            locale === l 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-500 hover:text-white'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
};

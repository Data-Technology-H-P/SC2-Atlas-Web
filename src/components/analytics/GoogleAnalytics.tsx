'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview, GA_TRACKING_ID } from '@/lib/gtag';

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_TRACKING_ID) {
      console.log('Google Analytics is disabled (NEXT_PUBLIC_GA_ID environment variable is missing).');
      return;
    }

    // Load Google Analytics (gtag.js) Script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag function
    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}');
      window.gtag = gtag;
    `;
    document.head.appendChild(inlineScript);
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (pathname && GA_TRACKING_ID) {
      pageview(pathname);
    }
  }, [pathname]);

  return null;
}

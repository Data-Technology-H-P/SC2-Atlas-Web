'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview } from '@/lib/gtag';

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
      // 1. Initialize GTM safely
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});

      const gtmScript = document.createElement('script');
      gtmScript.async = true;
      gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MWFJVHC4';
      document.head.appendChild(gtmScript);

      // 2. Initialize GA4
      const gaId = "G-X31QWB3D68";
      
      // Load GA Script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      // Initialize gtag function
      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
        window.gtag = gtag;
      `;
      document.head.appendChild(inlineScript);
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname]);

  return null;
}

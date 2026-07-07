'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview, GA_TRACKING_ID } from '@/lib/gtag';
import { useSettings } from '@/context/SettingsContext';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const { analyticsEnabled } = useSettings();

  useEffect(() => {
    const envEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';

    if (!envEnabled || !GA_TRACKING_ID) {
      console.log('Google Analytics is disabled (NEXT_PUBLIC_ANALYTICS_ENABLED is not true or NEXT_PUBLIC_GA_MEASUREMENT_ID is missing).');
      return;
    }

    if (analyticsEnabled !== true) {
      // User has rejected or not decided yet. Do not load script.
      return;
    }

    // Check if script is already added to prevent duplicates
    if (document.getElementById('google-analytics-script')) {
      return;
    }

    // Load Google Analytics (gtag.js) Script
    const script = document.createElement('script');
    script.id = 'google-analytics-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag function
    const inlineScript = document.createElement('script');
    inlineScript.id = 'google-analytics-inline-script';
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}');
      window.gtag = gtag;
    `;
    document.head.appendChild(inlineScript);
  }, [analyticsEnabled]);

  // Track page views on route changes
  useEffect(() => {
    if (pathname && GA_TRACKING_ID && analyticsEnabled === true) {
      pageview(pathname);
    }
  }, [pathname, analyticsEnabled]);

  return null;
}

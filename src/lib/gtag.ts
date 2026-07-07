export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Helper to verify if tracking is active (both by environment variable and user consent)
const isTrackingAllowed = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const envEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
  const userConsent = localStorage.getItem('sc2-atlas-analytics-enabled') !== 'false';
  
  return envEnabled && !!GA_TRACKING_ID && userConsent;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (isTrackingAllowed() && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  additionalParams?: Record<string, any>
) => {
  if (isTrackingAllowed() && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...additionalParams,
    });
  }
};

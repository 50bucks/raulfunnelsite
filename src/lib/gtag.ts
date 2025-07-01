// This declaration is needed because the gtag function is added to the window object by the Google script.
declare global {
  interface Window {
    gtag: (type: 'event', eventName: string, eventParams?: object) => void;
  }
}

/**
 * Fires a 'generate_lead' event for Google Ads.
 * This should be called when a user successfully completes a lead form.
 * This is a standard event that can be tracked as a conversion in your Google Ads account.
 */
export const reportGtagLead = () => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead');
  }
};

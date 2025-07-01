// This declaration is needed because the gtag function and custom conversion functions
// are added to the window object by the Google scripts.
declare global {
  interface Window {
    gtag: (type: 'event', eventName: string, eventParams?: object) => void;
    gtag_report_conversion: (url?: string) => void;
  }
}

/**
 * Fires a conversion event for Google Ads when a lead form is submitted.
 * This should be called when a user successfully completes a lead form.
 */
export const reportGtagConversion = () => {
  if (typeof window.gtag_report_conversion === 'function') {
    window.gtag_report_conversion();
  } else {
    console.warn('gtag_report_conversion function not found on window object.');
  }
};

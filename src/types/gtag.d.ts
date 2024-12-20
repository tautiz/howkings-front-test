// Type definitions for Google Analytics gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: {
        [key: string]: any;
        page_path?: string;
        page_title?: string;
        page_location?: string;
        send_page_view?: boolean;
      }
    ) => void;
    dataLayer: any[];
  }
}

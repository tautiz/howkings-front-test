import { cookieConsentService } from './cookieConsentService';

// Pridedame gtag tipų deklaraciją
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface AnalyticsEvent {
    action: string;
    category: string;
    label?: string;
    value?: number;
    customDimensions?: Record<string, string | number>;
}

interface UserProperties {
    userId?: string;
    userType?: string;
    accountType?: string;
    registrationDate?: string;
    lastLoginDate?: string;
}

interface DeviceInfo {
    type: 'mobile' | 'tablet' | 'desktop';
    orientation?: 'portrait' | 'landscape';
    screenSize: {
        width: number;
        height: number;
    };
    touchEnabled: boolean;
}

class AnalyticsService {
    private readonly GA4_ID = 'G-RCVV15RCHX';
    private readonly GTM_ID = 'GT-WKXQKTCH';
    private initialized = false;
    private scrollDepthMarkers = new Set<number>();
    private lastTouchStart: number = 0;
    private touchScrolling = false;

    public initializeAnalytics(): void {
        const consent = cookieConsentService.getConsent();
        if (!consent.analytics) return;

        // Inicializuojame dataLayer
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());

        // Initialize GA4
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA4_ID}`;
        document.head.appendChild(gaScript);

        // Konfigūruojame GA4
        window.gtag('config', this.GA4_ID, {
            send_page_view: true,
            cookie_flags: 'max-age=7200;secure;samesite=none'
        });

        // Initialize GTM
        const gtmScript = document.createElement('script');
        gtmScript.async = true;
        gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=${this.GTM_ID}`;
        document.head.appendChild(gtmScript);

        // Konfigūruojame GTM
        window.gtag('config', this.GTM_ID);

        this.initialized = true;
        this.setupEventListeners();
    }

    // Formų tracking
    public trackFormInteraction(formId: string, action: 'start' | 'complete' | 'error', details?: Record<string, any>): void {
        this.trackEvent({
            action: `form_${action}`,
            category: 'form_interaction',
            label: formId,
            customDimensions: {
                form_id: formId,
                ...details
            }
        });
    }

    // Mygtukų tracking
    public trackButtonClick(buttonId: string, buttonText: string, pageSection?: string): void {
        this.trackEvent({
            action: 'button_click',
            category: 'user_interaction',
            label: buttonText,
            customDimensions: {
                button_id: buttonId,
                page_section: pageSection || 'unknown'
            }
        });
    }

    // User properties
    public setUserProperties(properties: UserProperties): void {
        if (!this.initialized || !cookieConsentService.getConsent().analytics) return;

        window.gtag('set', 'user_properties', {
            user_id: properties.userId,
            user_type: properties.userType,
            account_type: properties.accountType,
            registration_date: properties.registrationDate,
            last_login_date: properties.lastLoginDate
        });
    }

    private getDeviceInfo(): DeviceInfo {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        let type: 'mobile' | 'tablet' | 'desktop' = 'desktop';
        if (width <= 768) {
            type = 'mobile';
        } else if (width <= 1024) {
            type = 'tablet';
        }

        return {
            type,
            orientation: width > height ? 'landscape' : 'portrait',
            screenSize: { width, height },
            touchEnabled: 'ontouchstart' in window
        };
    }

    private setupEventListeners(): void {
        if (typeof window === 'undefined') return;
        
        const deviceInfo = this.getDeviceInfo();
        const isMobile = deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet';

        const trackScroll = () => {
            const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
            
            [25, 50, 75, 90, 100].forEach(marker => {
                if (scrollPercent >= marker && !this.scrollDepthMarkers.has(marker)) {
                    this.scrollDepthMarkers.add(marker);
                    this.trackEvent({
                        action: 'scroll_depth',
                        category: 'user_engagement',
                        value: marker,
                        customDimensions: {
                            page_url: window.location.pathname,
                            page_title: document.title,
                            device_type: deviceInfo.type,
                            scroll_type: this.touchScrolling ? 'touch' : 'normal'
                        }
                    });
                }
            });
        };

        const scrollHandler = isMobile 
            ? this.debounce(trackScroll, 300)  // Faster debounce for mobile
            : this.debounce(trackScroll, 500); // Normal debounce for desktop

        window.addEventListener('scroll', scrollHandler);
    }

    private getCurrentSection(): string {
        // Simple logic to determine current section based on scroll position
        const sections = document.querySelectorAll('section, [data-section]');
        let currentSection = 'unknown';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentSection = section.id || section.getAttribute('data-section') || 'unknown';
            }
        });

        return currentSection;
    }

    private debounce(func: Function, wait: number): (...args: any[]) => void {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    public trackPageView(path: string): void {
        if (!this.initialized || !cookieConsentService.getConsent().analytics) return;
        
        window.gtag('config', this.GA4_ID, {
            page_path: path,
            page_title: document.title
        });
    }

    public trackEvent(event: AnalyticsEvent): void {
        if (!this.initialized || !cookieConsentService.getConsent().analytics) return;

        try {
            window.gtag('event', event.action, {
                event_category: event.category,
                event_label: event.label,
                value: event.value,
                ...event.customDimensions
            });
        } catch (error) {
            console.error('Analytics tracking failed:', error);
        }
    }
}

export const analyticsService = new AnalyticsService();

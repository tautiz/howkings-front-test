interface CookieConsent {
    analytics: boolean;
    marketing: boolean;
    necessary: boolean;
    timestamp: number;
}

class CookieConsentService {
    private readonly CONSENT_KEY = 'cookie_consent';
    private readonly CONSENT_DURATION = 7200; // 2 valandos sekundėmis
    
    public getConsent(): CookieConsent {
        const stored = localStorage.getItem(this.CONSENT_KEY);
        if (!stored) return this.getDefaultConsent();
        
        try {
            const consent = JSON.parse(stored) as CookieConsent;
            if (this.isConsentExpired(consent)) {
                return this.getDefaultConsent();
            }
            return consent;
        } catch {
            return this.getDefaultConsent();
        }
    }

    public setConsent(consent: Partial<CookieConsent>): void {
        const newConsent: CookieConsent = {
            ...this.getDefaultConsent(),
            ...consent,
            timestamp: Date.now(),
            necessary: true // Būtini slapukai visada įjungti
        };
        
        localStorage.setItem(this.CONSENT_KEY, JSON.stringify(newConsent));
        
        // Jei atsisakė analytics, išvalome esamus slapukus
        if (!newConsent.analytics) {
            this.deleteCookies(['_ga', '_gid', '_gat']);
        }
        
        // Jei atsisakė marketing, išvalome marketing slapukus
        if (!newConsent.marketing) {
            this.deleteCookies(['_gcl_au', '_fbp']);
        }
    }

    private getDefaultConsent(): CookieConsent {
        return {
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: 0
        };
    }

    private isConsentExpired(consent: CookieConsent): boolean {
        const now = Date.now();
        const age = (now - consent.timestamp) / 1000;
        return age > this.CONSENT_DURATION;
    }

    private deleteCookies(cookieNames: string[]): void {
        cookieNames.forEach(name => {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
        });
    }
}

export const cookieConsentService = new CookieConsentService();

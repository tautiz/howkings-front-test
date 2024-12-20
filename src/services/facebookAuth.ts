import { featureService } from '../config/features';

interface IFacebookAuthResponse {
    accessToken: string;
    userID: string;
    expiresIn: number;
}

/**
 * Facebook autentifikacijos servisas
 * @description Servisas skirtas Facebook prisijungimo funkcionalumui
 */
class FacebookAuthService {
    private readonly FB_APP_ID = process.env.VITE_FACEBOOK_APP_ID;
    private isInitialized = false;

    /**
     * Inicializuoja Facebook SDK
     */
    async initialize(): Promise<void> {
        if (!featureService.isEnabled('enableFacebookAuth')) {
            console.warn('Facebook autentifikacija išjungta');
            return;
        }

        if (this.isInitialized) return;

        return new Promise((resolve) => {
            window.fbAsyncInit = () => {
                FB.init({
                    appId: this.FB_APP_ID,
                    cookie: true,
                    xfbml: true,
                    version: 'v18.0'
                });
                this.isInitialized = true;
                resolve();
            };

            // Įkeliame Facebook SDK
            (function (d, s, id) {
                const fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                const js = d.createElement(s) as HTMLScriptElement;
                js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode?.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        });
    }

    /**
     * Prisijungimas per Facebook
     * @returns Promise<IFacebookAuthResponse>
     */
    async login(): Promise<IFacebookAuthResponse> {
        if (!featureService.isEnabled('enableFacebookAuth')) {
            throw new Error('Facebook autentifikacija išjungta');
        }

        if (!this.isInitialized) {
            await this.initialize();
        }

        return new Promise((resolve, reject) => {
            FB.login((response) => {
                if (response.authResponse) {
                    resolve({
                        accessToken: response.authResponse.accessToken,
                        userID: response.authResponse.userID,
                        expiresIn: response.authResponse.expiresIn
                    });
                } else {
                    reject(new Error('Prisijungimas atšauktas'));
                }
            }, { scope: 'email,public_profile' });
        });
    }

    /**
     * Atsijungimas iš Facebook
     */
    async logout(): Promise<void> {
        if (!featureService.isEnabled('enableFacebookAuth')) {
            throw new Error('Facebook autentifikacija išjungta');
        }

        return new Promise((resolve) => {
            FB.logout(() => {
                resolve();
            });
        });
    }

    /**
     * Gauti vartotojo duomenis
     * @returns Promise<any>
     */
    async getUserData(): Promise<any> {
        if (!featureService.isEnabled('enableFacebookAuth')) {
            throw new Error('Facebook autentifikacija išjungta');
        }

        return new Promise((resolve, reject) => {
            FB.api('/me', { fields: 'id,name,email,picture' }, (response) => {
                if (response.error) {
                    reject(new Error(response.error.message));
                } else {
                    resolve(response);
                }
            });
        });
    }
}

export const facebookAuthService = new FacebookAuthService();

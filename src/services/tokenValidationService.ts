import * as api from './api';
import { AES, enc } from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_TOKEN_ENCRYPTION_KEY || 'default-key';
const TOKEN_VALIDATION_INTERVAL = 5 * 60 * 1000; // 5 minutes

export class TokenValidationService {
    private static instance: TokenValidationService;
    private validationInterval: NodeJS.Timeout | null = null;
    
    private constructor() {
        this.startPeriodicValidation();
    }
    
    public static getInstance(): TokenValidationService {
        if (!TokenValidationService.instance) {
            TokenValidationService.instance = new TokenValidationService();
        }
        return TokenValidationService.instance;
    }

    private encrypt(text: string): string {
        return AES.encrypt(text, ENCRYPTION_KEY).toString();
    }

    private decrypt(ciphertext: string): string {
        const bytes = AES.decrypt(ciphertext, ENCRYPTION_KEY);
        return bytes.toString(enc.Utf8);
    }
    
    public async validateToken(): Promise<boolean> {
        try {
            const encryptedToken = localStorage.getItem('access_token');
            if (!encryptedToken) return false;
            
            const token = this.decrypt(encryptedToken);
            if (!token) return false;

            const response = await api.validateToken();
            
            if (response.data.status === 'success') {
                return true;
            }

            // Bandome atnaujinti token'ą
            const refreshed = await this.refreshToken();
            return refreshed;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    private async refreshToken(): Promise<boolean> {
        try {
            const encryptedRefreshToken = localStorage.getItem('refresh_token');
            if (!encryptedRefreshToken) return false;

            const refreshToken = this.decrypt(encryptedRefreshToken);
            const response = await api.refreshToken(refreshToken);

            if (response.data.status === 'success') {
                const { access_token, refresh_token } = response.data.tokens;
                
                // Išsaugome naujus tokenus
                localStorage.setItem('access_token', this.encrypt(access_token));
                if (refresh_token) {
                    localStorage.setItem('refresh_token', this.encrypt(refresh_token));
                }
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    }

    private startPeriodicValidation(): void {
        if (this.validationInterval) {
            clearInterval(this.validationInterval);
        }

        this.validationInterval = setInterval(async () => {
            const isValid = await this.validateToken();
            if (!isValid) {
                this.clearAuthData();
                window.dispatchEvent(new CustomEvent('auth:token-invalid'));
            }
        }, TOKEN_VALIDATION_INTERVAL);
    }
    
    public clearAuthData(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        if (this.validationInterval) {
            clearInterval(this.validationInterval);
            this.validationInterval = null;
        }
    }

    public saveTokens(accessToken: string, refreshToken?: string): void {
        localStorage.setItem('access_token', this.encrypt(accessToken));
        if (refreshToken) {
            localStorage.setItem('refresh_token', this.encrypt(refreshToken));
        }
    }
}

export const tokenValidationService = TokenValidationService.getInstance();

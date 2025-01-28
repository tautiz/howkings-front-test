import * as api from './api';

const TOKEN_VALIDATION_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface UserData {
    id: number;
    person_id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    current_company_id: number | null;
    current_connected_account_id: number | null;
    profile_photo_path: string | null;
    created_at: string;
    updated_at: string;
    last_renew_password_at: string | null;
    profile_photo_url: string;
}

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
    
    public async validateToken(): Promise<boolean> {
        const token = localStorage.getItem('access_token');
    
        if (!token) {
            return false;
        }
    
        try {
            const response = await api.validateToken();
            
            if (response.data?.data) {
                const userData = {
                    id: response.data.data.id?.toString() || '',
                    email: response.data.data.email || '',
                    name: response.data.data.name || ''
                };
                localStorage.setItem('user', JSON.stringify(userData));
                return true;
            }
    
            return await this.refreshToken();
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    public saveTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    }

    public clearAuthData(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this.stopPeriodicValidation();
    }

    private async refreshToken(): Promise<boolean> {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) return false;

            const response = await api.validateToken();
            console.log("Refres", response);
            if (response.data.status === 'success') {
                const { access_token, refresh_token } = response.data.data;
                this.saveTokens(access_token, refresh_token);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            this.clearAuthData();
            return false;
        }
    }

    private startPeriodicValidation(): void {
        if (this.validationInterval) return;
        
        this.validationInterval = setInterval(async () => {
            await this.validateToken();
        }, TOKEN_VALIDATION_INTERVAL);
    }

    private stopPeriodicValidation(): void {
        if (this.validationInterval) {
            clearInterval(this.validationInterval);
            this.validationInterval = null;
        }
    }
}

export const tokenValidationService = TokenValidationService.getInstance();

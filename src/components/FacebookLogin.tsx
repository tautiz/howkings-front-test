import React from 'react';
import { featureService } from '../config/features';
import { facebookAuthService } from '../services/facebookAuth';

interface FacebookLoginProps {
    onSuccess?: (response: any) => void;
    onError?: (error: Error) => void;
    buttonText?: string;
    className?: string;
}

/**
 * Facebook prisijungimo mygtukas
 * @component
 */
export const FacebookLogin: React.FC<FacebookLoginProps> = ({
    onSuccess,
    onError,
    buttonText = 'Prisijungti su Facebook',
    className = '',
}) => {
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        facebookAuthService.initialize().catch(console.error);
    }, []);

    const handleLogin = async () => {
        if (!featureService.isEnabled('enableFacebookAuth')) {
            console.warn('Facebook autentifikacija išjungta');
            return;
        }

        try {
            setIsLoading(true);
            const authResponse = await facebookAuthService.login();
            const userData = await facebookAuthService.getUserData();
            onSuccess?.({ ...authResponse, ...userData });
        } catch (error) {
            onError?.(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!featureService.isEnabled('enableFacebookAuth')) {
        return null;
    }

    return (
        <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`facebook-login-button ${className}`}
            data-testid="facebook-login-button"
        >
            {isLoading ? 'Jungiamasi...' : buttonText}
        </button>
    );
};

export default FacebookLogin;

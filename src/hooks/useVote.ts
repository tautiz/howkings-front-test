import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { AxiosError } from 'axios';

export const useVote = () => {
    const { isAuthenticated, setAuthForm, setPendingAction } = useAuth();

    const showToast = (message: string, type: 'error' | 'success' | 'warning' | 'info' = 'error') => {
        window.dispatchEvent(new CustomEvent('app:show-toast', {
            detail: { message, type }
        }));
    };

    const handleVote = async (moduleRequestId: number) => {
        if (!isAuthenticated) {
            // Store the vote action and show login modal
            setPendingAction({
                type: 'vote',
                payload: { moduleRequestId }
            });
            setAuthForm('login');
            return false;
        }

        try {
            const response = await api.addVote(moduleRequestId);
            
            if (response.status === 200) {
                showToast('Vote submitted successfully!', 'success');
                return true;
            }
            
            return false;
        } catch (error) {
            const axiosError = error as AxiosError;
            
            if (axiosError.response?.status === 401) {
                setPendingAction({
                    type: 'vote',
                    payload: { moduleRequestId }
                });
                setAuthForm('login');
                return false;
            }
            
            if (axiosError.response?.status === 409) {
                showToast('You have already voted for this item', 'warning');
                return false;
            }

            showToast('Failed to submit vote. Please try again.', 'error');
            return false;
        }
    };

    return { handleVote };
};

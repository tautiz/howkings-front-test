import { useAuth } from '../contexts/AuthContext';
import { createRequest } from '../services/api';
import { AxiosError } from 'axios';

interface RequestData {
  module_name: string;
  description: string;
  language: string;
  tags: string[];
}

export const useCreateRequest = () => {
  const { isAuthenticated, setAuthForm, setPendingAction } = useAuth();

  const showToast = (message: string, type: 'error' | 'success' | 'warning' | 'info' = 'error') => {
    window.dispatchEvent(new CustomEvent('app:show-toast', {
      detail: { message, type }
    }));
  };

  const handleCreateRequest = async (data: RequestData) => {
    if (!isAuthenticated) {
      // Store the create request action and show login modal
      setPendingAction({
        type: 'create_request',
        payload: { data }
      });
      setAuthForm('login');
      return false;
    }

    try {
      await createRequest(data);
      showToast('Request created successfully!', 'success');
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 401) {
        setPendingAction({
          type: 'create_request',
          payload: { data }
        });
        setAuthForm('login');
        return false;
      }

      showToast('Failed to create request. Please try again.', 'error');
      return false;
    }
  };

  return { handleCreateRequest };
};

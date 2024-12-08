// src/context/authHelpers.ts
export interface User {
    id: number;
    name: string;
    email: string;
    roles?: string[];
    profile_image_url?: string;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

export interface AuthResponse {
    status: 'success';
    message: string;
    data: {
        user: User;
        tokens: AuthTokens;
    };
}

export interface PendingAction {
    type: 'vote' | 'create_request';
    payload: {
        moduleRequestId?: number;
        data?: {
            module_name: string;
            description: string;
            language: string;
            tags: string[];
        };
    };
    onComplete?: () => void;
}

// Show toast messages by dispatching a custom event
export const showToast = (message: string, type: 'error' | 'success' | 'info' | 'warning' = 'error') => {
    window.dispatchEvent(new CustomEvent('app:show-toast', {
        detail: { message, type }
    }));
};

// Handle errors in a unified manner
export const handleError = (error: any, defaultMessage: string = 'An error occurred') => {
    const message = error?.response?.data?.message || defaultMessage;
    showToast(message, 'error');
};

// Execute pending actions after successful login
export const executePendingAction = async (pendingAction: PendingAction | null) => {
    if (!pendingAction) return;

    try {
        switch (pendingAction.type) {
            case 'vote': {
                // Example of executing a pending action
                const voteResponse = await (await import('../services/api')).addVote(pendingAction.payload.moduleRequestId);
                if (voteResponse.status === 200) {
                    showToast('Vote submitted successfully!', 'success');
                }
                break;
            }
            case 'create_request': {
                if (pendingAction.payload.data) {
                    await (await import('../services/api')).createRequest(pendingAction.payload.data);
                    showToast('Request created successfully!', 'success');
                }
                break;
            }
            default:
                console.warn('Unknown pending action type:', pendingAction.type);
        }

        if (pendingAction.onComplete) {
            pendingAction.onComplete();
        }
    } catch (error) {
        handleError(error);
    }
};

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
    type: string;
    payload: any;
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
                } else if (voteResponse.status === 409) {
                    showToast('You have already voted for this item', 'warning');
                }
                break;
            }
            // Add other action types as needed
        }
        pendingAction.onComplete?.();
    } catch (error: any) {
        if (error?.response?.status === 409) {
            showToast('You have already voted for this item', 'warning');
        } else {
            handleError(error, 'Failed to complete the pending action');
        }
    }
};

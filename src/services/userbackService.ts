import Userback from '@userback/widget';
import { User } from '../contexts/AuthContext';

const USERBACK_TOKEN = 'A-1zhRYuMdm5eJ38BC0YqfKfZly';

export const initializeUserback = (user: User | null) => {
    const options = {
        user_data: user ? {
            id: user.id.toString(),
            info: {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email
            }
        } : undefined
    };

    return Userback(USERBACK_TOKEN, options);
};

export const updateUserData = (user: User | null) => {
    const userData = user ? {
        id: user.id.toString(),
        info: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
        }
    } : undefined;

    Userback(USERBACK_TOKEN, { user_data: userData });
};

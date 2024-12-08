import { User } from '../contexts/AuthContext';

export interface UserData {
    id?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export const getUserData = (user: User | null): UserData => {
    if (!user) {
        return {};
    }

    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    };
};

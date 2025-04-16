export interface User {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
} 
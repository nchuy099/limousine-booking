import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, AuthState, User } from './types';
import authService from '../services/authService';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>(initialState);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for stored auth data on mount
        const user = authService.getCurrentUser();
        if (user && authService.isAuthenticated()) {
            setState({
                user,
                isAuthenticated: true
            });
        }

        // Listen for auth state changes
        const handleAuthStateChange = () => {
            const user = authService.getCurrentUser();
            if (user && authService.isAuthenticated()) {
                setState({
                    user,
                    isAuthenticated: true
                });
            } else {
                setState(initialState);
                navigate('/login');
            }
        };

        window.addEventListener('authStateChange', handleAuthStateChange);
        return () => window.removeEventListener('authStateChange', handleAuthStateChange);
    }, [navigate]);

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            if (response.success && response.data?.user) {
                setState({
                    user: response.data.user,
                    isAuthenticated: true
                });
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setState(initialState);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const updateUser = (user: User) => {
        setState(prev => ({
            ...prev,
            user
        }));
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 
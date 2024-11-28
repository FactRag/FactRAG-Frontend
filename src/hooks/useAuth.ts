// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export interface User {
    id: number;
    name: string;
    avatar: string;
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

interface AuthHook extends AuthState {
    login: (provider: 'google' | 'orcid') => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuth = (): AuthHook => {
    const [state, setState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        isLoading: true,
        error: null
    });

    const checkAuth = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await fetch(`${API_BASE_URL}/auth/status`, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Authentication check failed');

            const data = await response.json();
            setState({
                isAuthenticated: data.isAuthenticated,
                user: data.user,
                isLoading: false,
                error: null
            });
        } catch (error) {
            setState(prev => ({
                ...prev,
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: 'Authentication check failed'
            }));
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = (provider: 'google' | 'orcid') => {
        window.location.href = `${API_BASE_URL}/auth/${provider}/login`;
    };

    const logout = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Logout failed');

            setState({
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: null
            });
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Logout failed'
            }));
        }
    };

    return {
        ...state,
        login,
        logout,
        checkAuth
    };
};
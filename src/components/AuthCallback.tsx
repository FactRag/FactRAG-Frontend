// src/components/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { socialAuth } from '../services/auth';

export const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const tokens = new URLSearchParams(location.search).get('tokens');
        if (tokens) {
            socialAuth.handleCallback(tokens)
                .then(success => {
                    if (success) {
                        navigate('/');
                    } else {
                        navigate('/login?error=auth_failed');
                    }
                })
                .catch(() => navigate('/login?error=auth_failed'));
        }
    }, [location, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Processing authentication...</p>
            </div>
        </div>
    );
};
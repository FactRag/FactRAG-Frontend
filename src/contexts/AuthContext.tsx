// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const API_BASE_URL = 'http://localhost:8000/api'

export interface User {
  id: number;
  email: string;
  username: string;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  registerWithEmail: (credentials: RegisterCredentials) => Promise<void>;
  loginWithEmail: (credentials: LoginCredentials) => Promise<void>;
  socialLogin: (provider: 'google' | 'orcid') => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  username: string;
  password2: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearTokens = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  const handleAuthSuccess = (data: AuthResponse) => {
    localStorage.setItem('access_token', data.tokens.access)
    localStorage.setItem('refresh_token', data.tokens.refresh)
    setUser(data.user)
    setIsAuthenticated(true)
    setIsLoading(false)
    setError(null)
  }

  const handleAuthError = (error: any) => {
    setIsAuthenticated(false)
    setUser(null)
    setIsLoading(false)
    setError(error.message || 'Authentication failed')
    clearTokens()
  }

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        await refreshToken()
      }
    } catch (error) {
      handleAuthError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token')
      if (!refresh) throw new Error('No refresh token')

      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('access_token', data.access)
        await checkAuth()
      } else {
        throw new Error('Token refresh failed')
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  const loginWithEmail = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (response.ok) {
        const data: AuthResponse = await response.json()
        handleAuthSuccess(data)
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  const registerWithEmail = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (response.ok) {
        const data: AuthResponse = await response.json()
        handleAuthSuccess(data)
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  const socialLogin = async (provider: 'google' | 'orcid') => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/${provider}/login/`)
      const data = await response.json()
      window.location.href = data.auth_url
    } catch (error) {
      handleAuthError(error)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: localStorage.getItem('refresh_token') })
      })

      if (response.ok) {
        clearTokens()
        setUser(null)
        setIsAuthenticated(false)
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      handleAuthError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      checkAuth().then(r => r)
    } else {
      setIsLoading(false)
    }
  }, [])

  const value = {
    isAuthenticated,
    user,
    isLoading,
    error,
    registerWithEmail,
    loginWithEmail,
    socialLogin,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
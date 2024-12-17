// src/components/AuthCallback.tsx
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { socialAuth } from '../services/auth'

export const AuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const tokens = new URLSearchParams(location.search).get('tokens')
    const term_id = new URLSearchParams(location.search).get('term_id')
    const dataset = new URLSearchParams(location.search).get('dataset')

    if (tokens) {
      socialAuth
        .handleCallback(tokens)
        .then(success => {
          if (success) {
            navigate(term_id && dataset ? `/results?search=${term_id}&dataset=${dataset}` : '/')
          } else {
            navigate('/')
          }
        })
        .catch(() => navigate('/'))
    }
  }, [location, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  )
}

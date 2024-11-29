import { useAuth } from '../../contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { LogIn, Mail } from 'lucide-react'
import { Button, Label, TextInput } from 'flowbite-react'

export const AuthSection = () => {
  const {
    isAuthenticated,
    loginWithEmail,
    socialLogin
  } = useAuth()

  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginWithEmail({ email, password })
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      setShowEmailLogin(false)
      setEmail('')
      setPassword('')
    }
  }, [isAuthenticated])

  return (
    <div className='p-6 space-y-4 feedback-item'>
      <div className='text-center mb-4'>
        <LogIn className='w-12 h-12 mx-auto text-gray-400 mb-2' />
        <h3 className='text-lg font-medium text-gray-900'>Sign in to continue</h3>
        <p className='text-sm text-gray-500'>Authentication required for feedback</p>
      </div>

      {!showEmailLogin ? (
        <>
          <div className='space-y-3'>
            <Button
              color='light'
              className='w-full'
              onClick={() => socialLogin('google')}
            >
              <img src='/google-icon.svg' className='w-5 h-5 mr-2' alt='Google' />
              Continue with Google
            </Button>

            <Button
              color='light'
              className='w-full'
              onClick={() => socialLogin('orcid')}
            >
              <img src='/orcid-icon.svg' className='w-5 h-5 mr-2' alt='ORCID' />
              Continue with ORCID
            </Button>

            <div className='relative flex items-center justify-center'>
              <div className='absolute w-full border-t border-gray-300'></div>
              <div className='relative bg-white px-4'>
                <span className='text-sm text-gray-500'>Or</span>
              </div>
            </div>

            <Button
              color='light'
              className='w-full'
              onClick={() => setShowEmailLogin(true)}
            >
              <Mail className='w-5 h-5 mr-2' />
              Continue with Email
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={handleEmailLogin} className='space-y-4'>
          <div>
            <Label htmlFor='email'>Email</Label>
            <TextInput
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor='password'>Password</Label>
            <TextInput
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type='submit' color='dark' className='w-full'>
            Sign In
          </Button>
          <Button
            color='light'
            className='w-full'
            onClick={() => setShowEmailLogin(false)}
          >
            Back to social login
          </Button>
        </form>
      )}
    </div>
  )
}

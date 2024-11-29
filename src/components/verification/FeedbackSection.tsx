import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Label, TextInput } from 'flowbite-react'
import { LogIn, Mail, MessageCircle, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE_URL } from '../../config'
import { Feedback, FeedbackStats, FeedbackType } from '../../types'
import FeedbackItemWithVoting from './FeedbackItemWithVoting'
import EmojiStats from './EmojiStats'
import { FeedbackSubmitSection } from './FeedBackSubmitSection'

interface FeedbackSectionProps {
  searchTerm: string;
  dataset: string;
}

const AuthSection = () => {
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
              <img src='/static/google-icon.svg' className='w-5 h-5 mr-2' alt='Google' />
              Continue with Google
            </Button>

            <Button
              color='light'
              className='w-full'
              onClick={() => socialLogin('orcid')}
            >
              <img src='/static/orcid-icon.svg' className='w-5 h-5 mr-2' alt='ORCID' />
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

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ searchTerm, dataset }) => {
  // Auth hook
  const { isAuthenticated, user, socialLogin } = useAuth()

  const [isVisible, setIsVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('submit')
  const [selectedEmoji, setSelectedEmoji] = useState<FeedbackType | ''>('')
  const [comment, setComment] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [stats, setStats] = useState<FeedbackStats>({
    agree: 0,
    disagree: 0,
    uncertain: 0,
    total: 0
  })
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const popupRef = useRef<HTMLDivElement>(null)

  // Scroll visibility handler
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100
      setIsVisible(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load data when popup opens
  useEffect(() => {
    if (isOpen) {
      loadData().then(r => r)
    }
  }, [isOpen])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let headers = {}
      if (isAuthenticated) {
        headers = {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      }
      // Load feedback stats
      const statsResponse = await fetch(
        `${API_BASE_URL}/api/feedback/stats/?search=${encodeURIComponent(searchTerm)}&dataset=${encodeURIComponent(dataset)}`,
        {
          headers: headers
        }
      )

      // Load feedback history
      const feedbacksResponse = await fetch(
        `${API_BASE_URL}/api/feedback/list/?search=${encodeURIComponent(searchTerm)}&dataset=${encodeURIComponent(dataset)}`,
        {
          headers: headers
        }
      )

      if (!statsResponse.ok || !feedbacksResponse.ok) {
        throw new Error('Failed to load feedback data')
      }

      const statsData = await statsResponse.json()
      const feedbacksData = await feedbacksResponse.json()

      setStats(statsData)
      setFeedbacks(feedbacksData)
    } catch (err) {
      setError('Failed to load feedback data')
      console.error('Data loading failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!isAuthenticated || !selectedEmoji) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback/submit/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchTerm,
          dataset,
          feedback: selectedEmoji,
          comment,
          isPublic
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setComment('')
      setSelectedEmoji('')
      setIsPublic(true)
      setActiveTab('feedback')
      await loadData()
    } catch (err) {
      setError('Failed to submit feedback')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, selectedEmoji, searchTerm, dataset, comment, isPublic])

  const handleVote = async (feedbackId: number, isUpvote: boolean) => {
    if (!isAuthenticated) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/feedback/vote/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feedbackId,
          isUpvote
        })
      })

      if (!response.ok) {
        throw new Error('Failed to register vote')
      }

      await loadData() // Refresh feedback list
    } catch (err) {
      setError('Failed to register vote')
    }
  }

  const FeedbackList = () => (
    <div className='p-4 space-y-4'>
      {/* Stats Section remains the same */}
      <EmojiStats stats={{
        agree: stats.agree,
        disagree: stats.disagree,
        uncertain: stats.uncertain
      }} />

      {/* Error Alert remains the same */}
      {error && (
        <Alert color='failure' onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State remains the same */}
      {isLoading ? (
        <div className='text-center py-8'>
          <div className='loading-spinner mx-auto' />
        </div>
      ) : (
        <div className='space-y-3'>
          {feedbacks.length === 0 ? (
            <div className='text-center py-6 text-gray-500'>
              No feedback yet. Be the first to share your thoughts!
            </div>
          ) : (
            feedbacks.map((feedback: Feedback) => (
              <FeedbackItemWithVoting
                key={feedback.id}
                feedback={feedback}
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
                onVote={handleVote}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
  return (
    <div className='fixed bottom-6 right-6 z-50'>
      {/* Feedback Button */}
      <div
        className={`transition-all duration-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <Button
          color='purple'
          size='lg'
          pill
          onClick={() => setIsOpen(!isOpen)}
          className='shadow-lg hover:shadow-xl group'
        >
          <MessageCircle className='w-5 h-5 mr-2 group-hover:scale-110 transition-transform' />
          Feedback
        </Button>
      </div>

      {/* Feedback Panel */}
      {isOpen && (
        <div
          ref={popupRef}
          className='feedback-popup absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border'
        >
          {/* Panel Header */}
          <div className='flex items-center justify-between p-4 border-b'>
            <div className='flex space-x-4'>
              <button
                onClick={() => setActiveTab('submit')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'submit'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Submit
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'feedback'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Feedback
              </button>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100'
              aria-label='Close feedback panel'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Panel Content */}
          <div className='max-h-[70vh] overflow-y-auto'>
            {activeTab === 'submit' ? (
              !isAuthenticated ? (
                <AuthSection />
              ) : (
                <FeedbackSubmitSection
                  selectedEmoji={selectedEmoji}
                  setSelectedEmoji={setSelectedEmoji}
                  comment={comment}
                  setComment={setComment}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              )
            ) : (
              <FeedbackList />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(FeedbackSection)
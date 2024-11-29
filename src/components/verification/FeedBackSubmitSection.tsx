import React, { memo, useRef, useState } from 'react'
import { Button, Textarea } from 'flowbite-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FeedbackType } from '../../types'
import { EMOJIS, FEEDBACK_TYPES } from '../../config'

interface EmojiOption {
  key: string;
  value: FeedbackType;
  emoji: string;
  label: string;
}

export const FeedbackSubmitSection = memo(({
                                             selectedEmoji,
                                             setSelectedEmoji,
                                             comment,
                                             setComment,
                                             isPublic,
                                             setIsPublic,
                                             handleSubmit,
                                             isLoading
                                           }: {
  selectedEmoji: FeedbackType | '';
  setSelectedEmoji: (emoji: FeedbackType | '') => void;
  comment: string;
  setComment: (comment: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
}) => {
  const emojiOptions: EmojiOption[] = Object.entries(FEEDBACK_TYPES).map(([key, value]) => ({
    key,
    value,
    emoji: EMOJIS[value],
    label: key
  }))

  const [currentIndex, setCurrentIndex] = useState(1)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const minSwipeDistance = 50

  const updateIndex = (direction: 'next' | 'prev') => {
    setCurrentIndex(prev => {
      const newIndex = direction === 'next'
        ? (prev === emojiOptions.length - 1 ? 0 : prev + 1)
        : (prev === 0 ? emojiOptions.length - 1 : prev - 1)
      setSelectedEmoji(emojiOptions[newIndex].value)
      return newIndex
    })
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      updateIndex('next')
    } else if (isRightSwipe) {
      updateIndex('prev')
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStartX.current !== null) {
      touchEndX.current = e.clientX
    }
  }

  const handleMouseUp = () => {
    if (touchStartX.current && touchEndX.current) {
      const distance = touchStartX.current - touchEndX.current
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance

      if (isLeftSwipe) {
        updateIndex('next')
      } else if (isRightSwipe) {
        updateIndex('prev')
      }
    }
    touchStartX.current = null
    touchEndX.current = null
  }

  const handleMouseLeave = () => {
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <div className='p-6 space-y-8'>
      {/* Header Section */}
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-gray-900'>How are you feeling?</h2>
        <p className='text-gray-600'>
          Your input is valuable in helping us better understand your needs and tailor our service accordingly.
        </p>
      </div>

      {/* Emoji Selector with Navigation Buttons */}
      <div className='flex items-center justify-center'>
        {/* Left Navigation Button */}
        <button
          onClick={() => updateIndex('prev')}
          className='p-2 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-200'
          aria-label='Previous emoji'
        >
          <ChevronLeft className='w-6 h-6 text-gray-500' />
        </button>

        {/* Swipeable Emoji Area */}
        <div
          className='flex items-center justify-center space-x-8 mx-4 cursor-grab active:cursor-grabbing'
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Previous Emoji */}
          <div className='opacity-50 transform scale-75 select-none transition-transform duration-200'>
            <span className='text-3xl'>
              {emojiOptions[(currentIndex - 1 + emojiOptions.length) % emojiOptions.length].emoji}
            </span>
          </div>

          {/* Current Emoji */}
          <div className='transform scale-150 select-none transition-transform duration-200 hover:scale-155'>
            <span className='text-4xl'>
              {emojiOptions[currentIndex].emoji}
            </span>
          </div>

          {/* Next Emoji */}
          <div className='opacity-50 transform scale-75 select-none transition-transform duration-200'>
            <span className='text-3xl'>
              {emojiOptions[(currentIndex + 1) % emojiOptions.length].emoji}
            </span>
          </div>
        </div>

        {/* Right Navigation Button */}
        <button
          onClick={() => updateIndex('next')}
          className='p-2 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-200'
          aria-label='Next emoji'
        >
          <ChevronRight className='w-6 h-6 text-gray-500' />
        </button>
      </div>

      {/* Selected Emoji Label */}
      <div className='text-center'>
        <span className='px-4 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700'>
          {emojiOptions[currentIndex].label}
        </span>
      </div>

      {/* Comment Section */}
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Add a comment...'
        rows={3}
        className='resize-none focus:border-green-500 focus:ring-green-500'
      />

      {/* Public Toggle */}
      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id='public-toggle'
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className='rounded text-green-600 focus:ring-green-500'
        />
        <label htmlFor='public-toggle' className='text-sm text-gray-600'>
          Make feedback public
        </label>
      </div>

      {/* Submit Button */}
      <Button
        color='success'
        className='w-full'
        onClick={handleSubmit}
        disabled={!selectedEmoji || isLoading}
      >
        {isLoading ? (
          <div className='flex items-center justify-center'>
            <div className='loading-spinner mr-2' />
            Submitting...
          </div>
        ) : (
          'Submit Now'
        )}
      </Button>
    </div>
  )
})
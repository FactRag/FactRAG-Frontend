import React from 'react'
import { Avatar } from 'flowbite-react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface VotingProps {
  upvotes: number;
  downvotes: number;
  hasUserVoted?: {
    upvoted?: boolean;
    downvoted?: boolean;
  };
  isAuthenticated: boolean;
  isLoading: boolean;
  onVote: (isUpvote: boolean) => void;
}

const VotingSection: React.FC<VotingProps> = ({
                                                upvotes,
                                                downvotes,
                                                hasUserVoted,
                                                isAuthenticated,
                                                isLoading,
                                                onVote
                                              }) => {
  const voteScore = upvotes - downvotes
  const getVoteColor = (isUpvote: boolean) => {
    if (!hasUserVoted) return 'text-gray-500'
    return (isUpvote ? hasUserVoted.upvoted : hasUserVoted.downvoted)
      ? 'text-purple-600'
      : 'text-gray-500'
  }

  return (
    <div className='flex flex-col items-center justify-center space-y-1'>
      <button
        className={`p-1 rounded-lg hover:bg-gray-100 transition-colors ${getVoteColor(true)}`}
        onClick={() => onVote(true)}
        disabled={!isAuthenticated || isLoading}
        title={isAuthenticated ? 'Upvote' : 'Login to vote'}
      >
        <ChevronUp className='w-5 h-5' />
      </button>

      <span
        className={`text-sm font-medium ${voteScore > 0 ? 'text-purple-600' : voteScore < 0 ? 'text-red-600' : 'text-gray-600'}`}>
        {voteScore}
      </span>

      <button
        className={`p-1 rounded-lg hover:bg-gray-100 transition-colors ${getVoteColor(false)}`}
        onClick={() => onVote(false)}
        disabled={!isAuthenticated || isLoading}
        title={isAuthenticated ? 'Downvote' : 'Login to vote'}
      >
        <ChevronDown className='w-5 h-5' />
      </button>
    </div>
  )
}

// Example usage in the feedback list:
const FeedbackItemWithVoting: React.FC<{
  feedback: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  onVote: (feedbackId: number, isUpvote: boolean) => void;
}> = ({ feedback, isAuthenticated, isLoading, onVote }) => {
  return (
    <div className='feedback-item bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex gap-4'>
        {/* Voting Section */}
        <VotingSection
          upvotes={feedback.upvotes}
          downvotes={feedback.downvotes}
          hasUserVoted={feedback.hasUserVoted}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          onVote={(isUpvote) => onVote(feedback.id, isUpvote)}
        />

        {/* Content Section */}
        <div className='flex-1'>
          {/* User Info */}
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center space-x-2'>
              {feedback.user.avatar ?
                <Avatar img={feedback.user.avatar} size='sm' bordered />
                :
                <Avatar
                  placeholderInitials=
                    {feedback.user.username ? feedback.user.username.charAt(0).toUpperCase() : 'R'}
                  size='sm' bordered />
              }
              <div>
                <p className='text-sm font-medium text-gray-900'>
                  {feedback.user.username}
                </p>
                <p className='text-xs text-gray-500'>
                  {
                    new Date(feedback.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })
                  }
                </p>
              </div>
            </div>
            <span className='text-xl' title={feedback.feedback_type}>
              {feedback.emoji}
            </span>
          </div>

          {/* Feedback Content */}
          {feedback.comment && (
            <p className='text-sm text-gray-600 mt-2 break-words'>
              {feedback.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedbackItemWithVoting